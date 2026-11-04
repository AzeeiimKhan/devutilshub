# DevUtilsHub

Developer tools that never leave your browser.

DevUtilsHub is a privacy-first developer utility interface built with Next.js,
TypeScript, Tailwind CSS, and shadcn/ui conventions. This repository currently
contains the production-ready application shell, metadata-driven tool catalog,
and a reusable Tool Engine with nine implemented utilities: JSON Formatter,
JSON Validator, JSON Compare, Base64 Encode / Decode, URL Encode / Decode,
JWT Decoder, UUID Generator, Timestamp Converter, and Hash Generator.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run test:unit
npm run test:e2e
```

The unit suite covers valid and invalid inputs, Unicode, precision and range
boundaries, large JSON arrays, reference hash values, and the supplied examples.
The browser suite tests every page at 390, 768, and 1280 pixels, both themes,
automated WCAG accessibility checks, navigation, keyboard interactions, tool
results, clipboard access and denial, downloads, and 404 recovery. Tests run
against a production build on port 3100 and check for browser errors and input
submission over the network.

Install Playwright Chromium on every platform with `npm run test:install`.
Firefox and Safari are not covered by this configuration. See [TESTING.md](TESTING.md)
for installation, individual specs, production-build runs, CI, and lint audit details.

Run `npm test` for both suites. Browser reports are saved in `playwright-report/`,
with JSON results and failure screenshots/traces in `test-results/`.

## Current scope

- Dark-first responsive homepage
- Accessible navigation, search, tool cards, category cards, FAQ, and footer
- Typed tool metadata registry
- Dynamic `/tools/[slug]` routing with a custom not-found state
- Reusable tool-page shell, workspace, examples, related tools, and FAQ sections
- Local-only JSON formatting, minification, validation, and comparison
- Base64 and URL component encoding and decoding, and JWT inspection
- UUID v4 generation, timestamp conversion, and SHA-256, SHA-1, and MD5 hashing
- Copying, downloads, examples, and keyboard shortcuts where applicable
- Local theme preference handling
- No backend, authentication, database, uploads, or external processing

## Privacy and sharing

JSON processing runs synchronously in the browser. The Share action copies the
clean tool URL only; it deliberately excludes JSON state so sensitive or large
payloads are not placed in browser history. URL state sharing can be added later
as an isolated opt-in feature if a suitable size and privacy policy is defined.
