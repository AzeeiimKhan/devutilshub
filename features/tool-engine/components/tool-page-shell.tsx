import type { ReactNode } from "react";

import { ToolBreadcrumb } from "@/features/tool-engine/components/tool-breadcrumb";
import { ToolHeader } from "@/features/tool-engine/components/tool-header";
import type { ToolMetadata } from "@/types/tool";

interface ToolPageShellProps {
  tool: ToolMetadata;
  children: ReactNode;
}

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  return (
    <article className="pb-20 sm:pb-24">
      <div className="container-shell pt-8 sm:pt-10">
        <ToolBreadcrumb toolTitle={tool.title} />
        <ToolHeader tool={tool} />
      </div>
      {children}
    </article>
  );
}
