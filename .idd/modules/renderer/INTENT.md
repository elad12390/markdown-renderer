# Renderer Intent

## Goal

Render extended markdown into verified HTML and SVG in two modes:

- `client`: emit HTML with placeholders for browser-only renderers
- `static`: emit final HTML after real browser execution

## Required behavior

| Input | Expected behavior |
| --- | --- |
| Normal markdown | Render through CommonMark/GFM |
| Mermaid fence | Become a real SVG in static export mode |
| Inline and block math | Render through KaTeX output |
| Trusted SVG | Survive sanitization |
| Safe custom HTML | Survive the sanitization allowlist |
| Dangerous raw content | Be stripped or neutralized |
| DOT fence | Render to SVG without an external Graphviz binary |

## Constraints

1. Use real browser verification for static export.
2. Default to safe sanitization.
3. Keep the package installable and runnable through `npx` and `bunx`.
4. Keep the CLI surface area intentionally small.

## Acceptance examples

### Example: mixed markdown document

Given a markdown document containing:
- standard markdown and GFM features
- Mermaid
- math
- trusted SVG
- Graphviz/DOT

When static export runs

Then the output contains rendered HTML structure, Mermaid SVG, KaTeX markup, preserved trusted SVG, and Graphviz SVG.

### Example: unsafe raw content

Given markdown containing script tags or dangerous attributes such as `onclick` or `onload`

When rendering runs

Then dangerous content is removed and the exported HTML contains no executable user markup.
