"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { UploadCloud, X, FileText, AlertCircle } from "lucide-react";

import {
  FILE_ACCEPTED_EXT,
  FILE_ACCEPTED_MIME,
  FILE_MAX_BYTES,
  FILE_MAX_COUNT,
} from "@/lib/validations/quote-schema";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  className?: string;
}

/**
 * Editorial drag & drop file uploader.
 *
 * Controlled component — owner keeps the `File[]` state. Validation is
 * client-side for UX (immediate feedback when a file is too big or the
 * wrong type); the `/api/quote` route re-validates against the same
 * constants before any file reaches Resend. This one runs on the
 * browser thread — do not import it from server code.
 */
export function FileUploader({ value, onChange, className }: FileUploaderProps) {
  const t = useTranslations("quote.fileUploader");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [rejections, setRejections] = useState<
    Array<{ name: string; reason: "type" | "size" | "count" }>
  >([]);

  const remaining = Math.max(0, FILE_MAX_COUNT - value.length);

  function addFiles(incoming: File[]) {
    const rejected: typeof rejections = [];
    const accepted: File[] = [];
    const bySignature = new Set(
      value.map((f) => `${f.name}__${f.size}__${f.lastModified}`),
    );

    for (const file of incoming) {
      if (accepted.length + value.length >= FILE_MAX_COUNT) {
        rejected.push({ name: file.name, reason: "count" });
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const mimeOk = FILE_ACCEPTED_MIME.has(file.type) || file.type === "";
      const extOk = FILE_ACCEPTED_EXT.has(ext);
      if (!mimeOk || !extOk) {
        rejected.push({ name: file.name, reason: "type" });
        continue;
      }
      if (file.size > FILE_MAX_BYTES) {
        rejected.push({ name: file.name, reason: "size" });
        continue;
      }
      const key = `${file.name}__${file.size}__${file.lastModified}`;
      if (bySignature.has(key)) continue;
      bySignature.add(key);
      accepted.push(file);
    }

    if (accepted.length > 0) onChange([...value, ...accepted]);
    setRejections(rejected);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
    // Clear so the same file can be re-selected after removal
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(false);
    if (!e.dataTransfer.files) return;
    addFiles(Array.from(e.dataTransfer.files));
  }

  function onDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(true);
  }

  function onDragLeave() {
    setDragActive(false);
  }

  function removeFile(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label
        htmlFor="quote-file-input"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-6 py-10 text-center transition-colors",
          dragActive
            ? "border-gold bg-bone/40"
            : "border-ink/20 hover:border-ink/40 hover:bg-bone/20",
          remaining === 0 && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          ref={inputRef}
          id="quote-file-input"
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp,.ai,.eps,application/pdf,image/png,image/jpeg,image/webp,application/postscript,application/illustrator"
          onChange={onInputChange}
          disabled={remaining === 0}
          className="sr-only"
        />
        <UploadCloud
          className={cn(
            "size-6 transition-colors",
            dragActive ? "text-gold" : "text-stone",
          )}
          strokeWidth={1.5}
          aria-hidden
        />
        <p className="font-display text-h4 text-ink">
          {remaining === 0 ? t("maxReached") : t("dropzoneHeading")}
        </p>
        <p className="max-w-md text-pretty text-body-sm text-stone">
          {t("dropzoneHint")}
        </p>
        <p className="font-mono text-caption uppercase text-stone">
          {t("counter", {
            current: String(value.length),
            max: String(FILE_MAX_COUNT),
          })}
        </p>
      </label>

      {rejections.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {rejections.map((r, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-body-sm text-destructive"
            >
              <AlertCircle
                aria-hidden
                className="mt-0.5 size-4 shrink-0"
                strokeWidth={1.5}
              />
              <span className="text-pretty">
                <strong className="font-medium">{r.name}</strong>
                {" — "}
                {t(`rejection.${r.reason}`)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {value.length > 0 ? (
        <ul className="flex flex-col">
          {value.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-4 border-t border-ink/10 py-3 last:border-b"
            >
              <FileText
                aria-hidden
                className="size-5 shrink-0 text-stone"
                strokeWidth={1.5}
              />
              <div className="flex flex-1 flex-col gap-0.5 truncate">
                <span className="truncate text-body-sm text-ink">
                  {file.name}
                </span>
                <span className="font-mono text-caption uppercase text-stone">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={t("remove")}
                className="inline-flex size-9 items-center justify-center text-stone transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
