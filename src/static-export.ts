import type { Browser, Page } from 'playwright'
import { chromium } from 'playwright'
import { executeMermaid } from './render/mermaid'
import { renderToHtmlDocument, wrapDocument } from './render/pipeline'
import { sanitizeRenderedFragment } from './render/sanitize'

export async function renderToStaticHtmlDocument(markdown: string, options: { title?: string } = {}): Promise<string> {
  const clientHtml = await renderToHtmlDocument(markdown, options)
  let browser: Browser | undefined
  let page: Page | undefined

  try {
    browser = await chromium.launch()
    page = await browser.newPage()
    await page.route('**/*', route => route.abort())
    await page.setContent(clientHtml, { waitUntil: 'load' })
    await executeMermaid(page)
    await page.evaluate(() => {
      Array.from(document.querySelectorAll('script')).forEach(script => script.remove())
    })
    const finalFragment = await page.locator('main').innerHTML()
    const sanitizedFragment = await sanitizeRenderedFragment(finalFragment)
    return wrapDocument(sanitizedFragment, options.title)
  }
  finally {
    await page?.close()
    await browser?.close()
  }
}
