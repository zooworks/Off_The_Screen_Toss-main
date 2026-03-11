import { useState } from 'react';
import type { Inquiry } from '@/services/admin';

interface InquiryItemProps {
    inquiry: Inquiry;
    onStatusChange: (id: string, status: string) => Promise<void>;
    onReply: (id: string, content: string) => Promise<void>;
}

const STATUS_OPTIONS = [
    { value: 'PENDING', label: '접수', color: 'bg-blue-500' },
    { value: 'COMPLETED', label: '완료', color: 'bg-purple-500' },
];

export default function InquiryItem({ inquiry, onStatusChange, onReply }: InquiryItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const currentStatus = STATUS_OPTIONS.find(s => s.value === inquiry.status) || STATUS_OPTIONS[0];

    // ... (handlers remain same)

    const handleStatusChange = async (status: string) => {
        setShowStatusDropdown(false);
        await onStatusChange(inquiry.id, status);
    };

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;
        setIsSubmitting(true);
        try {
            await onReply(inquiry.id, replyContent);
            setReplyContent('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    return (
        <div className="border-b border-gray-100 last:border-b-0">
            {/* Header Row (Same) */}
            <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{inquiry.title}</h3>
                    <p className="text-sm text-gray-500">
                        {inquiry.user?.email || inquiry.userId} | {formatDate(inquiry.createdAt)}
                    </p>
                </div>

                {/* Status Dropdown (Same) */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    {/* ... */}
                    {inquiry.status === 'COMPLETED' ? (
                        <span className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${currentStatus.color}`}>
                            {currentStatus.label}
                        </span>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${currentStatus.color} flex items-center gap-2`}
                            >
                                {currentStatus.label}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    {STATUS_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleStatusChange(option.value)}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${option.value === inquiry.status ? 'bg-gray-50 font-medium' : ''}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-6 pb-4">
                    {/* 문의 내용 */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        {/* Images Grid */}
                        {inquiry.images && inquiry.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {inquiry.images.map((imgUrl, index) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`첨부 이미지 ${index + 1}`}
                                        className="w-[150px] h-[150px] rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => window.open(imgUrl, '_blank')}
                                    />
                                ))}
                            </div>
                        )}
                        <p className="text-gray-700 whitespace-pre-wrap">{inquiry.content}</p>
                    </div>

                    {/* Replies (Same) */}
                    {inquiry.replies && inquiry.replies.length > 0 && (
                        <div className="mb-4 space-y-2">
                            <h4 className="text-sm font-medium text-gray-600">답변 내역</h4>
                            {inquiry.replies.map((reply) => (
                                <div key={reply.id} className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-400">
                                    <p className="text-gray-700 text-sm">{reply.content}</p>
                                    <p className="text-xs text-gray-400 mt-1">{formatDate(reply.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reply Input (Same) */}
                    {inquiry.status !== 'COMPLETED' && (
                        <div className="flex flex-col gap-2">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="답변을 입력하세요..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-[#5a3d8b]"
                                rows={3}
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleReplySubmit}
                                    disabled={isSubmitting || !replyContent.trim()}
                                    className="px-6 py-2 bg-[#5a3d8b] text-white rounded-lg hover:bg-[#4a2d7b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? '등록 중...' : '등록하기'}
                                </button>
                            </div>
                        </div>
                    )}
                    {inquiry.status === 'COMPLETED' && (
                        <p className="text-sm text-gray-400 italic text-center py-2">완료된 문의는 수정할 수 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
}
