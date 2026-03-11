import api from '../lib/api';

export interface Notification {
    id: string;
    userId: string | null;
    type: 'CONTENT_NEW' | 'CONTENT_UPDATE' | 'INQUIRY_REPLY' | 'NOTICE';
    title: string;
    message: string | null;
    referenceId: string | null;
    isRead: boolean;
    createdAt: string;
}

const notificationsService = {
    // 알림 목록 조회 (서버에서 읽음 상태 포함하여 반환)
    getAll: async (): Promise<Notification[]> => {
        try {
            const response = await api.get<Notification[]>('/notifications', { auth: true });
            return response;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            return [];
        }
    },

    // 개별 알림 읽음 처리 (서버 API 호출)
    markAsRead: async (id: string): Promise<void> => {
        try {
            await api.post(`/notifications/read/${id}`, {}, { auth: true });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    },

    // 전체 알림 읽음 처리 (서버 API 호출)
    markAllAsRead: async (): Promise<void> => {
        try {
            await api.post('/notifications/read-all', {}, { auth: true });
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    },
};

export default notificationsService;
