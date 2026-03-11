import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface MapAppsModalProps {
    isOpen: boolean;
    onClose: () => void;
    destinationLat: number;
    destinationLng: number;
    destinationName: string;
}

// Google Maps 아이콘
function GoogleMapIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#4285F4" />
            <path d="M16 8C12.13 8 9 11.13 9 15C9 20.25 16 26 16 26C16 26 23 20.25 23 15C23 11.13 19.87 8 16 8ZM16 17.5C14.62 17.5 13.5 16.38 13.5 15C13.5 13.62 14.62 12.5 16 12.5C17.38 12.5 18.5 13.62 18.5 15C18.5 16.38 17.38 17.5 16 17.5Z" fill="white" />
            <circle cx="16" cy="15" r="2" fill="#EA4335" />
        </svg>
    );
}

// Naver Maps 아이콘
function NaverMapIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#03C75A" />
            <path d="M19.5 10H12.5C11.67 10 11 10.67 11 11.5V20.5C11 21.33 11.67 22 12.5 22H19.5C20.33 22 21 21.33 21 20.5V11.5C21 10.67 20.33 10 19.5 10Z" fill="white" />
            <path d="M14.5 13L14.5 19L16 16L17.5 19V13" stroke="#03C75A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// Kakao Maps 아이콘
function KakaoMapIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#FEE500" />
            <path d="M16 8C12.13 8 9 11.13 9 15C9 20.25 16 26 16 26C16 26 23 20.25 23 15C23 11.13 19.87 8 16 8ZM16 17.5C14.62 17.5 13.5 16.38 13.5 15C13.5 13.62 14.62 12.5 16 12.5C17.38 12.5 18.5 13.62 18.5 15C18.5 16.38 17.38 17.5 16 17.5Z" fill="#3C1E1E" />
        </svg>
    );
}

export default function MapAppsModal({ isOpen, onClose, destinationLat, destinationLng, destinationName }: MapAppsModalProps) {
    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 현재 위치 가져오기
    useEffect(() => {
        if (isOpen && navigator.geolocation) {
            console.log("Requesting geolocation...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Geolocation success:", position.coords);
                    setCurrentPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log("Geolocation error:", error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            console.log("Geolocation not available or modal not open");
        }
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const openAppOrWeb = (appUrl: string, webUrl: string) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Try opening the App
            // Using window.location.href for deep link
            const start = Date.now();
            window.location.href = appUrl;

            // Fallback to Web if App not installed (detected by timeout)
            setTimeout(() => {
                const elapsed = Date.now() - start;
                // If the user didn't switch apps (page didn't lose focus/suspend), execute fallback
                // (Though exact behavior varies by OS/browser, this is a common pattern)
                if (elapsed < 2000) {
                    window.open(webUrl, "_blank");
                }
            }, 1500);
        } else {
            // Desktop -> Open Web
            window.open(webUrl, "_blank");
        }
    };

    const handleGoogleMaps = () => {
        const query = encodeURIComponent(destinationName);
        const url = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${query}`;
        window.open(url, "_blank");
        onClose();
    };

    const handleNaverMaps = () => {
        const encodedName = encodeURIComponent(destinationName);
        const appUrl = `nmap://search?query=${encodedName}&appname=com.offthescreen.app`; // appname is formal param
        const webUrl = `https://map.naver.com/v5/search/${encodedName}`;

        openAppOrWeb(appUrl, webUrl);
        onClose();
    };

    const handleKakaoMaps = () => {
        const encodedName = encodeURIComponent(destinationName);
        const appUrl = `kakaomap://search?q=${encodedName}`;
        const webUrl = `https://map.kakao.com/link/search/${encodedName}`;

        openAppOrWeb(appUrl, webUrl);
        onClose();
    };

    const modalContent = (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-[100]"
                onClick={onClose}
            />

            {/* Bottom Sheet Container - Centers the modal */}
            <div className="fixed inset-x-0 bottom-0 z-[110] flex justify-center pointer-events-none">
                {/* Modal Content */}
                <div className="w-full max-w-[1280px] bg-white rounded-t-[20px] pointer-events-auto animate-slide-up">
                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-[40px] h-[4px] bg-gray-300 rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="px-[16px] pb-[40px]">
                        {/* Title */}
                        <h2 className="font-['Toss Product Sans',sans-serif] font-semibold text-[18px] text-black mb-6">
                            Map Apps
                        </h2>

                        {/* Map Options */}
                        <div className="space-y-4">
                            {/* Google Maps */}
                            <button
                                onClick={handleGoogleMaps}
                                className="w-full flex items-center gap-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <GoogleMapIcon />
                                <span className="font-['Toss Product Sans',sans-serif] text-[16px] text-black">
                                    Google Map
                                </span>
                            </button>

                            {/* Naver Maps */}
                            <button
                                onClick={handleNaverMaps}
                                className="w-full flex items-center gap-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <NaverMapIcon />
                                <span className="font-['Toss Product Sans',sans-serif] text-[16px] text-black">
                                    Naver Map
                                </span>
                            </button>

                            {/* Kakao Maps */}
                            <button
                                onClick={handleKakaoMaps}
                                className="w-full flex items-center gap-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <KakaoMapIcon />
                                <span className="font-['Toss Product Sans',sans-serif] text-[16px] text-black">
                                    Kakao Map
                                </span>
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full mt-6 py-4 border border-gray-200 rounded-full font-['Toss Product Sans',sans-serif] text-[16px] text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Animation styles */}
            <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
        </>
    );

    return createPortal(modalContent, document.body);
}
