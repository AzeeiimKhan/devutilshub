import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ToolWorkspaceProps {
  toolbar: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ToolWorkspace({
  toolbar,
  children,
  className,
}: ToolWorkspaceProps) {
  return (
    <section
      id="tool-workspace"
      aria-label="Tool workspace"
      className={cn(
        "border-border bg-card mt-10 scroll-mt-24 overflow-hidden rounded-xl border shadow-2xl shadow-black/10",
        className,
      )}
    >
      {toolbar}
      <div className="lg:divide-border grid lg:grid-cols-2 lg:divide-x">
        {children}
      </div>
    </section>
  );
}

interface ToolToolbarProps {
  children: ReactNode;
}

export function ToolToolbar({ children }: ToolToolbarProps) {
  return (
    <div className="border-border bg-secondary/45 border-b px-3 py-3 sm:px-4">
      <div className="overflow-x-auto pb-1 sm:pb-0">
        <div className="flex min-w-max items-center gap-2">{children}</div>
      </div>
    </div>
  );
}

interface ToolPanelProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ToolPanel({
  title,
  description,
  children,
  footer,
  actions,
  className,
}: ToolPanelProps) {
  return (
    <section className={cn("flex min-w-0 flex-col", className)}>
      <div className="border-border flex min-h-16 items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-foreground font-mono text-sm font-semibold">
            {title}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
        </div>
        {actions}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
      <div className="border-border bg-secondary/25 text-muted-foreground flex min-h-10 items-center border-t px-4 py-2 font-mono text-[11px] sm:px-5">
        {footer}
      </div>
    </section>
  );
}
