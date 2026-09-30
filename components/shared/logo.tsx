import Link from "next/link";
import { Braces } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-md text-sm font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      aria-label="DevUtilsHub home"
    >
      <span className="border-primary/25 bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg border">
        <Braces className="size-4" aria-hidden="true" />
      </span>
      <span>DevUtilsHub</span>
    </Link>
  );
}
