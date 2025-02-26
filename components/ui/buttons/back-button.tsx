"use client";

import Link from "next/link";
import { Button } from "@/components/ui/buttons";
import { ChevronLeftIcon } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
}

function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className="hover:bg-gray-100 dark:hover:bg-gray-800 mb-4"
    >
      <Link href={href} className="flex items-center gap-1">
        <ChevronLeftIcon className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}

export { BackButton };
