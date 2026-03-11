import api from '@/lib/api';
import type { Content, ContentFilter } from '@/types/api';

// API 응답 래퍼 타입
interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
}

export const contentsService = {
    /**
     * Get all contents with optional filtering
     */
    getAll: async (filter?: ContentFilter): Promise<Content[]> => {
        const params: Record<string, string | number | undefined> = {};
        if (filter) {
            if (filter.type) params.type = filter.type;
            if (filter.country) params.country = filter.country;
            if (filter.category?.length) params.category = filter.category.join(',');
            if (filter.trending) params.trending = filter.trending;
            if (filter.search) params.search = filter.search;
            if (filter.page) params.page = filter.page;
            if (filter.limit) params.limit = filter.limit;
        }
        const response = await api.get<PaginatedResponse<Content>>('/contents', { params });
        return response.data;
    },

    /**
     * Get trending contents
     */
    getTrending: async (): Promise<Content[]> => {
        return api.get<Content[]>('/contents/trending');
    },

    /**
     * Get a single content by ID
     */
    getById: async (id: string): Promise<Content> => {
        return api.get<Content>(`/contents/${id}`);
    },
};

export default contentsService;
