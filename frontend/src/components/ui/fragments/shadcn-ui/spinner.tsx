import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

function Spinner({ className, ...props }: Omit<React.ComponentProps<"svg">, "width" | "height"> & { width?: number; height?: number }) {
  return (
    <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...(props as unknown as Record<string, unknown>)} />
  )
}

export { Spinner }
