export const BASE_STYLE = `
  :root {
    color-scheme: light dark;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  }

  body {
    margin: 0;
    padding: 2rem;
    line-height: 1.6;
    background: #ffffff;
    color: #0f172a;
  }

  main {
    max-width: 72rem;
    margin: 0 auto;
  }

  pre {
    overflow-x: auto;
    padding: 1rem;
    border-radius: 0.75rem;
    background: #f8fafc;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, SFMono, Menlo, Consolas, monospace;
  }

  .mdr-render-block {
    margin: 1.5rem 0;
  }

  .mdr-render-block svg {
    max-width: 100%;
    height: auto;
  }

  .mdr-source {
    display: none;
  }

  .mdr-render-block[data-render-state="failed"] {
    border: 1px solid #dc2626;
    border-radius: 0.75rem;
    padding: 1rem;
  }
`

export const SVG_TAGS = [
  'svg',
  'g',
  'path',
  'circle',
  'ellipse',
  'rect',
  'line',
  'polyline',
  'polygon',
  'text',
  'tspan',
  'defs',
  'marker',
  'pattern',
  'clipPath',
  'title',
  'desc',
] as const

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')
}
