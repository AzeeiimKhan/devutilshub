import type { ToolCategory, ToolIconName } from "@/types/tool";

export interface CategoryMetadata {
  id: ToolCategory;
  title: string;
  description: string;
  icon: ToolIconName;
}

export const categories: CategoryMetadata[] = [
  {
    id: "json",
    title: "JSON",
    description: "Format, validate, compare, and inspect structured data.",
    icon: "braces",
  },
  {
    id: "encoding",
    title: "Encoding",
    description: "Convert text and data between common transport formats.",
    icon: "binary",
  },
  {
    id: "authentication-developer",
    title: "Authentication / Developer",
    description: "Inspect tokens, identifiers, and developer-focused formats.",
    icon: "key",
  },
  {
    id: "utilities",
    title: "Utilities",
    description: "Focused helpers for everyday engineering workflows.",
    icon: "wrench",
  },
];
