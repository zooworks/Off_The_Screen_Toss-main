// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

// User
export interface User {
    id: string;
    email: string | null;
    name: string | null;
    profileImage: string | null;
    provider: string;
    role: string;
    notificationEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

// Content
export interface Content {
    id: string;
    title: string;
    titleEn?: string | null;      // 영문 제목
    description: string | null;
    descriptionEn?: string | null; // 영문 설명
    type: string;
    country: string;
    category: string[];
    thumbnailUrl: string | null;
    trending: string | null;
    viewCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    locations?: Location[];
}

// Location
export interface Location {
    id: string;
    contentId: string;
    content?: Content;
    name: string;
    nameEn?: string | null;       // 영문 장소명
    description: string | null;
    descriptionEn?: string | null; // 영문 설명
    address: string;
    addressEn?: string | null;    // 영문 주소
    displayAddress?: string | null;  // 화면 표시용 주소 (KR)
    displayAddressEn?: string | null; // 화면 표시용 주소 (EN)
    latitude: number;
    longitude: number;
    openingHours: string | null;
    thumbnailUrl: string | null;
    chefImageUrl?: string | null;         // 셰프 이미지
    offTheScreenImageUrl?: string | null; // Off The Screen 이미지
    images?: string[];                    // 추가 이미지
    rating: number;
    reviewCount: number;
    viewCount: number;                    // 조회수
    owner: string | null;                 // 소유자/운영자
    ownerDescription: string | null;      // 소유자 설명
    ownerDescriptionEn?: string | null;   // 소유자 설명 (영문)
    onScreen: string | null;              // 화면에 등장한 장면 설명
    onScreenEn?: string | null;           // 화면에 등장한 장면 설명 (영문)
    price: string | null;                 // 가격 정보
    accessibility: boolean;               // 접근성
    parking: string | null;               // 주차 정보 (KR)
    parkingEn?: string | null;            // 주차 정보 (EN)
    isChef?: boolean;                     // 셰프/요식업 장소
    isOffTheScreen?: boolean;             // Off The Screen 추천
    hasVisitorInfo?: boolean;             // 방문자 정보 완비
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isFavorite?: boolean;                 // 좋아요 여부
    _count?: {                            // 카운트 정보
        reviews?: number;
        favorites?: number;
    };
}

// Favorite
export interface Favorite {
    id: string;
    userId: string;
    locationId: string;
    location: Location;
    createdAt: string;
}

// Review
export interface Review {
    id: string;
    userId: string;
    user?: User;
    locationId: string;
    rating: number;
    content: string | null;
    createdAt: string;
    updatedAt: string;
}

// Filter DTOs
export interface ContentFilter {
    type?: string;
    country?: string;
    category?: string[];
    trending?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface LocationFilter {
    contentId?: string;
    search?: string;
    page?: number;
    limit?: number;
}

// Auth
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
    user: User;
}
