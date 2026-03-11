import { useState, useEffect, useCallback } from 'react';
import favoritesService from '@/services/favorites';
import authService from '@/services/auth';
import type { Favorite } from '@/types/api';

interface UseFavoritesState {
    favorites: Favorite[];
    loading: boolean;
    error: Error | null;
}

interface UseFavoritesReturn extends UseFavoritesState {
    refetch: () => Promise<void>;
    addFavorite: (locationId: string) => Promise<void>;
    removeFavorite: (locationId: string) => Promise<void>;
    isFavorite: (locationId: string) => boolean;
}

export function useFavorites(): UseFavoritesReturn {
    const [state, setState] = useState<UseFavoritesState>({
        favorites: [],
        loading: false,
        error: null,
    });

    const fetchFavorites = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            setState({ favorites: [], loading: false, error: null });
            return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await favoritesService.getAll();
            setState({ favorites: data, loading: false, error: null });
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err : new Error('Failed to fetch favorites'),
            }));
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const addFavorite = useCallback(async (locationId: string) => {
        if (!authService.isAuthenticated()) {
            throw new Error('Not authenticated');
        }

        try {
            const newFavorite = await favoritesService.add(locationId);
            setState((prev) => ({
                ...prev,
                favorites: [...prev.favorites, newFavorite],
            }));
        } catch (err) {
            throw err instanceof Error ? err : new Error('Failed to add favorite');
        }
    }, []);

    const removeFavorite = useCallback(async (locationId: string) => {
        if (!authService.isAuthenticated()) {
            throw new Error('Not authenticated');
        }

        // Optimistic Update: Remove immediately
        const prevFavorites = state.favorites;
        setState((prev) => ({
            ...prev,
            favorites: prev.favorites.filter((f) => f.location.id !== locationId),
        }));

        try {
            await favoritesService.remove(locationId);
        } catch (err) {
            // Revert on failure
            setState((prev) => ({
                ...prev,
                favorites: prevFavorites,
                error: err instanceof Error ? err : new Error('Failed to remove favorite'),
            }));
        }
    }, [state.favorites]);

    const isFavorite = useCallback(
        (locationId: string) => {
            return state.favorites.some((f) => f.locationId === locationId);
        },
        [state.favorites]
    );

    return {
        ...state,
        refetch: fetchFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
    };
}

export default useFavorites;
