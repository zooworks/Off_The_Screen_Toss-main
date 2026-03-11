import { useState } from 'react';
import inquiriesService from '@/services/inquiries';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserImageUploaderProps {
    value?: string[];
    onChange: (urls: string[]) => void;
}

export default function UserImageUploader({ value = [], onChange }: UserImageUploaderProps) {
    const { t } = useLanguage();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check limits
        if (value.length + files.length > 5) {
            alert(t('inquiry_image_limit_error'));
            return;
        }

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File size limit exceeded: ${file.name}`);
                continue;
            }
        }

        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => inquiriesService.uploadFile(file));
            const results = await Promise.all(uploadPromises);
            const newUrls = results.map(r => r.url);
            onChange([...value, ...newUrls]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert(t('inquiry_image_upload_failed'));
        } finally {
            setIsUploading(false);
        }

        e.target.value = '';
    };

    const handleRemove = (indexToRemove: number) => {
        const newValue = value.filter((_, index) => index !== indexToRemove);
        onChange(newValue);
    };

    return (
        <div className="w-full">
            {/* Previews */}
            {value.length > 0 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3">
                    {value.map((url, index) => (
                        <div key={index} className="relative w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                            <img
                                src={url}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 hover:bg-black/70 transition-colors"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {value.length < 5 && (
                <label className="w-full h-[46px] bg-[#F2F4F6] rounded-xl cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[15px] text-[#8B95A1] font-medium">{t('image_button')}</span>
                    <input
                        type="file"
                        accept="image/jpg,image/jpeg,image/gif,image/png"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            )}
            {isUploading && <p className="text-xs text-[#735ccc] mt-2">{t('uploading')}</p>}
        </div>
    );
}
