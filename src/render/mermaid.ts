import type { Page } from 'playwright'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const mermaidScriptPath = require.resolve('mermaid/dist/mermaid.min.js')

interface MermaidRenderResult {
  svg: string
  bindFunctions?: (element: Element) => void
}

interface MermaidApi {
  initialize: (config: { startOnLoad: boolean, securityLevel: 'strict' }) => void
  render: (id: string, source: string) => Promise<MermaidRenderResult>
}

export async function executeMermaid(page: Page): Promise<void> {
  await page.addScriptTag({ path: mermaidScriptPath })
  await page.evaluate(async () => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-render-kind="mermaid"]'))
    if (blocks.length === 0)
      return

    const mermaid = (window as unknown as { mermaid: MermaidApi }).mermaid
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' })

    for (const [index, block] of blocks.entries()) {
      const source = block.querySelector('.mdr-source')?.textContent || ''

      try {
        const { svg, bindFunctions } = await mermaid.render(`mdr-mermaid-${index}`, source)
        block.innerHTML = svg
        block.setAttribute('data-render-state', 'rendered')
        if (bindFunctions)
          bindFunctions(block)
      }
      catch (error) {
        block.setAttribute('data-render-state', 'failed')
        block.textContent = error instanceof Error ? error.message : String(error)
      }
    }
  })
}
