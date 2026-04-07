import rehypeParse from 'rehype-parse'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import { SVG_TAGS } from './constants'

type SanitizeSchema = Exclude<Parameters<typeof rehypeSanitize>[0], boolean | null | undefined>

export function createSanitizeSchema(): SanitizeSchema {
  const tagNames = [...new Set([...(defaultSchema.tagNames || []), ...SVG_TAGS])]
  const globalAttributes = [...(defaultSchema.attributes?.['*'] || []), 'className', 'data*']

  return {
    ...defaultSchema,
    tagNames,
    attributes: {
      ...defaultSchema.attributes,
      '*': globalAttributes,
      'div': [...(defaultSchema.attributes?.div || []), 'data*', ['className', /^mdr-/]],
      'pre': [...(defaultSchema.attributes?.pre || []), ['className', /^mdr-/]],
      'span': ['className', 'ariaHidden'],
      'svg': ['viewBox', 'xmlns', 'role', 'ariaLabel', 'ariaHidden', 'focusable', 'width', 'height'],
      'g': ['fill', 'stroke', 'strokeWidth', 'transform'],
      'path': ['d', 'fill', 'stroke', 'strokeWidth', 'transform'],
      'circle': ['cx', 'cy', 'r', 'fill', 'stroke', 'strokeWidth'],
      'ellipse': ['cx', 'cy', 'rx', 'ry', 'fill', 'stroke', 'strokeWidth'],
      'rect': ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'stroke', 'strokeWidth'],
      'line': ['x1', 'x2', 'y1', 'y2', 'stroke', 'strokeWidth'],
      'polyline': ['points', 'fill', 'stroke', 'strokeWidth'],
      'polygon': ['points', 'fill', 'stroke', 'strokeWidth'],
      'text': ['x', 'y', 'dx', 'dy', 'fill', 'textAnchor'],
      'tspan': ['x', 'y', 'dx', 'dy', 'fill', 'textAnchor'],
      'marker': ['id', 'markerWidth', 'markerHeight', 'refX', 'refY', 'orient'],
      'pattern': ['id', 'width', 'height', 'patternUnits'],
      'clipPath': ['id'],
      'title': [],
      'desc': [],
    },
    protocols: {
      ...defaultSchema.protocols,
      href: ['http', 'https', 'mailto'],
      src: ['http', 'https'],
    },
    strip: [...(defaultSchema.strip || []), 'script'],
  }
}

export async function sanitizeRenderedFragment(fragment: string): Promise<string> {
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, createSanitizeSchema())
    .use(rehypeStringify)

  const file = await processor.process(fragment)
  return String(file)
}
