import type { ToolMetadata } from "@/types/tool";

export const tools: ToolMetadata[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Format, minify, and validate JSON locally in a focused browser workspace.",
    category: "json",
    icon: "braces",
    keywords: ["json", "format", "beautify", "prettify", "minify"],
    featured: true,
    popular: true,
    browserOnly: true,
    availability: "available",
    badges: ["browser-only", "privacy-first"],
    examples: [
      {
        id: "nested-object",
        title: "Nested object",
        description: "A user record with nested preferences.",
        input:
          '{"user":{"id":42,"name":"Ada Lovelace","preferences":{"theme":"dark","notifications":true}},"active":true}',
      },
      {
        id: "array-of-objects",
        title: "Array of objects",
        description: "A compact collection of API records.",
        input:
          '[{"id":1,"name":"Build","status":"done"},{"id":2,"name":"Test","status":"running"},{"id":3,"name":"Ship","status":"queued"}]',
      },
      {
        id: "compact-input",
        title: "Compact input",
        description: "A minified configuration object.",
        input:
          '{"environment":"production","features":{"search":true,"sharing":false},"retries":3}',
      },
      {
        id: "escaped-characters",
        title: "Escaped characters",
        description: "Strings containing quotes, slashes, and new lines.",
        input:
          '{"message":"She said \\"hello\\".","path":"C:\\\\dev\\\\tools","lines":"first\\nsecond"}',
      },
      {
        id: "trailing-comma",
        title: "Trailing comma (invalid)",
        description: "An invalid object for testing error feedback.",
        input: '{"name":"DevUtilsHub","private":true,}',
      },
    ],
    commonMistakes: [
      {
        title: "Trailing comma",
        description:
          "Remove the final comma before a closing brace or bracket.",
        example: '{"enabled": true,}',
      },
      {
        title: "Missing closing brace or bracket",
        description:
          "Every opening object or array delimiter needs a matching close.",
        example: '{"items": [1, 2, 3}',
      },
      {
        title: "Unquoted keys",
        description: "JSON property names must be wrapped in double quotes.",
        example: '{status: "ready"}',
      },
      {
        title: "Single quotes",
        description: "JSON strings and property names require double quotes.",
        example: "{'status': 'ready'}",
      },
      {
        title: "Unexpected token",
        description:
          "Look near the reported location for an extra character or delimiter.",
      },
      {
        title: "Comments inside JSON",
        description: "Standard JSON does not support // or /* */ comments.",
        example: '{"enabled": true // remove this comment\n}',
      },
    ],
    relatedTools: [
      "json-validator",
      "json-compare",
      "base64-encode-decode",
      "jwt-decoder",
    ],
    faq: [
      {
        question: "What does JSON formatting do?",
        answer:
          "Formatting parses JSON and adds consistent indentation and line breaks, making nested data easier to read without changing its values.",
      },
      {
        question: "Is my JSON uploaded?",
        answer:
          "No. Parsing, formatting, validation, copying, and downloads all happen locally in your browser. Your JSON is never sent to DevUtilsHub.",
      },
      {
        question: "What happens when JSON is invalid?",
        answer:
          "The formatter leaves your input intact and shows a concise error with line and column details when the browser parser provides a reliable location.",
      },
      {
        question:
          "What is the difference between formatting and minifying JSON?",
        answer:
          "Formatting adds whitespace for readability. Minifying removes unnecessary whitespace to produce a smaller equivalent JSON string.",
      },
    ],
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
    availability: "coming-soon",
    badges: ["browser-only", "privacy-first"],
    examples: [],
    commonMistakes: [],
    relatedTools: [],
    faq: [],
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
    availability: "coming-soon",
    badges: ["browser-only", "privacy-first"],
    examples: [],
    commonMistakes: [],
    relatedTools: [],
    faq: [],
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
    availability: "coming-soon",
    badges: ["browser-only", "privacy-first"],
    examples: [],
    commonMistakes: [],
    relatedTools: [],
    faq: [],
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Inspect JWT headers and payload claims locally without uploading tokens.",
    category: "authentication-developer",
    icon: "key",
    keywords: ["jwt", "token", "decode", "claims", "authentication"],
    featured: false,
    popular: false,
    browserOnly: true,
    availability: "coming-soon",
    badges: ["browser-only", "privacy-first"],
    examples: [],
    commonMistakes: [],
    relatedTools: [],
    faq: [],
  },
];

export const featuredTools = tools.filter((tool) => tool.featured);
export const popularTools = tools.filter((tool) => tool.popular);

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
