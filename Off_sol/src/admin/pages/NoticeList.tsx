import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService, { Notice } from '@/services/admin';
import NoticeItem from '../components/NoticeItem';
import Pagination from '../components/Pagination';

export default function NoticeList() {
    const navigate = useNavigate();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dateSearch, setDateSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotices = async (page: number, date?: string) => {
        setIsLoading(true);
        try {
            const response = await adminService.getNotices(page, 10, date);
            setNotices(response.data);
            setTotalPages(response.meta.totalPages);
            setCurrentPage(response.meta.page);
        } catch (error) {
            console.error('Failed to fetch notices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices(1);
    }, []);

    const handleSearch = () => {
        fetchNotices(1, dateSearch);
    };

    const handlePageChange = (page: number) => {
        fetchNotices(page, dateSearch);
    };

    const handleEdit = (id: string) => {
        navigate(`/admin/notices/${id}/edit`);
    };

    const handleCreate = () => {
        navigate('/admin/notices/create');
    };

    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteNotice(id);
            // 삭제 후 목록 새로고침
            fetchNotices(currentPage, dateSearch);
        } catch (error) {
            console.error('Failed to delete notice:', error);
            alert('공지사항 삭제에 실패했습니다.');
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-800">공지사항 및 알림관리</h1>
                <div className="flex items-center gap-4">
                    <div className="flex">
                        <input
                            type="datetime-local"
                            value={dateSearch}
                            onChange={(e) => setDateSearch(e.target.value)}
                            className="w-48 px-3 py-2 border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:border-[#5a3d8b]"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-r-lg hover:bg-gray-700 transition-colors"
                        >
                            찾기 🔍
                        </button>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-[#5a3d8b] text-white text-sm rounded-lg hover:bg-[#4a2d7b] transition-colors"
                    >
                        새 공지사항 등록하기
                    </button>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-6">
                시용자가 문의한 내역은 이메일로 처리합니다. 해당 페이지에서는 문의 내역의 진행 상태만 변경할 수 있습니다.
            </p>

            {/* Notice List */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading...</div>
                </div>
            ) : notices.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg">
                    <div className="text-gray-400">등록된 공지사항이 없습니다.</div>
                </div>
            ) : (
                <div className="bg-white rounded-lg overflow-hidden">
                    {notices.map((notice) => (
                        <NoticeItem
                            key={notice.id}
                            notice={notice}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
