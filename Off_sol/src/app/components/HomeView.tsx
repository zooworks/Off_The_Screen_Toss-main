import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Content } from "@/types/api";
import SearchBar from "@/app/components/SearchBar";
import MovieCard from "@/app/components/MovieCard";
import FilterModal, { ContentFilters } from "@/app/components/FilterModal";
import { getLocalizedContent } from "@/lib/localization";
import { Analytics } from "@apps-in-toss/web-framework";

import frameSvg from '@/assets/Frame_2043684107.svg';
import LoginQuestionModal from "@/app/components/LoginQuestionModal";
import TermsModal from "@/app/components/TermsModal";
import authService from "@/services/auth";
import WelcomeScreen from "@/app/components/WelcomeScreen";

const imgImage1662 = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Image";

interface HomeViewProps {
    contents: Content[];
    loading: boolean;
    error: any;
    refetch: (params?: any) => void;
}

export default function HomeView({ contents, loading, error, refetch }: HomeViewProps) {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const observerRef = useRef<IntersectionObserver | null>(null);

    // UI State
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    // Helper to check token synchronously or use authService
    const isAuthenticated = authService.isAuthenticated();

    // Read Content IDs (Local Logic)
    const [readContentIds, setReadContentIds] = useState<string[]>(() => {
        const stored = localStorage.getItem('off_read_content_ids');
        return stored ? JSON.parse(stored) : [];
    });

    // Filter Logic
    const filteredContents = contents.filter(content => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        return (
            (content.title && content.title.toLowerCase().includes(query)) ||
            (content.titleEn && content.titleEn.toLowerCase().includes(query)) ||
            (content.description && content.description.toLowerCase().includes(query)) ||
            (content.descriptionEn && content.descriptionEn.toLowerCase().includes(query))
        );
    });

    // Impression Logging
    useEffect(() => {
        if (loading || filteredContents.length === 0) return;

        // Disconnect previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const contentId = entry.target.getAttribute('data-item-id');
                    if (contentId) {
                        Analytics.impression({ item_id: contentId });
                        // Unobserve after logging to prevent duplicate logs for the same session view
                        observerRef.current?.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.5 }); // 50% visibility

        const cards = document.querySelectorAll('.movie-card-item');
        cards.forEach((card) => {
            observerRef.current?.observe(card);
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [filteredContents, loading]);

    const handleCardClick = (content: Content) => {
        Analytics.click({
            button_name: 'content_card',
            params: {
                content_id: content.id,
                title: content.title
            } as any
        });

        if (!readContentIds.includes(content.id)) {
            const newReadIds = [...readContentIds, content.id];
            setReadContentIds(newReadIds);
            localStorage.setItem('off_read_content_ids', JSON.stringify(newReadIds));
        }
        navigate(`/content/${content.id}`);
    };

    const handleFilterApply = (filters: ContentFilters) => {
        const filterParams = {
            country: filters.country,
            type: filters.type?.join(','),
            category: filters.category,
            trending: filters.trending,
        };
        localStorage.setItem('off_content_filters', JSON.stringify(filterParams));
        refetch(filterParams);
    };

    const handleProtectedRoute = () => {
        if (isAuthenticated) {
            // If already logged in, navigate (e.g. to profile) or show something
            // For now, no specific "My Info" page was requested, just the intercept check.
            // If My Info page exists, navigate there. Otherwise do nothing or alert.
            // Assuming no Profile page yet, just verify flow.
            console.log("Accessing Protected Route: My Info");
        } else {
            setIsLoginModalOpen(true);
        }
    };

    // Callback when user agrees to terms -> Proceed to Login
    const handleLoginProcedure = () => {
        setIsTermsModalOpen(false);
        // Trigger Toss Login
        // Usually redirects to Toss App or shows OAuth window.
        // For Sandbox, we might simulate or redirect.
        window.location.href = '/api/auth/toss/login'; // Or use authService method if implemented
    };

    return (
        <>
            <SearchBar
                onFilterClick={() => setIsFilterModalOpen(true)}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <main className="flex-1 overflow-y-auto pb-40 no-scrollbar">
                <div className="w-full bg-white h-[59px] flex flex-col justify-center">
                    <div className="w-full max-w-7xl mx-auto px-[16px] flex flex-col gap-1">
                        <h2 className="font-['Manrope',sans-serif] text-[20px] font-bold text-[#111]">{t('home_banner_title')}</h2>
                        <p className="font-['Manrope',sans-serif] text-[14px] text-[#999] font-medium">{t('home_banner_desc')}</p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-[16px] pt-[16px] pb-[16px]">

                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#735ccc]"></div>
                        </div>
                    )}
                    {error && (
                        <div className="text-center py-12 text-red-500">Failed to load contents.</div>
                    )}
                    {!loading && !error && filteredContents.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="font-['Toss Product Sans',sans-serif] text-lg mb-2">{t('no_content_available')}</p>
                        </div>
                    )}
                    {!loading && !error && filteredContents.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-4">
                            {filteredContents.map((content) => {
                                const localizedContent = getLocalizedContent(content, language);
                                return (
                                    <MovieCard
                                        key={content.id}
                                        image={content.thumbnailUrl || imgImage1662}
                                        title={localizedContent.title}
                                        description={localizedContent.description || undefined}
                                        onCardClick={() => handleCardClick(content)}
                                        className="movie-card-item"
                                        data-item-id={content.id}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={handleFilterApply} />
            <LoginQuestionModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={() => {
                    setIsLoginModalOpen(false);
                    setIsTermsModalOpen(true);
                }}
            />
            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                onLogin={handleLoginProcedure}
            />
        </>
    );
}
