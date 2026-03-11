import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService, { Content, UpdateContentRequest } from '@/services/admin';
import CountrySelector from '../components/CountrySelector';
import ChipSelector from '../components/ChipSelector';
import ImageUploader from '../components/ImageUploader';
import ContentCard from '../components/ContentCard';

const contentTypes = [
    { value: 'Drama', label: '🎬 Drama & Film' },
    { value: 'Reality', label: '📺 Reality & Show' },
    { value: 'Documentary', label: '🎥 Documentary' },
    { value: 'Travel', label: '✈️ Travel & Lifestyle' },
];

const experiences = [
    { value: 'Food', label: '🍽 Food' },
    { value: 'Culture', label: '🎨 Culture' },
    { value: 'Nature', label: '🌿 Nature' },
    { value: 'Street', label: '🚶 Street' },
    { value: 'Landmark', label: '🏙 Landmark' },
];

export default function ContentEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [content, setContent] = useState<Content | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        titleEn: '',
        description: '',
        descriptionEn: '',
        country: ['ALL'] as string[],
        type: '',
        category: [] as string[],
        thumbnailUrl: '',
    });

    useEffect(() => {
        if (id) {
            fetchContent();
        }
    }, [id]);

    const fetchContent = async () => {
        try {
            const data = await adminService.getContentById(id!);
            setContent(data);
            setFormData({
                title: data.title,
                titleEn: data.titleEn || '',
                description: data.description || '',
                descriptionEn: data.descriptionEn || '',
                country: data.country ? data.country.split(',') : ['ALL'],
                type: data.type,
                category: JSON.parse(data.category || '[]'),
                thumbnailUrl: data.thumbnailUrl || '',
            });
        } catch (error) {
            console.error('Failed to fetch content:', error);
            alert('콘텐츠를 불러오는데 실패했습니다.');
            navigate('/admin/contents');
        } finally {
            setIsLoading(false);
        }
    };
    // ...
    {/* Country */ }
    <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">Country</label>
        <CountrySelector
            value={formData.country}
            onChange={(country) => setFormData({ ...formData, country: Array.isArray(country) ? country : [country] })}
            multiple
        />
    </div>

    const handleAiAutofill = async () => {
        if (!formData.title) {
            alert('먼저 제목을 입력해주세요.');
            return;
        }

        setIsAiLoading(true);
        try {
            const result = await adminService.aiContentInfo(formData.title);

            // 기존 데이터 유지하면서 AI 결과로 덮어쓰기 (빈 값이면 AI 값 우선)
            setFormData(prev => ({
                ...prev,
                titleEn: result.titleEn || prev.titleEn,
                description: result.description || prev.description,
                descriptionEn: result.descriptionEn || prev.descriptionEn,
                country: result.country && result.country.length > 0 ? result.country : prev.country,
                type: result.type ? (contentTypes.find(t => t.value === result.type) ? result.type : prev.type) : prev.type,
                category: result.category && result.category.length > 0 ? result.category.filter(c => experiences.some(e => e.value === c)) : prev.category,
            }));

            alert('AI가 정보를 입력했습니다. 내용을 확인해주세요.');
        } catch (error) {
            console.error('AI Autofill failed:', error);
            alert('AI 자동완성에 실패했습니다.');
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!content || !formData.title || !formData.type) {
            alert('필수 정보를 입력해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            const payload: UpdateContentRequest = {
                title: formData.title,
                titleEn: formData.titleEn,
                description: formData.description,
                descriptionEn: formData.descriptionEn,
                country: Array.isArray(formData.country) ? formData.country.join(',') : formData.country,
                type: formData.type,
                category: formData.category,
                thumbnailUrl: formData.thumbnailUrl,
            };
            await adminService.updateContent(id!, payload);
            navigate('/admin/contents');
        } catch (error) {
            console.error('Failed to update content:', error);
            alert('콘텐츠 수정에 실패했습니다.');
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
                    onClick={() => navigate('/admin/contents')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xl font-bold">{content?.title} 수정하기</span>
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
                새로운 미션을 등록하고 종료된 미션을 다시 볼 수 있습니다. 설정한 기간에 따라 자동으로 앱에 반영됩니다.
            </p>

            {/* Form */}
            <div className="space-y-8 max-w-2xl">
                {/* Title */}
                <div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="콘텐츠 제목을 입력하세요"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                        />
                        <button
                            onClick={handleAiAutofill}
                            disabled={isAiLoading || !formData.title}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${isAiLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                                }`}
                        >
                            {isAiLoading ? '🔄 생성중...' : '✨ AI 자동완성'}
                        </button>
                    </div>
                </div>

                {/* Title (EN) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Title (EN)</label>
                    <input
                        type="text"
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                        placeholder="Enter English title"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b]"
                    />
                </div>

                {/* Description (KR) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Description (KR)</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="콘텐츠 설명을 입력하세요"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b] min-h-[100px]"
                    />
                </div>

                {/* Description (EN) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Description (EN)</label>
                    <textarea
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                        placeholder="Enter English description"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5a3d8b] min-h-[100px]"
                    />
                </div>

                {/* Country */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Country</label>
                    <CountrySelector
                        value={formData.country}
                        onChange={(country) => setFormData({ ...formData, country: country as string[] })}
                        multiple
                    />
                </div>

                {/* Content Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Content Type</label>
                    <ChipSelector
                        options={contentTypes}
                        value={formData.type}
                        onChange={(type) => setFormData({ ...formData, type: type as string })}
                    />
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Experience</label>
                    <ChipSelector
                        options={experiences}
                        value={formData.category}
                        onChange={(category) => setFormData({ ...formData, category: category as string[] })}
                        multiple
                    />
                </div>

                {/* Picture & Preview */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Picture & Preview</label>
                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <ImageUploader
                                value={formData.thumbnailUrl}
                                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                * 이미지를 업로드하면 우측 카드에 미리보기가 적용됩니다.
                            </p>
                        </div>

                        {/* Live Preview Card */}
                        <div className="w-[280px] h-[400px] flex-shrink-0">
                            <div className="mb-2 text-xs font-medium text-gray-500 text-center">앱 내 노출 예시</div>
                            <ContentCard
                                content={{
                                    id: 'preview',
                                    title: formData.title || '제목 없음',
                                    thumbnailUrl: formData.thumbnailUrl || null,
                                    createdAt: content?.createdAt || new Date().toISOString(),
                                    category: JSON.stringify(formData.category),
                                    // Make sure other fields are present or optional in Content interface
                                    titleEn: '', // Add missing fields if needed by Content type
                                    description: '',
                                    descriptionEn: '',
                                    type: formData.type,
                                    country: Array.isArray(formData.country) ? formData.country.join(',') : formData.country,
                                    viewCount: content?.viewCount || 0,
                                    isActive: true,
                                    updatedAt: new Date().toISOString(),
                                    trending: null,
                                } as any}
                                onEdit={() => { }} // No-op
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
