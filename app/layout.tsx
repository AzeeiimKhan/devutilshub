import type { Metadata, Viewport } from "next";

import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/metadata/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Privacy-first developer tools`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "developer tools",
    "JSON formatter",
    "JSON validator",
    "Base64",
    "browser tools",
    "privacy-first",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    title: siteConfig.tagline,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.tagline,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#080a0f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="bg-primary text-primary-foreground focus:ring-ring focus:ring-offset-background fixed top-3 left-3 z-[100] -translate-y-20 rounded-md px-4 py-2 text-sm font-medium transition-transform outline-none focus:translate-y-0 focus:ring-2 focus:ring-offset-2 motion-reduce:transition-none"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
