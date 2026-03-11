import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService, { Notice, UpdateNoticeRequest } from '@/services/admin';
import DateRangePicker from '../components/DateRangePicker';
import ImageUploader from '../components/ImageUploader';

interface NoticeFormData {
    title: string;
    content: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
}

export default function NoticeEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<NoticeFormData>({
        title: '',
        content: '',
        imageUrl: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if (id) {
            fetchNotice();
        }
    }, [id]);

    const fetchNotice = async () => {
        try {
            const data = await adminService.getNoticeById(id!);
            setNotice(data);
            setFormData({
                title: data.title,
                content: data.content || '',
                imageUrl: data.imageUrl || '',
                startDate: data.startDate.split('T')[0],
                endDate: data.endDate.split('T')[0],
            });
        } catch (error) {
            console.error('Failed to fetch notice:', error);
            alert('공지사항을 불러오는데 실패했습니다.');
            navigate('/admin/notices');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof NoticeFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!formData.startDate || !formData.endDate) {
            alert('기간을 선택해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            const payload: UpdateNoticeRequest = {
                title: formData.title,
                content: formData.content || undefined,
                imageUrl: formData.imageUrl || undefined,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };
            await adminService.updateNotice(id!, payload);
            navigate('/admin/notices');
        } catch (error) {
            console.error('Failed to update notice:', error);
            alert('공지사항 수정에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/admin/notices')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <span>&lt;</span>
                    <span className="text-xl font-bold">{notice?.title} 수정</span>
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#5a3d8b] text-white rounded-lg hover:bg-[#4a2d7b] transition-colors disabled:opacity-50"
                >
                    {isSaving ? '저장 중...' : '저장하기'}
                </button>
            </div>

            <p className="text-sm text-gray-500 mb-8">
                어플의 주요 기능 업데이트, 약관 변경 등에 대한 공지사항을 작성합니다. 저장 시 이전 공지사항 관리 페이지로 이동합니다.
            </p>

            {/* Form */}
            <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">공지사항 수정하기</h2>

                {/* 제목 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            maxLength={25}
                            placeholder="공지사항 제목을 입력하세요"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            {formData.title.length}/25
                        </span>
                    </div>
                </div>

                {/* 기간 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
                    <DateRangePicker
                        startDate={formData.startDate}
                        endDate={formData.endDate}
                        onChange={(start, end) => {
                            handleChange('startDate', start);
                            handleChange('endDate', end);
                        }}
                    />
                </div>

                {/* 사진 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사진</label>
                    <ImageUploader
                        value={formData.imageUrl}
                        onChange={(url) => handleChange('imageUrl', url)}
                    />
                </div>

                {/* 내용 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        placeholder="내용을 입력해주세요."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b] resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
