import { useId, useRef, useState } from "react";
import { FileIcon, UploadIcon } from "../icons.tsx";
import { formatFileSize } from "../../utils/format.ts";
import { Spinner } from "./fields.tsx";
import { labelClass, messageClass } from "./styles.ts";
import { CV_MAX_BYTES } from "./validation.ts";

// No basta con la extension: se revisa la firma del archivo ("%PDF-")
async function checkPdf(file: File) {
  const looksLikePdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!looksLikePdf) return "El archivo debe ser PDF";
  if (file.size === 0) return "El archivo está vacío";
  if (file.size > CV_MAX_BYTES) {
    return `El archivo pesa ${formatFileSize(file.size)}; el máximo es 5 MB`;
  }
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  if (String.fromCharCode(...header) !== "%PDF-") {
    return "El archivo no parece un PDF válido";
  }
  return null;
}

type CvUploadProps = {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
};

export default function CvUpload({ file, onChange, error }: CvUploadProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [dragging, setDragging] = useState(false);

  const message = fileError ?? error;

  const handleFile = async (candidate: File | undefined) => {
    if (!candidate) return;
    setChecking(true);
    const problem = await checkPdf(candidate);
    setChecking(false);
    setFileError(problem);
    if (!problem) onChange(candidate);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className={labelClass}>CV</span>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="application/pdf,.pdf"
        aria-label="CV en PDF"
        aria-invalid={Boolean(message)}
        aria-describedby={message ? messageId : undefined}
        className="peer sr-only"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          // Permite volver a elegir el mismo archivo
          e.target.value = "";
        }}
      />

      {file ? (
        <div className="flex flex-wrap items-center gap-4 rounded-none border border-blue/40 bg-blue/10 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-blue text-navy">
            <FileIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{file.name}</p>
            <p className="text-[13px] text-white/55">PDF · {formatFileSize(file.size)}</p>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm font-medium text-lavender hover:underline"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            // Ignora el paso del cursor sobre el texto interno de la zona
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setDragging(false);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void handleFile(e.dataTransfer.files[0]);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-none border-2 border-dashed px-6 py-10 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue/60 ${
            dragging
              ? "border-blue bg-blue/10"
              : message
                ? "border-danger/50 bg-white/[0.02]"
                : "border-white/15 bg-white/[0.02] hover:border-white/30"
          }`}
        >
          {checking ? (
            <Spinner className="h-6 w-6 text-blue" />
          ) : (
            <UploadIcon className="h-7 w-7 text-blue" />
          )}
          <span className="font-poppins font-semibold text-white">
            Arrastra tu CV aquí o{" "}
            <span className="text-lavender underline underline-offset-4">
              elige un archivo
            </span>
          </span>
          <span className="text-[13px] text-white/45">Solo PDF · Máximo 5 MB</span>
        </label>
      )}

      {message && (
        <p id={messageId} className={messageClass(true)}>
          {message}
        </p>
      )}
    </div>
  );
}
