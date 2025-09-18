import ansiEscapes from 'ansi-escapes'
import boxen from 'boxen'
import cfonts from 'cfonts'
import chalk from 'chalk'
import chalkAnimation from 'chalk-animation'
// @ts-expect-error: No types for 'cli-spinners'
import cliSpinners from 'cli-spinners'
import Table from 'cli-table3'
import figlet from 'figlet'
import { atlas, cristal, morning, pastel, teen, vice } from 'gradient-string'
import { get as getEmoji } from 'node-emoji'
import ora from 'ora'
import sparkly from 'sparkly'
// @ts-expect-error: No types for 'terminal-kit'
import terminalKit from 'terminal-kit'
// @ts-expect-error: No types for 'update-notifier'
import updateNotifier from 'update-notifier'
import pkg from '../package.json' with { type: 'json' }

// Check for updates at startup
const notifier = updateNotifier({ pkg })
if (notifier.update) {
  notifier.notify()
}

// Initialize terminal-kit
const _term = terminalKit.terminal

// Define timeout as a utility function for better readability
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// OSC-8 hyperlink utility function to make terminal links clickable
const terminalLink = (text: string, url: string): string => {
  return `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`
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
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  const width = process.stdout.columns || 80
  const height = process.stdout.rows || 24
  const drops: number[] = []

  for (let x = 0; x < width; x++) {
    drops[x] = Math.floor(Math.random() * -height)
  }

  process.stdout.write(ansiEscapes.cursorHide)
  process.stdout.write(ansiEscapes.clearScreen)

  const startTime = Date.now()
  const interval = setInterval(() => {
    if (Date.now() - startTime > duration) {
      clearInterval(interval)
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
}

// Particle effect function
async function particleEffect(text: string, duration = 2000): Promise<void> {
  const frames = ['∙∙∙∙∙', '●∙∙∙∙', '∙●∙∙∙', '∙∙●∙∙', '∙∙∙●∙', '∙∙∙∙●', '∙∙∙∙∙']

  const startTime = Date.now()
  let frameIndex = 0

  const interval = setInterval(() => {
    if (Date.now() - startTime > duration) {
      clearInterval(interval)
      process.stdout.write(`\r${' '.repeat(50)}\r`)
      return
    }

    const particles = frames[frameIndex % frames.length]
    process.stdout.write(`\r${particles} ${vice(text)} ${particles}`)
    frameIndex++
  }, 100)

  await sleep(duration)
}

// ASCII art generator
async function generateAsciiArt(text: string): Promise<string> {
  return new Promise((resolve) => {
    figlet.text(
      text,
      {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
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

// Typewriter effect
async function typeWriter(text: string, delay = 30): Promise<void> {
  for (const char of text) {
    process.stdout.write(char)
    await sleep(delay)
  }
}

// Glitch effect
async function glitchEffect(text: string, iterations = 10): Promise<void> {
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

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
}

async function main(): Promise<void> {
  // Clear screen for fresh start
  console.clear()

  // Matrix rain intro
  await matrixRain(2000)

  // Epic ASCII art title with CFonts
  console.log(
    cfonts.render('DAVE.IO', {
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
    }).string
  )

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

  // Animated box with profile info - using boxen with proper alignment
  const profileBox = boxen(
    [
      `${getEmoji('rocket')}  ${pastel('Weapons-grade DevOps Engineer')}  ${getEmoji('rocket')}`,
      `${getEmoji('computer')}  ${vice('Full-stack Developer')}  ${getEmoji('computer')}`,
      `${getEmoji('wrench')}  ${cristal('Infrastructure Architect')}  ${getEmoji('wrench')}`,
      `${getEmoji('sparkles')}  ${morning('Creative Technologist')}  ${getEmoji('sparkles')}`
    ].join('\n'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan',
      textAlignment: 'center'
    }
  )

  // Typewriter effect for the box
  const boxLines = profileBox.split('\n')
  for (const line of boxLines) {
    await typeWriter(line, 5)
    console.log()
  }

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

  // Quick links section with proper boxen alignment
  const quickLinksBox = boxen(
    [
      `${getEmoji('earth_americas')}  ${terminalLink(chalk.underline(chalk.greenBright('Website')), 'https://dave.io')}`,
      '   → https://dave.io',
      '',
      `${getEmoji('rainbow')}  ${terminalLink(chalk.underline(chalk.blueBright('Pronouns')), 'https://dave.io/gender')}`,
      '   → they/them',
      '',
      `${getEmoji('briefcase')}  ${terminalLink(chalk.underline(chalk.yellowBright('CV/Resume')), 'https://dave.io/go/cv')}`,
      '   → View my experience',
      '',
      `${getEmoji('jigsaw') || '🧩'}  ${terminalLink(chalk.underline(chalk.magentaBright('Give me a TODO')), 'https://dave.io/go/todo')}`,
      '   → Random task generator',
      '',
      `${getEmoji('microphone')}  ${terminalLink(chalk.underline(chalk.cyanBright('Watch a talk')), 'https://dave.io/go/wat')}`,
      '   → WAT: A Tale of JavaScript',
      '',
      `${getEmoji('parrot')}  ${terminalLink(chalk.underline(chalk.redBright('Read a story')), 'https://dave.io/go/blit')}`,
      '   → The Blit Chronicles'
    ].join('\n'),
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'magenta',
      title: teen('Quick Links'),
      titleAlignment: 'center',
      textAlignment: 'left'
    }
  )

  console.log(quickLinksBox)

  // Final sparkle animation
  console.log()
  const finalAnimation = chalkAnimation.rainbow('═══════════════════════════════════════════')
  await sleep(1000)
  finalAnimation.stop()

  // Final message
  console.log()
  console.log(pastel('✨ All links above are clickable in supported terminals ✨'))
  console.log()
}

export default main
