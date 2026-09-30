import type { ToolMetadata } from "@/types/tool";

export const tools: ToolMetadata[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Format and inspect JSON in a clean, readable workspace built for large payloads.",
    category: "json",
    icon: "braces",
    keywords: ["json", "format", "beautify", "prettify"],
    featured: true,
    popular: true,
    browserOnly: true,
  },
  {
    slug: "json-validator",
    title: "JSON Validator",
    description:
      "Check JSON structure and surface syntax issues with precise, useful feedback.",
    category: "json",
    icon: "check-braces",
    keywords: ["json", "validate", "lint", "syntax"],
    featured: true,
    popular: true,
    browserOnly: true,
  },
  {
    slug: "json-compare",
    title: "JSON Compare",
    description:
      "Compare two JSON documents and review structural differences side by side.",
    category: "json",
    icon: "compare",
    keywords: ["json", "compare", "diff", "difference"],
    featured: true,
    popular: false,
    browserOnly: true,
  },
  {
    slug: "base64-encode-decode",
    title: "Base64 Encode / Decode",
    description:
      "Encode or decode Base64 text locally without sending content to a server.",
    category: "encoding",
    icon: "binary",
    keywords: ["base64", "encode", "decode", "text"],
    featured: true,
    popular: true,
    browserOnly: true,
  },
];

export const featuredTools = tools.filter((tool) => tool.featured);
export const popularTools = tools.filter((tool) => tool.popular);
