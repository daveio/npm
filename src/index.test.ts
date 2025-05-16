import { beforeEach, describe, expect, it, spyOn, test } from 'bun:test'
import pkg from '../package.json'
import main from './index'

// Helper to capture console.log output
let output = ''

beforeEach(() => {
  output = ''
  spyOn(console, 'log').mockImplementation((msg: string) => {
    output += msg
  })
})

describe('main export', () => {
  it('logs the expected intro and version', () => {
    main()
    expect(output).toContain(`Dave Williams (v${pkg.version})`)
    expect(output).toContain('https://') // At least one URL
  })
})
