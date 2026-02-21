"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      richColors
      toastOptions={{
        classNames: {
          toast: "border-0 text-white shadow-none",
          success: "bg-emerald-600 text-white",
          error: "bg-red-600 text-white",
          info: "bg-blue-600 text-white",
          warning: "bg-amber-500 text-white",
        },
      }}
      {...props}
    />
  );
}
