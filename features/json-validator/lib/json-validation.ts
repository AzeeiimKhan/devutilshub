import {
  parseJson,
  type JsonErrorDetails,
} from "@/features/json-formatter/lib/json-processing";

export interface JsonStructure {
  rootType: "Object" | "Array" | "String" | "Number" | "Boolean" | "Null";
  entries: number | null;
  entryLabel: "properties" | "items" | null;
  depth: number;
}

export type JsonValidationResult =
  | {
      ok: true;
      preview: string;
      structure: JsonStructure;
    }
  | { ok: false; error: JsonErrorDetails };

function jsonDepth(value: unknown): number {
  if (value === null || typeof value !== "object") return 0;

  const children = Array.isArray(value)
    ? value
    : Object.values(value as Record<string, unknown>);

  if (children.length === 0) return 1;

  return 1 + Math.max(...children.map(jsonDepth));
}

function structureOf(value: unknown): JsonStructure {
  if (Array.isArray(value)) {
    return {
      rootType: "Array",
      entries: value.length,
      entryLabel: "items",
      depth: jsonDepth(value),
    };
  }

  if (value !== null && typeof value === "object") {
    return {
      rootType: "Object",
      entries: Object.keys(value).length,
      entryLabel: "properties",
      depth: jsonDepth(value),
    };
  }

  const rootType =
    value === null
      ? "Null"
      : typeof value === "string"
        ? "String"
        : typeof value === "number"
          ? "Number"
          : "Boolean";

  return { rootType, entries: null, entryLabel: null, depth: 0 };
}

export function validateJson(input: string): JsonValidationResult {
  const parsed = parseJson(input);

  if (!parsed.ok) return parsed;

  return {
    ok: true,
    preview: JSON.stringify(parsed.value, null, 2),
    structure: structureOf(parsed.value),
  };
}
