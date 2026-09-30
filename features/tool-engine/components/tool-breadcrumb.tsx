import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface ToolBreadcrumbProps {
  toolTitle: string;
}

export function ToolBreadcrumb({ toolTitle }: ToolBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
        <li>
          <Link
            href="/"
            className="hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-sm transition-colors outline-none focus-visible:ring-2 motion-reduce:transition-none"
          >
            <Home className="size-3.5" aria-hidden="true" />
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3" />
        </li>
        <li>
          <Link
            href="/#featured-tools"
            className="hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors outline-none focus-visible:ring-2 motion-reduce:transition-none"
          >
            Tools
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3" />
        </li>
        <li className="text-foreground truncate" aria-current="page">
          {toolTitle}
        </li>
      </ol>
    </nav>
  );
}
