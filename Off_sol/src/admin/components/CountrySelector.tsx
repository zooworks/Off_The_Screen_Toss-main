interface CountrySelectorProps {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
}

const countries = [
    { code: 'ALL', label: 'ALL', flag: null },
    { code: 'KR', label: '한국', flag: '🇰🇷' },
    { code: 'US', label: '미국', flag: '🇺🇸' },
    { code: 'CN', label: '중국', flag: '🇨🇳' },
    { code: 'JP', label: '일본', flag: '🇯🇵' },
];

export default function CountrySelector({ value, onChange, multiple = false }: CountrySelectorProps) {
    const selectedValues = Array.isArray(value) ? value : [value];

    const handleClick = (code: string) => {
        if (!multiple) {
            onChange(code);
            return;
        }

        // 다중 선택 모드
        if (code === 'ALL') {
            // ALL 클릭 시 모두 선택 또는 모두 해제
            if (selectedValues.includes('ALL')) {
                onChange([]);
            } else {
                onChange(countries.map(c => c.code));
            }
            return;
        }

        // 개별 국가 선택
        let newValues: string[];
        if (selectedValues.includes(code)) {
            newValues = selectedValues.filter(v => v !== code && v !== 'ALL');
        } else {
            newValues = [...selectedValues.filter(v => v !== 'ALL'), code];
            // 모든 개별 국가가 선택되면 ALL도 추가
            const allIndividual = countries.filter(c => c.code !== 'ALL').every(c => newValues.includes(c.code));
            if (allIndividual) {
                newValues = countries.map(c => c.code);
            }
        }
        onChange(newValues);
    };

    const isSelected = (code: string) => selectedValues.includes(code);

    return (
        <div className="flex gap-3 flex-wrap">
            {countries.map((country) => (
                <button
                    key={country.code}
                    type="button"
                    onClick={() => handleClick(country.code)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all relative ${isSelected(country.code)
                            ? 'border-[#5a3d8b] scale-110'
                            : 'border-transparent hover:border-gray-200'
                        }`}
                >
                    {country.flag ? (
                        <span className="text-2xl">{country.flag}</span>
                    ) : (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 w-full h-full rounded-full flex items-center justify-center">
                            ALL
                        </span>
                    )}
                    {/* 다중 선택 시 체크 표시 */}
                    {multiple && isSelected(country.code) && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5a3d8b] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

