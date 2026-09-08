"use client"

import React, { useState } from "react"
import { useStore } from "@tanstack/react-store"
import { useFieldContext } from "@/hooks/use-form"
import { Input } from "@/components/ui/input"
import { FormBase, type FormControlProps } from "./form-base"
import { cn } from "@/lib/utils"

export function FormInput(props: FormControlProps & { disabled?: boolean }) {
  const field = useFieldContext<string | number | null>()
  const [isFocused, setIsFocused] = useState(false)

  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting
  )
  const submissionAttempts = useStore(
    field.form.baseStore,
    (state) => state.submissionAttempts
  )

  const errors = useStore(field.store, (state) => state.meta.errors)
  const value = useStore(field.store, (state) => state.value)

  // 1. LOGIKA VALIDASI (FIXED: null & undefined dihitung sebagai KOSONG)
  const hasErrors = errors.length > 0
  const hasValue = value !== undefined && value !== null && value !== ""

  const isInvalid = hasErrors && submissionAttempts > 0
  const isValid = hasValue && !hasErrors

  const isDisabled = (props as { disabled?: boolean }).disabled || isSubmitting
  // 2. THEMING SYSTEM - FIXED CONTRAST: dark text on bright bg
  const defaultInputColor = props.inputClassName || "text-foreground"
  const focusClass = props.isFocusClassName || "border-primary bg-primary/5 text-foreground"
  const validClass = props.isValidClassName || "border-primary bg-primary/5 text-foreground"
  const invalidClass =
    props.isInvalidClassName ||
    "border-red-600 bg-red-50 text-red-900 focus-visible:text-red-900 focus-visible:placeholder:text-red-700"

  // 3. PRIORITAS VISUAL
  let containerStateClass = "border-border "

  if (isInvalid) {
    containerStateClass = invalidClass
  } else if (isValid) {
    containerStateClass = validClass
  } else if (isFocused) {
    containerStateClass = focusClass
  }

  // 4. INTERCEPTOR ONCHANGE (FIXED: Kembalikan null saat input dibersihkan)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value

    if (props.inputMode === "numeric") {
      val = val.replace(/[^0-9]/g, "")
    }

    if (props.type === "number") {
      field.handleChange(
        (val === "" ? null : Number(val)) as string | number | null
      )
    } else {
      field.handleChange(val === "" ? null : val)
    }

    field.handleBlur()
  }

  return (
    <FormBase {...props}>
      <div
        className={cn(
          "relative flex h-12 w-full items-center overflow-hidden rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out",
          containerStateClass,
          isDisabled && "pointer-events-none opacity-50",
          props.className
        )}
      >
        <Input
          id={field.name}
          name={field.name}
          value={value ?? ""}
          inputMode={props.inputMode}
          maxLength={props.maxLength}
          min={props.min}
          max={props.max}
          placeholder={props.placeholder}
          type={props.type}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            field.handleBlur()
          }}
          className={cn(
            "right-0 h-full border-0 bg-transparent px-3 text-sm shadow-none transition-colors focus-visible:ring-0 text-foreground placeholder:text-muted-foreground",
            isInvalid &&
              "text-red-900 placeholder:text-red-700 focus-visible:text-red-900",
            isValid && "font-medium text-foreground",
            !isInvalid && !isValid && defaultInputColor
          )}
        />
      </div>
    </FormBase>
  )
}
