import { ArrowDown, LockKeyhole, Sparkles } from "lucide-react";

import { SearchField } from "@/components/shared/search-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/metadata/site";

export function HeroSection() {
  return (
    <section
      className="border-border relative overflow-hidden border-b"
      aria-labelledby="hero-title"
    >
      <div className="container-shell py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6" variant="outline">
            <Sparkles className="text-primary size-3" aria-hidden="true" />
            Developer utilities, refined
          </Badge>
          <h1
            id="hero-title"
            className="text-foreground text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl lg:leading-[1.08]"
          >
            Developer tools that never leave your browser.
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
            {siteConfig.description} No uploads, no accounts, and no waiting on
            a remote server.
          </p>

          <div className="mx-auto mt-9 max-w-2xl">
            <SearchField id="tool-search" />
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#featured-tools">
                Browse tools
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
            <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
              <LockKeyhole className="text-primary size-4" aria-hidden="true" />
              Your data stays on your device
            </span>
          </div>
        </div>

        <div className="divide-border border-border bg-card/50 mx-auto mt-16 grid max-w-3xl grid-cols-1 divide-y rounded-xl border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["0", "required uploads"],
            ["100%", "browser-based"],
            ["Always", "privacy-first"],
          ].map(([value, label]) => (
            <div key={label} className="px-5 py-4 text-center">
              <p className="text-foreground font-mono text-sm font-semibold">
                {value}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
