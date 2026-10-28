import { useId, useState, type KeyboardEvent } from "react";
import type { AcademicProgram } from "../../types/registration";
import { CheckIcon, SearchIcon } from "../icons.tsx";
import type { ControlProps } from "./fields.tsx";
import { inputClass } from "./styles.ts";

const MAX_RESULTS = 8;

// Minusculas y sin acentos: "computacion" encuentra "Computación"
const normalize = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

// Coincide si todas las palabras escritas aparecen en el nombre o la clave;
// primero los que empiezan con lo escrito
function search(options: AcademicProgram[], query: string) {
  const q = normalize(query);
  if (!q) return options;
  const tokens = q.split(/\s+/);
  return options
    .map((option) => ({
      option,
      text: normalize(`${option.name} ${option.code}`),
    }))
    .filter(({ text }) => tokens.every((token) => text.includes(token)))
    .sort((a, b) => Number(b.text.startsWith(q)) - Number(a.text.startsWith(q)))
    .map(({ option }) => option);
}

type ProgramComboboxProps = {
  options: AcademicProgram[];
  value: string;
  onChange: (programId: string) => void;
  control: ControlProps;
  placeholder: string;
  disabled?: boolean;
};

// Autocompletado accesible (patron combobox de WAI-ARIA). Montar con
// key={nivel} para que se reinicie cuando cambia la lista de opciones.
export default function ProgramCombobox({
  options,
  value,
  onChange,
  control,
  placeholder,
  disabled = false,
}: ProgramComboboxProps) {
  const listId = useId();
  const selected = options.find((option) => option.id === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Con una opcion ya elegida, abrir la lista muestra todas las opciones
  const effectiveQuery = selected && query === selected.name ? "" : query;
  const results = search(options, effectiveQuery).slice(0, MAX_RESULTS);
  const activeIndex = Math.min(active, results.length - 1);
  const activeOption = open ? results[activeIndex] : undefined;

  const choose = (option: AcademicProgram) => {
    onChange(option.id);
    setQuery(option.name);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive(Math.min(activeIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter" && activeOption) {
      e.preventDefault();
      choose(activeOption);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      <input
        {...control}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeOption ? `${listId}-${activeOption.id}` : undefined
        }
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
          // Escribir invalida la seleccion anterior hasta elegir otra
          if (value) onChange("");
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={() => {
          // Si escribieron el nombre exacto sin elegirlo de la lista, se toma igual
          const exact = options.find((o) => normalize(o.name) === normalize(query));
          if (exact && !value) choose(exact);
          else setOpen(false);
        }}
        onKeyDown={handleKeyDown}
        className={`${inputClass} pl-10`}
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-white/10 bg-navy p-1.5 shadow-2xl shadow-black/50"
        >
          {results.length === 0 ? (
            <li role="presentation" className="px-3 py-3 text-sm text-white/50">
              Sin coincidencias. Si tu carrera no aparece, márcalo abajo.
            </li>
          ) : (
            results.map((option, i) => (
              <li
                key={option.id}
                id={`${listId}-${option.id}`}
                role="option"
                aria-selected={option.id === value}
                // mousedown en vez de click: se ejecuta antes del blur del input
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(option);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  i === activeIndex ? "bg-white/10 text-white" : "text-white/75"
                }`}
              >
                <span>{option.name}</span>
                {option.id === value ? (
                  <CheckIcon className="h-4 w-4 shrink-0 text-blue" />
                ) : (
                  <span className="shrink-0 font-mono text-[11px] text-white/35">
                    {option.code}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
