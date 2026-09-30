import Link from "next/link";
import { ArrowUpRight, Plus, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toolIconMap } from "@/tools/icon-map";
import { getToolBySlug } from "@/tools/registry";
import type { ToolCommonMistake, ToolFaqItem } from "@/types/tool";

export function ToolCommonMistakes({
  mistakes,
}: {
  mistakes: ToolCommonMistake[];
}) {
  return (
    <section className="mt-20 sm:mt-24" aria-labelledby="common-mistakes-title">
      <div className="flex items-center gap-3">
        <span className="border-warning/25 bg-warning/10 text-warning flex size-9 items-center justify-center rounded-lg border">
          <TriangleAlert className="size-4" aria-hidden="true" />
        </span>
        <h2
          id="common-mistakes-title"
          className="text-foreground text-2xl font-semibold tracking-[-0.025em]"
        >
          Common JSON mistakes
        </h2>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mistakes.map((mistake) => (
          <Card key={mistake.title} className="p-5">
            <h3 className="text-foreground font-mono text-sm font-semibold">
              {mistake.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {mistake.description}
            </p>
            {mistake.example ? (
              <code className="border-border bg-background text-muted-foreground mt-4 block overflow-x-auto rounded-md border p-3 font-mono text-xs">
                {mistake.example}
              </code>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}

export function RelatedTools({ slugs }: { slugs: string[] }) {
  const relatedTools = slugs
    .map((slug) => getToolBySlug(slug))
    .filter((tool) => tool !== undefined);

  return (
    <section className="mt-20 sm:mt-24" aria-labelledby="related-tools-title">
      <p className="text-primary font-mono text-xs font-medium tracking-[0.18em] uppercase">
        Continue working
      </p>
      <h2
        id="related-tools-title"
        className="text-foreground mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl"
      >
        Related tools
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {relatedTools.map((tool) => {
          const Icon = toolIconMap[tool.icon];
          const content = (
            <Card className="group hover:border-primary/35 h-full p-5 transition-colors motion-reduce:transition-none">
              <div className="flex items-start justify-between gap-4">
                <span className="border-border bg-secondary text-muted-foreground group-hover:text-primary flex size-9 items-center justify-center rounded-lg border">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {tool.availability === "available" ? (
                  <ArrowUpRight
                    className="text-muted-foreground size-4"
                    aria-hidden="true"
                  />
                ) : (
                  <Badge variant="secondary">Coming soon</Badge>
                )}
              </div>
              <h3 className="text-foreground mt-5 font-mono text-sm font-semibold">
                {tool.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {tool.description}
              </p>
            </Card>
          );

          return tool.availability === "available" ? (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="focus-visible:ring-ring focus-visible:ring-offset-background rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {content}
            </Link>
          ) : (
            <div key={tool.slug}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}

export function ToolFAQ({ items }: { items: ToolFaqItem[] }) {
  return (
    <section className="mt-20 sm:mt-24" aria-labelledby="tool-faq-title">
      <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <p className="text-primary font-mono text-xs font-medium tracking-[0.18em] uppercase">
            FAQ
          </p>
          <h2
            id="tool-faq-title"
            className="text-foreground mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl"
          >
            About JSON formatting
          </h2>
        </div>
        <div className="divide-border border-border divide-y border-y">
          {items.map((item) => (
            <details key={item.question} className="group">
              <summary className="text-foreground hover:text-primary focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium outline-none focus-visible:ring-2 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <Plus
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <p className="text-muted-foreground max-w-2xl pb-5 text-sm leading-6">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
