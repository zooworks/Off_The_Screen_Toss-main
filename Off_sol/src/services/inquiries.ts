import apiClient from '@/lib/api';

export interface CreateInquiryRequest {
    title: string;
    content: string;
    images?: string[];
}

export interface MyInquiry {
    id: string;
    title: string;
    content: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
    images?: string[];
    replies: {
        id: string;
        content: string;
        createdAt: string;
    }[];
}

const inquiriesService = {
    // 문의 등록
    async createInquiry(dto: CreateInquiryRequest): Promise<MyInquiry> {
        return apiClient.post<MyInquiry>('/inquiries', dto, { auth: true });
    },

    // 내 문의 목록 조회
    async getMyInquiries(): Promise<MyInquiry[]> {
        return apiClient.get<MyInquiry[]>('/inquiries/my', { auth: true });
    },

    // 문의 삭제
    async deleteInquiry(id: string): Promise<void> {
        return apiClient.delete(`/inquiries/${id}`, { auth: true });
    },

    // 파일 업로드
    async uploadFile(file: File): Promise<{ url: string; id: string }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isPublic', 'true');

        // File Service URL (Default: http://localhost:3002)
        const FILE_SERVICE_URL = import.meta.env.VITE_FILE_SERVICE_URL || 'http://localhost:3002';

        const response = await fetch(`${FILE_SERVICE_URL}/files/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`File upload failed: ${response.statusText}`);
        }

        return response.json();
    },
};

export default inquiriesService;
