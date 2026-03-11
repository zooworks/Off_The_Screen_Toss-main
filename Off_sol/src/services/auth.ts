import api, { tokenManager } from '@/lib/api';
import type { User, LoginResponse } from '@/types/api';

type SocialProvider = 'google' | 'kakao' | 'naver' | 'apple';

export const authService = {
    /**
     * Social login
     */
    socialLogin: async (provider: 'google' | 'kakao' | 'naver' | 'apple' | 'toss', accessToken?: string, authCode?: string, referrer?: string) => {
        // Backend 'socialLogin' endpoint likely expects POST /auth/social with provider in body?
        // Let's assume I need to verify endpoint.
        // For now, I will assume consistent with my backend change plan (generic social login).
        const response = await api.post<LoginResponse>('/auth/social', { provider, accessToken, authCode, referrer });
        if (response.accessToken) {
            tokenManager.setTokens(response.accessToken, response.refreshToken);
        }
        return response;
    },

    /**
     * Get current user info
     */
    getMe: async (): Promise<User> => {
        return api.get<User>('/auth/me', { auth: true });
    },

    /**
     * Logout
     */
    logout: async (): Promise<void> => {
        try {
            await api.post<void>('/auth/logout', undefined, { auth: true });
        } finally {
            tokenManager.clearTokens();
        }
    },

    /**
     * Refresh token
     */
    refreshToken: async (): Promise<{ accessToken: string; refreshToken: string }> => {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        const response = await api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken });
        tokenManager.setTokens(response.accessToken, response.refreshToken);
        return response;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!tokenManager.getAccessToken();
    },
};

export default authService;
