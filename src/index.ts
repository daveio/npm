import ansiEscapes from 'ansi-escapes'
import cfonts from 'cfonts'
import chalk from 'chalk'
import chalkAnimation from 'chalk-animation'
import cliSpinners from 'cli-spinners'
import Table from 'cli-table3'
import figlet from 'figlet'
import { atlas, cristal, morning, pastel, teen, vice } from 'gradient-string'
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

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  const width = Math.min(termWidth, 200) // Cap width for performance
  const height = Math.min(termHeight, 50) // Cap height for performance
  const drops: number[] = []

  for (let x = 0; x < width; x++) {
    drops[x] = Math.floor(Math.random() * -height)
  }

  process.stdout.write(ansiEscapes.cursorHide)
  process.stdout.write(ansiEscapes.clearScreen)

  const startTime = Date.now()
  let interval: NodeJS.Timeout | null = null
  try {
    interval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        if (interval) clearInterval(interval)
        process.stdout.write(ansiEscapes.clearScreen)
        process.stdout.write(ansiEscapes.cursorShow)
        return
      }

      process.stdout.write(ansiEscapes.cursorTo(0, 0))

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (drops[x] === y) {
            process.stdout.write(chalk.greenBright(chars[Math.floor(Math.random() * chars.length)]))
          } else if (drops[x] === y - 1) {
            process.stdout.write(chalk.green(chars[Math.floor(Math.random() * chars.length)]))
          } else if (drops[x] > y && drops[x] < y + 10) {
            process.stdout.write(chalk.gray(chars[Math.floor(Math.random() * chars.length)]))
          } else {
            process.stdout.write(' ')
          }
        }
        if (y < height - 1) process.stdout.write('\n')
      }

      for (let x = 0; x < width; x++) {
        if (drops[x] >= height && Math.random() > 0.95) {
          drops[x] = 0
        }
        drops[x]++
      }
    }, 50)
  } catch (_err) {
    // Fallback for environments that don't support animations
    if (interval) clearInterval(interval)
    process.stdout.write(ansiEscapes.cursorShow)
  }
}

// Particle effect function
async function particleEffect(text: string, duration = 2000): Promise<void> {
  // Skip animation if disabled
  if (SKIP_ANIMATIONS || !supportsAnsi) {
    console.log(text)
    return
  }

  const frames = ['∙∙∙∙∙', '●∙∙∙∙', '∙●∙∙∙', '∙∙●∙∙', '∙∙∙●∙', '∙∙∙∙●', '∙∙∙∙∙']

  const startTime = Date.now()
  let frameIndex = 0

  let interval: NodeJS.Timeout | null = null
  try {
    interval = setInterval(() => {
      if (Date.now() - startTime > duration) {
        if (interval) clearInterval(interval)
        process.stdout.write(`\r${' '.repeat(50)}\r`)
        return
      }

      const particles = frames[frameIndex % frames.length]
      process.stdout.write(`\r${particles} ${vice(text)} ${particles}`)
      frameIndex++
    }, 100)

    await sleep(duration)
  } catch (_err) {
    // Fallback: just display the text
    console.log(text)
  } finally {
    if (interval) clearInterval(interval)
  }
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

async function main(): Promise<void> {
  // Clear screen for fresh start (only if in TTY)
  if (supportsAnsi) {
    console.clear()
  }

  // Matrix rain intro (respects SKIP_ANIMATIONS)
  await matrixRain(2000)

  // Epic ASCII art title with CFonts
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

  // Animated particles around version
  await particleEffect(`v${pkg.version}`, 1500)
  console.log()

  // Create animated loading sequence with multiple spinners
  const spinners = [
    { text: 'Initializing quantum flux capacitor', spinner: cliSpinners.dots12 },
    { text: 'Calibrating neural pathways', spinner: cliSpinners.bouncingBall },
    { text: 'Syncing with the mainframe', spinner: cliSpinners.circleHalves },
    { text: 'Decrypting profile matrix', spinner: cliSpinners.shark },
    { text: 'Loading awesome', spinner: cliSpinners.aesthetic }
  ]

  for (const config of spinners) {
    const spinner = ora({
      text: teen(config.text),
      spinner: config.spinner
    }).start()
    await sleep(400)
    spinner.succeed(morning(`${config.text} ✓`))
  }

  console.log()

  // Generate sparkly data points
  const data = [50, 100, 75, 88, 92, 70, 65, 80, 90, 100]
  console.log(`${chalk.cyan('Activity Matrix: ')}${sparkly(data)}`)
  console.log()

  // Glitch effect for name reveal
  const nameArt = await generateAsciiArt('DAVE')
  console.log(atlas.multiline(nameArt))

  // Profile section - clean centered display without borders
  console.log()
  console.log(chalk.cyan('─'.repeat(90)))
  console.log()

  const profileLines = [
    `${getEmoji('rocket')}  ${pastel('Weapons-grade DevOps Engineer')}  ${getEmoji('rocket')}`,
    `${getEmoji('computer')}  ${vice('Full-stack Developer')}  ${getEmoji('computer')}`,
    `${getEmoji('wrench')}  ${cristal('Infrastructure Architect')}  ${getEmoji('wrench')}`,
    `${getEmoji('sparkles')}  ${morning('Creative Technologist')}  ${getEmoji('sparkles')}`
  ]

  // Display each line centered
  for (const line of profileLines) {
    const padding = ' '.repeat(20)
    console.log(padding + line)
  }

  console.log()
  console.log(chalk.cyan('─'.repeat(90)))
  console.log()

  // Glitch transition
  await glitchEffect('>>> LOADING SOCIAL MATRIX <<<', 15)
  console.log('\n')

  // Define social media links with emojis
  const links: SocialLink[] = [
    {
      icon: '🦋',
      name: 'Bluesky',
      url: 'https://dave.io/go/bluesky',
      color: chalk.yellow,
      link: (text) => terminalLink(chalk.underline(chalk.yellow(text)), 'https://dave.io/go/bluesky'),
      emoji: 'butterfly'
    },
    {
      icon: '📓',
      name: 'Dreamwidth',
      url: 'https://dave.io/go/dreamwidth',
      color: chalk.green,
      link: (text) => terminalLink(chalk.underline(chalk.green(text)), 'https://dave.io/go/dreamwidth'),
      emoji: 'notebook'
    },
    {
      icon: '📘',
      name: 'Facebook',
      url: 'https://dave.io/go/facebook',
      color: chalk.blue,
      link: (text) => terminalLink(chalk.underline(chalk.blue(text)), 'https://dave.io/go/facebook'),
      emoji: 'blue_book'
    },
    {
      icon: '🐙',
      name: 'GitHub',
      url: 'https://dave.io/go/github',
      color: chalk.magenta,
      link: (text) => terminalLink(chalk.underline(chalk.magenta(text)), 'https://dave.io/go/github'),
      emoji: 'octopus'
    },
    {
      icon: '📷',
      name: 'Instagram',
      url: 'https://dave.io/go/instagram',
      color: chalk.red,
      link: (text) => terminalLink(chalk.underline(chalk.red(text)), 'https://dave.io/go/instagram'),
      emoji: 'camera'
    },
    {
      icon: '🔗',
      name: 'LinkedIn',
      url: 'https://dave.io/go/linkedin',
      color: chalk.yellow,
      link: (text) => terminalLink(chalk.underline(chalk.yellow(text)), 'https://dave.io/go/linkedin'),
      emoji: 'link'
    },
    {
      icon: '🐘',
      name: 'Mastodon',
      url: 'https://dave.io/go/mastodon',
      color: chalk.green,
      link: (text) => terminalLink(chalk.underline(chalk.green(text)), 'https://dave.io/go/mastodon'),
      emoji: 'elephant'
    },
    {
      icon: '🔮',
      name: 'Pillowfort',
      url: 'https://dave.io/go/pillowfort',
      color: chalk.blue,
      link: (text) => terminalLink(chalk.underline(chalk.blue(text)), 'https://dave.io/go/pillowfort'),
      emoji: 'crystal_ball'
    },
    {
      icon: '🧵',
      name: 'Threads',
      url: 'https://dave.io/go/threads',
      color: chalk.magenta,
      link: (text) => terminalLink(chalk.underline(chalk.magenta(text)), 'https://dave.io/go/threads'),
      emoji: 'thread'
    },
    {
      icon: '📱',
      name: 'Tumblr',
      url: 'https://dave.io/go/tumblr',
      color: chalk.red,
      link: (text) => terminalLink(chalk.underline(chalk.red(text)), 'https://dave.io/go/tumblr'),
      emoji: 'iphone'
    },
    {
      icon: '🎥',
      name: 'YouTube',
      url: 'https://dave.io/go/youtube',
      color: chalk.yellow,
      link: (text) => terminalLink(chalk.underline(chalk.yellow(text)), 'https://dave.io/go/youtube'),
      emoji: 'movie_camera'
    },
    {
      icon: '☠️',
      name: 'Twitter',
      url: "We don't use Twitter any more.",
      color: chalk.dim,
      link: (text) => chalk.dim(text),
      emoji: 'skull'
    }
  ]

  // Create a table for social links - 2 columns layout, invisible borders
  const socialTable = new Table({
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
      middle: '  ' // Two spaces for column separator
    },
    style: {
      'padding-left': 2, // Increased padding
      'padding-right': 2,
      head: ['cyan'],
      border: [] // No border styling
    },
    colWidths: [45, 45] // Wider columns for full URLs
  })

  // Group links into rows of 2
  for (let i = 0; i < links.length; i += 2) {
    const row: string[] = []
    for (let j = 0; j < 2 && i + j < links.length; j++) {
      const link = links[i + j]
      // Add extra spaces between emoji and text for better alignment
      const content = `${link.color(link.icon)}  ${link.color(link.name)}`
      row.push(content)
    }
    // Fill empty cells if needed
    while (row.length < 2) {
      row.push('')
    }
    socialTable.push(row)

    // Add URLs row
    const urlRow: string[] = []
    for (let j = 0; j < 2 && i + j < links.length; j++) {
      const link = links[i + j]
      // Add indentation for URLs to align with text above
      urlRow.push(`    ${link.link(link.url)}`)
    }
    while (urlRow.length < 2) {
      urlRow.push('')
    }
    socialTable.push(urlRow)

    // Add a separator row if not the last group
    if (i + 2 < links.length) {
      socialTable.push(['', ''])
    }
  }

  console.log(socialTable.toString())
  console.log()

  // Separator before Quick Links
  console.log(chalk.magenta('─'.repeat(90)))
  console.log()
  console.log(chalk.magenta(chalk.bold('                                Quick Links                                ')))
  console.log()

  // Quick links section as two-column table like social links
  const quickLinksTable = new Table({
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
      middle: '  ' // Two spaces for column separator
    },
    style: {
      'padding-left': 2, // Increased padding
      'padding-right': 2,
      head: ['magenta'],
      border: [] // No border styling
    },
    colWidths: [45, 45] // Wider columns for full URLs
  })

  // Quick links data
  const quickLinks = [
    {
      icon: getEmoji('earth_americas'),
      name: terminalLink(chalk.underline(chalk.greenBright('Website')), 'https://dave.io'),
      detail: 'https://dave.io'
    },
    {
      icon: getEmoji('rainbow'),
      name: terminalLink(chalk.underline(chalk.blue('Pronouns')), 'https://dave.io/gender'),
      detail: 'they/them'
    },
    {
      icon: getEmoji('briefcase'),
      name: terminalLink(chalk.underline(chalk.yellow('CV/Resume')), 'https://dave.io/go/cv'),
      detail: 'View my experience'
    },
    {
      icon: getEmoji('jigsaw') || '🧩',
      name: terminalLink(chalk.underline(chalk.magenta('Give me a TODO')), 'https://dave.io/go/todo'),
      detail: 'Random task generator'
    },
    {
      icon: getEmoji('microphone'),
      name: terminalLink(chalk.underline(chalk.cyan('Watch a talk')), 'https://dave.io/go/wat'),
      detail: 'WAT: A Tale of JavaScript'
    },
    {
      icon: getEmoji('parrot'),
      name: terminalLink(chalk.underline(chalk.red('Read a story')), 'https://dave.io/go/blit'),
      detail: 'The Blit Chronicles'
    }
  ]

  // Group links into rows of 2
  for (let i = 0; i < quickLinks.length; i += 2) {
    const row: string[] = []
    for (let j = 0; j < 2 && i + j < quickLinks.length; j++) {
      const link = quickLinks[i + j]
      const content = `${link.icon}  ${link.name}`
      row.push(content)
    }
    // Fill empty cells if needed
    while (row.length < 2) {
      row.push('')
    }
    quickLinksTable.push(row)

    // Add detail row
    const detailRow: string[] = []
    for (let j = 0; j < 2 && i + j < quickLinks.length; j++) {
      const link = quickLinks[i + j]
      detailRow.push(`    → ${link.detail}`)
    }
    while (detailRow.length < 2) {
      detailRow.push('')
    }
    quickLinksTable.push(detailRow)

    // Add a separator row if not the last group
    if (i + 2 < quickLinks.length) {
      quickLinksTable.push(['', ''])
    }
  }

  console.log(quickLinksTable.toString())

  // Final sparkle animation
  console.log()
  const finalAnimation = chalkAnimation.rainbow('═'.repeat(90))
  await sleep(1000)
  finalAnimation.stop()

  // Final message
  console.log()
  console.log(pastel('✨ All links above are clickable in supported terminals ✨'))
  console.log()
}

export default main
