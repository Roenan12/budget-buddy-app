"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CancelButtonProps = {
  href?: string;
  children?: React.ReactNode;
};

function CancelButton({ href, children = "Cancel" }: CancelButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Button asChild size="lg" className="my-auto" variant="outline">
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="my-auto"
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}

export default CancelButton;
