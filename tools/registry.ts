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
    relatedTools: ["json-validator", "json-compare", "base64", "jwt-decoder"],
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
      "Validate JSON locally in your browser with useful syntax feedback and no uploads.",
    category: "json",
    icon: "check-braces",
    keywords: ["json", "validate", "lint", "syntax"],
    featured: true,
    popular: true,
    browserOnly: true,
    availability: "available",
    badges: ["browser-only", "privacy-first"],
    examples: [
      {
        id: "valid-object",
        title: "Valid object",
        description: "A small object with common JSON value types.",
        input: '{"name":"DevUtilsHub","browserOnly":true,"version":1}',
        kind: "valid",
      },
      {
        id: "valid-array",
        title: "Valid array",
        description: "An array containing several JSON objects.",
        input: '[{"id":1,"status":"ready"},{"id":2,"status":"pending"}]',
        kind: "valid",
      },
      {
        id: "nested-json",
        title: "Nested JSON",
        description: "A valid object with nested arrays and objects.",
        input:
          '{"user":{"name":"John","roles":["developer","reviewer"],"active":true}}',
        kind: "valid",
      },
      {
        id: "trailing-comma",
        title: "Trailing comma",
        description: "An extra comma before the closing brace.",
        input: '{"name":"DevUtilsHub",}',
        kind: "invalid",
      },
      {
        id: "missing-bracket",
        title: "Missing bracket",
        description: "An array without its closing bracket.",
        input: '{"items":[1,2,3}',
        kind: "invalid",
      },
      {
        id: "single-quotes",
        title: "Single quotes",
        description: "JavaScript-style strings are not valid JSON.",
        input: "{'name':'DevUtilsHub'}",
        kind: "invalid",
      },
    ],
    commonMistakes: [
      {
        title: "Trailing comma",
        description: "Remove the comma before a closing brace or bracket.",
        example: '{"enabled": true,}',
      },
      {
        title: "Missing closing brace or bracket",
        description: "Each opening object or array delimiter needs a match.",
        example: '{"items": [1, 2, 3}',
      },
      {
        title: "Unquoted keys",
        description: "JSON property names must use double quotes.",
        example: '{status: "ready"}',
      },
      {
        title: "Single quotes",
        description:
          "Use double quotes around JSON strings and property names.",
        example: "{'status': 'ready'}",
      },
      {
        title: "Unexpected token",
        description: "Check near the reported location for an extra character.",
        example: '{"count": @}',
      },
      {
        title: "Comments inside JSON",
        description: "Standard JSON does not support line or block comments.",
        example: '{"enabled": true // remove this comment\n}',
      },
    ],
    relatedTools: ["json-formatter", "json-compare", "base64", "jwt-decoder"],
    faq: [
      {
        question: "What is JSON validation?",
        answer:
          "JSON validation checks whether text follows JSON syntax, including correct quotes, commas, values, braces, and brackets.",
      },
      {
        question: "Does validation upload my JSON?",
        answer:
          "No. Validation runs entirely in your browser. Your JSON is never uploaded or sent to DevUtilsHub.",
      },
      {
        question: "Why is my JSON invalid?",
        answer:
          "Common causes include trailing commas, single quotes, unquoted property names, comments, and missing closing braces or brackets.",
      },
      {
        question: "What is the difference between validation and formatting?",
        answer:
          "Validation checks syntax and explains errors. Formatting parses valid JSON and rewrites it with consistent indentation for readability.",
      },
    ],
  },
  {
    slug: "json-compare",
    title: "JSON Compare",
    description:
      "Compare two JSON documents structurally in your browser with local processing and no uploads.",
    category: "json",
    icon: "compare",
    keywords: ["json", "compare", "diff", "difference"],
    featured: true,
    popular: false,
    browserOnly: true,
    availability: "available",
    badges: ["browser-only", "privacy-first"],
    examples: [
      {
        id: "no-changes",
        title: "No changes",
        description:
          "Equivalent objects with different formatting and key order.",
        input: '{\n  "name": "John",\n  "age": 24\n}',
        secondaryInput: '{"age":24,"name":"John"}',
      },
      {
        id: "changed-property",
        title: "Changed property",
        description: "A primitive value changes between documents.",
        input: '{"name":"John","age":24}',
        secondaryInput: '{"name":"John","age":25}',
      },
      {
        id: "added-property",
        title: "Added property",
        description: "JSON B introduces a property that is absent from A.",
        input: '{"name":"John"}',
        secondaryInput: '{"name":"John","age":24}',
      },
      {
        id: "removed-property",
        title: "Removed property",
        description: "JSON B no longer contains a property from A.",
        input: '{"name":"John","age":24}',
        secondaryInput: '{"name":"John"}',
      },
      {
        id: "nested-change",
        title: "Nested change",
        description: "A deeply nested city value changes.",
        input: '{"user":{"name":"John","address":{"city":"Mumbai"}}}',
        secondaryInput: '{"user":{"name":"John","address":{"city":"Delhi"}}}',
      },
      {
        id: "array-change",
        title: "Array change",
        description: "An array item changes at the same index.",
        input: '{"items":["A","B","C"]}',
        secondaryInput: '{"items":["A","X","C","D"]}',
      },
    ],
    commonMistakes: [
      {
        title: "Structural, not textual",
        description:
          "Whitespace and formatting differences do not count as changes.",
      },
      {
        title: "Valid JSON required",
        description:
          "Both inputs must parse successfully before comparison can begin.",
      },
      {
        title: "Property order is ignored",
        description:
          "Objects with the same keys and values are equal regardless of key order.",
      },
      {
        title: "Arrays use indexes",
        description:
          "V1 compares array values at the same index and does not detect moved items.",
        example: "items[1]",
      },
      {
        title: "Not a text diff",
        description:
          "The tool compares parsed JSON values rather than lines or characters.",
      },
    ],
    relatedTools: ["json-formatter", "json-validator", "base64", "jwt-decoder"],
    faq: [
      {
        question: "How does JSON comparison work?",
        answer:
          "Both inputs are parsed, then their objects, arrays, and values are compared recursively. Results identify added, removed, and changed paths.",
      },
      {
        question: "Does formatting or whitespace affect the comparison?",
        answer:
          "No. Whitespace, indentation, and object property order are ignored because comparison happens on parsed JSON values.",
      },
      {
        question: "Can I compare nested JSON?",
        answer:
          "Yes. Nested objects and arrays are compared recursively, and differences use readable paths such as user.address.city.",
      },
      {
        question: "How are arrays compared?",
        answer:
          "Arrays are compared by index in V1. The tool does not attempt to infer moved or matching items.",
      },
      {
        question: "Is my JSON uploaded?",
        answer:
          "No. Parsing and comparison happen entirely in your browser. Neither JSON document is uploaded or sent to DevUtilsHub.",
      },
    ],
  },
  {
    slug: "base64",
    title: "Base64 Encode / Decode",
    description:
      "Encode and decode Base64 text locally in your browser with no uploads—encoding, not encryption.",
    category: "encoding",
    icon: "binary",
    keywords: ["base64", "encode", "decode", "text"],
    featured: true,
    popular: true,
    browserOnly: true,
    availability: "available",
    badges: ["browser-only", "privacy-first"],
    examples: [
      {
        id: "encode-hello-world",
        title: "Hello World",
        description: "Encode a short ASCII greeting.",
        input: "Hello World",
        mode: "encode",
      },
      {
        id: "encode-json",
        title: "JSON text",
        description: "Encode a compact JSON object as UTF-8.",
        input: '{"name":"DevUtilsHub","private":true}',
        mode: "encode",
      },
      {
        id: "encode-url",
        title: "URL-like text",
        description: "Encode text containing URL punctuation.",
        input: "https://devutilshub.com/tools?mode=fast",
        mode: "encode",
      },
      {
        id: "encode-unicode",
        title: "Unicode text",
        description: "Encode accents, non-Latin text, and emoji correctly.",
        input: "Café ☕ — こんにちは 🌍",
        mode: "encode",
      },
      {
        id: "encode-multiline",
        title: "Multiline text",
        description: "Preserve line breaks through a Base64 round trip.",
        input: "first line\nsecond line",
        mode: "encode",
      },
      {
        id: "decode-hello-world",
        title: "Hello World Base64",
        description: "Decode a familiar Base64 value.",
        input: "SGVsbG8gV29ybGQ=",
        mode: "decode",
      },
      {
        id: "decode-json",
        title: "JSON Base64",
        description: "Decode Base64 back into JSON text.",
        input: "eyJzdGF0dXMiOiJyZWFkeSIsImNvdW50IjozfQ==",
        mode: "decode",
      },
      {
        id: "decode-unicode",
        title: "Unicode Base64",
        description: "Decode UTF-8 non-Latin text and emoji.",
        input: "4KSo4KSu4KS44KWN4KSk4KWHIPCfkYs=",
        mode: "decode",
      },
    ],
    commonMistakes: [
      {
        title: "Encoding, not encryption",
        description:
          "Base64 is reversible representation and provides no confidentiality.",
      },
      {
        title: "Not password protection",
        description:
          "Anyone can decode Base64 without a password or secret key.",
      },
      {
        title: "Larger output",
        description:
          "Base64 typically increases data size by roughly one third.",
      },
      {
        title: "No key required",
        description:
          "Decoding uses a public character mapping, not a cryptographic key.",
      },
      {
        title: "Malformed input",
        description:
          "Unexpected characters, length, or padding can make Base64 invalid.",
        example: "SGVsbG8===",
      },
      {
        title: "UTF-8 matters",
        description:
          "Text must be converted to and from UTF-8 bytes to preserve Unicode.",
      },
    ],
    relatedTools: [
      "json-formatter",
      "json-validator",
      "json-compare",
      "url-encode-decode",
      "jwt-decoder",
    ],
    faq: [
      {
        question: "What is Base64?",
        answer:
          "Base64 represents bytes using a limited set of text characters, which is useful when data needs to travel through text-oriented systems.",
      },
      {
        question: "Is Base64 encryption?",
        answer:
          "No. Base64 is encoding, not encryption. It provides no secrecy or protection because anyone can reverse it.",
      },
      {
        question: "Can Base64 be decoded without a key?",
        answer:
          "Yes. Base64 uses a public reversible mapping and never requires a secret key.",
      },
      {
        question: "Does Base64 work with Unicode?",
        answer:
          "Yes. DevUtilsHub converts text through UTF-8 bytes, preserving accented characters, emoji, and non-Latin scripts.",
      },
      {
        question: "Does Base64 increase the size of data?",
        answer:
          "Yes. Base64 output is generally about 33% larger than the original bytes, with small variations from padding.",
      },
      {
        question: "Is my input uploaded?",
        answer:
          "No. Encoding and decoding happen entirely in your browser. Your input is never uploaded or sent to DevUtilsHub.",
      },
    ],
  },
  {
    slug: "url-encode-decode",
    title: "URL Encode / Decode",
    description:
      "Encode and decode URL components with browser-only percent encoding, local processing, and no uploads—encoding, not encryption.",
    category: "encoding",
    icon: "wrench",
    keywords: ["url", "encode", "decode", "percent", "uri"],
    featured: false,
    popular: true,
    browserOnly: true,
    availability: "available",
    badges: ["browser-only", "privacy-first"],
    examples: [
      {
        id: "simple-text",
        title: "Simple text",
        description: "Encode a space in a short text value.",
        input: "Hello World",
        mode: "encode",
      },
      {
        id: "query-parameter",
        title: "Query parameter",
        description: "Encode a value containing spaces and an ampersand.",
        input: "search term & filters",
        mode: "encode",
      },
      {
        id: "special-characters",
        title: "Special characters",
        description: "Encode URL-reserved punctuation inside a component.",
        input: "hello@example.com?test=1&mode=full",
        mode: "encode",
      },
      {
        id: "unicode",
        title: "Unicode",
        description: "Encode non-Latin text using UTF-8 percent sequences.",
        input: "नमस्ते दुनिया",
        mode: "encode",
      },
      {
        id: "emoji",
        title: "Emoji",
        description: "Encode an emoji alongside ordinary text.",
        input: "DevUtilsHub 🚀",
        mode: "encode",
      },
      {
        id: "already-encoded",
        title: "Already encoded",
        description: "Decode a percent-encoded space.",
        input: "hello%20world",
        mode: "decode",
      },
      {
        id: "url-component",
        title: "URL component",
        description: "Encode a location used as a parameter value.",
        input: "Mumbai & Maharashtra",
        mode: "encode",
      },
      {
        id: "multiline-text",
        title: "Multiline text",
        description: "Encode line breaks and punctuation predictably.",
        input: "first line\nsecond line & notes",
        mode: "encode",
      },
    ],
    commonMistakes: [
      {
        title: "Encoding, not encryption",
        description:
          "Percent encoding is reversible and provides no confidentiality or security.",
      },
      {
        title: "Spaces become %20",
        description:
          "encodeURIComponent represents spaces as %20 rather than a plus sign.",
        example: "hello%20world",
      },
      {
        title: "Hexadecimal bytes",
        description:
          "Percent sequences represent encoded UTF-8 bytes using hexadecimal values.",
        example: "%E2%9C%93",
      },
      {
        title: "Components are not full URLs",
        description:
          "Encoding an entire URL also escapes structural separators such as :, /, ?, and &.",
      },
      {
        title: "Avoid accidental double encoding",
        description:
          "Encoding an existing % sequence turns the percent sign into %25.",
        example: "%2520",
      },
      {
        title: "Malformed sequences",
        description:
          "Incomplete or non-hexadecimal percent sequences cannot be decoded.",
        example: "abc%2G",
      },
    ],
    relatedTools: [
      "json-formatter",
      "json-validator",
      "json-compare",
      "base64",
      "jwt-decoder",
    ],
    faq: [
      {
        question: "What is URL encoding?",
        answer:
          "URL encoding, or percent encoding, represents characters as URL-safe UTF-8 byte sequences such as %20 for a space.",
      },
      {
        question: "Is URL encoding encryption?",
        answer:
          "No. URL encoding is reversible and provides no confidentiality, authentication, password protection, or security.",
      },
      {
        question: "Why are spaces encoded as %20?",
        answer:
          "encodeURIComponent uses percent encoding for spaces. A plus sign for spaces belongs to form-style application/x-www-form-urlencoded data.",
      },
      {
        question:
          "What is the difference between URL component encoding and encoding a full URL?",
        answer:
          "Components are individual values or path pieces. Full URLs contain separators such as :, /, ?, and &, whose structural meaning should usually be preserved.",
      },
      {
        question: "Can URL encoding handle Unicode?",
        answer:
          "Yes. Browser-native component encoding converts Unicode text into UTF-8 percent sequences and decodes them back to text.",
      },
      {
        question: "What happens if the input is already encoded?",
        answer:
          "Encoding it again will encode percent signs as %25. Decode first unless double encoding is intentional.",
      },
      {
        question: "Is my input uploaded?",
        answer:
          "No. Encoding and decoding happen entirely in your browser. Your input is never uploaded or sent to DevUtilsHub.",
      },
    ],
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Decode JWT headers, payloads, and claims locally with no uploads—signature not verified.",
    category: "authentication-developer",
    icon: "key",
    keywords: ["jwt", "token", "decode", "claims", "authentication"],
    featured: false,
    popular: true,
    browserOnly: true,
    availability: "available",
    badges: ["browser-only", "privacy-first"],
    examples: [
      {
        id: "basic-jwt",
        title: "Basic demonstration JWT",
        description: "Harmless sample subject and name claims.",
        input:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJuYW1lIjoiRGV2VXRpbHNIdWIgRGVtbyJ9.ZGVtby1zaWduYXR1cmU",
      },
      {
        id: "common-claims",
        title: "Common time claims",
        description: "Demonstrates issued-at and future expiration timestamps.",
        input:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6NDEwMjQ0NDgwMH0.ZGVtby1zaWduYXR1cmU",
      },
      {
        id: "expired-token",
        title: "Expired timestamp",
        description: "A demonstration payload with an expiration in the past.",
        input:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJleHAiOjE2MDAwMDAwMDB9.ZGVtby1zaWduYXR1cmU",
      },
      {
        id: "future-not-before",
        title: "Future not-before",
        description: "A demonstration payload that is not active yet.",
        input:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJuYmYiOjQxMDI0NDQ4MDB9.ZGVtby1zaWduYXR1cmU",
      },
      {
        id: "custom-claims",
        title: "Custom claims",
        description: "Nested, Boolean, null, Unicode, and emoji sample values.",
        input:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGV2ZWxvcGVyIiwibG9jYWxlIjoiaGktSU4iLCJtZXNzYWdlIjoi4KSo4KSu4KS44KWN4KSk4KWHIPCfkYsiLCJwcm9maWxlIjp7InRoZW1lIjoiZGFyayJ9LCJhY3RpdmUiOnRydWUsInNjb3JlIjpudWxsfQ.ZGVtby1zaWduYXR1cmU",
      },
      {
        id: "invalid-jwt",
        title: "Invalid JWT",
        description: "An intentionally malformed value for testing feedback.",
        input: "not-a-jwt",
        kind: "invalid",
      },
    ],
    commonMistakes: [
      {
        title: "Three sections",
        description:
          "A standard JWT normally contains header, payload, and signature sections separated by dots.",
        example: "header.payload.signature",
      },
      {
        title: "Base64URL, not Base64",
        description:
          "JWT sections use URL-safe characters and commonly omit padding.",
      },
      {
        title: "Encoded, not encrypted",
        description:
          "Header and payload contents can be decoded without a password or key.",
      },
      {
        title: "Decoding is not verification",
        description:
          "Readable claims are not proof that a token or its issuer is authentic.",
      },
      {
        title: "Signature not verified",
        description:
          "A signature only provides assurance after cryptographic verification by a trusted party.",
      },
      {
        title: "Unix time claims",
        description:
          "exp, iat, and nbf commonly contain Unix timestamps measured in seconds.",
      },
      {
        title: "Protect production tokens",
        description:
          "Avoid exposing live access tokens unless you understand the security implications.",
      },
    ],
    relatedTools: [
      "json-formatter",
      "json-validator",
      "base64",
      "url-encode-decode",
      "json-compare",
    ],
    faq: [
      {
        question: "What is a JWT?",
        answer:
          "A JSON Web Token is a compact format for carrying JSON claims in Base64URL-encoded sections, often alongside a cryptographic signature.",
      },
      {
        question: "Can this tool verify a JWT?",
        answer:
          "No. DevUtilsHub only decodes and inspects the token. It does not verify the signature, issuer, audience, or trustworthiness.",
      },
      {
        question: "Is a JWT encrypted?",
        answer:
          "A typical signed JWT is encoded, not encrypted. Anyone holding it can decode its header and payload.",
      },
      {
        question: "What are the three parts of a JWT?",
        answer:
          "They are the Base64URL-encoded header, Base64URL-encoded payload, and encoded signature, separated by dots.",
      },
      {
        question: "What do exp, iat, and nbf mean?",
        answer:
          "exp is expiration time, iat is issued-at time, and nbf is not-before time. They are commonly Unix timestamps in seconds.",
      },
      {
        question: "Is my JWT uploaded?",
        answer:
          "No. Decoding happens entirely in your browser. The token is not uploaded or sent to DevUtilsHub.",
      },
      {
        question: "Should I paste a production access token here?",
        answer:
          "Avoid exposing production credentials unnecessarily. Browser-local processing reduces transmission risk but does not make sharing sensitive tokens consequence-free.",
      },
    ],
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description:
      "Generate random UUID v4 identifiers locally with browser-native cryptography and no uploads.",
    category: "utilities",
    icon: "fingerprint",
    keywords: ["uuid", "uuid v4", "guid", "identifier", "random"],
    featured: false,
    popular: true,
    browserOnly: true,
    availability: "available",
    badges: ["browser-only", "privacy-first"],
    examples: [],
    commonMistakes: [
      {
        title: "Identifiers, not secrets",
        description:
          "UUIDs identify records and resources, but should not be treated as passwords or access tokens.",
      },
      {
        title: "Random UUID v4",
        description:
          "Version 4 UUIDs use random bits rather than timestamps or sequential values.",
        example: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
      },
      {
        title: "Collisions are negligible, not impossible",
        description:
          "UUID v4 has an enormous address space, making accidental collisions statistically negligible for ordinary use.",
      },
      {
        title: "No embedded metadata",
        description:
          "A UUID v4 does not encode a creation time, user identity, or database sequence.",
      },
      {
        title: "Not authentication",
        description:
          "Possessing or guessing an identifier must not grant authorization to protected data.",
      },
      {
        title: "Store the canonical text form",
        description:
          "The familiar lowercase 8-4-4-4-12 representation is portable across systems.",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
    ],
    relatedTools: [
      "json-formatter",
      "base64",
      "url-encode-decode",
      "jwt-decoder",
    ],
    faq: [
      {
        question: "What is a UUID?",
        answer:
          "A UUID is a 128-bit identifier designed to be unique across systems without requiring a central numbering service.",
      },
      {
        question: "Which UUID version does this tool generate?",
        answer:
          "DevUtilsHub generates UUID version 4 values using the browser-native crypto.randomUUID() API.",
      },
      {
        question: "Can two UUID v4 values collide?",
        answer:
          "A collision is theoretically possible, but the probability is statistically negligible for typical application workloads.",
      },
      {
        question: "Are UUIDs secure secrets?",
        answer:
          "No. UUIDs are identifiers, not passwords, authentication credentials, encryption, or authorization controls.",
      },
      {
        question: "Are UUIDs generated locally?",
        answer:
          "Yes. Generation happens through your browser's cryptographic API. No UUID request or generated value is sent to DevUtilsHub.",
      },
      {
        question: "Why can I generate up to 100 at once?",
        answer:
          "Batch generation is convenient for fixtures, test data, imports, and other workflows that need several independent identifiers.",
      },
    ],
  },
];

export const featuredTools = tools.filter((tool) => tool.featured);
export const popularTools = tools.filter((tool) => tool.popular);

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
