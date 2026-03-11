import { useState, useEffect, useCallback } from 'react';
import locationsService from '@/services/locations';
import type { Location, LocationFilter } from '@/types/api';

interface UseLocationsState {
    locations: Location[];
    loading: boolean;
    error: Error | null;
}

interface UseLocationsReturn extends UseLocationsState {
    refetch: (filter?: LocationFilter) => Promise<void>;
}

export function useLocations(initialFilter?: LocationFilter): UseLocationsReturn {
    const [state, setState] = useState<UseLocationsState>({
        locations: [],
        loading: true,
        error: null,
    });

    const fetchLocations = useCallback(async (filter?: LocationFilter) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await locationsService.getAll(filter);
            setState({ locations: data, loading: false, error: null });
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err : new Error('Failed to fetch locations'),
            }));
        }
    }, []);

    useEffect(() => {
        fetchLocations(initialFilter);
    }, [fetchLocations, initialFilter]);

    return {
        ...state,
        refetch: fetchLocations,
    };
}

interface UseNearbyLocationsReturn {
    locations: Location[];
    loading: boolean;
    error: Error | null;
    refetch: (lat: number, lng: number, radius?: number) => Promise<void>;
}

export function useNearbyLocations(
    lat?: number,
    lng?: number,
    radius?: number
): UseNearbyLocationsReturn {
    const [state, setState] = useState<UseLocationsState>({
        locations: [],
        loading: false,
        error: null,
    });

    const fetchNearby = useCallback(async (latitude: number, longitude: number, r?: number) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await locationsService.getNearby(latitude, longitude, r);
            setState({ locations: data, loading: false, error: null });
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err : new Error('Failed to fetch nearby locations'),
            }));
        }
    }, []);

    useEffect(() => {
        if (lat !== undefined && lng !== undefined) {
            fetchNearby(lat, lng, radius);
        }
    }, [lat, lng, radius, fetchNearby]);

    return {
        ...state,
        refetch: fetchNearby,
    };
}

interface UseLocationReturn {
    location: Location | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useLocation(id: string | null): UseLocationReturn {
    const [state, setState] = useState<{ location: Location | null; loading: boolean; error: Error | null }>({
        location: null,
        loading: !!id,
        error: null,
    });

    const fetchLocation = useCallback(async () => {
        if (!id) return;
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await locationsService.getById(id);
            setState({ location: data, loading: false, error: null });
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err : new Error('Failed to fetch location'),
            }));
        }
    }, [id]);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    return {
        ...state,
        refetch: fetchLocation,
    };
}

interface UseContentLocationsReturn {
    locations: Location[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useContentLocations(contentId: string | null): UseContentLocationsReturn {
    const [state, setState] = useState<UseLocationsState>({
        locations: [],
        loading: !!contentId,
        error: null,
    });

    const fetchLocations = useCallback(async () => {
        if (!contentId) return;
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await locationsService.getByContent(contentId);
            setState({ locations: data, loading: false, error: null });
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err : new Error('Failed to fetch content locations'),
            }));
        }
    }, [contentId]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return {
        ...state,
        refetch: fetchLocations,
    };
}

export default useLocations;
