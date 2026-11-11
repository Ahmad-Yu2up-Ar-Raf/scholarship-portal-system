"use client";

import { useStore } from "@tanstack/react-store";
import { useFieldContext } from "@/hooks/use-form";
import { cn } from "@/lib/utils";

export function CatatanField() {
  const field = useFieldContext<string>();
  const val = field.state.value ?? "";
  const submissionAttempts = useStore(
    field.form.baseStore,
    (state) => state.submissionAttempts,
  );
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isInvalid = errors.length > 0 && submissionAttempts > 0;

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.name}
        className={cn(
          "font-head text-sm font-black uppercase block",
          isInvalid && "text-red-600",
        )}
      >
        Catatan / Alasan Layak *
      </label>
      <textarea
        id={field.name}
        value={val}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder="Ceritakan prestasimu dan kenapa layak menerima beasiswa ini (min 20 karakter)..."
        rows={4}
        aria-invalid={isInvalid}
        className={cn(
          "w-full border-4 border-black bg-white p-4 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none outline-none focus:bg-yellow-50 wrap-break-word",
          isInvalid &&
            "border-red-600 bg-red-50 text-red-900 placeholder:text-red-700 focus-visible:text-red-900",
        )}
      />
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
