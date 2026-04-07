# Resolution: Standalone package bootstrap

## Problem

The renderer started life embedded inside the skill repository, so distribution and packaging behaviors were not trustworthy enough for a public npm CLI.

## Resolution

1. Extracted the renderer into a standalone repo based on `antfu/starter-ts`.
2. Kept explicit intent in `.idd/` and behavior in `.bdd/`.
3. Split the renderer into typed modules for pipeline, sanitization, Mermaid execution, Graphviz rendering, and static export.
4. Fixed package-distribution issues:
   - externalized Playwright and runtime renderer dependencies in the build
   - resolved Mermaid asset lookup in the built package
   - added CI and release workflows for npm trusted publishing
5. Verified the package with lint, typecheck, unit tests, Playwright E2E, build, and publint.

## Follow-up constraint

Local E2E verification requires a one-time Chromium install via:

```bash
pnpm exec playwright install chromium
```
