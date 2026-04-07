import { instance as createViz } from '@viz-js/viz'

export async function graphvizSvg(dotSource: string): Promise<string> {
  const viz = await createViz()
  return viz.renderString(dotSource, { format: 'svg', engine: 'dot' })
}
