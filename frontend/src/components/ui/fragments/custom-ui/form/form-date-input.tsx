"use client"

import { useState } from "react"
import { useStore } from "@tanstack/react-store"
import { format, isValid, parse, startOfToday } from "date-fns"
import { id } from "date-fns/locale"
import { Popover } from "@base-ui/react/popover"
import { useFieldContext } from "@/hooks/use-form"
import { Calendar } from "@/components/ui/calendar"
import { FormBase, type FormControlProps } from "./form-base"
import { cn } from "@/lib/utils"

function parseValue(value: string | null | undefined): Date | undefined {
  if (!value) return undefined
  const d = parse(value, "yyyy-MM-dd", new Date())
  if (isValid(d)) return d
  const iso = new Date(value)
  return isValid(iso) ? iso : undefined
}

/**
 * FormDateInput — brutalist date picker. Stores `yyyy-MM-dd`.
 * Max selectable date is yesterday: today and all future dates are disabled
 * (matches server `BeasiswaRequest` rule `date|before:today`).
 */
export function FormDateInput(props: FormControlProps & { disabled?: boolean }) {
  const field = useFieldContext<string | null>()
  const [open, setOpen] = useState(false)

  const isSubmitting = useStore(field.form.baseStore, (s) => s.isSubmitting)
  const submissionAttempts = useStore(field.form.baseStore, (s) => s.submissionAttempts)
  const errors = useStore(field.store, (s) => s.meta.errors)
  const value = useStore(field.store, (s) => s.value)

  const hasErrors = errors.length > 0
  const hasValue = value !== undefined && value !== null && value !== ""
  const isInvalid = hasErrors && submissionAttempts > 0
  const isDisabled = props.disabled || isSubmitting
  const dateValue = parseValue(value)

  const handleSelect = (date: Date | undefined) => {
    field.handleChange(date ? format(date, "yyyy-MM-dd") : null)
    field.handleBlur()
    setOpen(false)
  }

  return (
    <FormBase {...props}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          id={field.name}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          className={cn(
            "flex h-12 w-full items-center justify-between gap-2 border-4 border-black bg-white px-3 text-sm font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none transition-all outline-none",
            "hover:bg-yellow-50 focus-visible:bg-yellow-50 disabled:pointer-events-none disabled:opacity-50",
            !hasValue && !isInvalid && "text-muted-foreground",
            hasValue && !isInvalid && "text-foreground",
            isInvalid && "border-red-600 bg-red-50 text-red-900",
          )}
        >
          <span className="truncate">
            {dateValue ? format(dateValue, "dd MMMM yyyy", { locale: id }) : (props.placeholder ?? "Pilih tanggal")}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <rect x="3" y="5" width="18" height="16" fill="#ffdc58" stroke="#000" strokeWidth="2" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="#000" strokeWidth="2" />
          </svg>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup className="border-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none outline-none">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={handleSelect}
                defaultMonth={dateValue ?? new Date(new Date().getFullYear() - 20, 0, 1)}
                disabled={(date) => date >= startOfToday()}
              />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </FormBase>
  )
}
