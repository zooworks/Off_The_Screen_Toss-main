import { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, OverlayView } from "@react-google-maps/api";
import { useLocations } from "@/hooks/useLocations";
import type { Location } from "@/types/api";
import svgPaths from "@/imports/svg-rjl8y4ucu3";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedLocation } from "@/lib/localization";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || "";

// 서울 기본 좌표 (위치 권한이 없을 때 폴백)
const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.9780,
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

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

function CocoBoldHome1() {
  return <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="COCO/Bold/Home" />;
}

function SfSymbol2() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="SF Symbol">
      <MagnifyingGlassGlassSearchMagnifying1 />
      <CocoBoldHome1 />
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="bg-[rgba(250,250,250,0.93)] h-[36px] relative rounded-[10px] shrink-0 w-full" data-name="content">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <SfSymbol2 />
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none font-['Toss Product Sans',sans-serif] text-[14px] text-gray-900 placeholder:text-[rgba(60,60,67,0.6)] ml-2"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const { t } = useLanguage();
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full" data-name="& SearchBar">
      <SearchInput value={value} onChange={onChange} placeholder={t('search_placeholder')} />
    </div>
  );
}

interface MapSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

function MapSearchBar({ value, onChange }: MapSearchBarProps) {
  return (
    <div className="w-full bg-white px-[16px] py-4 border-b border-gray-100 z-10">
      <div className="max-w-7xl mx-auto">
        <SearchBar value={value} onChange={onChange} />
      </div>
    </div>
  );
}

interface LocationInfoProps {
  location: Location;
  onClose: () => void;
  onLocationClick?: (location: Location) => void;
}

function LocationInfo({ location, onClose, onLocationClick }: LocationInfoProps) {
  const { language } = useLanguage();
  const localizedLocation = getLocalizedLocation(location, language);

  return (
    <InfoWindow
      position={{ lat: location.latitude, lng: location.longitude }}
      onCloseClick={onClose}
    >
      <div className="p-2 min-w-[200px]">
        {location.thumbnailUrl && (
          <img
            src={location.thumbnailUrl}
            alt={localizedLocation.name}
            className="w-full h-24 object-cover rounded-lg mb-2 cursor-pointer"
            onClick={() => onLocationClick?.(location)}
          />
        )}
        <h3
          className="font-['Toss Product Sans',sans-serif] font-semibold text-sm cursor-pointer hover:text-[#735ccc] transition-colors"
          onClick={() => onLocationClick?.(location)}
        >
          {localizedLocation.name}
        </h3>
        <p className="font-['Toss Product Sans',sans-serif] text-xs text-gray-500 mt-1">{localizedLocation.address}</p>
        {location.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500">★</span>
            <span className="font-['Toss Product Sans',sans-serif] text-xs">{location.rating.toFixed(1)}</span>
            <span className="font-['Toss Product Sans',sans-serif] text-xs text-gray-400">({location.reviewCount})</span>
          </div>
        )}
      </div>
    </InfoWindow>
  );
}

// 현재 위치 마커 컴포넌트
function CurrentLocationMarker({ position }: { position: { lat: number; lng: number } }) {
  return (
    <Marker
      position={position}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#6393F2",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      }}
      zIndex={1000}
    />
  );
}

interface MapViewProps {
  onLocationClick?: (location: Location) => void;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

const STORAGE_KEY = 'off_map_state';

export default function MapView({ onLocationClick }: MapViewProps) {
  const { locations, loading, error } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize from session storage or default
  const [mapCenter, setMapCenter] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).center : DEFAULT_CENTER;
    } catch (e) {
      return DEFAULT_CENTER;
    }
  });
  const [zoom, setZoom] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).zoom : 13;
    } catch (e) {
      return 13;
    }
  });

  const hasSavedState = useRef(!!sessionStorage.getItem(STORAGE_KEY));
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLocations = locations.filter(location => {
    if (!searchTerm) return false;
    const query = searchTerm.toLowerCase();
    const localized = getLocalizedLocation(location, language);
    return localized.name.toLowerCase().includes(query) || localized.address.toLowerCase().includes(query);
  });

  const handleSearchResultClick = (location: Location) => {
    handleMarkerClick(location);
    setSearchTerm(""); // Clear search after selection
  };

  // Update storage when map moves
  const onIdle = useCallback(() => {
    if (map) {
      const center = map.getCenter();
      const currentZoom = map.getZoom();
      if (center && currentZoom) {
        const state = {
          center: { lat: center.lat(), lng: center.lng() },
          zoom: currentZoom
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    }
  }, [map]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    language: language,
    id: "google-map-script",
    libraries,
  });

  useEffect(() => {
    // console.log("API Key loaded:", !!GOOGLE_MAPS_API_KEY); // Comment out debug
    if (loadError) console.error("Google Maps Load Error:", loadError);
  }, [loadError]);

  useEffect(() => {
    let watchId: number | null = null;

    if (navigator.geolocation) {
      // 초기 위치 빠르게 가져오기
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
          // Only center if we didn't restore from storage
          if (!hasSavedState.current) {
            setMapCenter(pos);
          }
        },
        (error) => {
          console.log("Geolocation error:", error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000,
        }
      );

      // 위치 변경 실시간 감지
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
        },
        (error) => {
          console.log("Watch position error:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    console.log("MapView: isLoaded:", isLoaded, "loadError:", loadError);
  }, [isLoaded, loadError]);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("MapView: Google Map Instance Created (onLoad)");
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // 윈도우 리사이즈 시 맵 리사이즈 트리거
  useEffect(() => {
    const handleResize = () => {
      if (map) {
        google.maps.event.trigger(map, 'resize');
        // 현재 센터 유지
        const center = map.getCenter();
        if (center) {
          setTimeout(() => {
            map.setCenter(center);
          }, 100);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    if (map) {
      map.panTo({ lat: location.latitude, lng: location.longitude });
    }
  };

  // 현재 위치로 이동
  const goToCurrentLocation = () => {
    if (currentPosition && map) {
      map.panTo(currentPosition);
      map.setZoom(14);
    }
  };

  if (loadError) {
    return <div>Error: {loadError.message}</div>
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full relative">
      <div className="relative z-20">
        <MapSearchBar value={searchTerm} onChange={setSearchTerm} />

        {/* Search Results Dropdown */}
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg max-h-[60vh] overflow-y-auto border-b border-gray-200">
            {filteredLocations.length > 0 ? (
              filteredLocations.map(location => {
                const localized = getLocalizedLocation(location, language);
                return (
                  <div
                    key={location.id}
                    className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                    onClick={() => handleSearchResultClick(location)}
                  >
                    {location.thumbnailUrl && <img src={location.thumbnailUrl} alt="" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />}
                    <div>
                      <div className="font-semibold text-sm">{localized.name}</div>
                      <div className="text-xs text-gray-500">{localized.address}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="relative w-full flex-1">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            center={mapCenter}
            zoom={zoom}
            options={mapOptions}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onIdle={onIdle} // Added onIdle listener
          >
            {/* 현재 위치 마커 */}
            {currentPosition && (
              <CurrentLocationMarker position={currentPosition} />
            )}

            {/* Location Markers... */}
            {!loading && !error && locations.map((location) => {
              const localizedLocation = getLocalizedLocation(location, language);
              return (
                <OverlayView
                  key={location.id}
                  position={{ lat: location.latitude, lng: location.longitude }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div
                    onClick={() => handleMarkerClick(location)}
                    className="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    style={{ width: 55, height: 55 }}
                  >
                    <div className="w-full h-full rounded-[10px] overflow-hidden border-2 border-white shadow-lg">
                      <img
                        src={location.thumbnailUrl || "https://placehold.co/55x55/735ccc/ffffff?text=📍"}
                        alt={localizedLocation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </OverlayView>
              );
            })}
            {/* Selected Location Info */}
            {selectedLocation && (
              <LocationInfo
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
                onLocationClick={onLocationClick}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full">Loading Maps Script...</div>
        )}

        {/* 현재 위치로 이동 버튼 */}
        {currentPosition && (
          <button
            onClick={goToCurrentLocation}
            className="absolute bottom-28 right-6 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
            title={language === 'en' ? "Move to current location" : "현재 위치로 이동"}
          >
            <svg className="w-6 h-6 text-[#6393F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
            </svg>
          </button>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#735ccc]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-red-500 bg-white/80 p-4 rounded-lg font-['Toss Product Sans',sans-serif]">
              <p>{language === 'en' ? 'Failed to load locations' : '위치 정보를 불러오는데 실패했습니다.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}