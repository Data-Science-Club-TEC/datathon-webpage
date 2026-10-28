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
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap justify-center gap-3"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-full border px-6 py-2.5 font-poppins font-semibold text-[15px] transition delay-100 ease-in-out ${
              isActive
                ? "btn-glow border-blue bg-blue text-navy"
                : "border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:text-[#9fbfed]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
