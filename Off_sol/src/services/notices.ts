import api from '../lib/api';

export interface Notice {
    id: string;
    title: string;
    titleEn?: string;
    content?: string;
    contentEn?: string;
    imageUrl?: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
}

const noticesService = {
    getNotices: async () => {
        return api.get<Notice[]>('/notices');
    },
};

export default noticesService;
