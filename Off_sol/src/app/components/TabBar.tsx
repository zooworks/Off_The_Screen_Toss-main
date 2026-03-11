import React from 'react';
import svgPathsNav from "@/imports/svg-tx1u7cf6ek";

export type TabType = "home" | "map" | "favorite" | "myinfo" | "notice" | "notification";

interface NavIconProps {
    isActive: boolean;
}

// ... existing icon components ...

function CocoBoldHome({ isActive }: NavIconProps) {
    return (
        <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Home">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g id="COCO/Bold/Home">
                    <path d={svgPathsNav.pddc4a00} fill={isActive ? "#735CCC" : "#8E8E93"} id="Vector" />
                </g>
            </svg>
        </div>
    );
}

function CocoBoldDiscovery({ isActive }: NavIconProps) {
    return (
        <div className="absolute inset-[7.14%]" data-name="COCO/Bold/Discovery">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g id="COCO/Bold/Discovery">
                    <path clipRule="evenodd" d={svgPathsNav.p15801500} fill={isActive ? "#735CCC" : "#8E8E93"} fillRule="evenodd" id="Vector" />
                </g>
            </svg>
        </div>
    );
}

function CocoBoldHeart({ isActive }: NavIconProps) {
    return (
        <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Heart">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g id="COCO/Bold/Heart">
                    <path d={svgPathsNav.p22aa1980} fill={isActive ? "#735CCC" : "#8E8E93"} id="Vector" />
                </g>
            </svg>
        </div>
    );
}

function CocoBoldUser({ isActive }: NavIconProps) {
    return (
        <div className="absolute inset-[7.14%] overflow-clip" data-name="COCO/Bold/User">
            <div className="absolute h-[18px] left-[5px] top-[3px] w-[14px]" data-name="Vector">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 18">
                    <g id="Vector">
                        <path d={svgPathsNav.p34f72700} fill={isActive ? "#735CCC" : "#8E8E93"} />
                        <path d={svgPathsNav.p1328ee72} fill={isActive ? "#735CCC" : "#8E8E93"} />
                    </g>
                </svg>
            </div>
        </div>
    );
}

interface TabProps {
    activeTab: string; // Changed from TabType to string to accept generic route matching
    onTabClick: (tab: string) => void;
}

export default function IOsTabBar({ activeTab, onTabClick }: TabProps) {
    // Navigation always in English (as per requirement)
    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] backdrop-blur-[10px] backdrop-filter bg-[rgba(249,249,249,0.94)] flex flex-col items-center justify-end border-t border-gray-200 z-50" data-name="iOS Tab Bar">
            <div className="w-full max-w-7xl">
                <div className="flex items-center justify-evenly w-full" data-name="Tabs">
                    {/* Home Tab */}
                    <button
                        onClick={() => onTabClick("home")}
                        className="flex-1 flex flex-col h-[49px] items-center justify-center pb-[8px] pt-[11px]"
                    >
                        <div className="relative shrink-0 size-[28px]">
                            <CocoBoldHome isActive={activeTab === "home"} />
                        </div>
                        <p className={`font-['Toss Product Sans:Medium',sans-serif] text-[10px] text-center tracking-[-0.24px] ${activeTab === "home" ? "text-[#735ccc]" : "text-[#8e8e93]"
                            }`}>Home</p>
                    </button>

                    {/* Map Tab */}
                    <button
                        onClick={() => onTabClick("map")}
                        className="flex-1 flex flex-col h-[49px] items-center justify-center pb-[8px] pt-[11px]"
                    >
                        <div className="relative shrink-0 size-[28px]">
                            <CocoBoldDiscovery isActive={activeTab === "map"} />
                        </div>
                        <p className={`font-['Toss Product Sans:Medium',sans-serif] text-[10px] text-center tracking-[-0.24px] ${activeTab === "map" ? "text-[#735ccc]" : "text-[#8e8e93]"
                            }`}>Map</p>
                    </button>

                    {/* Favorite Tab */}
                    <button
                        onClick={() => onTabClick("favorite")}
                        className="flex-1 flex flex-col h-[49px] items-center justify-center pb-[8px] pt-[11px]"
                    >
                        <div className="overflow-clip relative shrink-0 size-[28px]">
                            <CocoBoldHeart isActive={activeTab === "favorite"} />
                        </div>
                        <p className={`font-['Toss Product Sans:Medium',sans-serif] text-[10px] text-center tracking-[-0.24px] ${activeTab === "favorite" ? "text-[#735ccc]" : "text-[#8e8e93]"
                            }`}>Favorite</p>
                    </button>

                    {/* My Info Tab */}
                    <button
                        onClick={() => onTabClick("myinfo")}
                        className="flex-1 flex flex-col h-[49px] items-center justify-center pb-[8px] pt-[11px]"
                    >
                        <div className="overflow-clip relative shrink-0 size-[28px]">
                            <CocoBoldUser isActive={activeTab === "myinfo"} />
                        </div>
                        <p className={`font-['Toss Product Sans:Medium',sans-serif] text-[10px] text-center tracking-[-0.24px] ${activeTab === "myinfo" ? "text-[#735ccc]" : "text-[#8e8e93]"
                            }`}>My info</p>
                    </button>
                </div>


            </div>
        </div>
    );
}
