import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ToolNotFound() {
  return (
    <section className="container-shell flex min-h-[65vh] items-center py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="border-border bg-secondary text-muted-foreground mx-auto flex size-12 items-center justify-center rounded-xl border">
          <SearchX className="size-6" aria-hidden="true" />
        </span>
        <p className="text-primary mt-6 font-mono text-xs font-medium tracking-[0.18em] uppercase">
          404 · Tool not found
        </p>
        <h1 className="text-foreground mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          This tool is not available.
        </h1>
        <p className="text-muted-foreground mt-4 text-base leading-7">
          The URL may be incorrect, or the tool may still be on the roadmap.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/#featured-tools">
              <ArrowLeft aria-hidden="true" />
              Browse available tools
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
