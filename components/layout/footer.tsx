import { ArrowUpRight } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { categories } from "@/metadata/categories";
import { siteConfig } from "@/metadata/site";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Featured tools", href: "#featured-tools" },
      { label: "Popular tools", href: "#popular-tools" },
      { label: "Why DevUtilsHub", href: "#why-devutilshub" },
    ],
  },
  {
    title: "Categories",
    links: categories.map((category) => ({
      label: category.title,
      href: `#category-${category.id}`,
    })),
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Privacy principles", href: "#why-devutilshub" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-border bg-card/35 border-t">
      <div className="container-shell py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr] lg:gap-16">
          <div className="max-w-sm">
            <Logo />
            <p className="text-muted-foreground mt-4 text-sm leading-6">
              {siteConfig.tagline} Fast, focused utilities for developers who
              care where their data goes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors outline-none focus-visible:ring-2"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                Company
              </h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-sm text-sm transition-colors outline-none focus-visible:ring-2"
                  >
                    GitHub
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <span className="text-muted-foreground/60 text-sm">
                    About — soon
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DevUtilsHub.</p>
          <p className="font-mono">Built for local-first workflows.</p>
        </div>
      </div>
    </footer>
  );
}
