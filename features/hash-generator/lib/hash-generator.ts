import { md5 } from "@noble/hashes/legacy.js";

export const HASH_ALGORITHMS = ["SHA-256", "SHA-1", "MD5"] as const;
export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];

// Bound UTF-8 allocation and synchronous MD5 work in this text-only workspace.
export const MAX_HASH_INPUT_BYTES = 5 * 1024 * 1024;

export type GeneratedHash = {
  algorithm: HashAlgorithm;
  hash: string;
  inputBytes: number;
};

export type HashResult =
  { ok: true; value: GeneratedHash } | { ok: false; error: string };

export async function generateHash(
  input: string,
  algorithm: HashAlgorithm,
): Promise<HashResult> {
  if (!HASH_ALGORITHMS.includes(algorithm)) {
    return {
      ok: false,
      error: "Choose SHA-256, SHA-1, or MD5 to generate a hash.",
    };
  }

  // Whitespace is meaningful data. Never trim or normalize text before hashing.
  if (input.length === 0) {
    return { ok: false, error: "Enter some text before generating a hash." };
  }

  if (input.length > MAX_HASH_INPUT_BYTES) return inputTooLarge();

  if (hasIncompleteUnicode(input)) {
    return {
      ok: false,
      error:
        "The input contains an incomplete Unicode character. Remove it and try again.",
    };
  }

  try {
    const bytes = new TextEncoder().encode(input);
    if (bytes.byteLength > MAX_HASH_INPUT_BYTES) return inputTooLarge();

    let digest: Uint8Array;
    if (algorithm === "MD5") {
      digest = md5(bytes);
    } else {
      if (!globalThis.crypto?.subtle) {
        return {
          ok: false,
          error:
            "Web Crypto is unavailable. Open this tool over HTTPS or localhost in a supported browser.",
        };
      }
      digest = new Uint8Array(
        await globalThis.crypto.subtle.digest(algorithm, bytes),
      );
    }

    return {
      ok: true,
      value: {
        algorithm,
        hash: Array.from(digest, (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join(""),
        inputBytes: bytes.byteLength,
      },
    };
  } catch {
    return {
      ok: false,
      error:
        algorithm === "MD5"
          ? "MD5 could not be generated. Try again or choose another algorithm."
          : `${algorithm} could not be generated. Try again in a browser with Web Crypto support.`,
    };
  }
}

function inputTooLarge(): HashResult {
  return {
    ok: false,
    error:
      "This text exceeds the 5 MiB UTF-8 limit. Use a smaller input to keep the browser responsive.",
  };
}

function hasIncompleteUnicode(input: string) {
  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = input.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return true;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
}
