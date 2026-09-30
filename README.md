# DevUtilsHub

Developer tools that never leave your browser.

DevUtilsHub is a privacy-first developer utility interface built with Next.js,
TypeScript, Tailwind CSS, and shadcn/ui conventions. This repository currently
contains the production-ready application shell, metadata-driven tool catalog,
and a reusable Tool Engine. JSON Formatter is the first implemented utility.

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
```

## Current scope

- Dark-first responsive homepage
- Accessible navigation, search, tool cards, category cards, FAQ, and footer
- Typed tool metadata registry
- Dynamic `/tools/[slug]` routing with a custom not-found state
- Reusable tool-page shell, workspace, examples, related tools, and FAQ sections
- Local-only JSON formatting, minification, validation, copying, and downloads
- Local theme preference handling
- No backend, authentication, database, uploads, or external processing

## Privacy and sharing

JSON processing runs synchronously in the browser. The Share action copies the
clean tool URL only; it deliberately excludes JSON state so sensitive or large
payloads are not placed in browser history. URL state sharing can be added later
as an isolated opt-in feature if a suitable size and privacy policy is defined.
