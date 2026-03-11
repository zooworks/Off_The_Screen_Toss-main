import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
    imageSrc: string;
    onComplete: (croppedImageUrl: string) => void;
    onCancel: () => void;
    aspectRatio?: number;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 80,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export default function ImageCropper({
    imageSrc,
    onComplete,
    onCancel,
    aspectRatio = 4 / 5,
}: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);

    const onImageLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            const { width, height } = e.currentTarget;
            const initialCrop = aspectRatio
                ? centerAspectCrop(width, height, aspectRatio)
                : {
                    unit: '%' as const,
                    x: 10,
                    y: 10,
                    width: 80,
                    height: 80,
                };
            setCrop(initialCrop);
        },
        [aspectRatio]
    );

    const getCroppedImg = useCallback(async () => {
        if (!completedCrop || !imgRef.current) return;

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Use getBoundingClientRect for precise rendered dimensions (float values)
        // to match what the user sees, preventing drift due to integer rounding of offsetWidth/Height.
        const rect = image.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const scaleX = image.naturalWidth / rect.width;
        const scaleY = image.naturalHeight / rect.height;

        // Calculate source coordinates in natural image space
        const sourceX = completedCrop.x * scaleX;
        const sourceY = completedCrop.y * scaleY;
        const sourceWidth = completedCrop.width * scaleX;
        const sourceHeight = completedCrop.height * scaleY;

        // Clamp values to ensure they stay within the natural image bounds
        const safeSourceX = Math.max(0, sourceX);
        const safeSourceY = Math.max(0, sourceY);

        // Prevent requesting more than exists (avoids transparency/cut-off at edges)
        const safeSourceWidth = Math.min(sourceWidth, image.naturalWidth - safeSourceX);
        const safeSourceHeight = Math.min(sourceHeight, image.naturalHeight - safeSourceY);

        // Set canvas size to match the captured area
        canvas.width = Math.floor(safeSourceWidth);
        canvas.height = Math.floor(safeSourceHeight);

        // Safety check
        if (canvas.width === 0 || canvas.height === 0) return;

        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            safeSourceX,
            safeSourceY,
            safeSourceWidth,
            safeSourceHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
        });

        if (blob) {
            const croppedUrl = URL.createObjectURL(blob);
            onComplete(croppedUrl);
        }
    }, [completedCrop, onComplete]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-[700px] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <h3 className="text-lg font-bold text-gray-900">사진 등록</h3>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Crop Area */}
                <div className="bg-[#1a1a1a] p-6 flex justify-center items-center min-h-[400px]">
                    <div className="relative">
                        <style>{`
                            .ReactCrop__crop-selection {
                                border: 2px dashed white !important;
                                border-radius: 0 !important;
                            }
                            .ReactCrop__drag-handle {
                                width: 16px !important;
                                height: 16px !important;
                                background: white !important;
                                border: 2px solid white !important;
                                border-radius: 0 !important;
                            }
                            .ReactCrop__drag-handle::after {
                                display: none !important;
                            }
                            .ReactCrop__drag-handle.ord-nw,
                            .ReactCrop__drag-handle.ord-ne,
                            .ReactCrop__drag-handle.ord-sw,
                            .ReactCrop__drag-handle.ord-se {
                                width: 20px !important;
                                height: 20px !important;
                            }
                            .ReactCrop__drag-bar {
                                display: none !important;
                            }
                        `}</style>
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                            minWidth={50}
                            minHeight={50}
                            keepSelection
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop"
                                onLoad={onImageLoad}
                                style={{
                                    maxHeight: '450px',
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                            />
                        </ReactCrop>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-4 py-4 border-t bg-white">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        취소
                    </button>
                    <button
                        onClick={getCroppedImg}
                        disabled={!completedCrop}
                        className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-medium"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
