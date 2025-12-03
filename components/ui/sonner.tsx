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

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-500" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-300" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "px-4 min-h-12 border border-light-border rounded-md bg-white flex items-center gap-2 min-w-[20em] font-family-roboto text-sm",
          icon: "flex-shrink-0 z-10 relative",
          title: "",
          description: "",
          actionButton: "",
          cancelButton: "",
          closeButton: "",
          error: "",
          success: "",
          warning: "",
          info: "",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
