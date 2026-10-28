type FilterOption<T extends string> = { value: T; label: string };

type FilterPillsProps<T extends string> = {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterPillsProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-md border-2 px-4 py-2 font-mono text-xs md:text-sm uppercase tracking-wider transition-colors ${
              isActive
                ? "border-white bg-white text-navy-dark"
                : "border-white/20 text-white/80 hover:border-white/50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
