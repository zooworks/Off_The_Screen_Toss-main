import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import inquiriesService, { MyInquiry } from '@/services/inquiries';

interface MyInquiriesModalProps {
    isOpen: boolean;
    initialInquiryId?: string;
    onClose: () => void;
    onCreate: () => void;
}

export default function MyInquiriesModal({ isOpen, initialInquiryId, onClose, onCreate }: MyInquiriesModalProps) {
    const { t } = useLanguage();
    const [inquiries, setInquiries] = useState<MyInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
    const [selectedInquiry, setSelectedInquiry] = useState<MyInquiry | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchInquiries().then((data) => {
                if (initialInquiryId && data) {
                    const found = data.find(i => i.id === initialInquiryId);
                    if (found) {
                        setSelectedInquiry(found);
                        setView('DETAIL');
                    }
                }
            });
            setView(initialInquiryId ? 'DETAIL' : 'LIST'); // Optimistic
            // Actually relying on fetch promise is better for data
        }
    }, [isOpen, initialInquiryId]);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const data = await inquiriesService.getMyInquiries();
            const safeData = Array.isArray(data) ? data : [];
            setInquiries(safeData);
            return safeData;
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedInquiry) return;
        try {
            await inquiriesService.deleteInquiry(selectedInquiry.id);
            await fetchInquiries();
            setIsDeleteConfirmOpen(false);
            setView('LIST');
            setSelectedInquiry(null);
        } catch (error) {
            console.error('Failed to delete inquiry:', error);
            alert('삭제 실패');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear().toString();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}/${mm}/${dd}`;
    };

    const getStatusBadge = (status: string) => {
        // ... (unchanged)
        switch (status) {
            case 'PENDING':
                return <span className="px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-[#F3F0FF] text-[#735CCC]">{t('inquiry_status_pending')}</span>;
            case 'IN_PROGRESS':
                return <span className="px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-yellow-100 text-yellow-600">{t('inquiry_status_progress')}</span>;
            case 'COMPLETED':
                return <span className="px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-[#5A3D8B] text-white">{t('inquiry_status_completed')}</span>;
            default:
                return <span className="px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-gray-100 text-gray-600">{status}</span>;
        }
    };

    if (!isOpen) return null;

    // --- Detail View ---
    if (view === 'DETAIL' && selectedInquiry) {
        return (
            <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] bg-white z-[100] flex flex-col animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
                    <h2 className="text-[18px] font-bold text-[#191F28] line-clamp-1 flex-1 pr-4">
                        {selectedInquiry.title}
                    </h2>
                    <button
                        onClick={() => setView('LIST')}
                        className="p-1 -mr-1 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                            <path d="M15.75 15.75L2.25 2.25" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.75 2.25L2.25 15.75" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    {/* Top Row: Status & Delete - Left Aligned */}
                    <div className="flex items-center justify-start gap-2 mb-2">
                        {getStatusBadge(selectedInquiry.status)}
                        <button
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            className="px-3 py-1.5 bg-[#F2F4F6] text-[#8B95A1] text-xs font-medium rounded-[6px] hover:bg-gray-200 transition-colors"
                        >
                            {t('inquiry_delete')}
                        </button>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-[#8B95A1] mb-3">{formatDate(selectedInquiry.createdAt)}</p>

                    {/* Full Title */}
                    <h3 className="text-[17px] font-bold text-[#191F28] leading-tight mb-4">
                        {selectedInquiry.title}
                    </h3>

                    {/* Images */}
                    {selectedInquiry.images && selectedInquiry.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                            {selectedInquiry.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`attached-${idx}`}
                                    className="w-[100px] h-[100px] object-cover rounded-lg border border-gray-100 flex-shrink-0 cursor-pointer"
                                    onClick={() => window.open(img, '_blank')}
                                />
                            ))}
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="text-[15px] text-[#333D4B] whitespace-pre-wrap leading-relaxed mb-8">
                        {selectedInquiry.content}
                    </div>

                    {/* Reply Section */}
                    <h4 className="text-[15px] font-bold text-[#191F28] mb-3">{t('inquiry_admin_reply')}</h4>
                    {selectedInquiry.replies && selectedInquiry.replies.length > 0 ? (
                        <div className="space-y-4">
                            {selectedInquiry.replies.map((reply) => (
                                <div key={reply.id} className="bg-[#F9FAFB] p-4 rounded-xl">
                                    <p className="text-[14px] text-[#333D4B] whitespace-pre-wrap leading-relaxed">
                                        {reply.content}
                                    </p>
                                    <p className="text-xs text-[#8B95A1] mt-2">{formatDate(reply.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-[120px] bg-[#F2F4F6] rounded-xl flex items-center justify-center">
                            <p className="text-[#8B95A1] text-[14px]">{t('inquiry_reply_pending')}</p>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Overlay */}
                {isDeleteConfirmOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-200">
                        <div className="bg-white rounded-[20px] w-full max-w-[300px] p-[24px] flex flex-col items-center animate-in zoom-in-95 duration-200">
                            <h3 className="font-['Pretendard'] font-bold text-[18px] text-[#000000] mb-[8px]">
                                {t('inquiry_delete')}
                            </h3>
                            <p className="font-['Pretendard'] text-[15px] text-[#3C3C43]/60 mb-[24px]">
                                {t('inquiry_delete_confirm_desc')}
                            </p>

                            <div className="flex gap-[10px] w-full">
                                <button
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                    className="flex-1 h-[46px] rounded-[12px] bg-[#F5F5F5] text-[#000000] font-['Pretendard'] font-semibold text-[15px] active:bg-gray-200 transition-colors"
                                >
                                    {t('cancel_action')}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 h-[46px] rounded-[12px] bg-[#5A3D8B] text-white font-['Pretendard'] font-semibold text-[15px] active:bg-[#4a3275] transition-colors"
                                >
                                    {t('inquiry_delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }


    // --- List View ---
    return (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] bg-white z-[100] flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 h-[54px] border-b border-gray-50 shrink-0">
                <div className="flex items-center h-full px-[16px] gap-1 relative size-full">
                    <button onClick={onClose} className="relative shrink-0 size-[24px]" data-name="arrow_back_ios">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                            <g id="arrow_back_ios">
                                <path d="M17.0019 2.985C16.5119 2.495 15.7219 2.495 15.2319 2.985L6.92187 11.295C6.53187 11.685 6.53187 12.315 6.92187 12.705L15.2319 21.015C15.7219 21.505 16.5119 21.505 17.0019 21.015C17.4919 20.525 17.4919 19.735 17.0019 19.245L9.76187 11.995L17.0119 4.745C17.4919 4.265 17.4919 3.465 17.0019 2.985Z" fill="var(--fill-0, #000000)" id="Vector"></path>
                            </g>
                        </svg>
                    </button>

                    <h1 className="font-['Pretendard'] font-bold text-[18px] ml-[14px] pt-[3px]">{t('menu_qna')}</h1>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-10 scrollbar-hide flex flex-col">

                {/* Contact Button - Moved to Top */}
                <div className="py-4">
                    <button
                        onClick={onCreate}
                        className="w-full h-[46px] bg-[#f3f0ff] text-[#735ccc] rounded-xl font-bold text-[15px] hover:bg-[#ebe6ff] transition-colors flex items-center justify-center"
                    >
                        {t('contact_us')}
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#735ccc]"></div>
                    </div>
                ) : inquiries.length === 0 ? (
                    /* Empty State - Block Style 335x180 */
                    <div className="w-full h-[180px] flex items-center justify-center rounded-[14px]">
                        <span className="font-['Pretendard'] text-[15px] text-[#C7C7CC] text-center">
                            {t('inquiry_empty') || '문의한 내용이 없습니다.'}
                        </span>
                    </div>
                ) : (
                    <div className="space-y-0 divide-y divide-gray-100 mb-6">
                        {inquiries.map((inquiry) => (
                            <button
                                key={inquiry.id}
                                onClick={() => {
                                    setSelectedInquiry(inquiry);
                                    setView('DETAIL');
                                }}
                                className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex-1 pr-4">
                                    <div className="text-xs text-[#8E8E93] mb-1 font-medium font-['Pretendard']">
                                        {formatDate(inquiry.createdAt)}
                                    </div>
                                    <h3 className="text-[15px] font-medium text-[#191F28] line-clamp-1 group-hover:text-[#735ccc] transition-colors font-['Pretendard']">
                                        {inquiry.title}
                                    </h3>
                                </div>
                                <div className="flex-shrink-0">
                                    {getStatusBadge(inquiry.status)}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
