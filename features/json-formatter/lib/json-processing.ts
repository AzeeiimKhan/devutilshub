export interface JsonErrorDetails {
  message: string;
  line?: number;
  column?: number;
  position?: number;
}

export type JsonParseResult =
  { ok: true; value: unknown } | { ok: false; error: JsonErrorDetails };

export type JsonTransformResult =
  { ok: true; output: string } | { ok: false; error: JsonErrorDetails };

function locationFromPosition(input: string, position: number) {
  let line = 1;
  let column = 1;

  for (let index = 0; index < position && index < input.length; index += 1) {
    if (input[index] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return { line, column };
}

function friendlyJsonError(input: string, error: unknown): JsonErrorDetails {
  if (!(error instanceof SyntaxError)) {
    return {
      message:
        "The JSON could not be processed. Check the input and try again.",
    };
  }

  const parserMessage = error.message;
  const positionMatch = parserMessage.match(/position\s+(\d+)/i);
  const locationMatch = parserMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  const position = positionMatch ? Number(positionMatch[1]) : undefined;
  const derivedLocation =
    position !== undefined ? locationFromPosition(input, position) : undefined;
  const line = locationMatch ? Number(locationMatch[1]) : derivedLocation?.line;
  const column = locationMatch
    ? Number(locationMatch[2])
    : derivedLocation?.column;

  let message =
    "Invalid JSON. Check for an unexpected comma, quote, or bracket.";

  if (/unexpected end|end of json|unterminated/i.test(parserMessage)) {
    message =
      "Invalid JSON. The input may be missing a closing brace, bracket, or quote.";
  } else if (/property name|double-quoted/i.test(parserMessage)) {
    message =
      "Invalid JSON. Property names need double quotes, and trailing commas are not allowed.";
  } else if (/escape|control character/i.test(parserMessage)) {
    message =
      "Invalid JSON. Check that special characters and backslashes are escaped correctly.";
  } else if (/number/i.test(parserMessage)) {
    message = "Invalid JSON. Check that numeric values use valid JSON syntax.";
  }

  return { message, line, column, position };
}

export function parseJson(input: string): JsonParseResult {
  if (!input.trim()) {
    return {
      ok: false,
      error: { message: "Enter JSON before running this action." },
    };
  }

  try {
    return { ok: true, value: JSON.parse(input) as unknown };
  } catch (error) {
    return { ok: false, error: friendlyJsonError(input, error) };
  }
}

export function transformJson(
  input: string,
  mode: "format" | "minify",
): JsonTransformResult {
  const parsed = parseJson(input);

  if (!parsed.ok) return parsed;

  return {
    ok: true,
    output: JSON.stringify(parsed.value, null, mode === "format" ? 2 : 0),
  };
}
