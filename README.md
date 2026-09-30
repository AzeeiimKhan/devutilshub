# DevUtilsHub

Developer tools that never leave your browser.

DevUtilsHub is a privacy-first developer utility interface built with Next.js,
TypeScript, Tailwind CSS, and shadcn/ui conventions. This repository currently
contains the production-ready application shell and metadata-driven tool
catalog. Tool processing is intentionally not implemented yet.

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
- Local theme preference handling
- No backend, authentication, database, uploads, or utility processing
