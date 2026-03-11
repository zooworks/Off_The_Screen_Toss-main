import React from 'react';
import svgPathsSearch from "@/imports/svg-rjl8y4ucu3";
import { useLanguage } from "@/contexts/LanguageContext";

function MagnifyingGlassGlassSearchMagnifying() {
    return (
        <div className="absolute inset-[3.61%_3.56%_3.5%_3.6%]" data-name="magnifying-glass--glass-search-magnifying">
            <div className="absolute inset-[-4.47%_-4.5%_-4.49%_-4.49%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2139 18.2168">
                    <g id="magnifying-glass--glass-search-magnifying">
                        <path d={svgPathsSearch.pb8d780} id="Vector" stroke="var(--stroke-0, #3C3C43)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
                        <path d={svgPathsSearch.p1b5fdd80} id="Vector_2" stroke="var(--stroke-0, #3C3C43)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
                    </g>
                </svg>
            </div>
        </div>
    );
}

function MagnifyingGlassGlassSearchMagnifying1() {
    return (
        <div className="absolute left-[5px] overflow-clip size-[18px] top-[5px]" data-name="magnifying-glass--glass-search-magnifying">
            <MagnifyingGlassGlassSearchMagnifying />
        </div>
    );
}

function CocoBoldHome1() {
    return <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Home" />;
}

function SfSymbol() {
    return (
        <div className="relative shrink-0 size-[28px]" data-name="SF Symbol">
            <MagnifyingGlassGlassSearchMagnifying1 />
            <CocoBoldHome1 />
        </div>
    );
}

function Content({ searchTerm, onSearchChange }: { searchTerm?: string, onSearchChange?: (term: string) => void }) {
    const { language, t } = useLanguage();

    return (
        <div className="bg-[rgba(250,250,250,0.93)] h-[36px] relative rounded-[10px] shrink-0 w-full" data-name="content">
            <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center p-[8px] relative size-full">
                    <SfSymbol />
                    <input
                        type="text"
                        className="w-full bg-transparent border-none outline-none font-['Toss Product Sans',sans-serif] text-[14px] text-gray-900 placeholder:text-[rgba(60,60,67,0.6)] ml-2"
                        placeholder={t('search_placeholder')}
                        value={searchTerm || ''}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

function FigmaSearchBar({ searchTerm, onSearchChange }: { searchTerm?: string, onSearchChange?: (term: string) => void }) {
    return (
        <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full" data-name="& SearchBar">
            <Content searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>
    );
}

function Tune() {
    return (
        <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
        </svg>
    );
}

interface SearchBarProps {
    onFilterClick: () => void;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
}

export default function SearchBar({ onFilterClick, searchTerm, onSearchChange }: SearchBarProps) {
    return (
        <div className="w-full bg-white h-[70px] flex items-center px-[16px]">
            <div className="w-full max-w-7xl mx-auto flex items-center gap-3">
                <div className="flex-1">
                    <FigmaSearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
                </div>
                <button onClick={onFilterClick} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="scale-y-[-100%]">
                        <Tune />
                    </div>
                </button>
            </div>
        </div>
    );
}
