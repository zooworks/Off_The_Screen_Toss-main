import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import authService from '@/services/auth';
import type { User } from '@/types/api';

type SocialProvider = 'google' | 'kakao' | 'naver' | 'apple';

interface AuthState {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
    login: (provider: SocialProvider, accessToken: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        isAuthenticated: false,
    });

    const refreshUser = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            setState({ user: null, loading: false, isAuthenticated: false });
            return;
        }

        try {
            const user = await authService.getMe();
            setState({ user, loading: false, isAuthenticated: true });
        } catch {
            setState({ user: null, loading: false, isAuthenticated: false });
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = useCallback(async (provider: SocialProvider, accessToken: string) => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const response = await authService.socialLogin(provider, accessToken);
            setState({ user: response.user, loading: false, isAuthenticated: true });
        } catch (err) {
            setState((prev) => ({ ...prev, loading: false }));
            throw err;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            setState({ user: null, loading: false, isAuthenticated: false });
        }
    }, []);

    useEffect(() => {
        const handleLogout = () => {
            logout();
        };
        window.addEventListener('off:logout', handleLogout);
        return () => window.removeEventListener('off:logout', handleLogout);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default useAuth;
