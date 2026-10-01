export type Base64Mode = "encode" | "decode";

export type Base64Result =
  { ok: true; output: string } | { ok: false; error: string };

const INVALID_BASE64_MESSAGE =
  "Invalid Base64. Check that the input contains valid Base64 characters and padding.";

function hasUnpairedSurrogate(value: string) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);

    if (code >= 0xd800 && code <= 0xdbff) {
      if (index + 1 >= value.length) return true;
      const next = value.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) return true;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }

  return false;
}

function bytesToBinary(bytes: Uint8Array) {
  const chunkSize = 0x8000;
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, offset + chunkSize),
    );
  }

  return binary;
}

export function encodeBase64(input: string): Base64Result {
  if (!input) {
    return { ok: false, error: "Enter text before encoding." };
  }

  if (hasUnpairedSurrogate(input)) {
    return {
      ok: false,
      error:
        "The input contains an incomplete Unicode character. Remove it and try again.",
    };
  }

  const bytes = new TextEncoder().encode(input);
  return { ok: true, output: btoa(bytesToBinary(bytes)) };
}

export function decodeBase64(input: string): Base64Result {
  const compact = input.replace(/\s/g, "");

  if (!compact) {
    return { ok: false, error: "Enter Base64 text before decoding." };
  }

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact)) {
    return { ok: false, error: INVALID_BASE64_MESSAGE };
  }

  if (compact.includes("=") && compact.length % 4 !== 0) {
    return { ok: false, error: INVALID_BASE64_MESSAGE };
  }

  const unpadded = compact.replace(/=+$/, "");
  const remainder = unpadded.length % 4;

  if (remainder === 1) {
    return { ok: false, error: INVALID_BASE64_MESSAGE };
  }

  const normalized = unpadded + "=".repeat((4 - remainder) % 4);

  try {
    const binary = atob(normalized);

    if (btoa(binary).replace(/=+$/, "") !== unpadded) {
      return { ok: false, error: INVALID_BASE64_MESSAGE };
    }

    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    const output = new TextDecoder("utf-8", { fatal: true }).decode(bytes);

    return { ok: true, output };
  } catch {
    return {
      ok: false,
      error:
        "Invalid Base64 or UTF-8 text. Check the value and try decoding again.",
    };
  }
}

export function transformBase64(input: string, mode: Base64Mode) {
  return mode === "encode" ? encodeBase64(input) : decodeBase64(input);
}
