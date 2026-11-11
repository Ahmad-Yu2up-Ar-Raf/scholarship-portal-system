"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  DocumentAttachmentIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export type ImageItem = File | string

interface MediaDropzoneProps {
  items: ImageItem[]
  onChange: (items: ImageItem[]) => void
  multiple?: boolean
  maxFiles?: number
  isInvalid?: boolean
  disabled?: boolean
  accept?: string
  acceptedTypes?: string[]
  /** Overrides the helper line under the dropzone. */
  helperText?: string
  /** Per-field size cap in bytes (defaults to 5MB document cap). */
  maxBytes?: number
}

const DEFAULT_ACCEPTED_TYPES = ["application/pdf", "application/zip", "application/x-zip-compressed", "image/jpeg", "image/jpg", "image/png", "image/webp"]
const DEFAULT_ACCEPTED_EXTS = [".pdf", ".zip", ".jpg", ".jpeg", ".png", ".webp"]
const MAX_BYTES = 5 * 1024 * 1024

const itemKey = (item: ImageItem, index: number): string =>
  typeof item === "string"
    ? `u-${item}`
    : `f-${item.name}-${item.size}-${item.lastModified}-${index}`

const itemMatches = (a: ImageItem, b: ImageItem): boolean =>
  a === b || (typeof a !== "string" && typeof b !== "string" && a === b)

function isAcceptedFile(file: File, acceptedTypes: string[], acceptedExts: string[]): boolean {
  if (acceptedTypes.includes(file.type)) return true
  const ext = "." + file.name.split(".").pop()?.toLowerCase()
  return acceptedExts.includes(ext)
}

const previewUrls = new WeakMap<File, string>()

function previewFor(file: File): string {
  let url = previewUrls.get(file)
  if (!url) {
    url = URL.createObjectURL(file)
    previewUrls.set(file, url)
  }
  return url
}

function revokePreview(file: File): void {
  const url = previewUrls.get(file)
  if (url) {
    URL.revokeObjectURL(url)
    previewUrls.delete(file)
  }
}

const isImageFile = (file: File) => file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name)

const Tile = function Tile({
  item,
  isInvalid,
  onRemove,
}: {
  item: ImageItem
  isInvalid: boolean
  onRemove: (item: ImageItem) => void
}) {
  const isFile = typeof item !== "string"
  const name = isFile ? item.name : item.split("/").pop() ?? item
  const size = isFile ? `${(item.size / 1024).toFixed(1)} KB` : ""
  const ext = name.split(".").pop()?.toUpperCase() ?? "FILE"
  const isImg = isFile && isImageFile(item as File)

  return (
    <div
      className={cn(
        "group relative flex w-full items-center gap-3 border-4 border-black bg-white p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        isInvalid ? "border-red-600 bg-red-50" : "border-black",
      )}
    >
      {isImg && isFile ? (
        <img src={previewFor(item as File)} alt={name} className="h-12 w-12 shrink-0 border-2 border-black object-cover shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <HugeiconsIcon icon={DocumentAttachmentIcon} className="size-6 text-black" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-head text-sm font-black truncate pr-8">{name}</div>
        <div className="flex gap-2 text-xs font-bold">
          <span className="border border-black bg-black text-white px-1.5 py-0.5">{ext}</span>
          {size && <span className="text-muted-foreground">{size}</span>}
          <span className="hidden sm:inline text-muted-foreground">• Siap diunggah</span>
        </div>
      </div>
      <Button
        type="button"
        aria-label="Hapus berkas"
        onClick={() => onRemove(item)}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-none border-2 border-black bg-red-500 p-0 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-white" />
      </Button>
    </div>
  )
}

export function MediaDropzone({
  items,
  onChange,
  multiple = false,
  maxFiles = 8,
  isInvalid = false,
  disabled = false,
  accept,
  acceptedTypes,
  helperText,
  maxBytes,
}: MediaDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const types = acceptedTypes ?? DEFAULT_ACCEPTED_TYPES
  // ponytail: `accept="image/*"` yields zero dot-exts — fall back to defaults
  // so extension matching never silently degrades to MIME-only.
  const dotExts = accept ? accept.split(",").map((s) => s.trim().toLowerCase()).filter((s) => s.startsWith(".")) : DEFAULT_ACCEPTED_EXTS
  const exts = dotExts.length > 0 ? dotExts : DEFAULT_ACCEPTED_EXTS
  const effectiveAccept = accept ?? DEFAULT_ACCEPTED_TYPES.join(",") + "," + DEFAULT_ACCEPTED_EXTS.join(",")
  const limit = maxBytes ?? MAX_BYTES
  const defaultHelper = "Hanya PDF atau ZIP — maks 5MB per file • Pastikan transkrip/sertifikat jelas terbaca"

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const accepted: File[] = []
      for (const file of Array.from(incoming)) {
        if (!isAcceptedFile(file, types, exts) || file.size > limit) continue
        if (
          items.some(
            (it) =>
              it !== file &&
              it instanceof File &&
              it.name === file.name &&
              it.size === file.size
          )
        )
          continue
        accepted.push(file)
        if (!multiple) break
      }
      if (accepted.length === 0) return

      const next = multiple
        ? [...items, ...accepted].slice(0, maxFiles)
        : [accepted[accepted.length - 1]]
      onChange(next)
    },
    [items, multiple, maxFiles, onChange, types, exts, limit]
  )

  const handleRemove = useCallback(
    (target: ImageItem) => {
      if (target instanceof File) revokePreview(target)
      onChange(items.filter((it) => !itemMatches(it, target)))
    },
    [items, onChange]
  )

  // Revoke object URLs on unmount so re-selected files never serve stale blobs.
  const itemsRef = useRef(items)
  itemsRef.current = items
  useEffect(() => () => {
    for (const it of itemsRef.current) {
      if (it instanceof File) revokePreview(it)
    }
  }, [])

  const atLimit = items.length >= (multiple ? maxFiles : 1)

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {items.length > 0 && (
        <div className={cn("grid gap-3", multiple ? "grid-cols-1" : "grid-cols-1")}>
          {items.map((item, index) => (
            <Tile
              key={itemKey(item, index)}
              item={item}
              isInvalid={isInvalid}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {!atLimit && (
        <div
          data-drag-active={isDragActive || undefined}
          aria-invalid={isInvalid || undefined}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragActive(true)
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragActive(false)
            if (!disabled) addFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 border-4 border-black p-4 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all",
            isDragActive && "bg-primary border-black",
            isInvalid && "border-red-600 bg-red-50",
            !isDragActive && !isInvalid && "bg-white hover:bg-muted"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={effectiveAccept}
            multiple={multiple}
            aria-label="Unggah berkas"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files)
              e.target.value = ""
            }}
          />
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <HugeiconsIcon
              icon={Upload01Icon}
              className={cn("size-5", isInvalid ? "text-red-600" : "text-black")}
            />
          </div>
          <p className={cn("font-head text-sm font-black", isInvalid ? "text-red-600" : "text-foreground")}>
            {isDragActive ? "Lepaskan berkas di sini" : "Letakkan berkas di sini, atau klik untuk memilih"}
          </p>
          <p className={cn("text-xs font-bold", isInvalid ? "text-red-600" : "text-muted-foreground")}>
            {helperText ?? defaultHelper}
          </p>
        </div>
      )}
    </div>
  )
}
