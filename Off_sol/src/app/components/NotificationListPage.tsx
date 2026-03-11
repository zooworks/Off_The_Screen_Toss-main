import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import notificationsService, { Notification } from "@/services/notifications";
import noticesService from "@/services/notices";
import contentsService from "@/services/contents";
import { useLanguage } from "@/contexts/LanguageContext";

// 종 아이콘 컴포넌트
function BellIcon({ isRead }: { isRead: boolean }) {
    return (
        <div className={`shrink-0 size-12 rounded-[12px] flex items-center justify-center ${isRead ? 'bg-[#F2F2F7]' : 'bg-[#EEE8FF]'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                    stroke={isRead ? "#8E8E93" : "#5a3d8b"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

// 알림 아이템 컴포넌트
function NotificationItem({
    notification,
    onClick
}: {
    notification: Notification;
    onClick: () => void;
}) {
    const { language } = useLanguage();
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace('.', '');
    };

    return (
        <div
            onClick={onClick}
            className="flex items-start gap-4 py-4 px-1 cursor-pointer transition-colors active:bg-gray-50 border-b border-gray-100 last:border-none"
        >
            <BellIcon isRead={notification.isRead} />
            <div className="flex flex-col flex-1 gap-1 min-w-0">
                <span className={`font-['Pretendard'] text-[15px] leading-snug ${notification.isRead
                    ? 'font-normal text-[#8E8E93]'
                    : 'font-semibold text-[#000000]'
                    }`}>
                    {notification.title}
                </span>
                {notification.message && (
                    <span className={`font-['Pretendard'] text-[13px] leading-snug line-clamp-2 ${notification.isRead ? 'text-[#AEAEB2]' : 'text-[#636366]'
                        }`}>
                        {notification.message}
                    </span>
                )}
                <span className="font-['Pretendard'] font-normal text-[12px] leading-none text-[#8E8E93] mt-1">
                    {formatDate(notification.createdAt)}
                </span>
            </div>
        </div>
    );
}

import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/contexts/NotificationContext";

export default function NotificationListPage({ onBack, onNoticeClick, onContentClick }: { onBack: () => void; onNoticeClick?: () => void; onContentClick?: (contentId: string) => void }) {
    const navigate = useNavigate();
    const { refreshCount } = useNotification();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // ...


    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const { user } = useAuth();

    useEffect(() => {
        fetchNotifications();
    }, [language]);

    const fetchNotifications = async () => {
        try {
            // 로그인한 경
            // 우에만 알림 목록 조회 (게스트는 빈 배열)
            // 공지사항 알림도 백엔드에서 생성되므로 별도 조회 불필요
            const notificationData = user ? await notificationsService.getAll() : [];

            // 콘텐츠 및 공지사항 데이터 가져오기 (번역용)
            const [contents, notices] = await Promise.all([
                contentsService.getAll(),
                noticesService.getNotices()
            ]);
            const contentMap = new Map(contents.map(c => [c.id, c]));
            const noticeMap = new Map(notices.map(n => [n.id, n]));

            // 알림 데이터 번역 처리
            const localizedNotifications = notificationData.map(n => {
                // 새로운 콘텐츠 알림 번역
                if (n.type === 'CONTENT_NEW' && n.referenceId) {
                    const content = contentMap.get(n.referenceId);
                    const displayTitle = content
                        ? (language === 'en' ? `New Content: ${content.titleEn || content.title}` : `새로운 콘텐츠: ${content.title}`)
                        : (language === 'en' ? `New Content: ${n.title.replace('새로운 콘텐츠: ', '')}` : n.title);

                    return {
                        ...n,
                        title: displayTitle,
                        message: language === 'en' ? 'New content has been registered.' : '새로운 콘텐츠가 등록되었습니다.'
                    };
                }
                // 콘텐츠 업데이트 알림 번역
                if (n.type === 'CONTENT_UPDATE' && n.referenceId) {
                    const content = contentMap.get(n.referenceId);
                    const displayTitle = content
                        ? (language === 'en' ? `Content Updated: ${content.titleEn || content.title}` : `콘텐츠 업데이트: ${content.title}`)
                        : (language === 'en' ? `Content Updated: ${n.title.replace('콘텐츠 업데이트: ', '')}` : n.title);

                    return {
                        ...n,
                        title: displayTitle,
                        message: language === 'en' ? 'Content has been updated.' : '콘텐츠가 업데이트되었습니다.'
                    };
                }
                // 공지사항 알림 번역
                if (n.type === 'NOTICE' && n.referenceId) {
                    const notice = noticeMap.get(n.referenceId);
                    const displayTitle = notice
                        ? (language === 'en' ? (notice.titleEn || notice.title) : notice.title)
                        : n.title;
                    const displayMessage = notice
                        ? (language === 'en' ? (notice.contentEn || notice.content || 'New notice has been posted.') : (notice.content || '새로운 공지사항이 등록되었습니다.'))
                        : (language === 'en' ? 'New notice has been posted.' : '새로운 공지사항이 등록되었습니다.');

                    return {
                        ...n,
                        title: displayTitle,
                        message: displayMessage
                    };
                }
                return n;
            });

            // 날짜순 정렬
            const sortedNotifications = localizedNotifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setNotifications(sortedNotifications);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // 공지사항인 경우 - 서버 API로 읽음 처리
        if (notification.type === 'NOTICE') {
            await notificationsService.markAsRead(notification.id);

            // 상태 업데이트
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notification.id ? { ...n, isRead: true } : n
                )
            );
            refreshCount();

            // 공지 목록으로 이동
            if (onNoticeClick) {
                onNoticeClick();
            }
            return;
        }

        // 콘텐츠 관련 알림인 경우 콘텐츠 상세로 이동
        if ((notification.type === 'CONTENT_NEW' || notification.type === 'CONTENT_UPDATE') && notification.referenceId) {
            notificationsService.markAsRead(notification.id);
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notification.id ? { ...n, isRead: true } : n
                )
            );
            refreshCount();

            if (onContentClick) {
                onContentClick(notification.referenceId);
            }
            return;
        }



        // 일반 알림 읽음 처리
        notificationsService.markAsRead(notification.id);

        // 상태 업데이트
        setNotifications(prev =>
            prev.map(n =>
                n.id === notification.id ? { ...n, isRead: true } : n
            )
        );
        refreshCount();
    };

    const handleMarkAllAsRead = async () => {
        // 서버에 전체 읽음 처리 요청
        await notificationsService.markAllAsRead();

        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        refreshCount();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 h-[54px] border-b border-gray-50 shrink-0">
                <div className="flex items-center justify-end h-full px-[16px] relative size-full">

                    {/* 전체 확인 버튼 - 항상 표시 */}
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                        className={`font-['Pretendard'] font-medium text-[14px] ${unreadCount > 0 ? 'text-[#735CCC]' : 'text-[#C7C7C7]'
                            }`}
                    >
                        {language === 'en' ? 'Read All' : '전체확인'}
                    </button>
                </div>
            </div>

            {/* List - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-2 pb-24">
                {loading ? (
                    <div className="py-10 text-center text-gray-400 text-sm">{language === 'en' ? 'Loading...' : '로딩 중...'}</div>
                ) : notifications.length > 0 ? (
                    notifications.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onClick={() => handleNotificationClick(notification)}
                        />
                    ))
                ) : (
                    <div className="py-10 text-center text-gray-400 text-sm">{language === 'en' ? 'No notifications.' : '알림이 없습니다.'}</div>
                )}
            </div>
        </div>
    );
}
