import { Notice } from '@/services/admin';

interface NoticeItemProps {
    notice: Notice;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function NoticeItem({ notice, onEdit, onDelete }: NoticeItemProps) {
    const formattedDate = new Date(notice.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const handleDelete = () => {
        if (window.confirm(`"${notice.title}" 공지사항을 삭제하시겠습니까?`)) {
            onDelete(notice.id);
        }
    };

    return (
        <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-100 hover:bg-gray-50">
            <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800">{notice.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(notice.id)}
                    className="px-4 py-2 bg-[#5a3d8b] text-white text-xs rounded-md hover:bg-[#4a2d7b] transition-colors"
                >
                    수정하기
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                >
                    삭제
                </button>
            </div>
        </div>
    );
}
