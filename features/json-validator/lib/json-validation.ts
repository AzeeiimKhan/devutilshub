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
  const pending: Array<{ value: object; depth: number }> = [
    { value, depth: 1 },
  ];
  let maximum = 0;

  while (pending.length > 0) {
    const current = pending.pop()!;
    maximum = Math.max(maximum, current.depth);
    const children = Array.isArray(current.value)
      ? current.value
      : Object.values(current.value);

    for (const child of children) {
      if (child !== null && typeof child === "object") {
        pending.push({ value: child, depth: current.depth + 1 });
      }
    }
  }

  return maximum;
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
