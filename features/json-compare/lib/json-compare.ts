import {
  parseJson,
  type JsonParseResult,
} from "@/features/json-formatter/lib/json-processing";

export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type JsonDifference =
  | { kind: "added"; path: string; after: JsonValue }
  | { kind: "removed"; path: string; before: JsonValue }
  | {
      kind: "changed";
      path: string;
      before: JsonValue;
      after: JsonValue;
    };

export interface JsonComparisonSummary {
  total: number;
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
}

export type JsonComparisonResult =
  | {
      ok: false;
      inputA: JsonParseResult;
      inputB: JsonParseResult;
    }
  | {
      ok: true;
      differences: JsonDifference[];
      summary: JsonComparisonSummary;
    };

function isJsonObject(value: JsonValue): value is Record<string, JsonValue> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function propertyPath(parent: string, key: string) {
  if (/^[A-Za-z_$][\w$]*$/.test(key)) {
    return parent ? `${parent}.${key}` : key;
  }

  const segment = `[${JSON.stringify(key)}]`;
  return parent ? `${parent}${segment}` : segment;
}

function arrayPath(parent: string, index: number) {
  return `${parent}[${index}]`;
}

function compareValues(
  before: JsonValue,
  after: JsonValue,
  path: string,
  differences: JsonDifference[],
): number {
  if (Array.isArray(before) && Array.isArray(after)) {
    if (before.length === 0 && after.length === 0) return 1;

    let unchanged = 0;
    const length = Math.max(before.length, after.length);

    for (let index = 0; index < length; index += 1) {
      const itemPath = arrayPath(path, index);

      if (index >= before.length) {
        differences.push({
          kind: "added",
          path: itemPath,
          after: after[index],
        });
      } else if (index >= after.length) {
        differences.push({
          kind: "removed",
          path: itemPath,
          before: before[index],
        });
      } else {
        unchanged += compareValues(
          before[index],
          after[index],
          itemPath,
          differences,
        );
      }
    }

    return unchanged;
  }

  if (isJsonObject(before) && isJsonObject(after)) {
    const keys = [
      ...new Set([...Object.keys(before), ...Object.keys(after)]),
    ].sort();

    if (keys.length === 0) return 1;

    let unchanged = 0;

    for (const key of keys) {
      const childPath = propertyPath(path, key);
      const beforeHasKey = Object.hasOwn(before, key);
      const afterHasKey = Object.hasOwn(after, key);

      if (!beforeHasKey) {
        differences.push({ kind: "added", path: childPath, after: after[key] });
      } else if (!afterHasKey) {
        differences.push({
          kind: "removed",
          path: childPath,
          before: before[key],
        });
      } else {
        unchanged += compareValues(
          before[key],
          after[key],
          childPath,
          differences,
        );
      }
    }

    return unchanged;
  }

  if (before === after) return 1;

  differences.push({
    kind: "changed",
    path: path || "$",
    before,
    after,
  });

  return 0;
}

export function compareJson(
  inputA: string,
  inputB: string,
): JsonComparisonResult {
  const parsedA = parseJson(inputA);
  const parsedB = parseJson(inputB);

  if (!parsedA.ok || !parsedB.ok) {
    return { ok: false, inputA: parsedA, inputB: parsedB };
  }

  const differences: JsonDifference[] = [];
  const unchanged = compareValues(
    parsedA.value as JsonValue,
    parsedB.value as JsonValue,
    "",
    differences,
  );
  const added = differences.filter((item) => item.kind === "added").length;
  const removed = differences.filter((item) => item.kind === "removed").length;
  const changed = differences.filter((item) => item.kind === "changed").length;

  return {
    ok: true,
    differences,
    summary: {
      total: differences.length,
      added,
      removed,
      changed,
      unchanged,
    },
  };
}

function displayValue(value: JsonValue) {
  return JSON.stringify(value);
}

export function comparisonAsText(result: JsonComparisonResult) {
  if (!result.ok) {
    return [
      result.inputA.ok
        ? "JSON A: VALID"
        : `JSON A: INVALID\n${result.inputA.error.message}`,
      result.inputB.ok
        ? "JSON B: VALID"
        : `JSON B: INVALID\n${result.inputB.error.message}`,
    ].join("\n\n");
  }

  if (result.differences.length === 0) {
    return "JSON documents are identical.";
  }

  const heading = `${result.summary.total} ${
    result.summary.total === 1 ? "difference" : "differences"
  } · ${result.summary.added} added · ${result.summary.removed} removed · ${result.summary.changed} changed`;
  const details = result.differences.map((difference) => {
    if (difference.kind === "added") {
      return `ADDED\n${difference.path}\n+ ${displayValue(difference.after)}`;
    }

    if (difference.kind === "removed") {
      return `REMOVED\n${difference.path}\n- ${displayValue(difference.before)}`;
    }

    return `CHANGED\n${difference.path}\n${displayValue(difference.before)} → ${displayValue(difference.after)}`;
  });

  return [heading, ...details].join("\n\n");
}
