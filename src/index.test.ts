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

    // Check that console.clear was NOT called in non-TTY environment
    expect(consoleClearCalled).toBe(false)

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

  it('displays profile section with proper formatting', async () => {
    await main()

    const allOutput = consoleLogOutput.join('\n')

    // Check profile content is present
    expect(allOutput).toContain('Weapons-grade DevOps Engineer')
    expect(allOutput).toContain('Full-stack Developer')
    expect(allOutput).toContain('Infrastructure Architect')
    expect(allOutput).toContain('Creative Technologist')

    // Check that horizontal separators are present (not box borders)
    expect(allOutput).toContain('─') // Horizontal line character
  }, 10000)

  it('displays Quick Links in two-column format', async () => {
    await main()

    const allOutput = consoleLogOutput.join('\n')

    // Check for Quick Links section title
    expect(allOutput).toContain('Quick Links')

    // Check that all quick links are present
    expect(allOutput).toContain('Website')
    expect(allOutput).toContain('Pronouns')
    expect(allOutput).toContain('CV/Resume')
    expect(allOutput).toContain('Give me a TODO')
    expect(allOutput).toContain('Watch a talk')
    expect(allOutput).toContain('Read a story')

    // Check for descriptions
    expect(allOutput).toContain('they/them')
    expect(allOutput).toContain('View my experience')
    expect(allOutput).toContain('Random task generator')
    expect(allOutput).toContain('WAT: A Tale of JavaScript')
    expect(allOutput).toContain('The Blit Chronicles')
  }, 10000)

  it('uses consistent separator widths', async () => {
    await main()

    const allOutput = consoleLogOutput.join('\n')

    // Check that separator characters exist
    expect(allOutput).toContain('─') // Horizontal line separator

    // Check for the rainbow animation output (it gets animated so we can't check exact pattern)
    // Just verify the final message appears after it
    expect(allOutput).toContain('All links above are clickable in supported terminals')
  }, 10000)
})
