import api from '@/lib/api';
import type { Favorite } from '@/types/api';

export const favoritesService = {
    /**
     * Get all favorites for the current user
     */
    getAll: async (): Promise<Favorite[]> => {
        return api.get<Favorite[]>('/favorites', { auth: true });
    },

    /**
     * Check if a location is favorited
     */
    check: async (locationId: string): Promise<{ isFavorite: boolean }> => {
        return api.get<{ isFavorite: boolean }>(`/favorites/${locationId}/check`, { auth: true });
    },

    /**
     * Add a location to favorites
     */
    add: async (locationId: string): Promise<Favorite> => {
        return api.post<Favorite>(`/favorites/${locationId}`, undefined, { auth: true });
    },

    /**
     * Remove a location from favorites
     */
    remove: async (locationId: string): Promise<void> => {
        return api.delete<void>(`/favorites/${locationId}`, { auth: true });
    },
};

export default favoritesService;
