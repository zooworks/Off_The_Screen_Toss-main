import { useState, useRef, useCallback, useEffect } from 'react';

interface ImagePanCropperProps {
    imageSrc: string;
    onComplete: (croppedImageUrl: string) => void;
    onCancel: () => void;
    aspectRatio?: number;
    cropWidth?: number;
    cropHeight?: number;
}

export default function ImagePanCropper({
    imageSrc,
    onComplete,
    onCancel,
    aspectRatio = 1,
    cropWidth = 400,
    cropHeight,
}: ImagePanCropperProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const imageRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    // 실제 크롭 영역 높이 계산
    const actualCropHeight = cropHeight || cropWidth / aspectRatio;

    // 컨테이너 크기 (편집 영역)
    const containerWidth = 800; // 충분히 넓게
    const containerHeight = 600;

    // 이미지 로드 핸들러
    const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        setImageSize({ width: naturalWidth, height: naturalHeight });
        setImageLoaded(true);

        // 초기 스케일 계산: 이미지가 크롭 영역을 덮도록
        const scaleX = cropWidth / naturalWidth;
        const scaleY = actualCropHeight / naturalHeight;
        const initialScale = Math.max(scaleX, scaleY);
        setScale(initialScale);

        // 이미지 중앙 정렬
        // (컨테이너 중앙) - (이미지 중앙)
        setPosition({
            x: (containerWidth - naturalWidth * initialScale) / 2,
            y: (containerHeight - naturalHeight * initialScale) / 2
        });
    }, [cropWidth, actualCropHeight]);

    // 드래그 시작
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    // 드래그 중
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
    }, [isDragging, dragStart]);

    // 드래그 종료
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // 마우스 이벤트 등록
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // 줌 핸들러
    const handleZoom = (delta: number) => {
        const newScale = Math.max(0.1, Math.min(5, scale + delta));

        // 줌 중심점: 컨테이너 중앙
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;

        // (현재 위치 - 중심) / 현재 스케일 = (새 위치 - 중심) / 새 스케일
        const newX = centerX + (position.x - centerX) * (newScale / scale);
        const newY = centerY + (position.y - centerY) * (newScale / scale);

        setScale(newScale);
        setPosition({ x: newX, y: newY });
    };

    // 미리보기 및 캔버스 업데이트
    useEffect(() => {
        if (!imageLoaded || !imageRef.current || !previewCanvasRef.current) return;

        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pixelRatio = window.devicePixelRatio || 1;
        const previewSize = 300;

        // 캔버스 설정
        canvas.width = previewSize * pixelRatio;
        canvas.height = (previewSize / aspectRatio) * pixelRatio;
        canvas.style.width = `${previewSize}px`;
        canvas.style.height = `${previewSize / aspectRatio}px`;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(pixelRatio, pixelRatio);

        // 그리기:
        // 크롭 프레임(컨테이너 중앙)에 해당하는 이미지 영역을 잘라내야 함
        // 이미지 상의 좌표 계산
        const containerCenterX = containerWidth / 2;
        const containerCenterY = containerHeight / 2;

        const cropLeft = containerCenterX - cropWidth / 2;
        const cropTop = containerCenterY - actualCropHeight / 2;

        // 이미지 기준 좌표로 변환
        // imageX = (screenX - imageXPos) / scale
        const sourceX = (cropLeft - position.x) / scale;
        const sourceY = (cropTop - position.y) / scale;
        const sourceWidth = cropWidth / scale;
        const sourceHeight = actualCropHeight / scale;

        ctx.drawImage(
            imageRef.current,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            previewSize,
            previewSize / aspectRatio
        );
    }, [imageLoaded, position, scale, cropWidth, actualCropHeight, aspectRatio, containerWidth, containerHeight]);

    // 최종 완료 처리
    const handleComplete = useCallback(() => {
        if (!imageRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 고해상도 출력 (2배)
        const outputWidth = cropWidth * 2;
        const outputHeight = actualCropHeight * 2;

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 계산 로직 동일
        const containerCenterX = containerWidth / 2;
        const containerCenterY = containerHeight / 2;
        const cropLeft = containerCenterX - cropWidth / 2;
        const cropTop = containerCenterY - actualCropHeight / 2;

        const sourceX = (cropLeft - position.x) / scale;
        const sourceY = (cropTop - position.y) / scale;
        const sourceWidth = cropWidth / scale;
        const sourceHeight = actualCropHeight / scale;

        ctx.drawImage(
            imageRef.current,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            outputWidth,
            outputHeight
        );

        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                onComplete(url);
            }
        }, 'image/jpeg', 0.95);
    }, [position, scale, cropWidth, actualCropHeight, onComplete, containerWidth, containerHeight]);

    // 오버레이 스타일 (구멍 뚫기)
    const overlayStyle = {
        boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`, // 주변 어둡게
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-[98vw] max-w-[1400px] h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-semibold">이미지 편집</h3>
                        <p className="text-sm text-gray-500">이미지를 이동/확대하여 프레임에 맞춰주세요</p>
                    </div>
                </div>

                <div className="flex gap-6 p-4 bg-gray-100 flex-1 overflow-hidden">
                    {/* 편집 영역 */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
                        <div
                            className="relative overflow-hidden bg-gray-800 rounded-lg cursor-move select-none shadow-xl border border-gray-700"
                            style={{ width: containerWidth, height: containerHeight }}
                            onMouseDown={handleMouseDown}
                        >
                            {/* 이미지 레이어 */}
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="Edit"
                                onLoad={handleImageLoad}
                                draggable={false}
                                className="absolute origin-top-left pointer-events-none"
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    maxWidth: 'none',
                                }}
                            />

                            {/* 오버레이 (마스크) */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div
                                    className="relative border-2 border-white shadow-sm"
                                    style={{
                                        width: cropWidth,
                                        height: actualCropHeight,
                                        ...overlayStyle
                                    }}
                                >
                                    {/* 그리드 가이드 */}
                                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className="border border-white/20" />
                                        ))}
                                    </div>
                                    <span className="absolute -top-6 left-0 text-white text-xs bg-black/50 px-2 py-0.5 rounded">
                                        편집 영역
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 줌 컨트롤 */}
                        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-lg z-10 w-[400px]">
                            <button onClick={() => handleZoom(-0.1)} className="p-1 hover:text-purple-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <input
                                type="range"
                                min="0.1"
                                max="3"
                                step="0.05"
                                value={scale}
                                onChange={(e) => handleZoom(parseFloat(e.target.value) - scale)}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5a3d8b]"
                            />
                            <button onClick={() => handleZoom(0.1)} className="p-1 hover:text-purple-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    min="10"
                                    max="300"
                                    value={Math.round(scale * 100)}
                                    onChange={(e) => {
                                        const percent = parseInt(e.target.value) || 100;
                                        const newScale = Math.max(0.1, Math.min(3, percent / 100));
                                        handleZoom(newScale - scale);
                                    }}
                                    className="w-14 text-sm font-medium text-center border border-gray-200 rounded-lg py-1 focus:outline-none focus:border-[#5a3d8b]"
                                />
                                <span className="text-sm ml-1">%</span>
                            </div>
                        </div>
                    </div>

                    {/* 사이드바 (미리보기) */}
                    <div className="w-[350px] flex-shrink-0 flex flex-col bg-white rounded-xl shadow-sm border p-4 h-full">
                        <p className="text-lg font-bold text-gray-800 mb-4">미리보기</p>
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center flex-1 min-h-[300px]">
                            <canvas
                                ref={previewCanvasRef}
                                className="rounded-lg shadow-lg max-w-full max-h-full object-contain bg-white"
                            />
                        </div>
                        <div className="mt-4 pt-4 border-t space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">크기</span>
                                <span className="font-medium text-gray-900">{cropWidth} x {Math.round(actualCropHeight)} px</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">배율</span>
                                <span className="font-medium text-gray-900">{Math.round(scale * 100)}%</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-200"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleComplete}
                                disabled={!imageLoaded}
                                className="flex-1 py-3 bg-[#5a3d8b] text-white rounded-lg hover:bg-[#4a2d7b] transition-colors disabled:opacity-50 font-medium shadow-md shadow-purple-200"
                            >
                                완료
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
