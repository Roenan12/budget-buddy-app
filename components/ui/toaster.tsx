"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle
                  className={
                    variant === "success"
                      ? "text-green-500"
                      : "text-destructive-foreground"
                  }
                >
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription
                  className={
                    variant === "success"
                      ? "text-foreground"
                      : "text-destructive-foreground"
                  }
                >
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
