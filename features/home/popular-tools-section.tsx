import { ArrowRight, Laptop } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { toolIconMap } from "@/tools/icon-map";
import { popularTools } from "@/tools/registry";

export function PopularToolsSection() {
  return (
    <section id="popular-tools" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          className="lg:sticky lg:top-28 lg:self-start"
          eyebrow="Popular"
          title="Quick access to familiar workflows."
          description="A streamlined starting point for the tools developers reach for most often."
        />
        <div>
          <ol className="border-border bg-card overflow-hidden rounded-xl border">
            {popularTools.map((tool, index) => {
              const Icon = toolIconMap[tool.icon];

              return (
                <li
                  key={tool.slug}
                  className="group border-border flex items-center gap-4 border-b p-4 last:border-b-0 sm:p-5"
                >
                  <span className="text-muted-foreground hidden w-7 font-mono text-xs sm:block">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="border-border bg-secondary text-muted-foreground group-hover:text-primary flex size-10 shrink-0 items-center justify-center rounded-lg border">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate font-mono text-sm font-semibold">
                      {tool.title}
                    </h3>
                    <p className="text-muted-foreground mt-1 hidden truncate text-sm sm:block">
                      {tool.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="hidden lg:flex">
                    <Laptop className="size-3" aria-hidden="true" />
                    Local
                  </Badge>
                  <Badge variant="secondary">Soon</Badge>
                  <ArrowRight
                    className="text-muted-foreground/50 hidden size-4 sm:block"
                    aria-hidden="true"
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
