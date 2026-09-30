import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { categories } from "@/metadata/categories";
import { toolIconMap } from "@/tools/icon-map";
import { tools } from "@/tools/registry";

export function CategoriesSection() {
  return (
    <section
      id="categories"
      className="border-border bg-card/30 scroll-mt-24 border-y py-20 sm:py-24"
    >
      <div className="container-shell">
        <SectionHeading
          eyebrow="Categories"
          title="A growing toolkit for everyday development."
          description="Start with the workflows you use most. Every category is built around local, browser-based processing."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = toolIconMap[category.icon];
            const toolCount = tools.filter(
              (tool) => tool.category === category.id,
            ).length;

            return (
              <Card
                id={`category-${category.id}`}
                key={category.id}
                className="group hover:border-primary/35 scroll-mt-24 p-6 transition-colors motion-reduce:transition-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="border-border bg-secondary text-muted-foreground group-hover:text-primary flex size-10 items-center justify-center rounded-lg border">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    className="text-muted-foreground/50 size-4"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-foreground mt-6 font-mono text-sm font-semibold">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {category.description}
                </p>
                <p className="text-muted-foreground mt-5 font-mono text-[11px] tracking-wide uppercase">
                  {toolCount > 0
                    ? `${toolCount} tool${toolCount === 1 ? "" : "s"} planned`
                    : "Tools planned"}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
