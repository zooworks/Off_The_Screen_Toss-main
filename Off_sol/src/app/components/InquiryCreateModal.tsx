import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import inquiriesService from '@/services/inquiries';
import UserImageUploader from './UserImageUploader';

interface InquiryCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack?: () => void;
    onSuccess?: () => void;
}

export default function InquiryCreateModal({ isOpen, onClose, onBack, onSuccess }: InquiryCreateModalProps) {
    const { t } = useLanguage();
    const [title, setTitle] = useState(() => localStorage.getItem('inquiry_draft_title') || '');
    const [content, setContent] = useState(() => localStorage.getItem('inquiry_draft_content') || '');
    const [images, setImages] = useState<string[]>(() => {
        const saved = localStorage.getItem('inquiry_draft_images');
        return saved ? JSON.parse(saved) : [];
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Animation states
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsClosing(false);
        } else if (isVisible) {
            setIsClosing(true);
        }
    }, [isOpen, isVisible]);

    // Save draft
    useEffect(() => {
        localStorage.setItem('inquiry_draft_title', title);
        localStorage.setItem('inquiry_draft_content', content);
        localStorage.setItem('inquiry_draft_images', JSON.stringify(images));
    }, [title, content, images]);

    const handlePreSubmit = () => {
        if (!title.trim() || !content.trim()) {
            setError(t('inquiry_error_required'));
            return;
        }
        setError('');
        setIsConfirmOpen(true);
    };

    const handleRealSubmit = async () => {
        setIsConfirmOpen(false);
        setIsSubmitting(true);

        try {
            await inquiriesService.createInquiry({ title, content, images });

            // Clear draft
            localStorage.removeItem('inquiry_draft_title');
            localStorage.removeItem('inquiry_draft_content');
            localStorage.removeItem('inquiry_draft_images');

            setTitle('');
            setContent('');
            setImages([]);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(t('inquiry_error_failed'));
        } finally {
            setIsSubmitting(false);
        }
    };


    // ... (rest of logic)

    // Render logic
    const handleAnimationEnd = (e: React.AnimationEvent) => {
        if (e.target !== e.currentTarget) return;

        if (isClosing) {
            setIsVisible(false);
            setIsClosing(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] bg-white z-[110] flex flex-col duration-300 ${isClosing ? 'animate-out slide-out-to-bottom' : 'animate-in slide-in-from-bottom'
                }`}
            style={{ animationFillMode: 'forwards' }}
            onAnimationEnd={handleAnimationEnd}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
                <h2 className="text-[18px] font-bold text-[#191F28]">{t('contact_us')}</h2>
                <button onClick={onClose} className="p-1 -mr-1">
                    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                        <path d="M15.75 15.75L2.25 2.25" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15.75 2.25L2.25 15.75" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 pb-10 scrollbar-hide">
                <div className="space-y-5">
                    {/* Title */}
                    <div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-3">{t('inquiry_title_label')}</h3>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('inquiry_title_placeholder')}
                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#735ccc] bg-white text-[15px]"
                            maxLength={25}
                        />
                        <div className="text-right mt-1">
                            <span className="text-xs text-gray-400">{title.length}/25</span>
                        </div>
                    </div>

                    {/* Image Attachment */}
                    <div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-2">{t('inquiry_image_label')}</h3>
                        <p className="text-xs text-gray-400 mb-3">{t('inquiry_image_helper')}</p>
                        <UserImageUploader value={images} onChange={setImages} />
                    </div>

                    {/* Content */}
                    <div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-3">{t('inquiry_content_label')}</h3>
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={t('inquiry_content_placeholder')}
                                rows={8}
                                className="w-full px-4 py-4 bg-[#F2F4F6] border-none rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-[#735ccc] text-[15px] min-h-[302px]"
                                maxLength={1000}
                            />
                            <div className="text-right mt-2">
                                <span className="text-xs text-gray-400">{content.length}/1000</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handlePreSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#f3f0ff] text-[#735ccc] rounded-xl font-bold text-[16px] hover:bg-[#ebe6ff] transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? t('inquiry_submitting') : t('inquiry_submit_button')}
                    </button>
                </div>
            </div>

            {/* Confirmation Modal Overlay */}
            {
                isConfirmOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-200">
                        <div className="bg-white rounded-[20px] w-full max-w-[300px] p-[24px] flex flex-col items-center animate-in zoom-in-95 duration-200">
                            <h3 className="font-['Pretendard'] font-bold text-[18px] text-[#000000] mb-[8px]">
                                {t('contact_us')}
                            </h3>
                            <p className="font-['Pretendard'] text-[15px] text-[#3C3C43]/60 mb-[24px]">
                                {t('inquiry_confirm_desc')}
                            </p>

                            <div className="flex gap-[10px] w-full">
                                <button
                                    onClick={() => setIsConfirmOpen(false)}
                                    className="flex-1 h-[46px] rounded-[12px] bg-[#F5F5F5] text-[#000000] font-['Pretendard'] font-semibold text-[15px] active:bg-gray-200 transition-colors"
                                >
                                    {t('cancel_action')}
                                </button>
                                <button
                                    onClick={handleRealSubmit}
                                    className="flex-1 h-[46px] rounded-[12px] bg-[#5A3D8B] text-white font-['Pretendard'] font-semibold text-[15px] active:bg-[#4a3275] transition-colors"
                                >
                                    {t('inquiry_submit_button')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
