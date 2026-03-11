import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService, { CreateNoticeRequest } from '@/services/admin';
import DateRangePicker from '../components/DateRangePicker';
import ImageUploader from '../components/ImageUploader';
import { useAutoDraft } from '../hooks/useAutoDraft';

interface NoticeFormData {
    title: string;
    titleEn: string;    // 영문 제목
    content: string;
    contentEn: string;  // 영문 내용
    imageUrl: string;
    startDate: string;
    endDate: string;
}

const initialFormData: NoticeFormData = {
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
};

export default function NoticeCreate() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [formData, setFormData] = useState<NoticeFormData>(initialFormData);
    const { isDirty, setIsDirty, saveDraft, clearDraft, getDraft, hasDraft, lastSaved } = useAutoDraft('notice-create', initialFormData);

    // 임시 저장본 복원
    useEffect(() => {
        if (hasDraft()) {
            const draft = getDraft();
            if (draft && window.confirm('저장하지 않은 작성 내용이 있습니다. 복원하시겠습니까?')) {
                setFormData(draft as NoticeFormData);
            } else {
                clearDraft();
            }
        }
    }, []);

    // 30초마다 자동 저장
    useEffect(() => {
        if (!isDirty) return;

        const interval = setInterval(() => {
            saveDraft(formData);
        }, 30000);

        return () => clearInterval(interval);
    }, [formData, isDirty, saveDraft]);

    const handleChange = (field: keyof NoticeFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setIsDirty(true);
        setFormData((prev) => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleAiTranslate = async () => {
        if (!formData.title || !formData.content) {
            alert('먼저 한글 제목과 내용을 모두 입력해주세요.');
            return;
        }

        setIsAiLoading(true);
        try {
            const result = await adminService.aiNoticeTranslate(formData.title, formData.content);
            setFormData(prev => ({
                ...prev,
                titleEn: result.titleEn || prev.titleEn,
                contentEn: result.contentEn || prev.contentEn
            }));
            alert('AI 번역이 완료되었습니다. 영문 내용을 확인해주세요.');
        } catch (error) {
            console.error('AI Translation failed:', error);
            alert('AI 자동번역에 실패했습니다.');
        } finally {
            setIsAiLoading(false);
        }
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

        setIsLoading(true);
        try {
            const payload: CreateNoticeRequest = {
                title: formData.title,
                titleEn: formData.titleEn || undefined,
                content: formData.content || undefined,
                contentEn: formData.contentEn || undefined,
                imageUrl: formData.imageUrl || undefined,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };
            await adminService.createNotice(payload);
            clearDraft();
            navigate('/admin/notices');
        } catch (error) {
            console.error('Failed to create notice:', error);
            alert('공지사항 생성에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/admin/notices')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <span>&lt;</span>
                    <span className="text-xl font-bold">새 공지사항 등록</span>
                </button>
                <div className="flex items-center gap-4">
                    {lastSaved && (
                        <span className="text-xs text-gray-400">
                            마지막 임시저장: {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2 bg-[#5a3d8b] text-white rounded-lg hover:bg-[#4a2d7b] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-8">
                어플의 주요 기능 업데이트, 약관 변경 등에 대한 공지사항을 작성합니다. 저장 시 이전 공지사항 관리 페이지로 이동합니다.
            </p>

            {/* Form */}
            <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold">새 공지사항 등록하기</h2>

                {/* 제목 (한글) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제목 (KR)</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
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
                        <button
                            onClick={handleAiTranslate}
                            disabled={isAiLoading || !formData.title || !formData.content}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${(isAiLoading || !formData.title || !formData.content)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                                }`}
                        >
                            {isAiLoading ? '🔄 번역중...' : '✨ AI 자동번역'}
                        </button>
                    </div>
                </div>

                {/* 제목 (영문) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제목 (EN)</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.titleEn}
                            onChange={(e) => handleChange('titleEn', e.target.value)}
                            maxLength={50}
                            placeholder="Enter English title"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            {formData.titleEn.length}/50
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

                {/* 내용 (한글) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">내용 (KR)</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        placeholder="내용을 입력해주세요."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b] resize-none"
                    />
                </div>

                {/* 내용 (영문) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">내용 (EN)</label>
                    <textarea
                        value={formData.contentEn}
                        onChange={(e) => handleChange('contentEn', e.target.value)}
                        placeholder="Enter English content."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b] resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
