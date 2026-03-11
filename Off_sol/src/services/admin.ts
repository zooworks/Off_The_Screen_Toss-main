import apiClient from '@/lib/api';

export interface AdminLoginRequest {
    username: string;
    password: string;
}

export interface AdminLoginResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

export interface Content {
    id: string;
    title: string;
    titleEn?: string | null;       // 영문 제목
    description: string | null;
    descriptionEn?: string | null; // 영문 설명
    type: string;
    country: string;
    category: string;
    thumbnailUrl: string | null;
    trending: string | null;
    viewCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        locations: number;
    };
}

export interface ContentListResponse {
    data: Content[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateContentRequest {
    title: string;
    titleEn?: string;       // 영문 제목
    description?: string;
    descriptionEn?: string; // 영문 설명
    type: string;
    country: string;
    category?: string[];
    thumbnailUrl?: string;
    trending?: string;
    isActive?: boolean;
}

export interface UpdateContentRequest {
    title?: string;
    titleEn?: string;       // 영문 제목
    description?: string;
    descriptionEn?: string; // 영문 설명
    type?: string;
    country?: string;
    category?: string[];
    thumbnailUrl?: string;
    trending?: string;
    isActive?: boolean;
}

const ADMIN_TOKEN_KEY = 'admin_token';

// 토큰 관리
export const getAdminToken = (): string | null => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const removeAdminToken = (): void => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const isAdminLoggedIn = (): boolean => {
    return !!getAdminToken();
};

import { getMockResponse } from '@/lib/mockData';

// API 호출 헬퍼
const adminApiClient = {
    async request<T>(method: string, url: string, data?: unknown): Promise<T> {
        // MOCK MODE CHECK
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
            return getMockResponse(url, method, data) as unknown as T;
        }

        const token = getAdminToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${url}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });

        // 401 에러 시 토큰 삭제하고 로그아웃 이벤트 발생
        if (response.status === 401) {
            removeAdminToken();
            window.dispatchEvent(new CustomEvent('admin-logout'));
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        if (response.status === 204) {
            return {} as T;
        }

        const text = await response.text();
        return text ? JSON.parse(text) : {} as T;
    },
};

// Admin API
export const adminService = {
    // 로그인
    async login(dto: AdminLoginRequest): Promise<AdminLoginResponse> {
        const response = await adminApiClient.request<AdminLoginResponse>('POST', '/admin/login', dto);
        setAdminToken(response.accessToken);
        return response;
    },

    // 로그아웃
    logout(): void {
        removeAdminToken();
    },

    // 콘텐츠 목록 조회
    async getContents(page = 1, limit = 10, search?: string): Promise<ContentListResponse> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });
        if (search) {
            params.append('search', search);
        }
        return adminApiClient.request<ContentListResponse>('GET', `/admin/contents?${params}`);
    },

    // 콘텐츠 상세 조회
    async getContentById(id: string): Promise<Content> {
        return adminApiClient.request<Content>('GET', `/admin/contents/${id}`);
    },

    // 콘텐츠 생성
    async createContent(dto: CreateContentRequest): Promise<Content> {
        return adminApiClient.request<Content>('POST', '/admin/contents', dto);
    },

    // 콘텐츠 수정
    async updateContent(id: string, dto: UpdateContentRequest): Promise<Content> {
        return adminApiClient.request<Content>('PUT', `/admin/contents/${id}`, dto);
    },

    // 콘텐츠 삭제
    async deleteContent(id: string): Promise<void> {
        return adminApiClient.request<void>('DELETE', `/admin/contents/${id}`);
    },

    // 콘텐츠 순서 변경
    async reorderContents(ids: string[]): Promise<void> {
        return adminApiClient.request<void>('POST', '/admin/contents/reorder', { ids });
    },

    // ==================== 공지사항 API ====================

    // 공지사항 목록 조회
    async getNotices(page = 1, limit = 10, date?: string): Promise<NoticeListResponse> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });
        if (date) {
            params.append('date', date);
        }
        return adminApiClient.request<NoticeListResponse>('GET', `/admin/notices?${params}`);
    },

    // 공지사항 상세 조회
    async getNoticeById(id: string): Promise<Notice> {
        return adminApiClient.request<Notice>('GET', `/admin/notices/${id}`);
    },

    // 공지사항 생성
    async createNotice(dto: CreateNoticeRequest): Promise<Notice> {
        return adminApiClient.request<Notice>('POST', '/admin/notices', dto);
    },

    // 공지사항 수정
    async updateNotice(id: string, dto: UpdateNoticeRequest): Promise<Notice> {
        return adminApiClient.request<Notice>('PUT', `/admin/notices/${id}`, dto);
    },

    // 공지사항 삭제
    async deleteNotice(id: string): Promise<void> {
        return adminApiClient.request<void>('DELETE', `/admin/notices/${id}`);
    },

    // ==================== 문의내역 API ====================

    // 문의내역 목록 조회
    async getInquiries(page = 1, limit = 10, status?: string, date?: string): Promise<InquiryListResponse> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });
        if (status) {
            params.append('status', status);
        }
        if (date) {
            params.append('date', date);
        }
        return adminApiClient.request<InquiryListResponse>('GET', `/inquiries?${params}`);
    },

    // 문의내역 상세 조회
    async getInquiryById(id: string): Promise<Inquiry> {
        return adminApiClient.request<Inquiry>('GET', `/inquiries/${id}`);
    },

    // 문의 상태 변경
    async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
        return adminApiClient.request<Inquiry>('PATCH', `/inquiries/${id}/status`, { status });
    },

    // 문의 답변 등록
    async replyToInquiry(id: string, content: string): Promise<InquiryReply> {
        return adminApiClient.request<InquiryReply>('POST', `/inquiries/${id}/reply`, { content });
    },

    // ==================== 촬영지(Location) API ====================

    // 콘텐츠별 촬영지 목록 조회
    async getLocationsByContentId(contentId: string, page = 1, limit = 100): Promise<LocationListResponse> {
        // Using public endpoint for now if admin specific doesn't exist, or sticking to admin convention
        // Assuming backend has /admin/locations or filtering. 
        // For now let's try to match existing pattern.
        // If backend doesn't support /admin/locations/content/:id, we might need to use public or filter.
        // Let's assume there is an endpoint or we use the public one wrapped.
        // Actually, let's just use the public one for reading if admin one doesn't exist? 
        // But let's define it as admin endpoint first.
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            contentId: contentId
        });
        return adminApiClient.request<LocationListResponse>('GET', `/admin/locations?${params}`);
    },

    // 촬영지 상세 조회
    async getLocationById(id: string): Promise<Location> {
        return adminApiClient.request<Location>('GET', `/admin/locations/${id}`);
    },

    // 촬영지 생성
    async createLocation(dto: CreateLocationRequest): Promise<Location> {
        return adminApiClient.request<Location>('POST', '/admin/locations', dto);
    },

    // 촬영지 수정
    async updateLocation(id: string, dto: UpdateLocationRequest): Promise<Location> {
        return adminApiClient.request<Location>('PUT', `/admin/locations/${id}`, dto);
    },

    // 촬영지 삭제
    async deleteLocation(id: string): Promise<void> {
        return adminApiClient.request<void>('DELETE', `/admin/locations/${id}`);
    },

    // 촬영지 순서 변경
    async reorderLocations(ids: string[]): Promise<void> {
        return adminApiClient.request<void>('POST', '/admin/locations/reorder', { ids });
    },

    // ==================== AI API ====================

    // AI Census: Find locations for a content
    async aiCensus(contentTitle: string, keywords?: string[], additionalPrompt?: string): Promise<AiCensusResult[]> {
        return adminApiClient.request<AiCensusResult[]>('POST', '/admin/ai/census', { contentTitle, keywords, additionalPrompt });
    },

    // AI Enrich: Generate details for a single location
    async aiEnrich(locationName: string, contentTitle?: string, userHints?: Record<string, string>): Promise<AiEnrichResult> {
        return adminApiClient.request<AiEnrichResult>('POST', '/admin/ai/enrich', { locationName, contentTitle, userHints });
    },

    // AI Batch Enrich: Generate and save multiple locations as drafts
    async aiBatchEnrich(
        locations: { name: string; type?: string; context?: string }[],
        contentId: string,
        contentTitle?: string
    ): Promise<AiBatchEnrichResponse> {
        return adminApiClient.request<AiBatchEnrichResponse>('POST', '/admin/ai/batch-enrich', {
            locations,
            contentId,
            contentTitle,
        });
    },

    // AI Content Info: Generate general info for a content
    async aiContentInfo(title: string): Promise<AiContentInfoResult> {
        return adminApiClient.request<AiContentInfoResult>('POST', '/admin/ai/content-info', { title });
    },

    // AI Notice Translate: Translate KR -> EN
    async aiNoticeTranslate(title: string, content: string): Promise<AiNoticeTranslateResult> {
        return adminApiClient.request<AiNoticeTranslateResult>('POST', '/admin/ai/notice-translate', { title, content });
    },

    // ==================== File API ====================
    async uploadFile(file: File): Promise<{ url: string; id: string }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isPublic', 'true');

        // File Service URL (Default: http://localhost:3002)
        const FILE_SERVICE_URL = import.meta.env.VITE_FILE_SERVICE_URL || 'http://localhost:3002';

        const response = await fetch(`${FILE_SERVICE_URL}/files/upload`, {
            method: 'POST',
            body: formData,
            // Note: Do not set Content-Type header manually for FormData, browser sets it with boundary
        });

        if (!response.ok) {
            throw new Error(`File upload failed: ${response.statusText}`);
        }

        return response.json();
    },
};

// Notice Types
export interface Notice {
    id: string;
    title: string;
    content: string | null;
    imageUrl: string | null;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NoticeListResponse {
    data: Notice[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateNoticeRequest {
    title: string;
    titleEn?: string;    // 영문 제목
    content?: string;
    contentEn?: string;  // 영문 내용
    imageUrl?: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}

export interface UpdateNoticeRequest {
    title?: string;
    titleEn?: string;    // 영문 제목
    content?: string;
    contentEn?: string;  // 영문 내용
    imageUrl?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

// ==================== 문의내역 Types ====================

export interface InquiryReply {
    id: string;
    inquiryId: string;
    adminId: string | null;
    content: string;
    createdAt: string;
}

export interface Inquiry {
    id: string;
    userId: string;
    user: {
        id: string;
        email: string | null;
        name: string | null;
    };
    title: string;
    content: string;
    images?: string[];
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
    replies: InquiryReply[];
}

export interface InquiryListResponse {
    data: Inquiry[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ==================== Location Types ====================

export interface Location {
    id: string;
    name: string;
    nameEn?: string;
    description: string;
    descriptionEn?: string;
    address: string;
    addressEn?: string;
    displayAddress?: string;
    displayAddressEn?: string;
    latitude: number;
    longitude: number;
    thumbnailUrl?: string; // 이미지
    chefImageUrl?: string; // 셰프 이미지
    offTheScreenImageUrl?: string; // Off The Screen 이미지
    images?: string[];     // 추가 이미지 (if any)
    viewCount?: number;     // 조회수


    // Additional fields from LocationEditor requirements
    ownerDescription?: string;
    ownerDescriptionEn?: string;
    onScreen?: string;
    onScreenEn?: string;

    // Toggles/Metadata
    isChef?: boolean;
    isOffTheScreen?: boolean;
    hasVisitorInfo?: boolean;

    // Standard fields
    openingHours?: string;
    price?: string;
    accessibility?: string;
    accessibilityEn?: string;
    parking?: string;
    parkingEn?: string; // Added parkingEn

    contentId: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LocationListResponse {
    data: Location[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateLocationRequest {
    contentId: string;
    name: string;
    nameEn?: string;
    description: string;
    descriptionEn?: string;
    address: string;
    addressEn?: string;
    displayAddress?: string;
    displayAddressEn?: string;
    latitude: number;
    longitude: number;
    thumbnailUrl?: string;
    chefImageUrl?: string; // Added
    offTheScreenImageUrl?: string; // Added

    ownerDescription?: string;
    ownerDescriptionEn?: string;
    onScreen?: string;
    onScreenEn?: string;

    isChef?: boolean;
    isOffTheScreen?: boolean;
    hasVisitorInfo?: boolean;

    openingHours?: string;
    price?: string;
    accessibility?: string;
    accessibilityEn?: string;
    parking?: string;
    parkingEn?: string;
    isActive?: boolean;
}

export interface UpdateLocationRequest extends Partial<CreateLocationRequest> { }

// ==================== AI Types ====================

export interface AiCensusResult {
    name: string;
    type?: string;
    context?: string;
}

export interface AiEnrichResult {
    name: string;
    nameEn?: string;
    description?: string;
    descriptionEn?: string;
    address?: string;
    addressEn?: string;
    displayAddress?: string;
    displayAddressEn?: string;
    latitude?: number;
    longitude?: number;
    isChef?: boolean;
    ownerDescription?: string;
    ownerDescriptionEn?: string;
    onScreen?: string;
    onScreenEn?: string;
    isOffTheScreen?: boolean;
    hasVisitorInfo?: boolean;
    openingHours?: string;
    price?: string;
    accessibility?: string;
    accessibilityEn?: string;
    parking?: string;
    parkingEn?: string;
}

export interface AiBatchEnrichResponse {
    processed: number;
    results: {
        success: boolean;
        id?: string;
        name: string;
        error?: string;
    }[];
}

export interface AiContentInfoResult {
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    country?: string[]; // e.g. ["KR"]
    type?: string;      // e.g. "Drama"
    category?: string[]; // e.g. ["Food", "Culture"]
}

export interface AiNoticeTranslateResult {
    titleEn: string;
    contentEn: string;
}


export default adminService;
