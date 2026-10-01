import { parseJson } from "@/features/json-formatter/lib/json-processing";

export type JsonObject = Record<string, unknown>;
export type JwtTimeClaimName = "iat" | "exp" | "nbf";
export type JwtTimeClaimStatus =
  "issued" | "expired" | "active" | "already-active" | "not-active" | "unknown";

export interface JwtTimeClaim {
  name: JwtTimeClaimName;
  label: string;
  value: number;
  isoDate: string | null;
  status: JwtTimeClaimStatus;
  statusLabel: string;
}

export interface DecodedJwt {
  header: JsonObject;
  payload: JsonObject;
  prettyHeader: string;
  prettyPayload: string;
  signature: string;
  algorithm: string | null;
  tokenType: string | null;
  claims: JwtTimeClaim[];
}

export type DecodeJwtResult =
  { ok: true; value: DecodedJwt } | { ok: false; error: string };

function binaryToBytes(binary: string) {
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function normalizedBase64Url(section: string) {
  if (!/^[A-Za-z0-9_-]+={0,2}$/.test(section)) return null;
  if (section.includes("=") && section.length % 4 !== 0) return null;

  const unpadded = section.replace(/=+$/, "");
  const remainder = unpadded.length % 4;
  if (remainder === 1) return null;

  return {
    unpadded,
    standard:
      unpadded.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - remainder) % 4),
  };
}

function decodeBase64UrlBytes(section: string) {
  const normalized = normalizedBase64Url(section);
  if (!normalized) return null;

  try {
    const binary = atob(normalized.standard);
    const canonical = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (canonical !== normalized.unpadded) return null;
    return binaryToBytes(binary);
  } catch {
    return null;
  }
}

function decodeBase64UrlText(section: string) {
  const bytes = decodeBase64UrlBytes(section);
  if (!bytes) return null;

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

function isJsonObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function interpretClaims(payload: JsonObject, nowSeconds: number) {
  const definitions: Array<{
    name: JwtTimeClaimName;
    label: string;
  }> = [
    { name: "iat", label: "Issued" },
    { name: "exp", label: "Expires" },
    { name: "nbf", label: "Not before" },
  ];

  return definitions.flatMap(({ name, label }): JwtTimeClaim[] => {
    const value = payload[name];
    if (typeof value !== "number" || !Number.isFinite(value)) return [];

    const date = new Date(value * 1000);
    const hasUsableDate = !Number.isNaN(date.getTime());
    let status: JwtTimeClaimStatus = "unknown";
    let statusLabel = "Unable to determine";

    if (hasUsableDate && name === "iat") {
      status = "issued";
      statusLabel = "Issued timestamp";
    } else if (hasUsableDate && name === "exp") {
      status = value <= nowSeconds ? "expired" : "active";
      statusLabel = value <= nowSeconds ? "Expired" : "Active / not expired";
    } else if (hasUsableDate && name === "nbf") {
      status = value <= nowSeconds ? "already-active" : "not-active";
      statusLabel = value <= nowSeconds ? "Already active" : "Not active yet";
    }

    return [
      {
        name,
        label,
        value,
        isoDate: hasUsableDate ? date.toISOString() : null,
        status,
        statusLabel,
      },
    ];
  });
}

export function decodeJwt(
  input: string,
  nowSeconds = Date.now() / 1000,
): DecodeJwtResult {
  const token = input.trim();

  if (!token) {
    return { ok: false, error: "Enter a JWT before decoding." };
  }

  const sections = token.split(".");
  if (sections.length !== 3) {
    return {
      ok: false,
      error: "Invalid JWT. Expected three dot-separated sections.",
    };
  }

  const [headerSection, payloadSection, signatureSection] = sections;
  if (!headerSection) {
    return { ok: false, error: "Invalid JWT. The header section is missing." };
  }
  if (!payloadSection) {
    return { ok: false, error: "Invalid JWT. The payload section is missing." };
  }
  if (!signatureSection) {
    return {
      ok: false,
      error: "Invalid JWT. The signature section is missing.",
    };
  }

  const headerText = decodeBase64UrlText(headerSection);
  if (headerText === null) {
    return { ok: false, error: "Unable to decode the JWT header." };
  }

  const payloadText = decodeBase64UrlText(payloadSection);
  if (payloadText === null) {
    return { ok: false, error: "Unable to decode the JWT payload." };
  }

  if (!decodeBase64UrlBytes(signatureSection)) {
    return {
      ok: false,
      error: "The JWT signature section is not valid Base64URL.",
    };
  }

  const parsedHeader = parseJson(headerText);
  if (!parsedHeader.ok) {
    return { ok: false, error: "JWT header is not valid JSON." };
  }
  if (!isJsonObject(parsedHeader.value)) {
    return { ok: false, error: "JWT header must decode to a JSON object." };
  }

  const parsedPayload = parseJson(payloadText);
  if (!parsedPayload.ok) {
    return { ok: false, error: "JWT payload is not valid JSON." };
  }
  if (!isJsonObject(parsedPayload.value)) {
    return { ok: false, error: "JWT payload must decode to a JSON object." };
  }

  return {
    ok: true,
    value: {
      header: parsedHeader.value,
      payload: parsedPayload.value,
      prettyHeader: JSON.stringify(parsedHeader.value, null, 2),
      prettyPayload: JSON.stringify(parsedPayload.value, null, 2),
      signature: signatureSection,
      algorithm:
        typeof parsedHeader.value.alg === "string"
          ? parsedHeader.value.alg
          : null,
      tokenType:
        typeof parsedHeader.value.typ === "string"
          ? parsedHeader.value.typ
          : null,
      claims: interpretClaims(parsedPayload.value, nowSeconds),
    },
  };
}

export function decodedJwtAsText(value: DecodedJwt) {
  const claims = value.claims.length
    ? value.claims
        .map(
          (claim) =>
            `${claim.label} (${claim.name}): ${claim.value}\n${claim.isoDate ?? "Date unavailable"}\n${claim.statusLabel}`,
        )
        .join("\n\n")
    : "No numeric iat, exp, or nbf claims found.";

  return [
    `Header:\n${value.prettyHeader}`,
    `Payload:\n${value.prettyPayload}`,
    `Claims:\n${claims}`,
    `Signature:\n${value.signature}`,
    "Signature verified: No (this decoder did not perform verification)",
  ].join("\n\n");
}

export function decodedJwtDownload(value: DecodedJwt) {
  return {
    header: value.header,
    payload: value.payload,
    claims: Object.fromEntries(
      value.claims.map((claim) => [
        claim.name,
        {
          value: claim.value,
          date: claim.isoDate,
          status: claim.statusLabel,
        },
      ]),
    ),
    signature: value.signature,
    signatureVerified: false,
    signatureVerificationNote:
      "This decoder did not verify the signature. This does not mean the signature is invalid.",
  };
}
