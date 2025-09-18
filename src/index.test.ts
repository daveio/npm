import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import main from './index.js'

describe('main export', () => {
  // Setup variables for testing
  let consoleLogOutput: string[] = []
  let consoleClearCalled = false

  beforeEach(() => {
    // Reset and capture console.log output
    consoleLogOutput = []
    consoleClearCalled = false

    spyOn(console, 'log').mockImplementation((msg: string) => {
      consoleLogOutput.push(msg)
    })

    spyOn(console, 'clear').mockImplementation(() => {
      consoleClearCalled = true
    })

    // Mock process.stdout.write to prevent terminal control sequences
    spyOn(process.stdout, 'write').mockImplementation(() => true)

    // Mock process.stdin and stdout for non-interactive mode
    process.stdin.isTTY = false
    process.stdout.isTTY = false

    // Mock terminal dimensions
    process.stdout.columns = 80
    process.stdout.rows = 24
  })

  it('logs the expected intro and version', async () => {
    // Set a longer timeout for this test since it has animations
    await main()

    // Check that console.clear was called
    expect(consoleClearCalled).toBe(true)

    // Check that there are console log calls
    expect(consoleLogOutput.length).toBeGreaterThan(0)

    // Check that some essential content is logged
    const allOutput = consoleLogOutput.join('\n')

    // Check for the title in the output (it's rendered with CFonts)
    expect(allOutput).toContain('█') // The block characters from the title

    // Check for social links
    expect(allOutput).toContain('https://dave.io') // Main website
    expect(allOutput).toContain('https://dave.io/go/') // At least one social link

    // Check for final message (no longer checking for interactive mode)
    expect(allOutput).toContain('All links above are clickable in supported terminals')
  }, 10000) // Set timeout to 10 seconds
})
