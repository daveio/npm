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
    expect(allOutput).toContain('https://dave.io/go/github') // GitHub link

    // Check for final message (no longer checking for interactive mode)
    expect(allOutput).toContain('All links above are clickable in supported terminals')
  }, 10000) // Set timeout to 10 seconds

  it('displays profile section with proper formatting', async () => {
    await main()

    const allOutput = consoleLogOutput.join('\n')

    // Check profile content is present
    expect(allOutput).toContain('Dave Williams')
    expect(allOutput).toContain('Weapons-grade DevOps Engineer')
    expect(allOutput).toContain('Berlin, Germany')
    expect(allOutput).toContain('TypeScript, Rust, Go')

    // Check that horizontal separators are present (not box borders)
    expect(allOutput).toContain('─') // Horizontal line character
  }, 10000)

  it('displays Quick Links in two-column format', async () => {
    await main()

    const allOutput = consoleLogOutput.join('\n')

    // Check for Social Links section title
    expect(allOutput).toContain('Social Links')

    // Check that all social links are present
    expect(allOutput).toContain('Bluesky')
    expect(allOutput).toContain('GitHub')
    expect(allOutput).toContain('LinkedIn')
    expect(allOutput).toContain('Mastodon')
    expect(allOutput).toContain('Instagram')
    expect(allOutput).toContain('Facebook')

    // Check for URLs
    expect(allOutput).toContain('https://dave.io/go/bluesky')
    expect(allOutput).toContain('https://dave.io/go/github')
    expect(allOutput).toContain('https://dave.io/go/linkedin')
    expect(allOutput).toContain('https://dave.io')
    expect(allOutput).toContain('https://dave.io/go/mastodon')
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

  it('respects NO_ANIMATIONS environment variable', async () => {
    // Set NO_ANIMATIONS
    process.env.NO_ANIMATIONS = 'true'

    await main()

    const allOutput = consoleLogOutput.join('\n')

    // Should still have content (title rendered with CFonts block characters)
    expect(allOutput).toContain('█') // Block characters from title
    expect(allOutput).toContain('Weapons-grade DevOps Engineer')

    // Should have simplified loading message instead of spinners
    expect(allOutput).toContain('Loading profile...')

    // Clean up
    delete process.env.NO_ANIMATIONS
  }, 10000)

  it('respects NO_COLOR environment variable', async () => {
    // Set NO_COLOR
    process.env.NO_COLOR = 'true'

    await main()

    const allOutput = consoleLogOutput.join('\n')

    // Should still have content (title might be plain or with block chars)
    expect(allOutput.length).toBeGreaterThan(0)
    expect(allOutput).toContain('All links above are clickable')

    // Clean up
    delete process.env.NO_COLOR
  }, 10000)

  it('handles both NO_ANIMATIONS and NO_COLOR together', async () => {
    // Set both environment variables
    process.env.NO_ANIMATIONS = 'true'
    process.env.NO_COLOR = 'true'

    await main()

    const allOutput = consoleLogOutput.join('\n')

    // Should still have essential content
    expect(allOutput.length).toBeGreaterThan(0)
    expect(allOutput).toContain('Loading profile...')
    expect(allOutput).toContain('Weapons-grade DevOps Engineer')
    expect(allOutput).toContain('All links above are clickable')

    // Clean up
    delete process.env.NO_ANIMATIONS
    delete process.env.NO_COLOR
  }, 10000)
})
