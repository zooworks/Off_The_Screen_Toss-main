import { useState, useEffect, useCallback } from 'react';
import contentsService from '@/services/contents';
import type { Content, ContentFilter } from '@/types/api';

interface UseContentsState {
    contents: Content[];
    loading: boolean;
    error: Error | null;
}

interface UseContentsReturn extends UseContentsState {
    refetch: (filter?: ContentFilter) => Promise<void>;
}

export function useContents(initialFilter?: ContentFilter): UseContentsReturn {
    const [state, setState] = useState<UseContentsState>({
        contents: [],
        loading: true,
        error: null,
    });

    const fetchContents = useCallback(async (filter?: ContentFilter) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await contentsService.getAll(filter);
            setState({ contents: data, loading: false, error: null });
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err : new Error('Failed to fetch contents'),
            }));
        }
    }, []);

    useEffect(() => {
        fetchContents(initialFilter);
    }, [fetchContents, initialFilter]);

    return {
        ...state,
        refetch: fetchContents,
    };
}

interface UseTrendingReturn {
    trending: Content[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useTrendingContents(): UseTrendingReturn {
    const [state, setState] = useState<{ trending: Content[]; loading: boolean; error: Error | null }>({
        trending: [],
        loading: true,
        error: null,
    });

    const fetchTrending = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await contentsService.getTrending();
            setState({ trending: data, loading: false, error: null });
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err : new Error('Failed to fetch trending'),
            }));
        }
    }, []);

    useEffect(() => {
        fetchTrending();
    }, [fetchTrending]);

    return {
        ...state,
        refetch: fetchTrending,
    };
}

interface UseContentReturn {
    content: Content | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useContent(id: string | null): UseContentReturn {
    const [state, setState] = useState<{ content: Content | null; loading: boolean; error: Error | null }>({
        content: null,
        loading: !!id,
        error: null,
    });

    const fetchContent = useCallback(async () => {
        if (!id) return;
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await contentsService.getById(id);
            setState({ content: data, loading: false, error: null });
        } catch (err) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err : new Error('Failed to fetch content'),
            }));
        }
    }, [id]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return {
        ...state,
        refetch: fetchContent,
    };
}

export default useContents;
