import api from '@/lib/api';
import type { Location, LocationFilter } from '@/types/api';

// API 응답 래퍼 타입
interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
}

export const locationsService = {
    /**
     * Get all locations with optional filtering
     */
    getAll: async (filter?: LocationFilter): Promise<Location[]> => {
        const response = await api.get<PaginatedResponse<Location>>('/locations', { params: filter as Record<string, string | number | undefined> });
        return response.data;
    },

    /**
     * Get nearby locations based on coordinates
     */
    getNearby: async (lat: number, lng: number, radius?: number): Promise<Location[]> => {
        return api.get<Location[]>('/locations/nearby', {
            params: { lat, lng, radius },
        });
    },

    /**
     * Get locations by content ID
     */
    getByContent: async (contentId: string): Promise<Location[]> => {
        return api.get<Location[]>(`/locations/content/${contentId}`);
    },

    /**
     * Get a single location by ID (also increments view count)
     */
    getById: async (id: string): Promise<Location> => {
        return api.get<Location>(`/locations/${id}`);
    },
};

export default locationsService;
