import { GitFork, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { SearchField } from "@/components/shared/search-field";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/metadata/site";

export function Navbar() {
  return (
    <header className="border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container-shell flex h-16 items-center gap-4">
        <Logo className="shrink-0" />

        <nav
          className="ml-auto hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          <div className="mr-2 hidden w-56 lg:block">
            <SearchField variant="compact" id="navbar-tool-search" />
          </div>
          {siteConfig.navigation.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
          <Button variant="ghost" size="sm" asChild>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="DevUtilsHub on GitHub"
            >
              <GitFork aria-hidden="true" />
              GitHub
            </a>
          </Button>
          <ThemeToggle />
        </nav>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="icon" asChild>
            <a href="#tool-search" aria-label="Search tools">
              <Search aria-hidden="true" />
            </a>
          </Button>
          <ThemeToggle />
          <details className="group relative [&>summary::-webkit-details-marker]:hidden">
            <summary className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring flex size-10 cursor-pointer list-none items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2">
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Open navigation menu</span>
            </summary>
            <nav
              className="border-border bg-popover text-popover-foreground absolute top-12 right-0 w-60 rounded-xl border p-2 shadow-2xl shadow-black/25"
              aria-label="Mobile navigation"
            >
              <a
                href="#featured-tools"
                className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring flex rounded-lg px-3 py-2.5 text-sm outline-none focus-visible:ring-2"
              >
                Tools
              </a>
              <a
                href="#categories"
                className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring flex rounded-lg px-3 py-2.5 text-sm outline-none focus-visible:ring-2"
              >
                Categories
              </a>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-none focus-visible:ring-2"
              >
                <GitFork className="size-4" aria-hidden="true" />
                GitHub
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
