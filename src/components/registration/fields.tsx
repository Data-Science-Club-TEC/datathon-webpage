import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { CheckIcon, ChevronDownIcon, MinusIcon, PlusIcon } from "../icons.tsx";
import { inputClass, labelClass, messageClass } from "./styles.ts";

// Props de accesibilidad que Field pasa a su control
export type ControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  // Confirmacion visible cuando el valor es valido (p. ej. un enlace correcto)
  success?: string;
  optional?: boolean;
  className?: string;
  children: (control: ControlProps) => ReactNode;
};

export function Field({
  label,
  hint,
  error,
  success,
  optional,
  className = "",
  children,
}: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? success ?? hint;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className={labelClass}>
        <span>{label}</span>
        {optional && (
          <span className="text-xs font-normal text-white/40">Opcional</span>
        )}
      </label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": message ? messageId : undefined,
      })}
      {error || !success ? (
        message && (
          <p id={messageId} className={messageClass(Boolean(error))}>
            {message}
          </p>
        )
      ) : (
        <p id={messageId} className="flex items-center gap-1.5 text-[13px] text-blue">
          <CheckIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{success}</span>
        </p>
      )}
    </div>
  );
}

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${inputClass} appearance-none pr-10 [&>option]:bg-navy [&>option]:text-white ${
          props.value === "" ? "text-white/40" : ""
        } ${className}`}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
    </div>
  );
}

type AddonInputProps = InputHTMLAttributes<HTMLInputElement> & {
  addon: string;
};

// Input con un prefijo fijo (+52, github.com/)
export function AddonInput({ addon, className = "", ...props }: AddonInputProps) {
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true";
  return (
    <div
      className={`flex h-12 overflow-hidden rounded-lg border bg-navy-dark/70 transition-colors focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/25 ${
        invalid ? "border-danger/70" : "border-white/10 hover:border-white/20"
      }`}
    >
      <span className="flex shrink-0 select-none items-center border-r border-white/10 bg-white/[0.04] px-3 font-mono text-[13px] text-white/45">
        {addon}
      </span>
      <input
        {...props}
        className={`min-w-0 flex-1 bg-transparent px-3 text-[15px] text-white placeholder:text-white/30 outline-none ${className}`}
      />
    </div>
  );
}

type SegmentedOption<T> = { value: T; label: string };

type SegmentedProps<T extends string | boolean> = {
  label: string;
  name: string;
  options: SegmentedOption<T>[];
  value: T | null | "";
  onChange: (value: T) => void;
  error?: string;
  // Etiqueta a la izquierda y opciones a la derecha (preguntas Si/No)
  inline?: boolean;
};

// Grupo de radios con apariencia de control segmentado. Usa radios nativos
// para conservar la navegacion con flechas del teclado.
export function Segmented<T extends string | boolean>({
  label,
  name,
  options,
  value,
  onChange,
  error,
  inline = false,
}: SegmentedProps<T>) {
  const id = useId();
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex gap-3 ${
          inline
            ? "flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            : "flex-col"
        }`}
      >
        <span id={labelId} className={labelClass}>
          {label}
        </span>
        <div
          role="radiogroup"
          aria-labelledby={labelId}
          aria-describedby={error ? messageId : undefined}
          data-invalid={Boolean(error)}
          className={`inline-flex w-fit shrink-0 flex-wrap gap-1 rounded-xl border bg-navy-dark/70 p-1 ${
            error ? "border-danger/60" : "border-white/10"
          }`}
        >
          {options.map((option) => {
            const checked = option.value === value;
            return (
              <label key={String(option.value)} className="cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  className="peer sr-only"
                  checked={checked}
                  onChange={() => onChange(option.value)}
                />
                <span
                  className={`block rounded-lg px-5 py-2 text-sm font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue/60 ${
                    checked
                      ? "bg-blue text-navy"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      {error && (
        <p id={messageId} className={messageClass(true)}>
          {error}
        </p>
      )}
    </div>
  );
}

const yesNoOptions: SegmentedOption<boolean>[] = [
  { value: true, label: "Sí" },
  { value: false, label: "No" },
];

type YesNoProps = Omit<SegmentedProps<boolean>, "options" | "inline">;

export function YesNo(props: YesNoProps) {
  return <Segmented {...props} options={yesNoOptions} inline />;
}

type ChoiceCardOption<T> = {
  value: T;
  title: string;
  description?: string;
  icon?: ReactNode;
};

type ChoiceCardsProps<T extends string> = {
  label: string;
  name: string;
  options: ChoiceCardOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  error?: string;
  className?: string;
};

export function ChoiceCards<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
  error,
  className = "sm:grid-cols-2",
}: ChoiceCardsProps<T>) {
  const id = useId();
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;

  return (
    <div className="flex flex-col gap-3">
      <span id={labelId} className={labelClass}>
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={error ? messageId : undefined}
        data-invalid={Boolean(error)}
        className={`grid gap-3 ${className}`}
      >
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label key={option.value} className="block cursor-pointer">
              <input
                type="radio"
                name={name}
                className="peer sr-only"
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              <div
                className={`flex h-full items-start gap-4 rounded-xl border p-4 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue/60 ${
                  checked
                    ? "border-blue bg-blue/10"
                    : error
                      ? "border-danger/40 bg-white/[0.03] hover:border-white/25"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                {option.icon && (
                  <span
                    // Forma del contenedor del logo: redondo a la izquierda
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-l-[14px] rounded-r-[5px] transition-colors ${
                      checked ? "bg-blue text-navy" : "bg-white/5 text-blue"
                    }`}
                  >
                    {option.icon}
                  </span>
                )}
                <span className="flex-1">
                  <span className="block font-poppins font-semibold text-white">
                    {option.title}
                  </span>
                  {option.description && (
                    <span className="mt-1 block text-[13px] leading-snug text-white/55">
                      {option.description}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    checked ? "border-blue bg-blue text-navy" : "border-white/25"
                  }`}
                >
                  {checked && <CheckIcon className="h-3.5 w-3.5" />}
                </span>
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={messageId} className={messageClass(true)}>
          {error}
        </p>
      )}
    </div>
  );
}

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
};

export function Checkbox({ checked, onChange, error, children }: CheckboxProps) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? messageId : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue/60 ${
            checked
              ? "border-blue bg-blue text-navy"
              : error
                ? "border-danger/70"
                : "border-white/30"
          }`}
        >
          {checked && <CheckIcon className="h-3.5 w-3.5" />}
        </span>
        <span className="text-sm leading-relaxed text-white/75">{children}</span>
      </label>
      {error && (
        <p id={messageId} className={`mt-1.5 pl-8 ${messageClass(true)}`}>
          {error}
        </p>
      )}
    </div>
  );
}

type NumberStepperProps = ControlProps & {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

export function NumberStepper({
  value,
  min,
  max,
  onChange,
  ...control
}: NumberStepperProps) {
  const buttonClass =
    "flex w-12 items-center justify-center text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <div
      className={`inline-flex h-12 w-fit items-stretch overflow-hidden rounded-lg border bg-navy-dark/70 focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/25 ${
        control["aria-invalid"] ? "border-danger/70" : "border-white/10"
      }`}
    >
      <button
        type="button"
        aria-label="Restar uno"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={buttonClass}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <input
        {...control}
        type="text"
        inputMode="numeric"
        value={String(value)}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
          onChange(digits ? Number(digits) : 0);
        }}
        className="w-14 border-x border-white/10 bg-transparent text-center font-mono text-[15px] text-white outline-none"
      />
      <button
        type="button"
        aria-label="Sumar uno"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={buttonClass}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}
