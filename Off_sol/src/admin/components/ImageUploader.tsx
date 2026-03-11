import { useState, useEffect } from 'react';
import ImageCropper from './ImageCropper';
import { adminService } from '@/services/admin';
import chipsSvg from '@/assets/Chips.svg';

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    enableCrop?: boolean;
    aspectRatio?: number;
    required?: boolean;
    label?: string;
    className?: string;
}

export default function ImageUploader({
    value,
    onChange,
    enableCrop = true,
    aspectRatio = 4 / 5,
    required = false,
    label = '사진 등록',
    className = "",
    previewImageClassName = "",
}: ImageUploaderProps & { previewImageClassName?: string }) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [cropSource, setCropSource] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (50MB limit)
            if (file.size > 50 * 1024 * 1024) {
                alert('파일 크기는 50MB 이내여야 합니다.');
                return;
            }

            const objectUrl = URL.createObjectURL(file);

            if (enableCrop) {
                setCropSource(objectUrl);
            } else {
                // Direct upload without crop
                setPreview(objectUrl);

                const upload = async () => {
                    setIsUploading(true);
                    try {
                        const result = await adminService.uploadFile(file);
                        onChange(result.url); // Use server URL
                    } catch (error) {
                        console.error('Upload failed:', error);
                        alert('이미지 업로드에 실패했습니다.');
                        setPreview(null); // Revert preview on failure
                    } finally {
                        setIsUploading(false);
                    }
                };
                upload();
            }
        }
        e.target.value = '';
    };

    const handleCropComplete = async (croppedUrl: string) => {
        setPreview(croppedUrl);
        if (cropSource) {
            URL.revokeObjectURL(cropSource);
        }
        setCropSource(null);

        // Upload cropped image
        setIsUploading(true);
        try {
            // Convert Blob URL to File
            const response = await fetch(croppedUrl);
            const blob = await response.blob();
            const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });

            const result = await adminService.uploadFile(file);
            onChange(result.url); // Use server URL
        } catch (error) {
            console.error('Upload failed:', error);
            alert('이미지 업로드에 실패했습니다.');
            // Note: We keep the preview for now even if upload failed, or revert? 
            // Better to alert user.
        } finally {
            setIsUploading(false);
        }
    };

    const handleCropCancel = () => {
        if (cropSource) {
            URL.revokeObjectURL(cropSource);
        }
        setCropSource(null);
    };

    const handleRemove = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        onChange('');
    };

    return (
        <>
            {/* Upload Card - Custom size via className or default 200px width */}
            <div className={className || "w-[200px]"}>
                {preview ? (
                    // Preview state
                    <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: aspectRatio }}>
                        <img
                            src={preview}
                            alt="Preview"
                            className={previewImageClassName || "w-full h-full object-cover"}
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Re-edit button */}
                        <button
                            type="button"
                            onClick={() => {
                                // Open file picker again
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                        if (file.size > 50 * 1024 * 1024) {
                                            alert('파일 크기는 50MB 이내여야 합니다.');
                                            return;
                                        }
                                        const objectUrl = URL.createObjectURL(file);
                                        if (enableCrop) {
                                            setCropSource(objectUrl);
                                        } else {
                                            setPreview(objectUrl);
                                            onChange(objectUrl);
                                        }
                                    }
                                };
                                input.click();
                            }}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/90 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors shadow-sm"
                        >
                            📷 수정
                        </button>
                    </div>
                ) : (
                    // Empty state - upload card
                    <label
                        className={`rounded-xl bg-[#f5f5f5] flex flex-col cursor-pointer hover:bg-gray-200 transition-colors border border-dashed border-gray-300 ${className ? '' : 'w-full'}`}
                        style={{ aspectRatio: aspectRatio }}
                    >
                        {/* Content area */}
                        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
                            {required && (
                                <span className="absolute top-3 right-3 text-red-500 text-sm font-medium">필수 *</span>
                            )}

                            {/* Chips Icon */}
                            <img src={chipsSvg} alt="Upload" className="w-[90px] h-[36px] object-contain mb-2" />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-10 transition-all">
                                <div className="text-white font-medium">업로드 중...</div>
                            </div>
                        )}
                    </label>
                )}
            </div>

            {/* Image Cropper Modal */}
            {
                cropSource && (
                    <ImageCropper
                        imageSrc={cropSource}
                        onComplete={handleCropComplete}
                        onCancel={handleCropCancel}
                        aspectRatio={aspectRatio}
                    />
                )
            }
        </>
    );
}
