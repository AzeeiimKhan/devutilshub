export type ToolCategory =
  "json" | "encoding" | "authentication-developer" | "utilities";

export type ToolIconName =
  | "binary"
  | "braces"
  | "check-braces"
  | "clock"
  | "compare"
  | "fingerprint"
  | "key"
  | "wrench";

export type ToolAvailability = "available" | "coming-soon";

export type ToolBadge = "browser-only" | "privacy-first";

export interface ToolExample {
  id: string;
  title: string;
  description: string;
  input: string;
  secondaryInput?: string;
  kind?: "valid" | "invalid";
  mode?: "encode" | "decode";
}

export interface ToolCommonMistake {
  title: string;
  description: string;
  example?: string;
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

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
  availability: ToolAvailability;
  badges: ToolBadge[];
  examples: ToolExample[];
  commonMistakes: ToolCommonMistake[];
  relatedTools: string[];
  faq: ToolFaqItem[];
}
