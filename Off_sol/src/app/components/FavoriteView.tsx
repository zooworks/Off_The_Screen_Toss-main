import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import svgPaths from "@/imports/svg-cp1lx7j3fb";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedLocation, getLocalizedContent } from "@/lib/localization";
const imgItem = "https://placehold.co/200x300/CCCCCC/FFFFFF/png?text=Item";

import { Location } from "@/types/api";

interface FavoriteViewProps {
  onLocationClick?: (location: Location) => void;
}

export default function FavoriteView({ onLocationClick }: FavoriteViewProps) {
  const { isAuthenticated } = useAuth();
  const { favorites, loading, removeFavorite } = useFavorites();
  const { language } = useLanguage();

  const handleRemoveFavorite = async (locationId: string) => {
    try {
      await removeFavorite(locationId);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-[#f5f5f5]">
        <div className="flex flex-col items-center justify-center h-full p-[16px]">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium mb-2">{language === 'en' ? 'Login Required' : '로그인이 필요합니다'}</p>
            <p className="text-sm">{language === 'en' ? 'Please login to view favorites.' : '즐겨찾기를 보려면 로그인해주세요.'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-[#f5f5f5]">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#735ccc]"></div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto pb-24 bg-[#f5f5f5]">
        <div className="flex flex-col items-center justify-center h-full p-[16px]">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium mb-2">{language === 'en' ? 'No Favorites' : '즐겨찾기가 없습니다'}</p>
            <p className="text-sm">{language === 'en' ? 'Add places to your favorites.' : '좋아하는 장소를 즐겨찾기에 추가해보세요.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#f5f5f5]">
      <div className="flex flex-col gap-6 p-4 w-full">
        {Object.entries(
          favorites.reduce((groups, favorite) => {
            const content = favorite.location.content;
            const contentId = content ? content.id : 'unknown';

            if (!groups[contentId]) {
              groups[contentId] = {
                content: content,
                items: [],
              };
            }
            groups[contentId].items.push(favorite);
            return groups;
          }, {} as Record<string, { content: any; items: typeof favorites }>)
        ).map(([contentId, group]) => {
          const localizedContent = group.content
            ? getLocalizedContent(group.content, language)
            : { title: language === 'en' ? 'Others' : '기타', description: '' };

          return (
            <div key={contentId} className="flex flex-col gap-3">
              <h2 className="text-[#3b3b3b] font-bold text-lg font-['Toss Product Sans',sans-serif]">
                {localizedContent.title}
              </h2>
              <div className="flex flex-col gap-[14px]">
                {group.items.map((favorite) => {
                  const localizedLocation = getLocalizedLocation(favorite.location, language);
                  return (
                    <div
                      key={favorite.id}
                      className="bg-white flex flex-col h-[80px] items-start justify-center relative rounded-[10px] shrink-0 w-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onLocationClick?.(favorite.location)}
                    >
                      <div className="relative shrink-0 w-full">
                        <div className="flex flex-row items-center size-full">
                          <div className="flex items-center justify-between px-[10px] py-0 relative w-full">
                            <div className="flex gap-[8px] items-center relative shrink-0">
                              <div className="relative rounded-[4.685px] shrink-0 size-[60px] overflow-hidden">
                                <img
                                  alt={localizedLocation.name}
                                  className="absolute inset-0 size-full object-cover"
                                  src={favorite.location.thumbnailUrl || imgItem}
                                />
                              </div>
                              <div className="flex flex-col gap-1 items-start justify-center not-italic relative shrink-0 w-[153px]">
                                <p className="font-['Pretendard:Medium',sans-serif] leading-tight text-[#3b3b3b] text-[16px] w-full truncate">
                                  {localizedLocation.name}
                                </p>
                                <p className="font-['Toss Product Sans:Medium',sans-serif] leading-none text-[#948f97] text-[12px] w-full truncate">
                                  {localizedLocation.address}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFavorite(favorite.location.id);
                              }}
                              className="relative size-[28px] hover:opacity-70 transition-opacity flex items-center justify-center"
                            >
                              <div className="size-[24px]">
                                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                                  <path d={svgPaths.p22aa1980} fill="#735CCC" />
                                </svg>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
