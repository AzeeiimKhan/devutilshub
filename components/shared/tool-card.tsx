import { ArrowUpRight, Laptop } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toolIconMap } from "@/tools/icon-map";
import type { ToolMetadata } from "@/types/tool";

interface ToolCardProps {
  tool: ToolMetadata;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = toolIconMap[tool.icon];

  return (
    <Card
      id={`tool-${tool.slug}`}
      tabIndex={-1}
      className="group hover:border-primary/35 focus-visible:ring-ring relative h-full overflow-hidden transition-colors duration-200 outline-none focus-visible:ring-2 motion-reduce:transition-none"
    >
      <CardHeader className="h-full gap-5">
        <div className="flex items-start justify-between gap-4">
          <span className="border-border bg-secondary text-muted-foreground group-hover:border-primary/25 group-hover:text-primary flex size-10 items-center justify-center rounded-lg border transition-colors">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <ArrowUpRight
            className="text-muted-foreground/50 size-4"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="font-mono text-base">{tool.title}</CardTitle>
          <CardDescription className="leading-6">
            {tool.description}
          </CardDescription>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="secondary">Coming soon</Badge>
          {tool.browserOnly ? (
            <Badge variant="outline">
              <Laptop className="size-3" aria-hidden="true" />
              Browser-only
            </Badge>
          ) : null}
        </div>
      </CardHeader>
    </Card>
  );
}
