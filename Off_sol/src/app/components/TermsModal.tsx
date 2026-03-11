import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin?: () => void;
}

export default function TermsModal({ isOpen, onClose, onLogin }: TermsModalProps) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

    if (!isOpen) return null;

    const handleAgree = () => {
        if (onLogin) {
            onLogin();
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[600px] h-[80vh] rounded-2xl flex flex-col shadow-2xl m-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 font-['Toss Product Sans']">
                        {t('terms_and_policies')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'terms'
                            ? 'text-[#5a3d8b]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t('terms_of_service')}
                        {activeTab === 'terms' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5a3d8b]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'privacy'
                            ? 'text-[#5a3d8b]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t('privacy_policy')}
                        {activeTab === 'privacy' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5a3d8b]" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                        {activeTab === 'terms' ? (
                            <p>{t('terms_service_content')}</p>
                        ) : (
                            <p>{t('terms_privacy_content')}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <button
                        onClick={handleAgree}
                        className="w-full py-3 bg-[#3182F6] text-white rounded-xl font-medium hover:bg-[#1B64DA] transition-colors"
                    >
                        {onLogin ? (t('agree_and_continue') || "동의하고 계속하기") : t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
