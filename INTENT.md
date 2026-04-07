# Markdown Renderer Intent

## Goal

Ship a public CLI and library that renders extended markdown into real HTML and SVG.

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

## Modes

| Mode | Purpose |
| --- | --- |
| client | Emit HTML with placeholders for browser-only renderers |
| static | Emit final HTML after browser execution |

## Constraints

1. Use real browser verification for static export.
2. Default to safe sanitization.
3. Keep the package installable and runnable through `npx` and `bunx`.
4. Keep the CLI simple: `markdown-renderer render --in ... --out ... --mode ...`.
