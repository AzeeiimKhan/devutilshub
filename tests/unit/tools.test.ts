import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";

import {
  parseJson,
  transformJson,
} from "@/features/json-formatter/lib/json-processing";
import { validateJson } from "@/features/json-validator/lib/json-validation";
import {
  compareJson,
  comparisonAsText,
} from "@/features/json-compare/lib/json-compare";
import { encodeBase64, decodeBase64 } from "@/features/base64/lib/base64";
import {
  encodeUrlComponent,
  decodeUrlComponent,
} from "@/features/url-encoding/lib/url-encoding";
import {
  decodeJwt,
  decodedJwtDownload,
} from "@/features/jwt-decoder/lib/jwt-decoder";
import {
  generateUuids,
  type UuidQuantity,
} from "@/features/uuid-generator/lib/uuid-generator";
import {
  timestampToDate,
  dateInputToTimestamp,
  toDateTimeInputValue,
  formatUtcDate,
} from "@/features/timestamp-converter/lib/timestamp-converter";
import {
  generateHash,
  MAX_HASH_INPUT_BYTES,
  HASH_ALGORITHMS,
} from "@/features/hash-generator/lib/hash-generator";
import { tools } from "@/tools/registry";

for (const input of [
  "{}",
  "[]",
  "null",
  "false",
  "0",
  '"hello"',
  '{"a":[1,{"b":"🌍"}]}',
]) {
  test(`JSON: format, minify and validate ${input}`, () => {
    const value = JSON.parse(input);
    assert.deepEqual(transformJson(input, "format"), {
      ok: true,
      output: JSON.stringify(value, null, 2),
    });
    assert.deepEqual(transformJson(input, "minify"), {
      ok: true,
      output: JSON.stringify(value),
    });
    assert.equal(validateJson(input).ok, true);
  });
}
for (const input of [
  "",
  " ",
  '{"a":1,}',
  "{'a':1}",
  "{a:1}",
  "[1,]",
  "/*comment*/{}",
  "NaN",
  "undefined",
  "{",
  '{"a":"\\x"}',
]) {
  test(`JSON: reject malformed input ${JSON.stringify(input)}`, () => {
    assert.equal(parseJson(input).ok, false);
    assert.equal(validateJson(input).ok, false);
    assert.equal(compareJson(input, "{}").ok, false);
  });
}
test("JSON validator: structure, large arrays and deeply nested documents", () => {
  const result = validateJson('{"a":[{"b":true}]}');
  assert(result.ok);
  assert.deepEqual(result.structure, {
    rootType: "Object",
    entries: 1,
    entryLabel: "properties",
    depth: 3,
  });
  const wide = validateJson(
    JSON.stringify(Array.from({ length: 150_000 }, () => 1)),
  );
  assert(wide.ok);
  assert.equal(wide.structure.depth, 1);
  const deep = validateJson("[".repeat(1000) + "0" + "]".repeat(1000));
  assert(deep.ok);
  assert.equal(deep.structure.depth, 1000);
});
test("JSON compare: ordering, types, arrays, special keys and summary", () => {
  const same = compareJson('{"a":1,"b":2}', '{ "b":2, "a":1 }');
  assert(same.ok);
  assert.equal(same.summary.total, 0);
  const result = compareJson(
    '{"a":1,"removed":true,"items":[1,2],"x.y":0}',
    '{"a":"1","new":null,"items":[1],"x.y":1}',
  );
  assert(result.ok);
  assert.equal(result.summary.added, 1);
  assert.equal(result.summary.removed, 2);
  assert.equal(result.summary.changed, 2);
  assert(
    result.differences.some((difference) => difference.path === '["x.y"]'),
  );
  assert.match(comparisonAsText(result), /5 differences/);
  const prototype = compareJson('{"__proto__":1}', '{"__proto__":2}');
  assert(prototype.ok);
  assert.equal(prototype.summary.changed, 1);
});

for (const input of [
  "Hello World",
  "Café · नमस्ते · こんにちは 🌍",
  " \n\r\t ",
  "a".repeat(100_000),
  "\u0000",
  "\ufeffHello World",
]) {
  test(`Encoding: UTF-8 round trip (${input.length} characters)`, () => {
    const b64 = encodeBase64(input);
    assert(b64.ok);
    assert.equal(b64.output, Buffer.from(input).toString("base64"));
    assert.deepEqual(decodeBase64(b64.output), { ok: true, output: input });
    const url = encodeUrlComponent(input);
    assert(url.ok);
    assert.deepEqual(decodeUrlComponent(url.output), {
      ok: true,
      output: input,
    });
  });
}
for (const input of [
  "",
  "A",
  "a===",
  "A=AA",
  "@@@",
  "Zh==",
  "/w==",
  "SGVsbG8_",
]) {
  test(`Base64 rejects malformed/non-UTF-8 ${JSON.stringify(input)}`, () =>
    assert.equal(decodeBase64(input).ok, false));
}
test("Base64 allows whitespace and omitted padding", () => {
  assert.deepEqual(decodeBase64("SG Vs\nbG8"), { ok: true, output: "Hello" });
});
for (const input of ["", "%", "%2", "%GG", "%FF", "%E0%A4"]) {
  test(`URL rejects malformed ${JSON.stringify(input)}`, () =>
    assert.equal(decodeUrlComponent(input).ok, false));
}
test("Encoding rejects incomplete Unicode and preserves plus signs", () => {
  assert.equal(encodeBase64("\ud800").ok, false);
  assert.equal(encodeUrlComponent("\udc00").ok, false);
  assert.deepEqual(decodeUrlComponent("a+b"), { ok: true, output: "a+b" });
});

const b64url = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
const jwt = (
  payload: unknown,
  header: unknown = { alg: "HS256", typ: "JWT" },
) => `${b64url(header)}.${b64url(payload)}.c2ln`;
test("JWT: Unicode, expiry boundaries, future nbf, invalid dates and export", () => {
  const result = decodeJwt(
    jwt({ sub: "🌍", exp: 100, nbf: 101, iat: 1e100 }),
    100,
  );
  assert(result.ok);
  assert.equal(result.value.payload.sub, "🌍");
  assert.equal(
    result.value.claims.find((claim) => claim.name === "exp")?.status,
    "expired",
  );
  assert.equal(
    result.value.claims.find((claim) => claim.name === "nbf")?.status,
    "not-active",
  );
  assert.equal(
    result.value.claims.find((claim) => claim.name === "iat")?.isoDate,
    null,
  );
  assert.equal(decodedJwtDownload(result.value).signatureVerified, false);
});
for (const input of [
  "",
  "one.two",
  "a.b.c.d",
  ".abc.c2ln",
  `${b64url({})}..c2ln`,
  `${b64url({})}.${b64url({})}.`,
  jwt([]),
  jwt(null),
  jwt({}, []),
  `@@.${b64url({})}.c2ln`,
  `${b64url({})}.${b64url({})}.@`,
]) {
  test(`JWT rejects malformed ${JSON.stringify(input)}`, () =>
    assert.equal(decodeJwt(input).ok, false));
}
for (const quantity of [1, 10, 100] as const) {
  test(`UUID: ${quantity} unique UUID v4 values`, () => {
    const result = generateUuids(quantity);
    assert(result.ok);
    assert.equal(result.values.length, quantity);
    assert.equal(new Set(result.values).size, quantity);
    for (const value of result.values)
      assert.match(
        value,
        /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/,
      );
  });
}
test("UUID handles unavailable browser APIs and invalid quantity", () => {
  assert.equal(generateUuids(1, () => null).ok, false);
  assert.equal(generateUuids(2 as UuidQuantity).ok, false);
});

for (const [input, expected] of [
  ["0", 0],
  ["-1", -1000],
  ["1.001", 1001],
  ["-1.001", -1001],
  ["1.007", 1007],
  ["1.001e0", 1001],
  ["1704067200.123", 1704067200123],
  [".001", 1],
] as const) {
  test(`Timestamp: seconds ${input}`, () => {
    const result = timestampToDate(input, "seconds");
    assert(result.ok, result.ok ? "" : result.error);
    assert.equal(result.value.milliseconds, expected);
  });
}
for (const input of ["", "abc", "0x10", "Infinity", "1e100", "0.0001"]) {
  test(`Timestamp rejects invalid/range/precision ${JSON.stringify(input)}`, () =>
    assert.equal(timestampToDate(input, "seconds").ok, false));
}
test("Timestamp: milliseconds, UTC date, leap year, low year and formatting limits", () => {
  const result = timestampToDate("1704067200123", "milliseconds");
  assert(result.ok);
  assert.equal(result.value.iso, "2024-01-01T00:00:00.123Z");
  assert.equal(dateInputToTimestamp("2024-02-29T12:30:00.123", "utc").ok, true);
  assert.equal(dateInputToTimestamp("2023-02-29T12:30", "utc").ok, false);
  assert.equal(dateInputToTimestamp("2024-13-01T00:00", "utc").ok, false);
  const early = dateInputToTimestamp("0001-01-01T00:00:00.000", "utc");
  assert(early.ok);
  assert.equal(
    toDateTimeInputValue(early.value.date, "utc"),
    "0001-01-01T00:00:00.000",
  );
  const extreme = timestampToDate("8640000000000000", "milliseconds");
  assert(extreme.ok);
  assert.equal(formatUtcDate(extreme.value.date), "+275760-09-13 00:00:00 UTC");
});
for (const algorithm of HASH_ALGORITHMS) {
  for (const input of ["abc", "Hello World", " \n", "Café 🌍"]) {
    test(`Hash: ${algorithm} known reference (${JSON.stringify(input)})`, async () => {
      const result = await generateHash(input, algorithm);
      assert(result.ok);
      assert.equal(
        result.value.hash,
        createHash(algorithm.toLowerCase().replace("-", ""))
          .update(input, "utf8")
          .digest("hex"),
      );
      assert.equal(result.value.inputBytes, Buffer.byteLength(input));
    });
  }
}
test("Hash rejects empty, incomplete Unicode and oversized UTF-8", async () => {
  for (const input of [
    "",
    "\ud800",
    "a".repeat(MAX_HASH_INPUT_BYTES + 1),
    "🌍".repeat(MAX_HASH_INPUT_BYTES / 4 + 1),
  ]) {
    assert.equal((await generateHash(input, "SHA-256")).ok, false);
  }
});
test("UUID discards a partial batch when randomness becomes unavailable", () => {
  let calls = 0;
  const result = generateUuids(10, () => {
    calls += 1;
    return calls === 3 ? null : "550e8400-e29b-41d4-a716-446655440000";
  });
  assert.equal(calls, 3);
  assert.equal(result.ok, false);
  assert.equal("values" in result, false);
});

test("Timestamp: local date input preserves the entered fields and precision", () => {
  const input = "2024-01-15T12:34:56.789";
  const result = dateInputToTimestamp(input, "local");
  assert(result.ok);
  assert.equal(toDateTimeInputValue(result.value.date, "local"), input);
  assert.equal(
    result.value.milliseconds,
    new Date(2024, 0, 15, 12, 34, 56, 789).getTime(),
  );
});

for (const tool of tools.filter((tool) => tool.examples.length > 0)) {
  test(`${tool.title}: published examples match their intended behavior`, async () => {
    for (const example of tool.examples) {
      switch (tool.slug) {
        case "json-formatter":
          assert.equal(
            parseJson(example.input).ok,
            !example.title.includes("invalid"),
          );
          break;
        case "json-validator":
          assert.equal(
            validateJson(example.input).ok,
            example.kind === "valid",
          );
          break;
        case "json-compare":
          assert.equal(
            compareJson(example.input, example.secondaryInput ?? "").ok,
            true,
          );
          break;
        case "base64":
          assert.equal(
            (example.mode === "decode"
              ? decodeBase64(example.input)
              : encodeBase64(example.input)
            ).ok,
            true,
          );
          break;
        case "url-encode-decode":
          assert.equal(
            (example.mode === "decode"
              ? decodeUrlComponent(example.input)
              : encodeUrlComponent(example.input)
            ).ok,
            true,
          );
          break;
        case "jwt-decoder":
          assert.equal(decodeJwt(example.input).ok, example.kind !== "invalid");
          break;
        case "hash-generator":
          assert.equal(
            (await generateHash(example.input, example.algorithm ?? "SHA-256"))
              .ok,
            true,
          );
          break;
      }
    }
  });
}
