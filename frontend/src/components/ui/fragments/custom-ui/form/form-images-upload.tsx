"use client"

import { useStore } from "@tanstack/react-store"
import { useFieldContext } from "@/hooks/use-form"
import { FormBase, type FormControlProps } from "./form-base"
import { MediaDropzone } from "./media-dropzone"

interface FormImagesUploadProps extends Omit<
  FormControlProps,
  "type" | "maxLength" | "inputMode" | "placeholder" | "LeftIcon"
> {
  maxFiles?: number
  disabled?: boolean
  accept?: string
  acceptedTypes?: string[]
  helperText?: string
  maxBytes?: number
}

/**
 * FormImagesUpload — multi-file gallery field. Holds canonical stored
 * URLs (existing assets) and/or raw `File`s (pending uploads; resolved to
 * URLs during form submit).
 */
export function FormImagesUpload({
  maxFiles = 8,
  disabled,
  accept,
  acceptedTypes,
  helperText,
  maxBytes,
  ...props
}: FormImagesUploadProps) {
  const field = useFieldContext<Array<string | File>>()

  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting
  )
  const submissionAttempts = useStore(
    field.form.baseStore,
    (state) => state.submissionAttempts
  )
  const errors = useStore(field.store, (state) => state.meta.errors)
  const value = useStore(field.store, (state) => state.value) ?? []

  const isInvalid = errors.length > 0 && submissionAttempts > 0
  const isDisabled = isSubmitting || !!disabled

  return (
    <FormBase {...props}>
      <MediaDropzone
        items={value}
        onChange={(items) => {
          field.handleChange(items)
          field.handleBlur()
        }}
        multiple={maxFiles > 1}
        maxFiles={maxFiles}
        isInvalid={isInvalid}
        disabled={isDisabled}
        accept={accept}
        acceptedTypes={acceptedTypes}
        helperText={helperText}
        maxBytes={maxBytes}
      />
    </FormBase>
  )
}
