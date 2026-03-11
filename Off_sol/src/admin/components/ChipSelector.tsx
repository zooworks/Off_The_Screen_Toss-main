interface ChipSelectorProps {
    options: { value: string; label: string }[];
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
}

export default function ChipSelector({ options, value, onChange, multiple = false }: ChipSelectorProps) {
    const selectedValues = Array.isArray(value) ? value : [value];

    const handleClick = (optionValue: string) => {
        if (multiple) {
            const newValues = selectedValues.includes(optionValue)
                ? selectedValues.filter((v) => v !== optionValue)
                : [...selectedValues, optionValue];
            onChange(newValues);
        } else {
            onChange(optionValue);
        }
    };

    return (
        <div className="flex flex-wrap gap-3">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => handleClick(option.value)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${selectedValues.includes(option.value)
                            ? 'border-[#5a3d8b] bg-purple-50 text-[#5a3d8b]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
