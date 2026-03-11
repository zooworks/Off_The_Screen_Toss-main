const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
import { getMockResponse } from './mockData';

// Token storage keys
const ACCESS_TOKEN_KEY = 'off_access_token';
const REFRESH_TOKEN_KEY = 'off_refresh_token';

// Token management
export const tokenManager = {
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },
    clearTokens: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.dispatchEvent(new Event('off:logout'));
    },
};

// API Error class
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Request options type
interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | undefined>;
    auth?: boolean;
}

// Build URL with query params
function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }
    return url.toString();
}

// Main fetch wrapper
async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, auth = false, ...fetchOptions } = options;

    // MOCK MODE CHECK
    if (import.meta.env.VITE_USE_MOCK === 'true') {
        const method = options.method || 'GET';
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockResponse(endpoint, method, params) as Promise<T>;
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add auth token if required
    if (auth) {
        const token = tokenManager.getAccessToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
    }

    const url = buildUrl(endpoint, params);

    const response = await fetch(url, {
        ...fetchOptions,
        headers,
    });

    // Handle token refresh on 401
    if (response.status === 401 && auth) {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                    const tokens = await refreshResponse.json();
                    tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);

                    // Retry original request
                    (headers as Record<string, string>)['Authorization'] = `Bearer ${tokens.accessToken}`;
                    const retryResponse = await fetch(url, { ...fetchOptions, headers });

                    if (!retryResponse.ok) {
                        throw new ApiError(retryResponse.status, 'Request failed after token refresh');
                    }

                    return retryResponse.json();
                }
            } catch {
                tokenManager.clearTokens();
            }
        }
        tokenManager.clearTokens();
        throw new ApiError(401, 'Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
            response.status,
            errorData?.message || response.statusText,
            errorData
        );
    }

    // Handle empty response
    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text);
}

// API methods
export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        fetchApi<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        fetchApi<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        fetchApi<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        fetchApi<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
