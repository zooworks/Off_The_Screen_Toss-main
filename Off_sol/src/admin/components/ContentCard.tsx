import { Content } from '@/services/admin';

interface ContentCardProps {
    content: Content;
    onEdit: (id: string) => void;
}

export default function ContentCard({ content, onEdit }: ContentCardProps) {
    const formattedDate = new Date(content.createdAt).toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\. /g, '.').replace('.', '');

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 group">
            {/* Thumbnail */}
            {content.thumbnailUrl ? (
                <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-800" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

            {/* Date & Edit Button */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                <span className="text-white text-sm font-medium">{formattedDate}</span>
                <button
                    onClick={() => onEdit(content.id)}
                    className="px-3 py-1 bg-[#5a3d8b] text-white text-xs rounded-md hover:bg-[#4a2d7b] transition-colors"
                >
                    수정하기
                </button>
            </div>

            {/* Title */}
            <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-sm line-clamp-2">
                    {content.title}
                </h3>
            </div>
        </div>
    );
}
