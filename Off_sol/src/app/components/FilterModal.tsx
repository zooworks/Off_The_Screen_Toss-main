import { useState } from "react";
import svgPaths from "@/imports/svg-imrh5pxhqy";

export interface ContentFilters {
  country?: string;
  type?: string[];
  category?: string[];
  trending?: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ContentFilters) => void;
}

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  // Load initial state from storage
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('off_filter_ui_state');
      return stored ? JSON.parse(stored).country : "ALL";
    } catch { return "ALL"; }
  });
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('off_filter_ui_state');
      return stored ? JSON.parse(stored).types : [];
    } catch { return []; }
  });
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('off_filter_ui_state');
      return stored ? JSON.parse(stored).experiences : [];
    } catch { return []; }
  });
  const [selectedTrending, setSelectedTrending] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem('off_filter_ui_state');
      return stored ? JSON.parse(stored).trending : null;
    } catch { return null; }
  });

  const toggleSelection = (category: string[], item: string, setter: (value: string[]) => void) => {
    if (category.includes(item)) {
      setter(category.filter((i) => i !== item));
    } else {
      setter([...category, item]);
    }
  };

  const toggleTrending = (item: string) => {
    setSelectedTrending(selectedTrending === item ? null : item);
  };

  const resetAll = () => {
    setSelectedCountry("ALL");
    setSelectedContentTypes([]);
    setSelectedExperiences([]);
    setSelectedTrending(null);
    localStorage.removeItem('off_filter_ui_state');
  };

  const getFilterCount = () => {
    let count = 0;
    if (selectedCountry !== "ALL") count++;
    count += selectedContentTypes.length;
    count += selectedExperiences.length;
    if (selectedTrending) count++;
    return count;
  };

  const handleApply = () => {
    const filters: ContentFilters = {};

    if (selectedCountry !== "ALL") {
      // Country enum 매핑 (프론트엔드 값 → 백엔드 enum)
      const countryMap: Record<string, string> = {
        'Korea': 'KR',
        'America': 'US',
        'China': 'CN',
        'Japan': 'JP',
      };
      filters.country = countryMap[selectedCountry] || selectedCountry;
    }

    if (selectedContentTypes.length > 0) {
      // Content Type enum 매핑
      const typeMap: Record<string, string> = {
        'drama': 'Drama',
        'movie': 'Drama', // 'movie'도 Drama로 매핑 (ContentEdit에 Movie 타입이 별도로 없다면)
        'reality': 'Reality',
        'documentary': 'Documentary',
        'travel': 'Travel',
      };
      filters.type = selectedContentTypes.map(t => typeMap[t] || t.charAt(0).toUpperCase() + t.slice(1));
    }

    if (selectedExperiences.length > 0) {
      // Capitalize first letter for mismatch (food -> Food)
      filters.category = selectedExperiences.map(e => {
        if (e === 'culture2') return 'Culture'; // Handle UI duplicate if any
        return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
      });
    }

    if (selectedTrending) {
      filters.trending = selectedTrending.toUpperCase();
    }

    // Save UI state
    localStorage.setItem('off_filter_ui_state', JSON.stringify({
      country: selectedCountry,
      types: selectedContentTypes,
      experiences: selectedExperiences,
      trending: selectedTrending
    }));

    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-[3px] backdrop-filter bg-[rgba(0,0,0,0.2)] z-[90]"
        onClick={onClose}
      />

      {/* Filter Modal */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] z-[100] animate-slide-up">
        <div className="w-full mx-auto bg-white rounded-tl-[15.878px] rounded-tr-[15.878px] shadow-[0px_-103.206px_28.779px_0px_rgba(135,135,135,0),0px_-65.496px_26.794px_0px_rgba(135,135,135,0.01),0px_-36.718px_21.832px_0px_rgba(135,135,135,0.03),0px_-16.87px_16.87px_0px_rgba(135,135,135,0.06),0px_-3.969px_8.931px_0px_rgba(135,135,135,0.06)] overflow-hidden">
          <div className="relative flex flex-col gap-[16px] px-[19.847px] pt-[11.908px] pb-[47.634px] h-[746px] overflow-hidden">
            {/* Handle */}
            <div className="flex justify-center">
              <div className="bg-[#d9d9d9] h-[3.969px] rounded-[7.939px] w-[29.771px]" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-[16px] right-[20px] p-2 -mr-2 -mt-2"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 15.75L2.25 2.25" stroke="#070707" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.75 2.25L2.25 15.75" stroke="#070707" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Filter by: */}
            <p className="font-['Toss Product Sans:Medium',sans-serif] text-[#555e67] text-[14px]">
              Filter by:
            </p>

            {/* Country Filter */}
            <div className="flex flex-col gap-[12px]">
              <p className="font-['Toss Product Sans:SemiBold',sans-serif] text-[#31373d] text-[16px]">
                Country
              </p>
              <div className="flex gap-[9.924px]">
                <button
                  onClick={() => setSelectedCountry("ALL")}
                  style={{ borderRadius: '50%' }}
                  className={`overflow-hidden size-[40px] rounded-full border-2 transition-all ${selectedCountry === "ALL" ? "border-purple-600 scale-110" : "border-transparent"
                    }`}
                >
                  <div className="size-full bg-[#F5F5F5] flex items-center justify-center rounded-full">
                    <p className="font-['Toss Product Sans:SemiBold',sans-serif] text-[#555e67] text-[14px]">
                      ALL
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedCountry("Korea")}
                  style={{ borderRadius: '50%' }}
                  className={`overflow-hidden size-[40px] rounded-full border-2 transition-all ${selectedCountry === "Korea" ? "border-purple-600 scale-110" : "border-transparent"
                    }`}
                >
                  <KoreaFlag />
                </button>
                <button
                  onClick={() => setSelectedCountry("America")}
                  style={{ borderRadius: '50%' }}
                  className={`overflow-hidden size-[40px] rounded-full border-2 transition-all ${selectedCountry === "America" ? "border-purple-600 scale-110" : "border-transparent"
                    }`}
                >
                  <AmericaFlag />
                </button>
                <button
                  onClick={() => setSelectedCountry("China")}
                  style={{ borderRadius: '50%' }}
                  className={`overflow-hidden size-[40px] rounded-full border-2 transition-all ${selectedCountry === "China" ? "border-purple-600 scale-110" : "border-transparent"
                    }`}
                >
                  <ChinaFlag />
                </button>
                <button
                  onClick={() => setSelectedCountry("Japan")}
                  style={{ borderRadius: '50%' }}
                  className={`overflow-hidden size-[40px] rounded-full border-2 transition-all ${selectedCountry === "Japan" ? "border-purple-600 scale-110" : "border-transparent"
                    }`}
                >
                  <JapanFlag />
                </button>
              </div>
              <div className="h-[1px] bg-[#ECEDF0] w-full" />
            </div>

            {/* Content Type Filter */}
            <div className="flex flex-col gap-[12px]">
              <p className="font-['Toss Product Sans:SemiBold',sans-serif] text-[#31373d] text-[16px]">
                Content Type
              </p>
              <div className="flex gap-[10px]">
                <FilterButton
                  label="🎬 Drama & Film"
                  selected={selectedContentTypes.includes("drama")}
                  onClick={() => toggleSelection(selectedContentTypes, "drama", setSelectedContentTypes)}
                />
                <FilterButton
                  label="📺 Reality & Show"
                  selected={selectedContentTypes.includes("reality")}
                  onClick={() => toggleSelection(selectedContentTypes, "reality", setSelectedContentTypes)}
                />
              </div>
              <div className="flex gap-[10px]">
                <FilterButton
                  label="📚 Documentary"
                  selected={selectedContentTypes.includes("documentary")}
                  onClick={() => toggleSelection(selectedContentTypes, "documentary", setSelectedContentTypes)}
                />
                <FilterButton
                  label="✈️ Travel & Lifestyle"
                  selected={selectedContentTypes.includes("travel")}
                  onClick={() => toggleSelection(selectedContentTypes, "travel", setSelectedContentTypes)}
                />
              </div>
              <div className="h-[1px] bg-[#ECEDF0] w-full" />
            </div>

            {/* Experience Filter */}
            <div className="flex flex-col gap-[12px]">
              <p className="font-['Toss Product Sans:SemiBold',sans-serif] text-[#31373d] text-[16px]">
                Experience
              </p>
              <div className="flex gap-[10px]">
                <FilterButton
                  label="🍽 Food"
                  selected={selectedExperiences.includes("food")}
                  onClick={() => toggleSelection(selectedExperiences, "food", setSelectedExperiences)}
                />
                <FilterButton
                  label="🎨 Culture"
                  selected={selectedExperiences.includes("culture")}
                  onClick={() => toggleSelection(selectedExperiences, "culture", setSelectedExperiences)}
                />
                <FilterButton
                  label="🌿 Nature"
                  selected={selectedExperiences.includes("nature")}
                  onClick={() => toggleSelection(selectedExperiences, "nature", setSelectedExperiences)}
                />
              </div>
              <div className="flex gap-[10px]">
                <FilterButton
                  label="🎨 Culture"
                  selected={selectedExperiences.includes("culture2")}
                  onClick={() => toggleSelection(selectedExperiences, "culture2", setSelectedExperiences)}
                />
                <FilterButton
                  label="🚶 Street"
                  selected={selectedExperiences.includes("street")}
                  onClick={() => toggleSelection(selectedExperiences, "street", setSelectedExperiences)}
                />
                <FilterButton
                  label="🏙 Landmark"
                  selected={selectedExperiences.includes("landmark")}
                  onClick={() => toggleSelection(selectedExperiences, "landmark", setSelectedExperiences)}
                />
              </div>
              <div className="h-[1px] bg-[#ECEDF0] w-full" />
            </div>

            {/* Trending Filter */}
            <div className="flex flex-col gap-[12px]">
              <p className="font-['Toss Product Sans:SemiBold',sans-serif] text-[#31373d] text-[16px]">
                Trending
              </p>
              <div className="flex gap-[10px]">
                <FilterButton
                  label="🔥 Hot Now"
                  selected={selectedTrending === "hot"}
                  onClick={() => toggleTrending("hot")}
                />
                <FilterButton
                  label="⭐ Popular"
                  selected={selectedTrending === "popular"}
                  onClick={() => toggleTrending("popular")}
                />
                <FilterButton
                  label="🆕 New"
                  selected={selectedTrending === "new"}
                  onClick={() => toggleTrending("new")}
                />
              </div>
              <div className="h-[1px] bg-[#ECEDF0] w-full" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[10px] w-full">
              <button
                onClick={resetAll}
                style={{ borderRadius: '12px' }}
                className="flex-1 bg-[#f3f0ff] rounded-[12px] px-[17px] py-[14.656px] transition-all hover:bg-[#e8e3ff]"
              >
                <p className="font-['Toss Product Sans:SemiBold',sans-serif] text-[#5a3d8b] text-[14px] text-center">
                  Reset All
                </p>
              </button>
              <button
                onClick={handleApply}
                style={{ borderRadius: '12px' }}
                className="flex-1 bg-[#5a3d8b] rounded-[12px] px-[17px] py-[14.656px] transition-all hover:bg-[#4a2d7b]"
              >
                <p className="font-['Toss Product Sans:SemiBold',sans-serif] text-white text-[14px] text-center">
                  Apply Filters({getFilterCount()})
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function FilterButton({ label, selected, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{ borderRadius: '12px' }}
      className={`flex-1 h-[47.634px] rounded-[12px] border transition-all ${selected
        ? "border-purple-600 bg-purple-50 border-2"
        : "border-[#ecedf0] border-[0.992px] hover:border-purple-400"
        }`}
    >
      <p className={`font-['Toss Product Sans:Medium',sans-serif] text-[14px] ${selected ? "text-purple-700 font-semibold" : "text-[#555e67]"
        }`}>
        {label}
      </p>
    </button>
  );
}

function KoreaFlag() {
  return (
    <div className="size-full bg-[#f5f5f5] rounded-full overflow-hidden relative">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.4167 35.4167">
        <g>
          <path d={svgPaths.p2922c9f0} fill="#F5F5F5" />
          <path d={svgPaths.p3d28ccc0} fill="#ED1C31" />
          <path d={svgPaths.p1b3b1200} fill="#003478" />
          <path d={svgPaths.p5f72100} fill="#0073C7" />
          <g>
            <path d={svgPaths.p379500} fill="#36393B" />
            <path d={svgPaths.p3cff0a72} fill="#36393B" />
            <path d={svgPaths.p127fc680} fill="#36393B" />
            <path d={svgPaths.p390ce880} fill="#36393B" />
            <path d={svgPaths.p3ad73000} fill="#36393B" />
            <path d={svgPaths.p1e1fc00} fill="#36393B" />
            <path d={svgPaths.p15f7c400} fill="#36393B" />
            <path d={svgPaths.p1224fe00} fill="#36393B" />
            <path d={svgPaths.p28d6200} fill="#36393B" />
            <path d={svgPaths.p1f8ccb00} fill="#36393B" />
            <path d={svgPaths.p3bd6d700} fill="#36393B" />
            <path d={svgPaths.p208e0900} fill="#36393B" />
            <path d={svgPaths.p1a6eb500} fill="#36393B" />
            <path d={svgPaths.p22d2def0} fill="#36393B" />
            <path d={svgPaths.p2591f100} fill="#36393B" />
            <path d={svgPaths.p10519900} fill="#36393B" />
            <path d={svgPaths.p220364c0} fill="#36393B" />
            <path d={svgPaths.p8520780} fill="#36393B" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function AmericaFlag() {
  return (
    <div className="size-full relative">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g>
          <circle cx="20" cy="20" fill="#F2F0F2" r="20" />
          <g>
            <mask height="40" id="mask0_america" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="40" x="0" y="0">
              <circle cx="20" cy="20" fill="#FCFCFC" r="20" />
            </mask>
            <g mask="url(#mask0_america)">
              <rect fill="#D90026" height="5" width="27.5" x="6.5" y="35.5" />
              <rect fill="#D90026" height="5" width="39.5" x="0.5" y="25.5" />
              <rect fill="#D90026" height="5" width="39.5" x="0.5" y="15" />
              <rect fill="#D90026" height="5" width="39.5" x="0.5" y="5" />
              <rect fill="#0052B5" height="20" width="20.5" />
              <path d={svgPaths.p18a97b80} fill="#EFEFEF" />
              <path d={svgPaths.p7f34780} fill="#EFEFEF" />
              <path d={svgPaths.p23ba6100} fill="#EFEFEF" />
              <path d={svgPaths.p2383ca00} fill="#EFEFEF" />
              <path d={svgPaths.p3d72e080} fill="#EFEFEF" />
              <path d={svgPaths.p21365b00} fill="#EFEFEF" />
              <path d={svgPaths.p800d100} fill="#EFEFEF" />
              <path d={svgPaths.p20275c00} fill="#EFEFEF" />
              <path d={svgPaths.pce07380} fill="#EFEFEF" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

function ChinaFlag() {
  return (
    <div className="size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="1.67734 2.12656 35.75556 35.75554">
        <g>
          <path d="M19.5551 37.7821C9.73673 37.7821 1.77734 29.8227 1.77734 20.0043C1.77734 10.1859 9.73673 2.22656 19.5551 2.22656C29.3735 2.22656 37.3329 10.1859 37.3329 20.0043C37.3329 29.8227 29.3735 37.7821 19.5551 37.7821Z" fill="#D90026"></path>
          <path d={svgPaths.p22ca4640} fill="#FFDB44" />
          <path d={svgPaths.p15f7dc00} fill="#FFDB44" />
          <path d={svgPaths.p2cda1d00} fill="#FFDB44" />
          <path d={svgPaths.p21eeee00} fill="#FFDB44" />
          <path d={svgPaths.p3b73ac00} fill="#FFDB44" />
        </g>
      </svg>
    </div>
  );
}

function JapanFlag() {
  return (
    <div className="size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="1.77734 2.22656 35.55556 35.55554">
        <g>
          <path d="M37.3329 20.0043C37.3329 29.8227 29.3735 37.7821 19.5551 37.7821C9.73673 37.7821 1.77734 29.8227 1.77734 20.0043C1.77734 10.1859 9.73673 2.22656 19.5551 2.22656C29.3735 2.22656 37.3329 10.1859 37.3329 20.0043Z" fill="#F5F5F5"></path>
          <path d={svgPaths.p2e2eaa00} fill="#D90026" />
        </g>
      </svg>
    </div>
  );
}