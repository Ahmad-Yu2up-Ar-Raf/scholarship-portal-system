import { toast } from "sonner"
import { playSound } from "@/lib/sound"
import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form"
import type { AnyFormApi, AnyFormOptions } from "@tanstack/form-core"
import type { FormOptions, FormValidateOrFn, FormAsyncValidateOrFn, AppFieldExtendedReactFormApi } from "@tanstack/react-form"

import { FormInput } from "@/components/ui/fragments/custom-ui/form/form-input"
import { FormSelect } from "@/components/ui/fragments/custom-ui/form/form-select"
import { FormImagesUpload } from "@/components/ui/fragments/custom-ui/form/form-images-upload"

const fieldComponents = {
  Input: FormInput,
  Select: FormSelect,
  ImagesUpload: FormImagesUpload,
} as const

const formComponents = {} as Record<string, never>

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm: useBaseAppForm } = createFormHook({
  fieldComponents,
  formComponents,
  fieldContext,
  formContext,
})

function focusFirstInvalidField(formApi: AnyFormApi) {
  const fieldMeta = (formApi.state as { fieldMeta?: Record<string, { errors?: unknown[] }> }).fieldMeta
  const firstName = Object.keys(fieldMeta ?? {}).find((n) => (fieldMeta?.[n]?.errors?.length ?? 0) > 0)
  const target =
    (firstName ? document.getElementById(firstName) : null) ??
    document.querySelector<HTMLElement>('[aria-invalid="true"]')
  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true })
    target.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

function globalOnSubmitInvalid({ formApi }: { formApi: AnyFormApi }) {
  playSound("error", { volume: 0.8 })
  toast.error("Validasi Gagal", { description: "Periksa kembali isian form yang ditandai merah." })
  requestAnimationFrame(() => focusFirstInvalidField(formApi))
}

type AnyValidators = AnyFormOptions["validators"]

function withGlobalBehaviors<TFormData>(opts: FormOptions<TFormData, any, any, any, any, any, any, any, any, any, any, any>): AnyFormOptions {
  const validators = { ...(opts.validators ?? {}) } as AnyValidators & Record<string, unknown>
  if (validators.onSubmit !== undefined) {
    if (validators.onChange === undefined) validators.onChange = validators.onSubmit
    if (validators.onBlur === undefined) validators.onBlur = validators.onSubmit
  }
  return {
    ...opts,
    validators: validators as AnyValidators,
    onSubmitInvalid: (opts.onSubmitInvalid ?? globalOnSubmitInvalid) as AnyFormOptions["onSubmitInvalid"],
  }
}

export function useAppForm<TFormData, TOnMount extends FormValidateOrFn<TFormData> | undefined = undefined, TOnChange extends FormValidateOrFn<TFormData> | undefined = undefined, TOnChangeAsync extends FormAsyncValidateOrFn<TFormData> | undefined = undefined, TOnBlur extends FormValidateOrFn<TFormData> | undefined = undefined, TOnBlurAsync extends FormAsyncValidateOrFn<TFormData> | undefined = undefined, TOnSubmit extends FormValidateOrFn<TFormData> | undefined = undefined, TOnSubmitAsync extends FormAsyncValidateOrFn<TFormData> | undefined = undefined, TOnDynamic extends FormValidateOrFn<TFormData> | undefined = undefined, TOnDynamicAsync extends FormAsyncValidateOrFn<TFormData> | undefined = undefined, TOnServer extends FormAsyncValidateOrFn<TFormData> | undefined = undefined, TSubmitMeta = never>(
  opts: FormOptions<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>
): AppFieldExtendedReactFormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, typeof fieldComponents, typeof formComponents> {
  return useBaseAppForm(withGlobalBehaviors(opts) as AnyFormOptions) as AppFieldExtendedReactFormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta, typeof fieldComponents, typeof formComponents>
}

export { useFieldContext, useFormContext }
