"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toolIconMap } from "@/tools/icon-map";
import { tools } from "@/tools/registry";

interface SearchFieldProps {
  variant?: "default" | "compact";
  className?: string;
  id?: string;
}

export function SearchField({
  variant = "default",
  className,
  id,
}: SearchFieldProps) {
  const generatedId = useId();
  const inputId = id ?? `tool-search-${generatedId}`;
  const resultsId = `${inputId}-results`;
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return [];

    return tools.filter((tool) =>
      [tool.title, tool.description, tool.category, ...tool.keywords]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  function selectTool(slug: string, title: string) {
    setQuery(title);
    setIsOpen(false);
    const card = document.getElementById(`tool-${slug}`);
    card?.scrollIntoView({ behavior: "smooth", block: "center" });
    card?.focus({ preventScroll: true });
  }

  const showResults = isOpen && query.trim().length > 0;

  return (
    <div
      className={cn("relative w-full", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Search developer tools
      </label>
      <Search
        className={cn(
          "text-muted-foreground pointer-events-none absolute top-1/2 z-10 -translate-y-1/2",
          variant === "compact" ? "left-3 size-4" : "left-4 size-5",
        )}
        aria-hidden="true"
      />
      <Input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        placeholder={
          variant === "compact" ? "Search tools" : "Search developer tools..."
        }
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showResults}
        aria-controls={resultsId}
        className={cn(
          "bg-card relative",
          variant === "compact"
            ? "h-9 pl-9 text-xs"
            : "h-14 rounded-xl pr-14 pl-12 text-base shadow-lg shadow-black/10",
        )}
      />
      {variant === "default" ? (
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1 font-mono text-[10px] tracking-wide uppercase">
          Local
        </span>
      ) : null}

      {showResults ? (
        <div
          id={resultsId}
          className="border-border bg-popover text-popover-foreground absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border p-1.5 shadow-2xl shadow-black/25"
        >
          {results.length > 0 ? (
            <ul aria-label="Matching tools">
              {results.map((tool) => {
                const Icon = toolIconMap[tool.icon];

                return (
                  <li key={tool.slug}>
                    <button
                      type="button"
                      onClick={() => selectTool(tool.slug, tool.title)}
                      className="hover:bg-accent focus-visible:bg-accent focus-visible:ring-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left outline-none focus-visible:ring-2"
                    >
                      <Icon
                        className="text-primary size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="text-foreground block truncate font-mono text-xs font-medium">
                          {tool.title}
                        </span>
                        <span className="text-muted-foreground block truncate text-xs">
                          Coming soon
                        </span>
                      </span>
                      <ArrowRight
                        className="text-muted-foreground size-3.5"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground px-3 py-4 text-center text-sm">
              No tools match “{query}”.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
