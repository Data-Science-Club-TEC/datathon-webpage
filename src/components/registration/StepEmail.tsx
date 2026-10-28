import { useEffect, useId, useState } from "react";
import { MailIcon, ShieldIcon } from "../icons.tsx";
import {
  IS_MOCK_SERVICE,
  requestEmailCode,
  verifyEmailCode,
} from "../../services/registration.ts";
import type { StepProps } from "./draft.ts";
import { Field, Spinner } from "./fields.tsx";
import OtpInput, { OTP_LENGTH } from "./OtpInput.tsx";
import { buttonStyles, inputClass, messageClass } from "./styles.ts";
import { isValidEmail } from "./validation.ts";

// Espera minima entre reenvios; el limite real lo aplica Supabase Auth
const RESEND_SECONDS = 60;

type StepEmailProps = StepProps & { onVerified: () => void };

export default function StepEmail({
  draft,
  errors,
  update,
  onVerified,
}: StepEmailProps) {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "verifying">("idle");
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const otpMessageId = useId();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const email = draft.email.trim().toLowerCase();

  const sendCode = async () => {
    // La espera aplica aunque cambien de correo, para no saltarse el limite
    if (cooldown > 0 || status !== "idle") return;
    if (!isValidEmail(email)) {
      setError("Escribe un correo válido");
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      await requestEmailCode(email);
      setCodeSent(true);
      setCode("");
      setCooldown(RESEND_SECONDS);
    } catch {
      setError("No pudimos enviar el código. Intenta de nuevo en unos minutos.");
    } finally {
      setStatus("idle");
    }
  };

  const verify = async (value: string) => {
    setError(null);
    setStatus("verifying");
    try {
      const ok = await verifyEmailCode(email, value);
      if (!ok) {
        setError("El código no es correcto o ya expiró.");
        setCode("");
        return;
      }
      update({ email, emailVerified: true });
      onVerified();
    } catch {
      setError("No pudimos verificar el código. Intenta de nuevo.");
    } finally {
      setStatus("idle");
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setError(null);
    if (value.length === OTP_LENGTH) void verify(value);
  };

  if (draft.emailVerified) {
    return (
      <div className="flex flex-wrap items-center gap-4 rounded-none border border-blue/40 bg-blue/10 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-blue text-navy">
          <ShieldIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white/60">Correo verificado</p>
          <p className="truncate font-medium text-white">{draft.email}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            update({ emailVerified: false });
            setCodeSent(false);
          }}
          className="text-sm font-medium text-lavender hover:underline"
        >
          Usar otro correo
        </button>
      </div>
    );
  }

  const minutes = Math.floor(cooldown / 60);
  const seconds = String(cooldown % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-6">
      {!codeSent ? (
        <>
          <Field
            label="Correo electrónico"
            hint="Usa un correo al que tengas acceso: ahí recibirás la confirmación y los avisos del evento."
            error={error ?? errors.email}
          >
            {(control) => (
              <input
                {...control}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={320}
                placeholder="nombre@correo.com"
                value={draft.email}
                onChange={(e) => {
                  update({ email: e.target.value });
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void sendCode();
                  }
                }}
                className={inputClass}
              />
            )}
          </Field>
          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={status === "sending" || cooldown > 0}
            className={`${buttonStyles.primary} w-full sm:w-fit`}
          >
            {status === "sending" ? (
              <Spinner />
            ) : (
              <MailIcon className="h-4 w-4" />
            )}
            {status === "sending"
              ? "Enviando…"
              : cooldown > 0
                ? `Podrás enviar otro código en ${minutes}:${seconds}`
                : "Enviar código"}
          </button>
        </>
      ) : (
        <>
          <div>
            <p className="text-white/75">
              Enviamos un código de {OTP_LENGTH} dígitos a{" "}
              <span className="font-medium text-white">{email}</span>.
            </p>
            <p className="mt-1 text-sm text-white/45">
              Puede tardar un minuto. Revisa también tu carpeta de spam.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <OtpInput
              value={code}
              onChange={handleCodeChange}
              invalid={Boolean(error)}
              disabled={status === "verifying"}
              describedBy={error ? otpMessageId : undefined}
            />
            {status === "verifying" && (
              <p className="flex items-center gap-2 text-sm text-white/60">
                <Spinner className="h-3.5 w-3.5" /> Verificando…
              </p>
            )}
            {error && (
              <p id={otpMessageId} className={messageClass(true)}>
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <button
              type="button"
              onClick={() => void sendCode()}
              disabled={cooldown > 0 || status !== "idle"}
              className="font-medium text-lavender hover:underline disabled:cursor-default disabled:text-white/40 disabled:no-underline"
            >
              {cooldown > 0
                ? `Reenviar código en ${minutes}:${seconds}`
                : "Reenviar código"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCodeSent(false);
                setError(null);
              }}
              className="text-white/55 transition-colors hover:text-white"
            >
              Cambiar correo
            </button>
          </div>

          {IS_MOCK_SERVICE && (
            <p className="rounded-none border border-dashed border-white/15 px-4 py-3 text-[13px] text-white/50">
              Modo demo: cualquier código de 6 dígitos funciona; 000000 simula un
              código incorrecto.
            </p>
          )}
        </>
      )}

      <p className="flex items-start gap-3 border-t border-white/10 pt-5 text-[13px] leading-relaxed text-white/45">
        <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
        Verificar tu correo evita inscripciones a nombre de otras personas. No
        compartimos tu correo con terceros sin tu consentimiento.
      </p>
    </div>
  );
}
