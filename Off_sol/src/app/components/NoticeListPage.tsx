import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import noticesService, { Notice } from "@/services/notices";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedText } from "@/lib/localization";


function NoticeItem({ notice, isOpen, onToggle }: { notice: Notice; isOpen: boolean; onToggle: () => void }) {
    const { language } = useLanguage();
    return (
        <div className="border-b border-gray-100 last:border-none">
            {/* Header Row - 클릭 영역 */}
            <div
                onClick={onToggle}
                className="flex items-center justify-between py-4 cursor-pointer transition-colors active:bg-gray-50"
            >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    {/* 날짜 (상단) */}
                    <span className="font-['Pretendard'] font-normal text-[12px] leading-none text-[#8E8E93]">
                        {new Date(notice.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '/').replace('.', '')}
                    </span>
                    {/* 제목 */}
                    <span className="font-['Pretendard'] font-semibold text-[15px] leading-snug text-[#000000]">
                        {getLocalizedText(notice.title, notice.titleEn, language)}
                    </span>
                </div>

                {/* Chevron 아이콘 */}
                <svg
                    className={`w-5 h-5 text-gray-400 shrink-0 ml-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* 펼쳐진 내용 */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
            >
                <div className="pb-4">
                    {/* 이미지 (있는 경우) */}
                    {notice.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                            <img
                                src={notice.imageUrl}
                                alt={notice.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* 텍스트 내용 */}
                    <div className="text-[14px] leading-relaxed text-[#333333] whitespace-pre-wrap font-['Pretendard']">
                        {getLocalizedText(notice.content, notice.contentEn, language)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NoticeListPage({ onBack }: { onBack: () => void }) {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const data = await noticesService.getNotices();
            setNotices(data);
        } catch (error) {
            console.error("Failed to fetch notices:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    }
    return (
        <div className="bg-white h-full overflow-y-auto no-scrollbar pb-24">


            {/* List */}
            <div className="px-4 py-2">
                {loading ? (
                    <div className="py-10 text-center text-gray-400 text-sm">{t('loading')}</div>
                ) : notices.length > 0 ? (
                    notices.map(notice => (
                        <NoticeItem
                            key={notice.id}
                            notice={notice}
                            isOpen={expandedId === notice.id}
                            onToggle={() => handleToggle(notice.id)}
                        />
                    ))
                ) : (
                    <div className="py-10 text-center text-gray-400 text-sm">{t('notice_empty')}</div>
                )}
            </div>
        </div>
    );
}
