import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import adminService, { Location, Content, AiCensusResult } from '@/services/admin';

// Drag Item Type
const ItemType = {
    LOCATION: 'location',
};


interface DraggableLocationCardProps {
    location: Location;
    index: number;
    moveLocation: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd: () => void;
    displayLang: 'KR' | 'EN';
    formatViews: (views: number) => string;
    handleEditLocation: (id: string) => void;
    contentId: string | undefined;
    setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
}

const DraggableLocationCard = ({
    location,
    index,
    moveLocation,
    onDragEnd,
    displayLang,
    formatViews,
    handleEditLocation,
    contentId,
    setLocations,
    isSelected,
    onToggleSelect,
}: DraggableLocationCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop({
        accept: ItemType.LOCATION,
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

            // Move the item
            moveLocation(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType.LOCATION,
        item: () => {
            return { id: location.id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            if (monitor.didDrop()) {
                onDragEnd();
            }
        },
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ opacity }}
            data-handler-id={handlerId}
            className={`aspect-[160/165] bg-[#3b3b3b] rounded-[12.885px] relative group overflow-hidden cursor-move ${isSelected ? 'ring-2 ring-[#735CCC]' : ''}`}
        >
            {/* Background Image */}
            {location.thumbnailUrl ? (
                <img
                    src={location.thumbnailUrl}
                    alt={location.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-[12.885px]"
                />
            ) : (
                <div className="absolute inset-0 bg-[#3b3b3b]" />
            )}

            {/* Checkbox (Stop Propagation) */}
            <div
                className="absolute top-2 left-2 z-30"
                onClick={(e) => { e.stopPropagation(); }}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(location.id)}
                    className="w-4 h-4 cursor-pointer accent-[#735CCC]"
                />
            </div>

            {/* Overlay & Content Container */}
            <div
                className="absolute content-stretch flex flex-col gap-[3.221px] inset-0 items-start justify-end px-[12.885px] py-[10px]"
                style={{
                    backgroundImage: 'linear-gradient(0.40426deg, rgba(30, 30, 30, 0.6) 8.3907%, rgba(30, 30, 30, 0) 69.369%)'
                }}
            >
                {/* Top Row */}
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full z-20 pl-6">
                    {/* Private Badge */}
                    <div>
                        {!location.isActive && (
                            <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] rounded-full">비공개</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleEditLocation(location.id)}
                            className="px-2 py-1 bg-[#5a3d8b] text-white text-[10px] rounded-[4px] hover:bg-[#4a3275] transition-colors shadow-sm"
                        >
                            수정
                        </button>
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('정말 삭제하시겠습니까?')) {
                                    await adminService.deleteLocation(location.id);
                                    if (contentId) {
                                        const res = await adminService.getLocationsByContentId(contentId);
                                        setLocations(res.data);
                                    }
                                }
                            }}
                            className="px-2 py-1 bg-[rgba(255,255,255,0.2)] text-white text-[10px] rounded-[4px] hover:bg-[rgba(255,255,255,0.3)] transition-colors shadow-sm"
                        >
                            삭제
                        </button>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="basis-0 content-stretch flex flex-col grow items-start justify-end min-h-px min-w-px relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 text-white tracking-[0.0322px] w-full">
                        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[12.885px] w-full">
                            <p className="leading-[21.743px] truncate">
                                {displayLang === 'EN' && location.nameEn ? location.nameEn : location.name}
                            </p>
                        </div>
                        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-full">
                            <p className="leading-[16.911px]">
                                {formatViews(location.viewCount || 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function LocationSelection() {
    const { contentId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<Content | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]); // Multi-select state
    const [drafts, setDrafts] = useState<any[]>([]); // Drafts state
    const [isLoading, setIsLoading] = useState(true);

    // Language Toggle State for Display
    const [displayLang, setDisplayLang] = useState<'KR' | 'EN'>('KR');

    // AI Modal State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiResults, setAiResults] = useState<AiCensusResult[]>([]);
    const [selectedAiItems, setSelectedAiItems] = useState<Set<number>>(new Set());
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [additionalPrompt, setAdditionalPrompt] = useState('');

    // Format view count (e.g. 1300 -> 1.3k)
    const formatViews = (views: number) => {
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}k views`;
        }
        return `${views} views`;
    };

    const loadDrafts = () => {
        if (!contentId) return;
        const loadedDrafts: any[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`temp_location_${contentId}_`)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key)!);
                    const suffix = key.replace(`temp_location_${contentId}_`, '');

                    // Create a pseudo location object from draft data
                    loadedDrafts.push({
                        ...data,
                        id: suffix === 'new' ? `draft-new-${Math.random()}` : suffix,
                        storageKey: key, // Store original key for deletion
                        isDraft: true,
                        // Defaults for display if missing
                        viewCount: 0,
                        isActive: data.isActive ?? false
                    });
                } catch (e) {
                    console.error('Failed to parse draft', key);
                }
            }
        }
        setDrafts(loadedDrafts);
    };

    useEffect(() => {
        if (!contentId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const contentData = await adminService.getContentById(contentId);
                setContent(contentData);

                const locationResponse = await adminService.getLocationsByContentId(contentId);
                setLocations(locationResponse.data);

                loadDrafts(); // Load drafts
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Optional: Listen to storage events to auto-update if edited in another tab
        const handleStorageChange = () => loadDrafts();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [contentId]);

    const handleCreateLocation = () => {
        navigate(`/admin/locations/${contentId}/create`, { state: { contentTitle: content?.title } });
    };

    const handleEditLocation = (locationId: string) => {
        navigate(`/admin/locations/${contentId}/${locationId}`, { state: { contentTitle: content?.title } });
    };

    // AI Census: Find locations
    const handleAiFindLocations = async () => {
        if (!content) return;
        setIsAiLoading(true);
        setAiResults([]);
        setSelectedAiItems(new Set());

        try {
            const results = await adminService.aiCensus(content.title, undefined, additionalPrompt);
            setAiResults(results);
        } catch (error) {
            console.error('AI Census failed:', error);
            alert('AI 검색에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsAiLoading(false);
        }
    };

    // Toggle selection
    const toggleAiSelection = (index: number) => {
        const newSelection = new Set(selectedAiItems);
        if (newSelection.has(index)) {
            newSelection.delete(index);
        } else {
            newSelection.add(index);
        }
        setSelectedAiItems(newSelection);
    };

    // Batch Enrich: Generate drafts for selected items
    const handleBatchEnrich = async () => {
        if (!contentId || !content || selectedAiItems.size === 0) return;

        setIsBatchProcessing(true);
        const selectedLocations = Array.from(selectedAiItems).map(i => aiResults[i]);

        try {
            const response = await adminService.aiBatchEnrich(selectedLocations, contentId, content.title);

            // Remove processed from list
            const processedNames = response.results.filter(r => r.success).map(r => r.name);
            setAiResults(prev => prev.filter(item => !processedNames.includes(item.name)));
            setSelectedAiItems(new Set());

            // Refresh location list
            const locationResponse = await adminService.getLocationsByContentId(contentId);
            setLocations(locationResponse.data);

            alert(`${response.results.filter(r => r.success).length}개 임시 저장 완료! (Draft)\n수정 후 저장해주세요.`);
        } catch (error) {
            console.error('Batch Enrich failed:', error);
            alert('일괄 생성에 실패했습니다.');
        } finally {
            setIsBatchProcessing(false);
        }
    };

    // Bulk Delete Handler
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        if (window.confirm(`선택한 ${selectedIds.length}개의 촬영지를 삭제하시겠습니까?`)) {
            try {
                await Promise.all(selectedIds.map(id => adminService.deleteLocation(id)));
                alert('선택한 촬영지가 삭제되었습니다.');

                // Refresh location list
                if (contentId) {
                    const locationResponse = await adminService.getLocationsByContentId(contentId);
                    setLocations(locationResponse.data);
                    setSelectedIds([]);
                }
            } catch (error) {
                console.error('Failed to delete locations:', error);
                alert('일부 촬영지 삭제에 실패했습니다.');
                if (contentId) {
                    const locationResponse = await adminService.getLocationsByContentId(contentId);
                    setLocations(locationResponse.data);
                }
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
            setSelectedIds(locations.map(l => l.id));
        } else {
            setSelectedIds([]);
        }
    };

    // Drag and Drop Handlers
    const moveLocation = (dragIndex: number, hoverIndex: number) => {
        const dragLocation = locations[dragIndex];
        const newLocations = [...locations];
        newLocations.splice(dragIndex, 1);
        newLocations.splice(hoverIndex, 0, dragLocation);
        setLocations(newLocations);
    };

    const handleDragEnd = async () => {
        const ids = locations.map(l => l.id);
        try {
            await adminService.reorderLocations(ids);
        } catch (error) {
            console.error('Failed to reorder locations:', error);
            alert('순서 저장에 실패했습니다.');
            // Revert changes if needed, but for now just alert
            // Ideally refetch
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a3d8b]"></div>
            </div>
        );
    }

    if (!content) {
        return <div>Content not found</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="max-w-[1400px] mx-auto p-[16px]">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-400">OTT 상세 페이지 등록</span>
                            <span className="text-gray-300">/</span>
                            <span className="text-sm font-medium">{content.title}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            {content.title}
                            {content.titleEn && <span className="text-lg text-gray-400 font-normal">{content.titleEn}</span>}
                        </h1>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <p className="text-gray-500">
                            등록된 촬영지 <span className="font-bold text-[#5a3d8b]">{locations.length}</span>개
                        </p>

                        {/* Select All & Delete */}
                        <div className="flex items-center gap-2 ml-4 border-l pl-4 border-gray-300">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={locations.length > 0 && selectedIds.length === locations.length}
                                    onChange={(e) => toggleAll(e.target.checked)}
                                    className="w-4 h-4 accent-[#735CCC]"
                                />
                                <span className="text-sm">전체 선택</span>
                            </label>
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                >
                                    선택 삭제 ({selectedIds.length})
                                </button>
                            )}
                        </div>

                        {/* Language Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setDisplayLang('KR')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayLang === 'KR' ? 'bg-white text-[#5a3d8b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                KR
                            </button>
                            <button
                                onClick={() => setDisplayLang('EN')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayLang === 'EN' ? 'bg-white text-[#5a3d8b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                EN
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsAiModalOpen(true)}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            ✨ AI로 촬영지 및 참가자 관련 자료 찾기
                        </button>
                        <button
                            onClick={handleCreateLocation}
                            className="px-6 py-2 bg-[#5a3d8b] text-white rounded-lg hover:bg-[#4a2d7b] transition-colors flex items-center gap-2"
                        >
                            + 새로운 페이지 등록하기
                        </button>
                    </div>
                </div>

                {/* Locations List (Grid Layout) */}
                {(locations.length === 0 && drafts.length === 0) ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                        등록된 촬영지가 없습니다. 새로운 촬영지를 등록해주세요.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Render Drafts First */}
                        {drafts.map((draft) => (
                            <div
                                key={draft.id}
                                onClick={() => {
                                    if (draft.id.startsWith('draft-new-')) {
                                        navigate(`/admin/locations/${contentId}/create`);
                                    } else {
                                        handleEditLocation(draft.id);
                                    }
                                }}
                                className="aspect-[160/165] bg-[#3b3b3b] rounded-[12.885px] relative group overflow-hidden border-2 border-dashed border-yellow-400 cursor-pointer"
                            >
                                {/* Background Image */}
                                {draft.thumbnailUrl ? (
                                    <img
                                        src={draft.thumbnailUrl}
                                        alt={draft.name}
                                        className="absolute inset-0 w-full h-full object-cover rounded-[12.885px] opacity-70"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-[#3b3b3b]" />
                                )}

                                {/* Badge */}
                                <div className="absolute top-2 left-2 z-30">
                                    <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded-md shadow-sm">
                                        임시저장
                                    </span>
                                </div>

                                {/* Overlay */}
                                <div
                                    className="absolute content-stretch flex flex-col gap-[3.221px] inset-0 items-start justify-end px-[12.885px] py-[10px]"
                                    style={{
                                        backgroundImage: 'linear-gradient(0.40426deg, rgba(30, 30, 30, 0.6) 8.3907%, rgba(30, 30, 30, 0) 69.369%)'
                                    }}
                                >
                                    <div className="basis-0 content-stretch flex flex-col grow items-start justify-end min-h-px min-w-px relative shrink-0 w-full">
                                        <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 text-white tracking-[0.0322px] w-full">
                                            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[12.885px] w-full">
                                                <p className="leading-[21.743px] truncate">
                                                    {displayLang === 'EN' && draft.nameEn ? draft.nameEn : (draft.name || '(No Name)')}
                                                </p>
                                            </div>
                                            <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-full">
                                                <p className="leading-[16.911px] text-yellow-200">
                                                    Draft
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Draft Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('임시저장된 내용을 삭제하시겠습니까?')) {
                                            const key = (draft as any).storageKey;
                                            if (key) {
                                                localStorage.removeItem(key);
                                                window.location.reload();
                                            }
                                        }
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors z-30"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* Real Locations (Sortable) */}
                        {locations.map((location, index) => (
                            <DraggableLocationCard
                                key={location.id}
                                location={location}
                                index={index}
                                moveLocation={moveLocation}
                                onDragEnd={handleDragEnd}
                                displayLang={displayLang}
                                formatViews={formatViews}
                                handleEditLocation={handleEditLocation}
                                contentId={contentId}
                                setLocations={setLocations}
                                isSelected={selectedIds.includes(location.id)}
                                onToggleSelect={toggleSelection}
                            />
                        ))}
                    </div>
                )}

                {/* AI Find Modal */}
                {isAiModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-xl font-bold">✨ AI로 촬영지 및 참가자 관련 자료 찾기</h2>
                                <button onClick={() => setIsAiModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 flex-1 overflow-y-auto">
                                {isAiLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                                        <p className="text-gray-500">AI가 "{content.title}" 관련 촬영지를 검색 중...</p>
                                    </div>
                                ) : aiResults.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">버튼을 눌러 AI 검색을 시작하세요.</p>
                                        <div className="max-w-md mx-auto mb-6">
                                            <textarea
                                                value={additionalPrompt}
                                                onChange={(e) => setAdditionalPrompt(e.target.value)}
                                                placeholder="예: 주차 정보 포함해줘, 시즌2 위주로 찾아줘"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                                                rows={3}
                                            />
                                        </div>
                                        <button
                                            onClick={handleAiFindLocations}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90"
                                        >
                                            🔍 검색 시작
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-sm text-gray-500">
                                                {aiResults.length}개 발견됨 · <span className="text-purple-600 font-medium">{selectedAiItems.size}개 선택</span>
                                            </p>
                                            <button
                                                onClick={() => {
                                                    if (selectedAiItems.size === aiResults.length) {
                                                        setSelectedAiItems(new Set());
                                                    } else {
                                                        setSelectedAiItems(new Set(aiResults.map((_, i) => i)));
                                                    }
                                                }}
                                                className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                            >
                                                {selectedAiItems.size === aiResults.length ? '전체 해제' : '전체 선택'}
                                            </button>
                                        </div>
                                        {aiResults.map((item, index) => (
                                            <label
                                                key={index}
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAiItems.has(index) ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-gray-200 hover:border-purple-200'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAiItems.has(index)}
                                                    onChange={() => toggleAiSelection(index)}
                                                    className="w-5 h-5 accent-purple-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-500">{item.type} · {item.context}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t flex justify-between items-center bg-gray-50 rounded-b-2xl">
                                <button
                                    onClick={handleAiFindLocations}
                                    disabled={isAiLoading}
                                    className="px-4 py-2 text-gray-600 hover:text-purple-600"
                                >
                                    🔄 다시 검색
                                </button>
                                <button
                                    onClick={handleBatchEnrich}
                                    disabled={selectedAiItems.size === 0 || isBatchProcessing}
                                    className="px-6 py-2 bg-[#5a3d8b] text-white rounded-lg hover:bg-[#4a2d7b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isBatchProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                            생성 중...
                                        </>
                                    ) : (
                                        `선택한 ${selectedAiItems.size}개 임시 저장`
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    );
}

