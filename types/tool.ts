export type ToolCategory =
  "json" | "encoding" | "authentication-developer" | "utilities";

export type ToolIconName =
  "binary" | "braces" | "check-braces" | "compare" | "key" | "wrench";

export interface ToolMetadata {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: ToolIconName;
  keywords: string[];
  featured: boolean;
  popular: boolean;
  browserOnly: boolean;
}
