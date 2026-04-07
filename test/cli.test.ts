import { describe, expect, it } from 'vitest'
import { parseArgs } from '../src/cli'

describe('parseArgs', () => {
  it('parses render command and flags', () => {
    expect(parseArgs(['render', '--in', 'file.md', '--out', 'file.html', '--mode', 'static'])).toEqual({
      command: 'render',
      input: 'file.md',
      output: 'file.html',
      mode: 'static',
    })
  })

  it('defaults mode to client', () => {
    expect(parseArgs(['--in', 'a.md', '--out', 'a.html'])).toEqual({
      input: 'a.md',
      output: 'a.html',
      mode: 'client',
    })
  })
})
