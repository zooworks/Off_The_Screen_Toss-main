import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService, { Content } from '@/services/admin';
import Pagination from '../components/Pagination';


export default function LocationContentSelect() {
    const navigate = useNavigate();
    const [contents, setContents] = useState<Content[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchContents = async (page: number, searchQuery?: string) => {
        setIsLoading(true);
        try {
            const response = await adminService.getContents(page, 8, searchQuery);
            setContents(response.data);
            setTotalPages(response.meta.totalPages);
            setCurrentPage(response.meta.page);
        } catch (error) {
            console.error('Failed to fetch contents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContents(1);
    }, []);

    const handleSearch = () => {
        fetchContents(1, search);
    };

    const handlePageChange = (page: number) => {
        fetchContents(page, search);
    };

    // Card click handler -> Go to Location Selection page
    const handleContentClick = (id: string) => {
        navigate(`/admin/locations/${id}`);
    };

    const handleRegisterClick = () => {
        navigate('/admin/contents/new');
    };

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        navigate(`/admin/contents/${id}/edit`);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await adminService.deleteContent(id);
                fetchContents(currentPage, search);
            } catch (error) {
                console.error('Failed to delete content:', error);
                alert('삭제에 실패했습니다.');
            }
        }
    };



    // Format date as YY.MM.DD
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const yy = String(date.getFullYear()).slice(-2);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yy}.${mm}.${dd}`;
    };

    // Format view count (e.g. 1300 -> 1.3k)
    const formatViews = (views: number) => {
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}k views`;
        }
        return `${views} views`;
    };



    return (
        <div className="p-[16px] max-w-[1400px] mx-auto">
            {/* Search Bar Row */}
            <div className="flex items-center gap-4 mb-8">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="검색어를 입력하세요"
                    className="w-full max-w-[400px] h-[48px] px-4 bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#5a3d8b]"
                />
                <button
                    onClick={handleSearch}
                    className="h-[48px] px-8 bg-[#1a1a1a] text-white rounded-[8px] hover:bg-black transition-colors font-medium"
                >
                    찾기 🔍
                </button>
            </div>

            {/* Title & Register Button Row */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-2">OTT 상세 페이지 등록</h1>
                    <p className="text-[#999999] text-[15px]">
                        등록할 OTT 콘텐츠를 클릭해주세요.
                    </p>

                </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading...</div>
                </div>
            ) : contents.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">등록된 콘텐츠가 없습니다.</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contents.map((content) => (
                        <div
                            key={content.id}
                            onClick={() => handleContentClick(content.id)}
                            className="aspect-[2/3] bg-[#3b3b3b] rounded-[16px] relative cursor-pointer group hover:bg-[#4a4a4a] transition-colors overflow-hidden"
                        >
                            {/* Background Image/Gradient */}
                            {content.thumbnailUrl ? (
                                <>
                                    <img
                                        src={content.thumbnailUrl}
                                        alt={content.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-50" />
                            )}



                            {/* Content Wrapper */}
                            <div className="relative p-6 h-full flex flex-col justify-between z-10">
                                {/* Top Row: Date */}
                                <div className="flex justify-between items-start pl-6">
                                    <div className="text-white/90 text-[15px] font-medium">
                                        {formatDate(content.createdAt)}
                                    </div>
                                </div>

                                {/* Bottom Row: Title */}
                                <div>
                                    <h3 className="text-white text-[18px] font-bold leading-tight line-clamp-2">
                                        {content.titleEn || content.title}
                                    </h3>
                                    {content.titleEn && content.title && (
                                        <div className="text-white/70 text-[14px] mt-1 line-clamp-1">
                                            {content.title}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-12 mb-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
