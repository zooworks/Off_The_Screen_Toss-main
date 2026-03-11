import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TermsPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 font-['Toss Product Sans']">
                    {t('terms_and_policies')}
                </h2>
                <button
                    onClick={() => {
                        // Check if we came from 'intro' (LoginScreen)
                        const state = location.state as { from?: string } | null;
                        if (state?.from === 'intro') {
                            // Try to close mini-app
                            if (typeof Toss !== 'undefined' && Toss.close) {
                                Toss.close();
                            } else if (window.close) {
                                window.close();
                            } else {
                                // Fallback if close not available
                                navigate(-1);
                            }
                        } else {
                            // Default: Go back
                            navigate(-1);
                        }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 sticky top-[73px] bg-white z-10">
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
            <div className="flex-1 p-6 bg-gray-50">
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                    {activeTab === 'terms' ? (
                        <p>{t('terms_service_content')}</p>
                    ) : (
                        <p>{t('terms_privacy_content')}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
