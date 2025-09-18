import ansiEscapes from 'ansi-escapes'
import cfonts from 'cfonts'
import chalk from 'chalk'
import cliSpinners from 'cli-spinners'
import Table from 'cli-table3'
import figlet from 'figlet'
import gradientString, { atlas, cristal, pastel, vice } from 'gradient-string'
import { get as getEmoji } from 'node-emoji'
import ora from 'ora'
import sparkly from 'sparkly'
import updateNotifier from 'update-notifier'
import pkg from '../package.json' with { type: 'json' }

// Performance and environment detection
const SKIP_ANIMATIONS = process.env.NO_ANIMATIONS === 'true'
const NO_COLOR = process.env.NO_COLOR === 'true'
const supportsAnsi = process.stdout.isTTY && !NO_COLOR
const termWidth = process.stdout.columns || 80
const termHeight = process.stdout.rows || 24

// Animation configuration
const ANIMATION_CONFIG = {
  // Matrix rain settings
  matrixRain: {
    defaultDuration: 2000,
    maxWidth: 200,
    maxHeight: 50,
    fps: 20,
    frameDelay: 50, // 1000 / fps
    trailLength: 10,
    respawnChance: 0.95,
    performanceThreshold: 2000, // pixels before adaptive delay
    chars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  },
  // Particle effect settings
  particleEffect: {
    defaultDuration: 2000,
    frameDelay: 100,
    particles: ['∙∙∙∙∙', '●∙∙∙∙', '∙●∙∙∙', '∙∙●∙∙', '∙∙∙●∙', '∙∙∙∙●', '∙∙∙∙∙']
  },
  // Glitch effect settings
  glitchEffect: {
    defaultIterations: 15,
    frameDelay: 50,
    glitchThreshold: 0.7,
    glitchChars: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
  },
  // ASCII art settings
  asciiArt: {
    maxWidth: 80,
    font: 'ANSI Shadow'
  },
  // Loading sequence settings
  loadingSequence: {
    spinnerDelay: 500
  },
  // Final animation settings
  finalAnimation: {
    iterations: 3,
    frameDelay: 300
  },
  // Memory limits
  memoryLimits: {
    maxDropsArraySize: 1000,
    maxFrameBufferSize: 50000 // characters
  }
} as const

// Layout constants
const SEPARATOR_WIDTH = 94
// Column width increased from 40 to 44 to accommodate emoji display width variations
// Emojis typically render wider than regular characters, requiring extra space for proper alignment
const COLUMN_WIDTH = 44

// Career start date
const CAREER_START_DATE = new Date('2007-01-01')

// Check for updates at startup
const notifier = updateNotifier({ pkg })
if (notifier.update) {
  notifier.notify()
}

// Define timeout as a utility function for better readability
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// OSC-8 hyperlink utility function to make terminal links clickable
const terminalLink = (text: string, url: string): string => {
  // Validate URL to prevent injection attacks
  try {
    const validUrl = new URL(url)
    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      return text // Return plain text for non-HTTP(S) URLs
    }
    // Sanitize the URL to prevent control character injection
    // biome-ignore lint/suspicious/noControlCharactersInRegex: Intentionally removing control characters for security
    const sanitizedUrl = url.replace(/[\x00-\x1F\x7F]/g, '')
    return `\u001B]8;;${sanitizedUrl}\u0007${text}\u001B]8;;\u0007`
  } catch {
    return text // Return plain text if URL is invalid
  }
}

// Define social media link type for better type safety
interface SocialLink {
  icon: string
  name: string
  url: string
  color: chalk.ChalkFunction
  link: (text: string) => string
  emoji?: string
}

/**
 * Initializes drop positions for the matrix rain animation
 * @param width - Terminal width
 * @param height - Terminal height
 * @returns Float32Array of initial drop positions
 */
function initializeMatrixDrops(width: number, height: number): Float32Array {
  const drops = new Float32Array(width)
  for (let x = 0; x < width; x++) {
    drops[x] = Math.floor(Math.random() * -height)
  }
  return drops
}

/**
 * Calculates adaptive frame delay based on terminal size
 * @param width - Terminal width
 * @param height - Terminal height
 * @returns Frame delay in milliseconds
 */
function calculateAdaptiveDelay(width: number, height: number): number {
  const pixelCount = width * height
  return pixelCount > ANIMATION_CONFIG.matrixRain.performanceThreshold
    ? ANIMATION_CONFIG.matrixRain.frameDelay * 2
    : ANIMATION_CONFIG.matrixRain.frameDelay
}

/**
 * Renders a single frame of the matrix rain animation
 * @param width - Terminal width
 * @param height - Terminal height
 * @param drops - Array of drop positions
 * @param charArray - Array of available characters
 * @returns Rendered frame as string array
 */
function renderMatrixFrame(width: number, height: number, drops: Float32Array, charArray: string[]): string[] {
  const frameBuffer: string[] = []
  frameBuffer.push(ansiEscapes.cursorTo(0, 0))

  const lines: string[] = new Array(height)
  const charLength = charArray.length

  for (let y = 0; y < height; y++) {
    const lineChars: string[] = new Array(width)
    for (let x = 0; x < width; x++) {
      const dropY = drops[x]
      const randomChar = charArray[Math.floor(Math.random() * charLength)]

      if (dropY === y) {
        // Bright green for head of drop
        lineChars[x] = chalk.greenBright(randomChar)
      } else if (dropY === y - 1) {
        // Medium green for second character
        lineChars[x] = chalk.green(randomChar)
      } else if (y > dropY && y < dropY + ANIMATION_CONFIG.matrixRain.trailLength) {
        // Gray for trail (appears above/behind the drop head)
        lineChars[x] = chalk.gray(randomChar)
      } else {
        lineChars[x] = ' '
      }
    }
    lines[y] = lineChars.join('')
  }

  frameBuffer.push(...lines)
  if (height > 0) frameBuffer.push('\n')

  return frameBuffer
}

/**
 * Updates drop positions for the next animation frame
 * @param drops - Array of current drop positions
 * @param width - Terminal width
 * @param height - Terminal height
 */
function updateDropPositions(drops: Float32Array, width: number, height: number): void {
  for (let x = 0; x < width; x++) {
    if (drops[x] >= height && Math.random() > ANIMATION_CONFIG.matrixRain.respawnChance) {
      drops[x] = 0
    }
    drops[x]++
  }
}

/**
 * Creates a matrix-style rain animation effect in the terminal
 * @param duration - Duration of the animation in milliseconds
 * @returns Promise that resolves when animation completes
 * @throws Never throws - falls back gracefully on errors
 */
async function matrixRain(duration = ANIMATION_CONFIG.matrixRain.defaultDuration): Promise<void> {
  // Skip animation if disabled or not in TTY
  if (SKIP_ANIMATIONS || !supportsAnsi) {
    return
  }

  return new Promise<void>((resolve) => {
    const chars = ANIMATION_CONFIG.matrixRain.chars
    const width = Math.min(termWidth, ANIMATION_CONFIG.matrixRain.maxWidth)
    const height = Math.min(termHeight, ANIMATION_CONFIG.matrixRain.maxHeight)

    // Memory management: limit array size
    if (width > ANIMATION_CONFIG.memoryLimits.maxDropsArraySize) {
      console.warn('Terminal width exceeds memory limits, skipping animation')
      resolve()
      return
    }

    // Initialize animation state
    const drops = initializeMatrixDrops(width, height)
    const charArray = chars.split('')
    const adaptiveDelay = calculateAdaptiveDelay(width, height)

    process.stdout.write(ansiEscapes.cursorHide)
    process.stdout.write(ansiEscapes.clearScreen)

    const startTime = Date.now()

    const interval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        clearInterval(interval)
        process.stdout.write(ansiEscapes.clearScreen)
        process.stdout.write(ansiEscapes.cursorShow)
        resolve()
        return
      }

      // Memory check before building frame
      const estimatedFrameSize = width * height * 10 // estimate bytes per char
      if (estimatedFrameSize > ANIMATION_CONFIG.memoryLimits.maxFrameBufferSize) {
        clearInterval(interval)
        process.stdout.write(ansiEscapes.clearScreen)
        process.stdout.write(ansiEscapes.cursorShow)
        resolve()
        return
      }

      // Render and display frame
      const frameBuffer = renderMatrixFrame(width, height, drops, charArray)
      process.stdout.write(frameBuffer.join('\n'))

      // Update animation state for next frame
      updateDropPositions(drops, width, height)
    }, adaptiveDelay)
  })
}

/**
 * Creates a particle animation effect around the given text
 * @param text - Text to display with particle effects
 * @param duration - Duration of the animation in milliseconds
 * @returns Promise that resolves when animation completes
 * @throws Never throws - falls back gracefully on errors
 */
async function particleEffect(text: string, duration = ANIMATION_CONFIG.particleEffect.defaultDuration): Promise<void> {
  // Skip animation if disabled
  if (SKIP_ANIMATIONS || !supportsAnsi) {
    console.log(text)
    return
  }

  return new Promise<void>((resolve) => {
    const frames = ANIMATION_CONFIG.particleEffect.particles
    const startTime = Date.now()
    let frameIndex = 0

    const interval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        clearInterval(interval)
        process.stdout.write(`\r${' '.repeat(50)}\r`)
        console.log(vice(text))
        resolve()
        return
      }

      const particles = frames[frameIndex % frames.length]
      process.stdout.write(`\r${particles} ${vice(text)} ${particles}`)
      frameIndex++
    }, ANIMATION_CONFIG.particleEffect.frameDelay)
  })
}

/**
 * Generates ASCII art from text using figlet
 * @param text - Text to convert to ASCII art
 * @returns ASCII art string or original text on error
 * @throws Never throws - returns original text on error
 */
async function generateAsciiArt(text: string): Promise<string> {
  // Fallback for environments that don't support ASCII art
  if (!supportsAnsi) {
    return text
  }

  return new Promise((resolve) => {
    figlet.text(
      text,
      {
        font: ANIMATION_CONFIG.asciiArt.font,
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: Math.min(termWidth, ANIMATION_CONFIG.asciiArt.maxWidth),
        whitespaceBreak: true
      },
      (err, data) => {
        if (err) {
          resolve(text)
        } else {
          resolve(data || text)
        }
      }
    )
  })
}

/**
 * Creates a glitch text animation effect
 * @param text - Text to display with glitch effects
 * @param iterations - Number of glitch iterations
 * @returns Promise that resolves when animation completes
 * @throws Never throws - falls back to plain text on error
 */
async function glitchEffect(text: string, iterations = ANIMATION_CONFIG.glitchEffect.defaultIterations): Promise<void> {
  // Skip animation if disabled
  if (SKIP_ANIMATIONS || !supportsAnsi) {
    console.log(text)
    return
  }

  const glitchChars = ANIMATION_CONFIG.glitchEffect.glitchChars

  try {
    for (let i = 0; i < iterations; i++) {
      let glitched = ''
      for (const char of text) {
        if (Math.random() > ANIMATION_CONFIG.glitchEffect.glitchThreshold) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          glitched += char
        }
      }
      process.stdout.write(`\r${cristal(glitched)}`)
      await sleep(ANIMATION_CONFIG.glitchEffect.frameDelay)
    }
    process.stdout.write(`\r${atlas(text)}`)
  } catch (_err) {
    // Fallback to plain text
    console.log(text)
  }
}

// Display the title with CFonts
async function displayTitle(): Promise<void> {
  const titleRender = cfonts.render('DAVE.IO', {
    font: 'block',
    align: 'center',
    colors: ['cyan', 'magenta'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: ['cyan', 'magenta', 'yellow'],
    independentGradient: false,
    transitionGradient: true,
    env: 'node'
  })
  if (titleRender !== false) {
    console.log(titleRender.string)
  } else {
    console.log(chalk.cyan('DAVE.IO'))
  }
}

// Run loading spinners sequence
async function runLoadingSequence(): Promise<void> {
  if (SKIP_ANIMATIONS || !supportsAnsi) {
    console.log('Loading profile...')
    return
  }

  const spinners = [
    { text: 'Initializing quantum flux capacitor', spinner: cliSpinners.dots12 },
    { text: 'Calibrating neural pathways', spinner: cliSpinners.bouncingBall },
    { text: 'Syncing with the mainframe', spinner: cliSpinners.circleHalves },
    { text: 'Decrypting profile matrix', spinner: cliSpinners.shark },
    { text: 'Loading awesome', spinner: cliSpinners.aesthetic }
  ]

  for (const { text, spinner } of spinners) {
    const oraSpinner = ora({ text, spinner }).start()
    await sleep(ANIMATION_CONFIG.loadingSequence.spinnerDelay)
    oraSpinner.succeed()
  }
}

// Display the profile section
function displayProfile(): void {
  console.log()
  console.log(chalk.cyan('─'.repeat(SEPARATOR_WIDTH)))
  console.log()

  const profileLines = [
    `${getEmoji('rocket')}  Dave Williams`,
    `${getEmoji('wrench')}  Weapons-grade DevOps Engineer`,
    `${getEmoji('house')}  Berlin, Germany`,
    `${getEmoji('cake')}  Coding for ${Math.floor((Date.now() - CAREER_START_DATE.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years`,
    `${getEmoji('heart')}  TypeScript, Rust, Go, Infrastructure as Code`,
    `${getEmoji('briefcase')}  Building the future of developer tools`
  ]

  for (const line of profileLines) {
    const padding = ' '.repeat(20)
    console.log(padding + line)
  }

  console.log()
  console.log(chalk.cyan('─'.repeat(SEPARATOR_WIDTH)))
  console.log()
}

/**
 * Creates a standardized table with consistent styling
 * @param {object} options - Additional style options to override defaults
 * @returns {Table.Table} A configured table instance
 */
function createStyledTable(options = {}): Table.Table {
  return new Table({
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: '   '
    },
    style: {
      'padding-left': 2,
      'padding-right': 2,
      border: [],
      ...options
    },
    colWidths: [COLUMN_WIDTH, COLUMN_WIDTH]
  })
}

/**
 * Display social media links in a two-column table
 * @returns {void}
 */
function displaySocialLinks(): void {
  console.log()
  console.log(chalk.magenta('─'.repeat(SEPARATOR_WIDTH)))
  console.log(chalk.bold(chalk.magenta('   🔗 Social Links')))
  console.log(chalk.magenta('─'.repeat(SEPARATOR_WIDTH)))
  console.log()

  const quickLinksTable = createStyledTable()

  // Add Web and Pronouns sections side by side
  quickLinksTable.push([
    `🌐  ${chalk.greenBright('Web')}\n    ${chalk.greenBright(terminalLink('dave.io', 'https://dave.io'))}\n    ${chalk.white('https://dave.io')}`,
    `⚧  ${chalk.blue('Pronouns')}\n    ${chalk.blue(terminalLink('they/them', 'https://dave.io/gender'))}\n    ${chalk.white('https://dave.io/gender')}`
  ])
  quickLinksTable.push(['', '']) // Empty row

  const socialLinks: SocialLink[] = [
    {
      icon: '🌈',
      name: 'Bluesky',
      url: 'https://dave.io/go/bluesky',
      color: chalk.yellowBright,
      link: (text: string) => chalk.yellowBright(terminalLink(text, 'https://dave.io/go/bluesky'))
    },
    {
      icon: '📓',
      name: 'Dreamwidth',
      url: 'https://dave.io/go/dreamwidth',
      color: chalk.greenBright,
      link: (text: string) => chalk.greenBright(terminalLink(text, 'https://dave.io/go/dreamwidth'))
    },
    {
      icon: '📘',
      name: 'Facebook',
      url: 'https://dave.io/go/facebook',
      color: chalk.blueBright,
      link: (text: string) => chalk.blueBright(terminalLink(text, 'https://dave.io/go/facebook'))
    },
    {
      icon: '🐙',
      name: 'GitHub',
      url: 'https://dave.io/go/github',
      color: chalk.magentaBright,
      link: (text: string) => chalk.magentaBright(terminalLink(text, 'https://dave.io/go/github'))
    },
    {
      icon: '📷',
      name: 'Instagram',
      url: 'https://dave.io/go/instagram',
      color: chalk.redBright,
      link: (text: string) => chalk.redBright(terminalLink(text, 'https://dave.io/go/instagram'))
    },
    {
      icon: '🔗',
      name: 'LinkedIn',
      url: 'https://dave.io/go/linkedin',
      color: chalk.yellowBright,
      link: (text: string) => chalk.yellowBright(terminalLink(text, 'https://dave.io/go/linkedin'))
    },
    {
      icon: '🐘',
      name: 'Mastodon',
      url: 'https://dave.io/go/mastodon',
      color: chalk.greenBright,
      link: (text: string) => chalk.greenBright(terminalLink(text, 'https://dave.io/go/mastodon'))
    },
    {
      icon: '🔮',
      name: 'Pillowfort',
      url: 'https://dave.io/go/pillowfort',
      color: chalk.blueBright,
      link: (text: string) => chalk.blueBright(terminalLink(text, 'https://dave.io/go/pillowfort'))
    },
    {
      icon: '🧵',
      name: 'Threads',
      url: 'https://dave.io/go/threads',
      color: chalk.magentaBright,
      link: (text: string) => chalk.magentaBright(terminalLink(text, 'https://dave.io/go/threads'))
    },
    {
      icon: '📱',
      name: 'Tumblr',
      url: 'https://dave.io/go/tumblr',
      color: chalk.redBright,
      link: (text: string) => chalk.redBright(terminalLink(text, 'https://dave.io/go/tumblr'))
    },
    {
      icon: '🎥',
      name: 'YouTube',
      url: 'https://dave.io/go/youtube',
      color: chalk.yellowBright,
      link: (text: string) => chalk.yellowBright(terminalLink(text, 'https://dave.io/go/youtube'))
    },
    {
      icon: '☠️',
      name: 'Twitter',
      url: "We don't use Twitter any more.",
      color: chalk.dim,
      link: (text: string) => chalk.dim(text) // No link for Twitter
    }
  ]

  for (let i = 0; i < socialLinks.length; i += 2) {
    const link1 = socialLinks[i]
    const link2 = socialLinks[i + 1]

    // Show clickable name and visible URL separately for better compatibility
    const cell1 = `${link1.icon}  ${link1.link(link1.name)}\n    ${chalk.white(link1.url)}`
    const cell2 = link2 ? `${link2.icon}  ${link2.link(link2.name)}\n    ${chalk.white(link2.url)}` : ''

    quickLinksTable.push([cell1, cell2])
  }

  console.log(quickLinksTable.toString())
}

/**
 * Display quick action links in a two-column table
 * @returns {void}
 */
function displayActionLinks(): void {
  console.log()
  console.log(chalk.yellow('─'.repeat(SEPARATOR_WIDTH)))
  console.log(chalk.bold(chalk.yellow('   ⚡ Quick Actions')))
  console.log(chalk.yellow('─'.repeat(SEPARATOR_WIDTH)))
  console.log()

  const quickLinks = [
    {
      icon: getEmoji('page_facing_up') || '📄',
      name: 'CV/Resume',
      url: 'https://dave.io/go/cv',
      detail: 'View my experience'
    },
    {
      icon: getEmoji('jigsaw') || '🧩',
      name: 'Give me a TODO',
      url: 'https://dave.io/go/todo',
      detail: 'Random task generator'
    },
    {
      icon: getEmoji('microphone') || '🎤',
      name: 'Watch a talk',
      url: 'https://dave.io/go/wat',
      detail: 'WAT: A Tale of JavaScript'
    },
    {
      icon: getEmoji('parrot') || '🦜',
      name: 'Read a story',
      url: 'https://dave.io/go/blit',
      detail: 'The Blit Chronicles'
    }
  ]

  const actionsTable = createStyledTable()

  // Group links into rows of 2
  const linkColors = [chalk.yellowBright, chalk.magentaBright, chalk.cyanBright, chalk.redBright]
  for (let i = 0; i < quickLinks.length; i += 2) {
    const row: string[] = []
    for (let j = 0; j < 2 && i + j < quickLinks.length; j++) {
      const link = quickLinks[i + j]
      const colorFn = linkColors[i + j]
      // Show clickable name with color, and URL below in white
      const content = `${link.icon}  ${terminalLink(chalk.underline(colorFn(link.name)), link.url)}\n    ${chalk.white(link.url)}`
      row.push(content)
    }
    actionsTable.push(row)
  }

  console.log(actionsTable.toString())
}

/**
 * Display all quick links including social and action links
 * @returns {void}
 */
function displayQuickLinks(): void {
  displaySocialLinks()
  displayActionLinks()
}

async function main(): Promise<void> {
  // Clear screen for fresh start (only if in TTY)
  if (supportsAnsi) {
    console.clear()
  }

  // Matrix rain intro (respects SKIP_ANIMATIONS)
  await matrixRain(ANIMATION_CONFIG.matrixRain.defaultDuration)

  // Display title
  await displayTitle()

  // Animated particles around version
  await particleEffect(`v${pkg.version}`, ANIMATION_CONFIG.particleEffect.defaultDuration * 0.75)
  console.log()

  // Run loading sequence
  await runLoadingSequence()

  console.log()

  // Generate sparkly data points
  const data: number[] = [50, 100, 75, 88, 92, 70, 65, 80, 90, 100]
  console.log(`${chalk.cyan('Activity Matrix: ')}${sparkly(data)}`)
  console.log()

  // Glitch effect for name reveal
  const nameArt = await generateAsciiArt('DAVE')
  console.log(atlas.multiline(nameArt))

  // Display profile section
  displayProfile()

  // Glitch transition
  await glitchEffect('>>> LOADING SOCIAL MATRIX <<<', ANIMATION_CONFIG.glitchEffect.defaultIterations)
  console.log('\n')

  // Display quick links
  displayQuickLinks()

  // Final separator - use gradient instead of animation to avoid overwriting
  console.log()
  console.log()

  // Use a static gradient line instead of animated rainbow to prevent content overwriting
  const finalLine = '═'.repeat(SEPARATOR_WIDTH)
  if (!SKIP_ANIMATIONS && !NO_COLOR) {
    // Animated gradient effect that doesn't clear previous lines
    console.log(pastel(finalLine))
    // Small animation without using chalkAnimation which causes overwrites
    for (let i = 0; i < ANIMATION_CONFIG.finalAnimation.iterations; i++) {
      await sleep(ANIMATION_CONFIG.finalAnimation.frameDelay)
      process.stdout.write(`\r${gradientString.rainbow(finalLine)}`)
    }
    console.log() // Move to next line after animation
  } else if (!NO_COLOR) {
    // Static colored line when animations are disabled
    console.log(chalk.magenta(finalLine))
  } else {
    // Plain line when colors are disabled
    console.log(finalLine)
  }

  // Final message
  console.log()
  console.log(pastel('✨ All links above are clickable in supported terminals ✨'))
  console.log()
}

export default main
