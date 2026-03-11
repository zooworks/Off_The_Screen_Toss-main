import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService, { Content } from '@/services/admin';
import Pagination from '../components/Pagination';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Drag & Drop Item Types
const ItemTypes = {
    CONTENT: 'content',
};


interface ContentCardProps {
    content: Content;
    index: number;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    moveContent: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd: () => void;
    handleCardClick: (id: string) => void;
    handleEdit: (e: React.MouseEvent, id: string) => void;
    handleDelete: (e: React.MouseEvent, id: string) => void;
    formatDate: (dateString: string) => string;
}

const ContentCard = ({ content, index, isSelected, onToggleSelect, moveContent, onDragEnd, handleCardClick, handleEdit, handleDelete, formatDate }: ContentCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.CONTENT,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: any, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Note: For Grid, this Y-axis logic is imperfect but often sufficient for simple reordering.
            // Full grid logic requires X/Y checks.
            // However, swapping immediately in a grid feels responsive.

            moveContent(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CONTENT,
        item: () => {
            return { id: content.id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            onDragEnd();
        },
    });

    drag(drop(ref));

    const opacity = isDragging ? 0.4 : 1;

    return (
        <div
            ref={ref}
            style={{ opacity }}
            onClick={() => handleCardClick(content.id)}
            data-handler-id={handlerId}
            className={`aspect-[280/400] bg-[#3b3b3b] rounded-[16px] relative cursor-pointer group hover:bg-[#4a4a4a] transition-colors overflow-hidden ${isSelected ? 'ring-2 ring-[#735CCC]' : ''}`}
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

            {/* Checkbox (Stop Propagation) */}
            <div
                className="absolute top-3 left-3 z-20"
                onClick={(e) => { e.stopPropagation(); }}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(content.id)}
                    className="w-5 h-5 cursor-pointer accent-[#735CCC]"
                />
            </div>

            {/* Content Wrapper */}
            <div className="relative p-6 h-full flex flex-col justify-between z-10">
                {/* Top Row: Date & Actions */}
                <div className="flex justify-between items-start pl-6">
                    <div className="text-white/90 text-[15px] font-medium">
                        {formatDate(content.updatedAt)}
                    </div>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={(e) => handleEdit(e, content.id)}
                            className="px-3 py-1.5 bg-[#5a3d8b] text-white text-[12px] rounded-[6px] hover:bg-[#4a2d7b] transition-colors shadow-sm"
                        >
                            수정하기
                        </button>
                        <button
                            onClick={(e) => handleDelete(e, content.id)}
                            className="px-3 py-1.5 bg-[rgba(255,255,255,0.2)] text-white text-[12px] rounded-[6px] hover:bg-[rgba(255,255,255,0.3)] transition-colors shadow-sm"
                        >
                            삭제하기
                        </button>
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
    );
};

export default function ContentList() {
    const navigate = useNavigate();
    const [contents, setContents] = useState<Content[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]); // Multi-select state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContents = async (page: number, searchQuery?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await adminService.getContents(page, 8, searchQuery);
            setContents(response.data);
            setTotalPages(response.meta.totalPages);
            setCurrentPage(response.meta.page);
            setSelectedIds([]); // Reset selection on page change/fetch
        } catch (error) {
            console.error('Failed to fetch contents:', error);
            setError('데이터를 불러오는데 실패했습니다. (DB 연결 확인 필요)');
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

    // Bulk Delete Handler
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        if (window.confirm(`선택한 ${selectedIds.length}개의 콘텐츠를 삭제하시겠습니까?`)) {
            try {
                // Execute deletions in parallel
                await Promise.all(selectedIds.map(id => adminService.deleteContent(id)));
                alert('선택한 콘텐츠가 삭제되었습니다.');
                fetchContents(currentPage, search); // Refresh list
            } catch (error) {
                console.error('Failed to delete contents:', error);
                alert('일부 콘텐츠 삭제에 실패했습니다.');
                fetchContents(currentPage, search); // Refresh to show what remains
            }
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const toggleAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedIds(contents.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleCreate = () => {
        navigate('/admin/contents/create');
    };

    // Format date as YY.MM.DD
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const yy = String(date.getFullYear()).slice(-2);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yy}.${mm}.${dd}`;
    };

    // Card click handler -> Edit Content or Go to Details? 
    // ContentList is for adding/editing content, so let's stick to Edit.
    const handleCardClick = (id: string) => {
        navigate(`/admin/contents/${id}/edit`);
    };

    const moveContent = (dragIndex: number, hoverIndex: number) => {
        const dragItem = contents[dragIndex];
        const newContents = [...contents];
        newContents.splice(dragIndex, 1);
        newContents.splice(hoverIndex, 0, dragItem);
        setContents(newContents);
    };

    const handleDragEnd = async () => {
        // Optimistic UI update, then save to server
        const ids = contents.map(c => c.id);
        try {
            await adminService.reorderContents(ids);
        } catch (error) {
            console.error('Failed to save order:', error);
            alert('순서 변경 저장 실패');
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
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
                        <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-2">콘텐츠 등록</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={contents.length > 0 && selectedIds.length === contents.length}
                                    onChange={(e) => toggleAll(e.target.checked)}
                                    className="w-4 h-4 accent-[#735CCC]"
                                />
                                <span className="text-sm">전체 선택</span>
                            </label>
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="ml-4 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                >
                                    선택 삭제 ({selectedIds.length})
                                </button>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="h-[48px] px-6 bg-[#5a3d8b] text-white rounded-[8px] hover:bg-[#4a3275] transition-colors font-medium flex items-center justify-center"
                    >
                        추가하기
                    </button>
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-400">Loading...</div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64 flex-col gap-4">
                        <div className="text-red-400">{error}</div>
                        <button
                            onClick={() => fetchContents(currentPage, search)}
                            className="px-4 py-2 bg-[#3b3b3b] text-white rounded hover:bg-[#4a4a4a]"
                        >
                            재시도
                        </button>
                    </div>
                ) : contents.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-400">등록된 콘텐츠가 없습니다.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contents.map((content, index) => (
                            <ContentCard
                                key={content.id}
                                index={index}
                                content={content}
                                isSelected={selectedIds.includes(content.id)}
                                onToggleSelect={toggleSelection}
                                moveContent={moveContent}
                                onDragEnd={handleDragEnd}
                                handleCardClick={handleCardClick}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                formatDate={formatDate}
                            />
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
        </DndProvider>
    );
}
