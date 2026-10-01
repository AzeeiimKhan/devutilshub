export type UrlEncodingMode = "encode" | "decode";

export type UrlEncodingResult =
  { ok: true; output: string } | { ok: false; error: string };

export function encodeUrlComponent(input: string): UrlEncodingResult {
  if (!input) {
    return { ok: false, error: "Enter text before encoding." };
  }

  try {
    return { ok: true, output: encodeURIComponent(input) };
  } catch {
    return {
      ok: false,
      error:
        "The input contains an incomplete Unicode character. Remove it and try again.",
    };
  }
}

export function decodeUrlComponent(input: string): UrlEncodingResult {
  if (!input) {
    return { ok: false, error: "Enter percent-encoded text before decoding." };
  }

  try {
    return { ok: true, output: decodeURIComponent(input) };
  } catch {
    return {
      ok: false,
      error:
        "Invalid URL encoding. Check for incomplete or malformed percent-encoded sequences.",
    };
  }
}

export function transformUrlComponent(
  input: string,
  mode: UrlEncodingMode,
): UrlEncodingResult {
  return mode === "encode"
    ? encodeUrlComponent(input)
    : decodeUrlComponent(input);
}
