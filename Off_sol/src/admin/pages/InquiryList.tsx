import { useState, useEffect } from 'react';
import adminService, { Inquiry } from '@/services/admin';
import InquiryItem from '../components/InquiryItem';
import Pagination from '../components/Pagination';

export default function InquiryList() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchInquiries = async (page: number, status?: string, start?: string, end?: string) => {
        setIsLoading(true);
        try {
            const dateRange = start && end ? `${start},${end}` : start || end || undefined;
            const response = await adminService.getInquiries(page, 10, status, dateRange);
            setInquiries(response.data);
            setTotalPages(response.meta.totalPages);
            setCurrentPage(response.meta.page);
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries(1);
    }, []);

    const handleSearch = () => {
        fetchInquiries(1, statusFilter, startDate, endDate);
    };

    const handlePageChange = (page: number) => {
        fetchInquiries(page, statusFilter, startDate, endDate);
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await adminService.updateInquiryStatus(id, status);
            // 상태 변경 후 목록 새로고침
            fetchInquiries(currentPage, statusFilter, startDate, endDate);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleReply = async (id: string, content: string) => {
        try {
            await adminService.replyToInquiry(id, content);
            // 답변 등록 후 목록 새로고침
            fetchInquiries(currentPage, statusFilter, startDate, endDate);
        } catch (error) {
            console.error('Failed to send reply:', error);
        }
    };

    const handleActiveFilter = () => {
        setStatusFilter(statusFilter === 'active' ? '' : 'active');
        fetchInquiries(1, statusFilter === 'active' ? '' : 'active', startDate, endDate);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <h1 className="text-xl font-bold text-gray-800">문의내역 관리</h1>
                <p className="text-sm text-gray-500">
                    사용자가 문의한 내역은 이메일로 처리합니다. 해당 페이지에서는 문의 내역의 진행 상태만 변경할 수 있습니다.
                </p>

                <div className="flex items-center gap-4">
                    {/* 접수/진행중 모아보기 */}
                    <button
                        onClick={handleActiveFilter}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'active'
                            ? 'bg-[#5a3d8b] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        접수/진행중 모아보기
                    </button>

                    {/* 날짜 범위 검색 */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5a3d8b]"
                            placeholder="시작일"
                        />
                        <span className="text-gray-400">~</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5a3d8b]"
                            placeholder="종료일"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            찾기 🔍
                        </button>
                    </div>
                </div>
            </div>

            {/* Inquiry List */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">Loading...</div>
                </div>
            ) : inquiries.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg">
                    <div className="text-gray-400">등록된 문의가 없습니다.</div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm">
                    {inquiries.map((inquiry) => (
                        <InquiryItem
                            key={inquiry.id}
                            inquiry={inquiry}
                            onStatusChange={handleStatusChange}
                            onReply={handleReply}
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
