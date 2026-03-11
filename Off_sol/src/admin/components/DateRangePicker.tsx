import { useState, useRef, useEffect } from 'react';

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onChange: (start: string, end: string) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempStart, setTempStart] = useState(startDate);
    const [tempEnd, setTempEnd] = useState(endDate);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: (Date | null)[] = [];

        // 시작 요일까지 빈 칸
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // 해당 월의 날짜들
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const formatDate = (date: Date) => {
        // 로컬 시간대 기준으로 YYYY-MM-DD 형식 반환
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 오늘 날짜 (시간 제외, 로컬 기준)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleDayClick = (date: Date) => {
        const dateStr = formatDate(date);
        if (!tempStart || (tempStart && tempEnd)) {
            setTempStart(dateStr);
            setTempEnd('');
        } else {
            if (dateStr < tempStart) {
                setTempEnd(tempStart);
                setTempStart(dateStr);
            } else {
                setTempEnd(dateStr);
            }
        }
    };

    const handleConfirm = () => {
        if (tempStart && tempEnd) {
            onChange(tempStart, tempEnd);
            setIsOpen(false);
        }
    };

    const isInRange = (date: Date) => {
        if (!tempStart || !tempEnd) return false;
        const dateStr = formatDate(date);
        return dateStr >= tempStart && dateStr <= tempEnd;
    };

    const isSelected = (date: Date) => {
        const dateStr = formatDate(date);
        return dateStr === tempStart || dateStr === tempEnd;
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="relative" ref={pickerRef}>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={startDate || 'YYYY.MM.DD'}
                    readOnly
                    onClick={() => setIsOpen(true)}
                    className="w-40 px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer focus:outline-none focus:border-[#5a3d8b]"
                />
                <span className="text-gray-400">~</span>
                <input
                    type="text"
                    value={endDate || 'YYYY.MM.DD'}
                    readOnly
                    onClick={() => setIsOpen(true)}
                    className="w-40 px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer focus:outline-none focus:border-[#5a3d8b]"
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                >
                    📅
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-12 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            ◀
                        </button>
                        <span className="font-medium">
                            {currentMonth.getFullYear()}.{String(currentMonth.getMonth() + 1).padStart(2, '0')}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            ▶
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day) => (
                            <div key={day} className="text-center text-xs text-gray-400 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            // 오늘 이전 날짜는 선택 불가 (오늘은 선택 가능)
                            const isPastDate = day ? day.getTime() < today.getTime() : false;
                            return (
                                <div key={index} className="aspect-square">
                                    {day && (
                                        <button
                                            type="button"
                                            onClick={() => !isPastDate && handleDayClick(day)}
                                            disabled={isPastDate}
                                            className={`w-full h-full flex items-center justify-center text-sm rounded
                                                ${isPastDate ? 'text-gray-300 cursor-not-allowed' : ''}
                                                ${isSelected(day) && !isPastDate ? 'bg-[#5a3d8b] text-white' : ''}
                                                ${isInRange(day) && !isSelected(day) && !isPastDate ? 'bg-purple-100' : ''}
                                                ${!isPastDate ? 'hover:bg-purple-50' : ''}`}
                                        >
                                            {day.getDate()}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Confirm Button */}
                    <div className="mt-4 flex justify-center">
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!tempStart || !tempEnd}
                            className="px-6 py-2 bg-[#5a3d8b] text-white rounded-lg text-sm hover:bg-[#4a2d7b] disabled:opacity-50"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
