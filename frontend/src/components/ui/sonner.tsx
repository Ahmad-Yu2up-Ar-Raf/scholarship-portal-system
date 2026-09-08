"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group/toast relative flex w-auto max-w-[min(90vw,480px)] items-start gap-3 rounded-none border-4 border-black bg-white p-4 font-sans text-black opacity-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
          content: "flex min-w-0 flex-col gap-1 opacity-100",
          title: "font-head text-sm font-black text-black opacity-100 break-words",
          description: "text-sm font-bold text-black opacity-100 break-words whitespace-normal",
          icon: "shrink-0 text-black opacity-100",
          actionButton:
            "ms-auto h-fit min-w-fit shrink-0 rounded-none border-2 border-black bg-primary px-3 py-1.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
          cancelButton:
            "ms-auto h-fit min-w-fit shrink-0 rounded-none border-2 border-black bg-white px-3 py-1.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
          closeButton:
            "absolute -top-2 -right-2 rounded-none border-2 border-black bg-red-500 p-1 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600",
          success: "bg-primary border-black [&_[data-icon]]:text-black",
          warning: "bg-primary border-black [&_[data-icon]]:text-black",
          error: "bg-white border-black [&_[data-icon]]:text-red-600",
          info: "bg-white border-black [&_[data-icon]]:text-black",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
