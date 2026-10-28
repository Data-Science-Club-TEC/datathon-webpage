import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";

export const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  describedBy?: string;
};

// Seis casillas que se comportan como un solo campo: escribir avanza,
// borrar retrocede, y pegar (o el autocompletado del SMS/correo en movil)
// reparte el codigo completo.
export default function OtpInput({
  value,
  onChange,
  invalid,
  disabled,
  describedBy,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  const focusAt = (index: number) =>
    refs.current[Math.min(Math.max(index, 0), OTP_LENGTH - 1)]?.focus();

  // Foco en la primera casilla al aparecer y cuando el codigo se limpia
  // (p. ej. despues de un codigo incorrecto, al reactivarse las casillas)
  useEffect(() => {
    if (!disabled && value === "") refs.current[0]?.focus();
  }, [disabled, value]);

  const handleInput = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return;
    // No se permiten huecos: si escriben en una casilla adelantada, se llena la siguiente libre
    const start = Math.min(index, value.length);
    if (typed.length > 1) {
      const next = (value.slice(0, start) + typed).slice(0, OTP_LENGTH);
      onChange(next);
      focusAt(next.length);
      return;
    }
    onChange((value.slice(0, start) + typed + value.slice(start + 1)).slice(0, OTP_LENGTH));
    focusAt(start + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(index + 1);
    } else if (e.key === "Enter") {
      // Evita enviar el formulario del paso; el codigo se verifica solo al completarse
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    focusAt(pasted.length);
  };

  return (
    <div
      role="group"
      aria-label="Código de verificación"
      aria-describedby={describedBy}
      className="flex gap-2 sm:gap-3"
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Dígito ${i + 1} de ${OTP_LENGTH}`}
          aria-invalid={invalid}
          value={digit}
          disabled={disabled}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`h-14 w-11 rounded-none border bg-navy-dark/70 text-center font-mono text-2xl text-white outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/25 disabled:opacity-50 sm:w-13 ${
            invalid
              ? "border-danger/70"
              : digit
                ? "border-blue/50"
                : "border-white/10"
          }`}
        />
      ))}
    </div>
  );
}
