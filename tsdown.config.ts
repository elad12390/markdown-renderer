import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
    'src/static-export.ts',
  ],
  dts: true,
  external: [
    '@viz-js/viz',
    'katex',
    'mermaid',
    'playwright',
    'rehype-parse',
    'rehype-raw',
    'rehype-sanitize',
    'rehype-stringify',
    'remark-gfm',
    'remark-math',
    'remark-parse',
    'remark-rehype',
    'unified',
    'unist-util-visit',
  ],
  exports: true,
  platform: 'node',
  publint: true,
})
