import { useState, useEffect } from "react";
import LoginQuestionModal from "@/app/components/LoginQuestionModal";
import TermsModal from "@/app/components/TermsModal";
import { motion } from "motion/react";
import { useContentLocations } from "@/hooks/useLocations";
import favoritesService from "@/services/favorites";
import type { Location } from "@/types/api";
import svgPaths from "@/imports/svg-sfnnmum0j9";
import { getLocalizedLocation, getLocalizedText } from "@/lib/localization";
import { useLanguage } from "@/contexts/LanguageContext";
const imgItem = "https://placehold.co/100x150/CCCCCC/FFFFFF/png?text=Item";
const imgImage1663 = "https://placehold.co/100x150/CCCCCC/FFFFFF/png?text=Image";
const imgImage1662 = "https://placehold.co/100x150/CCCCCC/FFFFFF/png?text=Image";

interface DetailViewProps {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  backgroundImage: string;
  contentId?: string;
  onBack: () => void;
  onCardClick?: (location?: Location) => void;
}

const formatViews = (views: number, suffix: string) => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k ${suffix}`;
  }
  return `${views} ${suffix}`;
};

function ArrowBackIos({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative shrink-0 size-[24px]" data-name="arrow_back_ios">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow_back_ios">
          <path d={svgPaths.pf93b000} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </button>
  );
}

function Tune() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="tune">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tune"></g>
      </svg>
    </div>
  );
}

function Top({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-[54px] relative w-full" data-name="top">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-end px-[16px] py-0 relative size-full">
          <Tune />
        </div>
      </div>
    </div>
  );
}

function Frame({ title }: { title: string }) {
  return (
    <div className="w-[305px] flex flex-col gap-[8px] items-start relative shrink-0">
      <p className="font-['Toss Product Sans:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[24px] text-white tracking-[-0.5px] max-w-full font-[Toss Product Sans] font-bold">{title}</p>
    </div>
  );
}

function Frame1({ title, description }: { title: string; description: string }) {
  return (
    <div className="w-full flex flex-col gap-[14px] p-[16px] items-start shrink-0 z-10">
      <Frame title={title} />
      <p className="w-[335px] h-[42px] font-['Toss Product Sans',sans-serif] font-normal text-[14px] leading-[21px] tracking-[-0.5px] text-white break-keep whitespace-pre-wrap overflow-hidden text-ellipsis line-clamp-2">{description}</p>
    </div>
  );
}

function MagnifyingGlassGlassSearchMagnifying() {
  return (
    <div className="absolute inset-[3.61%_3.56%_3.5%_3.6%]" data-name="magnifying-glass--glass-search-magnifying">
      <div className="absolute inset-[-4.47%_-4.5%_-4.49%_-4.49%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2139 18.2168">
          <g id="magnifying-glass--glass-search-magnifying">
            <path d={svgPaths.pb8d780} id="Vector" stroke="var(--stroke-0, #3C3C43)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
            <path d={svgPaths.p1b5fdd80} id="Vector_2" stroke="var(--stroke-0, #3C3C43)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
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

function CocoBoldHome() {
  return <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Home" />;
}

function SfSymbol() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="SF Symbol">
      <MagnifyingGlassGlassSearchMagnifying1 />
      <CocoBoldHome />
    </div>
  );
}

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function SearchInput({ searchTerm, onSearchChange }: SearchInputProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-[rgba(250,250,250,0.93)] h-[36px] relative rounded-[10px] shrink-0 w-full" data-name="content">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <SfSymbol />
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none font-['Toss Product Sans',sans-serif] text-[14px] text-gray-900 placeholder:text-[rgba(60,60,67,0.6)] ml-2"
            placeholder={t('search_interest_area')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function SearchBar({ searchTerm, onSearchChange }: SearchInputProps) {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full" data-name="& SearchBar">
      <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />
    </div>
  );
}

function Frame2({ searchTerm, onSearchChange }: SearchInputProps) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
    </div>
  );
}

function Frame4({ searchTerm, onSearchChange }: SearchInputProps) {
  return (
    <div className="relative shrink-0 w-full mb-5 px-[16px]">
      <div className="content-stretch flex flex-col items-start relative size-full">
        <Frame2 searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>
    </div>
  );
}

interface Frame10Props extends SearchInputProps {
  title: string;
  description: string;
  onBack: () => void;
}

function Frame10({ title, description, onBack, searchTerm, onSearchChange }: Frame10Props) {
  return (
    <div className="flex flex-col items-center justify-start relative shrink-0 w-full">
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none w-full">
          <Top onBack={onBack} />
        </div>
      </div>
      <Frame1 title={title} description={description} />
      <Frame4 searchTerm={searchTerm} onSearchChange={onSearchChange} />
    </div>
  );
}

function CocoBoldHeart() {
  return (
    <div className="absolute left-1/2 size-[17.143px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1429 17.1429">
        <g id="COCO/Bold/Heart">
          <path d={svgPaths.p1bea0400} fill="var(--fill-0, #735CCC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <CocoBoldHeart />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <Frame3 />
      <div className="flex flex-col font-['Toss Product Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white tracking-[0.0322px]">
        <p className="leading-[16.911px]">124</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-start justify-end relative shrink-0 w-[134px]">
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 text-white tracking-[0.0322px] w-full">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[12.885px] w-full">
        <p className="leading-[21.743px]">K-POP Demo...</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-full">
        <p className="leading-[16.911px]">1.3k views</p>
        {/* Note: This is Frame7 used in Titles used in Content1 used in ItemText used in Item used in Frame8 (placeholder grid). */}
        {/* Placeholder text '1.3k views' is hardcoded here. I can replace it with t('views_suffix') but it's mock data. */}
        {/* I'll leave it or replace if critical. */}
      </div>
    </div>
  );
}

function Titles() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-end min-h-px min-w-px relative shrink-0 w-[94.683px]" data-name="Titles">
      <Frame7 />
    </div>
  );
}

function Content1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.221px] inset-[0_1.26%_0.05%_1.82%] items-start justify-end px-[12.885px] py-[10px]" data-name="Content" style={{ backgroundImage: "linear-gradient(0.40426deg, rgba(30, 30, 30, 0.6) 8.3907%, rgba(30, 30, 30, 0) 69.369%)" }}>
      <Frame5 />
      <Titles />
    </div>
  );
}

function ItemText() {
  return (
    <div className="absolute h-[165.084px] left-[calc(50%-0.46px)] top-0 translate-x-[-50%] w-[165.085px]" data-name="Item-text-1">
      <div className="absolute aspect-[160/165] left-[1.82%] right-[1.26%] top-0" data-name="image 1663">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1663} />
      </div>
      <Content1 />
    </div>
  );
}

interface LocationItemProps {
  location: Location;
  onCardClick?: (location: Location) => void;
  onRequireLogin?: () => void;
}

function LocationItem({ location, onCardClick, onRequireLogin }: LocationItemProps) {
  const { t, language } = useLanguage();
  const localizedLocation = getLocalizedLocation(location, language);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(location._count?.favorites || 0);
  const [isToggling, setIsToggling] = useState(false);

  // 토큰 있는지 확인 (로그인 상태)
  const hasToken = () => !!localStorage.getItem('off_access_token');

  // Lift state for modals? Or pass callback?
  // Since DetailView renders many LocationItems, managing modal state in LocationItem is weird.
  // Ideally, 'onFavoriteClick' should bubble up to DetailView or use Context.
  // However, user asked for modification in DetailView logic.
  // I will assume access to modal control via props or context is simpler... 
  // Wait, I cannot easily pass props down through 'LocationItem' as it is defined inside the file.
  // I will modify 'LocationItem' to accept 'onRequireLogin' callback.

  // 컴포넌트 마운트 시 좋아요 상태 확인 (로그인 상태일 때만)
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!hasToken()) return; // 게스트 모드면 스킵

      try {
        const result = await favoritesService.check(location.id);
        setIsFavorite(result.isFavorite);
      } catch (error) {
        // 인증되지 않은 경우 등 에러는 무시
        console.log('Favorite check skipped:', error);
      }
    };
    checkFavoriteStatus();
  }, [location.id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (isToggling) return;

    // 게스트 모드면 로그인 안내
    if (!hasToken()) {
      // alert(t('login_required'));
      // Call parent handler
      onRequireLogin?.();
      return;
    }

    setIsToggling(true);
    try {
      if (isFavorite) {
        await favoritesService.remove(location.id);
        setIsFavorite(false);
        setFavoriteCount(prev => Math.max(0, prev - 1));
      } else {
        await favoritesService.add(location.id);
        setIsFavorite(true);
        setFavoriteCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full aspect-[160/165] overflow-clip relative rounded-[12.885px] shrink-0 cursor-pointer"
      data-name="item"
      onClick={() => onCardClick?.(location)}
    >
      <img
        alt={location.name}
        className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12.885px] size-full"
        src={location.thumbnailUrl || imgItem}
      />
      <div className="absolute content-stretch flex flex-col gap-[3.221px] inset-0 items-start justify-end px-[12.885px] py-[10px]" style={{ backgroundImage: "linear-gradient(0.40426deg, rgba(30, 30, 30, 0.6) 8.3907%, rgba(30, 30, 30, 0) 69.369%)" }}>
        <div className="content-stretch flex items-start justify-end relative shrink-0 w-full">
          <button
            onClick={handleFavoriteClick}
            className="content-stretch flex items-center justify-center relative shrink-0 transition-transform active:scale-110"
          >
            <div className="overflow-clip relative shrink-0 size-[20px]">
              <div className="absolute left-1/2 size-[17.143px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                <svg className="block size-full" preserveAspectRatio="none" viewBox="0 0 17.1429 17.1429">
                  <path
                    d={svgPaths.p1bea0400}
                    fill={isFavorite ? "#735CCC" : "none"}
                    stroke={isFavorite ? "#735CCC" : "white"}
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>
            {favoriteCount > 0 && (
              <div className="flex flex-col font-['Toss Product Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white tracking-[0.0322px]">
                <p className="leading-[16.911px]">{favoriteCount}</p>
              </div>
            )}
          </button>
        </div>
        <div className="basis-0 content-stretch flex flex-col grow items-start justify-end min-h-px min-w-px relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 text-white tracking-[0.0322px] w-full">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[12.885px] w-full">
              <p className="leading-[21.743px] truncate">{localizedLocation.name}</p>
            </div>
            <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-full">
              <p className="leading-[16.911px]">{formatViews(location.viewCount || 0, 'views')}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Item({ onCardClick }: { onCardClick?: () => void }) {
  return (
    <motion.div
      layout
      className="w-full aspect-[160/165] overflow-clip relative rounded-[12.885px] shrink-0 cursor-pointer" data-name="item" onClick={onCardClick}>
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12.885px] size-full" src={imgItem} />
      <ItemText />
    </motion.div>
  );
}

interface LocationGridProps {
  locations: Location[];
  loading: boolean;
  onCardClick?: (location: Location) => void;
  onRequireLogin: () => void;
}

function LocationGrid({ locations, loading, onCardClick, onRequireLogin }: LocationGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#735ccc]"></div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 w-full">
        No locations found for this content.
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full max-w-7xl px-4 min-h-[905px]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-4 w-full">
        {locations.map((location) => (
          <LocationItem key={location.id} location={location} onCardClick={onCardClick} onRequireLogin={onRequireLogin} />
        ))}
      </div>
    </div>
  );
}

function Frame8({ onCardClick }: { onCardClick?: () => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-4 w-full">
      {[...Array(8).keys()].map((_, i) => (
        <Item key={i} onCardClick={onCardClick} />
      ))}
    </div>
  );
}

function Frame9({ onCardClick }: { onCardClick?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full max-w-7xl px-[16px]">
      <Frame8 onCardClick={onCardClick} />
    </div>
  );
}



export default function DetailView({ title, titleEn, description, descriptionEn, backgroundImage, contentId, onBack, onCardClick }: DetailViewProps) {
  const { locations, loading } = useContentLocations(contentId || null);
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleLoginProcedure = () => {
    setIsTermsModalOpen(false);
    window.location.href = '/api/auth/toss/login';
  };

  // Mock Data for Local Development
  const MOCK_LOCATIONS: Location[] = [
    { id: '1', name: 'K-POP Demo Location 1', address: 'Seoul, Gangnam-gu', viewCount: 1200, thumbnailUrl: 'https://placehold.co/160x165', _count: { favorites: 10 } } as Location,
    { id: '2', name: 'K-POP Demo Location 2', address: 'Seoul, Mapo-gu', viewCount: 850, thumbnailUrl: 'https://placehold.co/160x165', _count: { favorites: 5 } } as Location,
    { id: '3', name: 'K-POP Demo Location 3', address: 'Busan, Haeundae', viewCount: 3000, thumbnailUrl: 'https://placehold.co/160x165', _count: { favorites: 124 } } as Location,
    { id: '4', name: 'K-POP Demo Location 4', address: 'Jeju Island', viewCount: 500, thumbnailUrl: 'https://placehold.co/160x165', _count: { favorites: 2 } } as Location,
  ];

  const displayLocations = (locations.length === 0 && typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? MOCK_LOCATIONS
    : locations;

  const filteredLocations = displayLocations.filter(loc => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = getLocalizedLocation(loc, language).name.toLowerCase();
    const address = loc.address?.toLowerCase() || "";
    return name.includes(term) || address.includes(term);
  });

  // content object가 통째로 넘어오지 않고 props로 title, description만 넘어오고 있음.
  // 하지만 부모 컴포넌트(Home?)에서 어떤 데이터를 넘겨주는지 확인이 필요함.
  // 일단 contentId를 기반으로 locations는 새로 fetch하고 있음.
  // LocationsGrid 내부의 LocationItem들은 localization을 적용할 수 있음.
  // Frame10(Title/Desc)은 props로 받은걸 그대로 쓰고 있어서, 부모에서 이미 localized된걸 넘겨주거나
  // 여기서 content 정보를 다시 fetch해야 함.
  // 하지만 여기선 props로 받은걸 우선 쓰되, locations는 확실히 localize 가능.

  return (
    <div className="bg-white fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] z-[60] overflow-y-auto overflow-x-hidden pb-24 no-scrollbar" data-name="DetailView">
      {/* Background Image Layer */}
      <div className="absolute left-0 top-0 w-full h-[352px] overflow-hidden">
        <div className="absolute left-0 right-0 top-0 h-full overflow-hidden" data-name="image 1662">
          <img
            alt=""
            className="absolute w-full h-full object-cover object-top"
            src={backgroundImage || imgImage1662}
          />
          {/* Enhanced Dark Overlay for better contrast at the top - matched to Reference */}
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,1) 100%)"
            }}
          />
        </div>
      </div>

      <div className="relative flex flex-col items-center w-full min-h-full pb-20 z-20">
        <Frame10
          title={getLocalizedText(title, titleEn, language)}
          description={getLocalizedText(description, descriptionEn, language)}
          onBack={onBack}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {contentId ? (
          <LocationGrid locations={filteredLocations} loading={loading} onCardClick={onCardClick} onRequireLogin={() => setIsLoginModalOpen(true)} />
        ) : (
          <Frame9 onCardClick={() => onCardClick?.()} />
        )}
      </div>
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
    </div>
  );
}