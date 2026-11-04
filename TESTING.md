# Testing DevUtilsHub

Use Node.js 24 and npm. Tests use local inputs and a local Next.js production
server; no credentials, production data, or external tool services are needed.
On Windows PowerShell, use `npm.cmd`/`npx.cmd` if script execution is restricted.

## Install and run

```sh
npm ci
npm run test:install
npm test
```

Playwright, axe-core and the TypeScript unit runner are development dependencies
in `package.json` and `package-lock.json`. `test:install` downloads Chromium. On
Linux, use `npx playwright install --with-deps chromium` for system libraries too.

```sh
npm run test:unit
npm run test:e2e
npm run test:e2e -- tests/e2e/json-formatter.spec.ts
npm run test:e2e:ui
npm run test:e2e:report
```

`test:e2e` builds the application, then Playwright starts `next start` on
`http://127.0.0.1:3100`, waits for HTTP readiness, and stops the server afterward.
Port 3100 must be free; existing servers are deliberately not reused. To run
against an already built local production bundle without rebuilding:

```sh
npm run build
npm run test:e2e:built
npm run test:e2e:built -- tests/e2e/timestamp-converter.spec.ts
```

Playwright runs headless Chromium with one worker because the real system
clipboard is shared. CI retries failures twice and rejects `test.only`. Local
runs do not retry. Failures retain screenshots and traces in `test-results/`;
the HTML report is in `playwright-report/`. Open a trace with
`npx playwright show-trace <path-to-trace.zip>`. Generated artifacts and browser
installations are excluded from Git, Prettier, and ESLint.

## Coverage and maintenance

Homepage tests cover the featured tools, search, category targets, popular tool
list and FAQ already present on `main`. Navigation checks verify each link's
actual destination and anchor target, so they do not require the separate
`feature/homepage-catalog` branch or its catalog IDs and copy.

`tests/e2e/` has a spec for each of the nine tools, plus homepage, navigation,
and responsive specs. Shared fixtures check uncaught exceptions and console
errors and reject input-bearing network requests. Only the explicit 404 test
allows the browser's expected 404 resource error. Tests use accessible names,
labels, roles, and stable element IDs; they wait for observable state, without
fixed sleep delays. Encoding, example and clipboard-failure cases share helpers in
`tests/e2e/support/`.

Coverage includes valid/invalid/empty inputs, transformations, available
shortcuts, mode changes, supplied examples, real clipboard reads and downloaded
file contents. Hash tests use fixed SHA-256/SHA-1/MD5 reference digests. UUID
tests check v4 format and batch uniqueness. Timestamp tests cover explicit units,
negative values, fractional precision, UTC/local interpretation and range errors.
UUID has no text input or examples; unsupported quantities are covered by unit
tests. Unit example checks only register for tools with examples; separate cases
cover partial UUID generation failure and local timestamp round trips.
JSON Compare has no download action. Responsive checks cover every route
at 390, 768 and 1280 pixels, plus populated tool results at 320 pixels, in both
themes. Axe scans check WCAG A/AA rules; automated checks do not replace manual
keyboard, screen-reader, visual, or cross-browser review.

## Local quality checks

```sh
npm run format
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run test:e2e:built
```

`typecheck` runs `next typegen` before TypeScript so fresh checkouts have the
generated route and layout types without requiring a prior build.

`format` writes formatting changes across the project; CI uses `format:check`.
ESLint retains Next.js Core Web Vitals and TypeScript rules without overrides.

## GitHub Actions

`.github/workflows/ci.yml` runs on pull requests targeting `main` and pushes to
`main`. It installs from the lockfile, checks formatting, lint and types, runs
unit tests, builds production, installs Chromium, and tests that build. npm's
download cache and Playwright's revisioned browser cache are keyed from the
lockfile; Linux system dependencies are installed even on a browser cache hit.
Reports and diagnostics are uploaded for 14 days, including after test failures.
The workflow has read-only repository permissions and no deployment step or
deployment secrets. Vercel deployment settings are unchanged. Making this check
a required merge gate requires repository branch protection/ruleset settings.

## Timestamp Converter lint audit

The two reported errors reproduce against the committed `HEAD` version of
`features/timestamp-converter/components/timestamp-converter-tool.tsx`:

- **159:19 — `react-hooks/set-state-in-effect`:**
  `useEffect(() => setBrowserTimezone(getBrowserTimezone()), [])` synchronously
  updates state inside an effect, causing an extra render. The existing working
  tree already replaces this effect and state with `useSyncExternalStore`, a
  stable no-op subscription, the browser timezone snapshot, and a stable server
  fallback. This preserves hydration behavior without an effect-driven update.
- **229:44 — `react-hooks/purity`:** the compiler-backed rule reports
  `Date.now()` in `selectExample` as an impure render call. This function is
  actually invoked by the example button's click handler. The existing working
  tree already reads `new Date().getTime()` inside that event handler, matching
  the tool's current-time action. It keeps clock reads outside rendering.

Both corrections predated this testing task and are preserved. The working-tree
full-project lint baseline passes. No lint rule has been disabled or weakened;
only generated browser artifacts are added to ignores.
