import katex from 'katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { BASE_STYLE, escapeHtml } from './constants'
import { graphvizSvg } from './graphviz'
import { createSanitizeSchema } from './sanitize'

interface HtmlNode {
  type: 'html'
  value: string
}

interface ParentNode {
  children: Array<HtmlNode | unknown>
}

interface BasicNode {
  type: string
}

interface InlineMathNode {
  type: 'inlineMath'
  value: string
}

interface MathNode {
  type: 'math'
  value: string
}

interface CodeNode {
  type: 'code'
  lang?: string | null
  value: string
}

interface Replacement {
  parent: ParentNode
  index: number
  replacement: HtmlNode
  dotSource?: string
}

type VisitTree = Parameters<typeof visit>[0]

function isInlineMathNode(node: BasicNode): node is InlineMathNode {
  return node.type === 'inlineMath'
}

function isMathNode(node: BasicNode): node is MathNode {
  return node.type === 'math'
}

function isCodeNode(node: BasicNode): node is CodeNode {
  return node.type === 'code'
}

function renderKatexHtml(source: string, displayMode: boolean): string {
  return katex.renderToString(source, {
    displayMode,
    output: 'html',
    throwOnError: false,
    strict: 'ignore',
  })
}

function remarkRendererExtensions() {
  return async function transform(tree: unknown) {
    const replacements: Replacement[] = []

    visit(tree as VisitTree, (node, index, parent) => {
      const currentNode = node as BasicNode
      const currentIndex = index as number | undefined
      const currentParent = parent as ParentNode | undefined

      if (!currentParent || currentIndex === undefined)
        return

      if (isInlineMathNode(currentNode)) {
        replacements.push({
          parent: currentParent,
          index: currentIndex,
          replacement: {
            type: 'html',
            value: renderKatexHtml(currentNode.value, false),
          },
        })
        return
      }

      if (isMathNode(currentNode)) {
        replacements.push({
          parent: currentParent,
          index: currentIndex,
          replacement: {
            type: 'html',
            value: renderKatexHtml(currentNode.value, true),
          },
        })
        return
      }

      if (!isCodeNode(currentNode))
        return

      const lang = currentNode.lang?.toLowerCase()
      if (!lang)
        return

      if (lang === 'mermaid') {
        replacements.push({
          parent: currentParent,
          index: currentIndex,
          replacement: {
            type: 'html',
            value: `<div class="mdr-render-block" data-render-kind="mermaid" data-render-state="pending"><pre class="mdr-source">${escapeHtml(currentNode.value)}</pre></div>`,
          },
        })
        return
      }

      if (lang === 'dot' || lang === 'graphviz') {
        replacements.push({
          parent: currentParent,
          index: currentIndex,
          replacement: {
            type: 'html',
            value: '',
          },
          dotSource: currentNode.value,
        })
      }
    })

    for (const item of replacements) {
      if (item.dotSource) {
        item.parent.children[item.index] = {
          type: 'html',
          value: `<div class="mdr-render-block" data-render-kind="graphviz" data-render-state="rendered">${await graphvizSvg(item.dotSource)}</div>`,
        }
        continue
      }

      item.parent.children[item.index] = item.replacement
    }
  }
}

export async function renderFragment(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRendererExtensions)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, createSanitizeSchema())
    .use(rehypeStringify)

  const file = await processor.process(markdown)
  return String(file)
}

export function wrapDocument(fragment: string, title = 'Markdown Renderer'): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <style>${BASE_STYLE}</style>
  </head>
  <body>
    <main>${fragment}</main>
  </body>
</html>`
}

export async function renderToHtmlDocument(markdown: string, options: { title?: string } = {}): Promise<string> {
  const fragment = await renderFragment(markdown)
  return wrapDocument(fragment, options.title)
}
