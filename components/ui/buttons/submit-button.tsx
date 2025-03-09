"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/buttons";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  fullWidth?: boolean;
  disabled?: boolean;
  isSubmitting?: boolean;
};

// create a new component which needs to be rendered inside a form in order to use useFormStatus hook
function SubmitButton({
  children,
  pendingLabel,
  fullWidth = false,
  disabled = false,
  isSubmitting = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = pending || isSubmitting;

  return (
    <Button
      type="submit"
      size="lg"
      className="my-auto"
      disabled={isLoading || disabled}
      fullWidth={fullWidth}
    >
      {isLoading ? pendingLabel : children}
    </Button>
  );
}

export { SubmitButton };
