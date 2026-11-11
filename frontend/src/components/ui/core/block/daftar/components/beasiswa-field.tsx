"use client";

import { useStore } from "@tanstack/react-store";
import { useFieldContext } from "@/hooks/use-form";
import { cn } from "@/lib/utils";
import type { BeasiswaOption } from "../types/daftar.types";

interface BeasiswaFieldProps {
  options: BeasiswaOption[];
  isEligible: boolean;
  onOpenPicker: () => void;
}

export function BeasiswaField({
  options,
  isEligible,
  onOpenPicker,
}: BeasiswaFieldProps) {
  const field = useFieldContext<string>();
  const current = options.find((o) => o.value === field.state.value);
  const submissionAttempts = useStore(
    field.form.baseStore,
    (state) => state.submissionAttempts,
  );
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = errors.length > 0 && submissionAttempts > 0;

  return (
    <div className="space-y-2">
      <span
        className={cn("text-sm font-bold block", isInvalid && "text-red-600")}
      >
        Pilihan Beasiswa *
      </span>
      <button
        type="button"
        id={field.name}
        disabled={!isEligible}
        onClick={onOpenPicker}
        aria-invalid={isInvalid}
        className={cn(
          "w-full border-4 border-black bg-white p-3 text-left font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 wrap-break-word",
          isInvalid && "border-red-600 bg-red-50 text-red-900",
          !isInvalid && "hover:border-black",
        )}
      >
        {current ? (
          <span className="flex items-center gap-2">
            <span
              className="h-4 w-4 border-2 border-black shrink-0"
              style={{ backgroundColor: current.color_theme ?? "#ffdc58" }}
            />
            <span className="wrap-break-word">{current.label}</span>
          </span>
        ) : (
          <span
            className={cn("text-muted-foreground", isInvalid && "text-red-700")}
          >
            {isEligible
              ? "Pilih beasiswa — klik untuk cari"
              : "Terkunci — IPK < 3.0"}
          </span>
        )}
      </button>
      {isInvalid && errors[0] ? (
        <p className="text-xs font-black text-red-600 wrap-break-word">
          ⚠{" "}
          {String(
            (errors[0] as unknown as { message?: string })?.message ??
              errors[0],
          )}
        </p>
      ) : null}
    </div>
  );
}
