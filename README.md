# markdown-renderer-cli

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
npx markdown-renderer-cli render --in input.md --out output.html --mode static
```

### bunx

```bash
bunx markdown-renderer-cli render --in input.md --out output.html --mode static
```

### Client mode

Client mode keeps browser-only renderers as placeholders:

```bash
npx markdown-renderer-cli render --in input.md --out output.html --mode client
```

### Static mode

Static mode executes browser-only renderers in Chromium and emits final HTML:

```bash
npx markdown-renderer-cli render --in input.md --out output.html --mode static
```

## Library API

```ts
import { renderToHtmlDocument, renderToStaticHtmlDocument } from 'markdown-renderer-cli'

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
- The npm package name and executable are both `markdown-renderer-cli` for the first public release.

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for the first-release and trusted-publishing steps.

## License

MIT
