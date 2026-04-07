# Project Intent

## Purpose

`markdown-renderer` is a public npm package and CLI for turning extended markdown into real HTML and SVG.

## Product contract

1. The package must work as both a library and a CLI.
2. The CLI must remain simple: `markdown-renderer render --in ... --out ... --mode client|static`.
3. Static export must be proven in a real browser, not simulated.
4. Raw HTML and SVG must be sanitized by default.
5. Distribution quality matters as much as rendering quality: strict typing, linting, CI, build, and publish readiness are part of the product.

## Module map

| Module | Responsibility |
| --- | --- |
| `renderer` | Parse markdown, sanitize content, render deterministic outputs, and execute browser-only renderers during static export |
| `cli` | Accept user input, validate arguments, and write rendered output |
| `distribution` | Build, test, and publish the package safely |
