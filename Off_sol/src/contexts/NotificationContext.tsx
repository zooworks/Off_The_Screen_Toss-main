import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import notificationsService from '@/services/notifications';

interface NotificationContextType {
    unreadCount: number;
    refreshCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const refreshCount = useCallback(async () => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            return;
        }

        try {
            // 모든 알림 (공지사항 포함)을 서버에서 가져와서 읽지 않은 것 카운트
            const notifications = await notificationsService.getAll();
            const unreadCount = notifications.filter(n => !n.isRead).length;
            setUnreadCount(unreadCount);
        } catch (error) {
            console.error("Failed to fetch notification count:", error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        refreshCount();

        const interval = setInterval(refreshCount, 60000);
        return () => clearInterval(interval);
    }, [refreshCount]);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshCount }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
