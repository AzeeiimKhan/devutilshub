import { Laptop, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { toolIconMap } from "@/tools/icon-map";
import type { ToolBadge, ToolMetadata } from "@/types/tool";

const badgeContent: Record<ToolBadge, { label: string; icon: typeof Laptop }> =
  {
    "browser-only": { label: "Browser-only", icon: Laptop },
    "privacy-first": { label: "Privacy-first", icon: ShieldCheck },
    "no-upload": { label: "No upload", icon: ShieldCheck },
  };

interface ToolHeaderProps {
  tool: ToolMetadata;
}

export function ToolHeader({ tool }: ToolHeaderProps) {
  const Icon = toolIconMap[tool.icon];

  return (
    <header className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="max-w-3xl">
        <div className="border-primary/25 bg-primary/10 text-primary mb-5 flex size-12 items-center justify-center rounded-xl border">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-foreground text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl">
          {tool.title}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7 text-pretty sm:text-lg">
          {tool.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 lg:justify-end">
        {tool.badges.map((badge) => {
          const content = badgeContent[badge];
          const BadgeIcon = content.icon;

          return (
            <Badge key={badge} variant="outline" className="px-2.5 py-1">
              <BadgeIcon className="size-3" aria-hidden="true" />
              {content.label}
            </Badge>
          );
        })}
      </div>
    </header>
  );
}
