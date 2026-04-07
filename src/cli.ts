#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

export type RenderMode = 'client' | 'static'

export interface ParsedArgs {
  command?: string
  input?: string
  output?: string
  mode: string
}

export function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = { mode: 'client' }
  let index = 0

  if (argv[0] && !argv[0].startsWith('-')) {
    result.command = argv[0]
    index = 1
  }

  for (; index < argv.length; index += 1) {
    const current = argv[index]
    const next = argv[index + 1]

    if (current === '--in') {
      result.input = next
      index += 1
      continue
    }

    if (current === '--out') {
      result.output = next
      index += 1
      continue
    }

    if (current === '--mode') {
      result.mode = next || result.mode
      index += 1
    }
  }

  return result
}

function isRenderMode(value: string): value is RenderMode {
  return value === 'client' || value === 'static'
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))

  if (args.command && args.command !== 'render')
    throw new Error(`Unknown command: ${args.command}. Expected render.`)

  if (!args.input || !args.output)
    throw new Error('Usage: markdown-renderer render --in <file.md> --out <file.html> [--mode client|static]')

  if (!isRenderMode(args.mode))
    throw new Error(`Invalid mode: ${args.mode}. Expected client or static.`)

  const { renderToHtmlDocument, renderToStaticHtmlDocument } = await import('./index')
  const markdown = await readFile(path.resolve(args.input), 'utf8')
  const html = args.mode === 'static'
    ? await renderToStaticHtmlDocument(markdown)
    : await renderToHtmlDocument(markdown)

  await writeFile(path.resolve(args.output), html, 'utf8')
}

const isDirectRun = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  void main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error))
    process.exitCode = 1
  })
}
