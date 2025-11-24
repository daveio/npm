import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import main from './index.ts'

describe('main export', () => {
  // Setup variables for testing
  let consoleLogOutput: string[] = []

  beforeEach(() => {
    // Reset and capture console.log output
    consoleLogOutput = []
    spyOn(console, 'log').mockImplementation((msg: string) => {
      consoleLogOutput.push(msg)
    })
  })

  it('logs the expected intro and version', async () => {
    await main()

    // Check that there are console log calls
    expect(consoleLogOutput.length).toBeGreaterThan(0)

    // Check that some essential content is logged
    const allOutput = consoleLogOutput.join('\n')
    expect(allOutput).toContain('https://dave.io') //·Main·website
    expect(allOutput).toContain('https://dave.io/go/') // At least one social link
  })
})
