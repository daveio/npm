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

// Animation constants
const MAX_TERMINAL_WIDTH = 200
const MAX_TERMINAL_HEIGHT = 50
const MATRIX_RAIN_FPS = 20
const ANIMATION_FRAME_DELAY = 1000 / MATRIX_RAIN_FPS

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

// Matrix rain effect
async function matrixRain(duration = 3000): Promise<void> {
  // Skip animation if disabled or not in TTY
  if (SKIP_ANIMATIONS || !supportsAnsi) {
    return
  }

  return new Promise<void>((resolve) => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const width = Math.min(termWidth, MAX_TERMINAL_WIDTH)
    const height = Math.min(termHeight, MAX_TERMINAL_HEIGHT)
    const drops: number[] = []

    // Pre-calculate character array for faster access
    const charArray = chars.split('')
    const charLength = charArray.length

    // Initialize drop positions
    for (let x = 0; x < width; x++) {
      drops[x] = Math.floor(Math.random() * -height)
    }

    process.stdout.write(ansiEscapes.cursorHide)
    process.stdout.write(ansiEscapes.clearScreen)

    const startTime = Date.now()

    // Adaptive frame rate based on terminal size
    const pixelCount = width * height
    const adaptiveDelay = pixelCount > 2000 ? ANIMATION_FRAME_DELAY * 2 : ANIMATION_FRAME_DELAY

    const interval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        clearInterval(interval)
        process.stdout.write(ansiEscapes.clearScreen)
        process.stdout.write(ansiEscapes.cursorShow)
        resolve()
        return
      }

      // Buffer the entire frame before writing
      const frameBuffer: string[] = []
      frameBuffer.push(ansiEscapes.cursorTo(0, 0))

      for (let y = 0; y < height; y++) {
        let lineBuffer = ''
        for (let x = 0; x < width; x++) {
          const dropY = drops[x]
          if (dropY === y) {
            // Bright green for head of drop
            lineBuffer += chalk.greenBright(charArray[Math.floor(Math.random() * charLength)])
          } else if (dropY === y - 1) {
            // Medium green for second character
            lineBuffer += chalk.green(charArray[Math.floor(Math.random() * charLength)])
          } else if (dropY > y && dropY < y + 10) {
            // Gray for trail
            lineBuffer += chalk.gray(charArray[Math.floor(Math.random() * charLength)])
          } else {
            lineBuffer += ' '
          }
        }
        frameBuffer.push(lineBuffer)
        if (y < height - 1) frameBuffer.push('\n')
      }

      // Write entire frame at once
      process.stdout.write(frameBuffer.join(''))

      // Update drop positions
      for (let x = 0; x < width; x++) {
        if (drops[x] >= height && Math.random() > 0.95) {
          drops[x] = 0
        }
        drops[x]++
      }
    }, adaptiveDelay)
  })
}

// Particle effect function
async function particleEffect(text: string, duration = 2000): Promise<void> {
  // Skip animation if disabled
  if (SKIP_ANIMATIONS || !supportsAnsi) {
    console.log(text)
    return
  }

  return new Promise<void>((resolve) => {
    const frames = ['∙∙∙∙∙', '●∙∙∙∙', '∙●∙∙∙', '∙∙●∙∙', '∙∙∙●∙', '∙∙∙∙●', '∙∙∙∙∙']
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
    }, 100)
  })
}

// ASCII art generator
async function generateAsciiArt(text: string): Promise<string> {
  // Fallback for environments that don't support ASCII art
  if (!supportsAnsi) {
    return text
  }

  return new Promise((resolve) => {
    figlet.text(
      text,
      {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: Math.min(termWidth, 80),
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

// Glitch effect
async function glitchEffect(text: string, iterations = 10): Promise<void> {
  // Skip animation if disabled
  if (SKIP_ANIMATIONS || !supportsAnsi) {
    console.log(text)
    return
  }

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

  try {
    for (let i = 0; i < iterations; i++) {
      let glitched = ''
      for (const char of text) {
        if (Math.random() > 0.7) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          glitched += char
        }
      }
      process.stdout.write(`\r${cristal(glitched)}`)
      await sleep(50)
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
    await sleep(500)
    oraSpinner.succeed()
  }
}

// Display the profile section
function displayProfile(): void {
  console.log()
  console.log(chalk.cyan('─'.repeat(90)))
  console.log()

  const profileLines = [
    `${getEmoji('rocket')}  Dave Williams`,
    `${getEmoji('wrench')}  Weapons-grade DevOps Engineer`,
    `${getEmoji('house')}  Berlin, Germany`,
    `${getEmoji('cake')}  Coding for ${Math.floor((Date.now() - new Date('2007-01-01').getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years`,
    `${getEmoji('heart')}  TypeScript, Rust, Go, Infrastructure as Code`,
    `${getEmoji('briefcase')}  Building the future of developer tools`
  ]

  for (const line of profileLines) {
    const padding = ' '.repeat(20)
    console.log(padding + line)
  }

  console.log()
  console.log(chalk.cyan('─'.repeat(90)))
  console.log()
}

// Create a standardized table
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
      mid: '─',
      'mid-mid': '┼',
      right: '',
      'right-mid': '',
      middle: ' │ '
    },
    style: {
      'padding-left': 2,
      'padding-right': 2,
      border: [],
      ...options
    },
    colWidths: [40, 40]
  })
}

// Display quick links section
function displayQuickLinks(): void {
  console.log()
  console.log(chalk.magenta('─'.repeat(90)))
  console.log(chalk.bold(chalk.magenta('   🔗 Social Links')))
  console.log(chalk.magenta('─'.repeat(90)))
  console.log()

  const quickLinksTable = createStyledTable()

  // Add Web and Pronouns sections first
  quickLinksTable.push([
    `🌐  ${chalk.greenBright('Web')}`,
    `${chalk.white(terminalLink('dave.io', 'https://dave.io'))}\n    ${chalk.gray('https://dave.io')}`
  ])
  quickLinksTable.push(['', '']) // Empty row
  quickLinksTable.push([
    `⚧  ${chalk.blue('Pronouns')}`,
    `${chalk.white(terminalLink('they/them', 'https://dave.io/gender'))}\n    ${chalk.gray('https://dave.io/gender')}`
  ])
  quickLinksTable.push(['', '']) // Empty row

  const socialLinks: SocialLink[] = [
    {
      icon: '🌈',
      name: 'Bluesky',
      url: 'https://dave.io/go/bluesky',
      color: chalk.yellow,
      link: (text: string) => chalk.yellow(terminalLink(text, 'https://dave.io/go/bluesky'))
    },
    {
      icon: '📓',
      name: 'Dreamwidth',
      url: 'https://dave.io/go/dreamwidth',
      color: chalk.green,
      link: (text: string) => chalk.green(terminalLink(text, 'https://dave.io/go/dreamwidth'))
    },
    {
      icon: '📘',
      name: 'Facebook',
      url: 'https://dave.io/go/facebook',
      color: chalk.blue,
      link: (text: string) => chalk.blue(terminalLink(text, 'https://dave.io/go/facebook'))
    },
    {
      icon: '🐙',
      name: 'GitHub',
      url: 'https://dave.io/go/github',
      color: chalk.magenta,
      link: (text: string) => chalk.magenta(terminalLink(text, 'https://dave.io/go/github'))
    },
    {
      icon: '📷',
      name: 'Instagram',
      url: 'https://dave.io/go/instagram',
      color: chalk.red,
      link: (text: string) => chalk.red(terminalLink(text, 'https://dave.io/go/instagram'))
    },
    {
      icon: '🔗',
      name: 'LinkedIn',
      url: 'https://dave.io/go/linkedin',
      color: chalk.yellow,
      link: (text: string) => chalk.yellow(terminalLink(text, 'https://dave.io/go/linkedin'))
    },
    {
      icon: '🐘',
      name: 'Mastodon',
      url: 'https://dave.io/go/mastodon',
      color: chalk.green,
      link: (text: string) => chalk.green(terminalLink(text, 'https://dave.io/go/mastodon'))
    },
    {
      icon: '🔮',
      name: 'Pillowfort',
      url: 'https://dave.io/go/pillowfort',
      color: chalk.blue,
      link: (text: string) => chalk.blue(terminalLink(text, 'https://dave.io/go/pillowfort'))
    },
    {
      icon: '🧵',
      name: 'Threads',
      url: 'https://dave.io/go/threads',
      color: chalk.magenta,
      link: (text: string) => chalk.magenta(terminalLink(text, 'https://dave.io/go/threads'))
    },
    {
      icon: '📱',
      name: 'Tumblr',
      url: 'https://dave.io/go/tumblr',
      color: chalk.red,
      link: (text: string) => chalk.red(terminalLink(text, 'https://dave.io/go/tumblr'))
    },
    {
      icon: '🎥',
      name: 'YouTube',
      url: 'https://dave.io/go/youtube',
      color: chalk.yellow,
      link: (text: string) => chalk.yellow(terminalLink(text, 'https://dave.io/go/youtube'))
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
    const cell1 = `${link1.icon}  ${link1.link(link1.name)}\n    ${chalk.gray(link1.url)}`
    const cell2 = link2 ? `${link2.icon}  ${link2.link(link2.name)}\n    ${chalk.gray(link2.url)}` : ''

    quickLinksTable.push([cell1, cell2])
  }

  console.log(quickLinksTable.toString())

  // Display additional quick links
  console.log()
  console.log(chalk.yellow('─'.repeat(90)))
  console.log(chalk.bold(chalk.yellow('   ⚡ Quick Actions')))
  console.log(chalk.yellow('─'.repeat(90)))
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

  const actionsTable = new Table({
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
      mid: '─',
      'mid-mid': '┼',
      right: '',
      'right-mid': '',
      middle: ' │ '
    },
    style: {
      'padding-left': 2,
      'padding-right': 2,
      border: []
    },
    colWidths: [40, 40]
  })

  // Group links into rows of 2
  const linkColors = [chalk.yellowBright, chalk.magentaBright, chalk.cyanBright, chalk.redBright]
  for (let i = 0; i < quickLinks.length; i += 2) {
    const row: string[] = []
    for (let j = 0; j < 2 && i + j < quickLinks.length; j++) {
      const link = quickLinks[i + j]
      const colorFn = linkColors[i + j]
      // Show clickable name with color, and URL below in gray
      const content = `${link.icon}  ${terminalLink(chalk.underline(colorFn(link.name)), link.url)}\n    ${chalk.gray(link.url)}`
      row.push(content)
    }
    actionsTable.push(row)
  }

  console.log(actionsTable.toString())
}

async function main(): Promise<void> {
  // Clear screen for fresh start (only if in TTY)
  if (supportsAnsi) {
    console.clear()
  }

  // Matrix rain intro (respects SKIP_ANIMATIONS)
  await matrixRain(2000)

  // Display title
  await displayTitle()

  // Animated particles around version
  await particleEffect(`v${pkg.version}`, 1500)
  console.log()

  // Run loading sequence
  await runLoadingSequence()

  console.log()

  // Generate sparkly data points
  const data = [50, 100, 75, 88, 92, 70, 65, 80, 90, 100]
  console.log(`${chalk.cyan('Activity Matrix: ')}${sparkly(data)}`)
  console.log()

  // Glitch effect for name reveal
  const nameArt = await generateAsciiArt('DAVE')
  console.log(atlas.multiline(nameArt))

  // Display profile section
  displayProfile()

  // Glitch transition
  await glitchEffect('>>> LOADING SOCIAL MATRIX <<<', 15)
  console.log('\n')

  // Display quick links
  displayQuickLinks()

  // Final separator - use gradient instead of animation to avoid overwriting
  console.log()
  console.log()

  // Use a static gradient line instead of animated rainbow to prevent content overwriting
  const finalLine = '═'.repeat(90)
  if (!process.env.NO_ANIMATIONS && !process.env.SKIP_ANIMATIONS && !process.env.NO_COLOR) {
    // Animated gradient effect that doesn't clear previous lines
    console.log(pastel(finalLine))
    // Small animation without using chalkAnimation which causes overwrites
    for (let i = 0; i < 3; i++) {
      await sleep(300)
      process.stdout.write(`\r${gradientString.rainbow(finalLine)}`)
    }
    console.log() // Move to next line after animation
  } else if (!process.env.NO_COLOR) {
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
