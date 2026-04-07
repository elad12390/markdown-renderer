# markdown-renderer

Render extended markdown into real HTML and SVG.

Supports:

- CommonMark and GFM
- Mermaid diagrams
- KaTeX-style math rendering
- trusted SVG and constrained raw HTML
- Graphviz / DOT fences
- browser-backed static export

## Use

### npx

```bash
npx markdown-renderer render --in input.md --out output.html --mode static
```

### bunx

```bash
bunx markdown-renderer render --in input.md --out output.html --mode static
```

### Client mode

Client mode keeps browser-only renderers as placeholders:

```bash
markdown-renderer render --in input.md --out output.html --mode client
```

### Static mode

Static mode executes browser-only renderers in Chromium and emits final HTML:

```bash
markdown-renderer render --in input.md --out output.html --mode static
```

## Library API

```ts
import { renderToHtmlDocument, renderToStaticHtmlDocument } from 'markdown-renderer'

const clientHtml = await renderToHtmlDocument(markdown)
const staticHtml = await renderToStaticHtmlDocument(markdown)
```

## Local development

```bash
pnpm install
pnpm exec playwright install chromium
pnpm test
pnpm test:e2e
pnpm build
```

## Notes

- Static export uses Playwright + Chromium.
- Local end-to-end tests require a one-time `pnpm exec playwright install chromium`.
- CI installs Chromium before running end-to-end tests.
- Publishing is intended to use npm trusted publishing.

## License

MIT
