import { ArrowDownToLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ToolExample } from "@/types/tool";

interface ToolExamplesProps {
  examples: ToolExample[];
  onSelect: (example: ToolExample) => void;
}

export function ToolExamples({ examples, onSelect }: ToolExamplesProps) {
  return (
    <section className="mt-20 sm:mt-24" aria-labelledby="tool-examples-title">
      <div className="max-w-2xl">
        <p className="text-primary font-mono text-xs font-medium tracking-[0.18em] uppercase">
          Examples
        </p>
        <h2
          id="tool-examples-title"
          className="text-foreground mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl"
        >
          Start with a realistic payload.
        </h2>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Choose an example to place it in the input panel. Nothing is sent over
          the network.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {examples.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => onSelect(example)}
            className="group focus-visible:ring-ring focus-visible:ring-offset-background rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Card className="group-hover:border-primary/35 h-full p-5 transition-colors motion-reduce:transition-none">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground font-mono text-xs font-semibold">
                    {example.title}
                  </span>
                  {example.kind ? (
                    <Badge
                      variant="outline"
                      className={
                        example.kind === "valid"
                          ? "border-success/30 bg-success/8 text-success"
                          : "border-error/30 bg-error/8 text-error"
                      }
                    >
                      {example.kind}
                    </Badge>
                  ) : null}
                </div>
                <ArrowDownToLine
                  className="text-muted-foreground group-hover:text-primary size-4 shrink-0"
                  aria-hidden="true"
                />
              </div>
              <p className="text-muted-foreground mt-3 text-xs leading-5">
                {example.description}
              </p>
            </Card>
          </button>
        ))}
      </div>
    </section>
  );
}
