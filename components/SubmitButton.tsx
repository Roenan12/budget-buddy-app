"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  fullWidth?: boolean;
};

// create a new component which needs to be rendered inside a form in order to use useFormStatus hook
function SubmitButton({
  children,
  pendingLabel,
  fullWidth = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className="my-auto"
      disabled={pending}
      fullWidth={fullWidth}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}

export default SubmitButton;
