import chalk from 'chalk'
import chalkAnimation from 'chalk-animation'
import Table from 'cli-table3'
import { pastel } from 'gradient-string'
import ora from 'ora'
// @ts-expect-error: No types for 'update-notifier'
import updateNotifier from 'update-notifier'
import pkg from '../package.json' with { type: 'json' }

// Check for updates at startup
const notifier = updateNotifier({ pkg })
if (notifier.update) {
  notifier.notify()
}

// Define timeout as a utility function for better readability
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// Define social media link type for better type safety
interface SocialLink {
  icon: string
  name: string
  url: string
  color: chalk.ChalkFunction
  link: (text: string) => string
}

export default async function (): Promise<void> {
  // Create a spinner while "loading" the profile
  const spinner = ora({
    text: chalk.cyan('Crunching...'),
    spinner: 'binary'
  }).start()

  // Simulate loading time
  await sleep(2000)
  spinner.succeed()

  // Prepare version string with proper padding
  const versionStr = `Dave Williams (v${pkg.version})`

  // Title with gradient
  console.log(
    `\n${pastel.multiline(
      `
          ╔═══════════════════════════════════════╗
          ║                                       ║
          ║      ${versionStr.padEnd(33, ' ')}║
          ║                                       ║
          ╚═══════════════════════════════════════╝
    `
    )}`
  )

  // Animate the introduction
  const introText = '\n🚀 Weapons-grade DevOps engineer, developer, and tinkerer 🚀\n'
  const introAnim = chalkAnimation.rainbow(introText)
  await sleep(2000)
  introAnim.stop()

  // Replace with gradient version by moving cursor up and overwriting
  // Count the number of lines (2 for the \n characters plus potentially wrapped lines)
  const lineCount = introText.split('\n').length
  process.stdout.write(`\x1b[${lineCount}A\x1b[0J`) // Move cursor up and clear from cursor to end
  console.log(pastel(introText))

  // Define social media links - colors in rainbow order with no consecutive repeats
  const links: SocialLink[] = [
    {
      icon: '🦋',
      name: 'Bluesky',
      url: 'https://dave.io/go/bluesky',
      color: chalk.yellow,
      link: (text) => chalk.underline(chalk.yellow(text))
    },
    {
      icon: '📓',
      name: 'Dreamwidth',
      url: 'https://dave.io/go/dreamwidth',
      color: chalk.green,
      link: (text) => chalk.underline(chalk.green(text))
    },
    {
      icon: '📘',
      name: 'Facebook',
      url: 'https://dave.io/go/facebook',
      color: chalk.blue,
      link: (text) => chalk.underline(chalk.blue(text))
    },
    {
      icon: '🐙',
      name: 'GitHub',
      url: 'https://dave.io/go/github',
      color: chalk.magenta,
      link: (text) => chalk.underline(chalk.magenta(text))
    },
    {
      icon: '📷',
      name: 'Instagram',
      url: 'https://dave.io/go/instagram',
      color: chalk.red,
      link: (text) => chalk.underline(chalk.red(text))
    },
    {
      icon: '🔗',
      name: 'LinkedIn',
      url: 'https://dave.io/go/linkedin',
      color: chalk.yellow,
      link: (text) => chalk.underline(chalk.yellow(text))
    },
    {
      icon: '🐘',
      name: 'Mastodon',
      url: 'https://dave.io/go/mastodon',
      color: chalk.green,
      link: (text) => chalk.underline(chalk.green(text))
    },
    {
      icon: '🔮',
      name: 'Pillowfort',
      url: 'https://dave.io/go/pillowfort',
      color: chalk.blue,
      link: (text) => chalk.underline(chalk.blue(text))
    },
    {
      icon: '🧵',
      name: 'Threads',
      url: 'https://dave.io/go/threads',
      color: chalk.magenta,
      link: (text) => chalk.underline(chalk.magenta(text))
    },
    {
      icon: '📱',
      name: 'Tumblr',
      url: 'https://dave.io/go/tumblr',
      color: chalk.red,
      link: (text) => chalk.underline(chalk.red(text))
    },
    {
      icon: '🎥',
      name: 'YouTube',
      url: 'https://dave.io/go/youtube',
      color: chalk.yellow,
      link: (text) => chalk.underline(chalk.yellow(text))
    },
    {
      icon: '☠️',
      name: 'Twitter',
      url: "We don't use Twitter any more.",
      color: chalk.dim,
      link: (text) => chalk.dim(text)
    }
  ]

  // Create a table without borders
  const table = new Table({
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
      middle: ' '
    },
    style: {
      'padding-left': 0,
      'padding-right': 1,
      border: []
    },
    colWidths: [20, 45],
    colAligns: ['right', 'left']
  })

  // Add content to table
  table.push(
    [chalk.greenBright('🌐 Web'), chalk.underline(chalk.white('https://dave.io'))],
    [], // Empty row for spacing
    ...links.map((link) => [link.color(`${link.icon} ${link.name}`), link.link(link.url)]),
    [],
    [chalk.greenBright('💼 Check out my CV'), chalk.underline(chalk.white('https://dave.io/go/cv'))],
    [chalk.greenBright('🧩 Give me a TODO'), chalk.underline(chalk.white('https://dave.io/go/todo'))],
    [chalk.greenBright('🎤 Enjoy this talk'), chalk.underline(chalk.white('https://dave.io/go/wat'))],
    [chalk.greenBright('🦜 Read this story'), chalk.underline(chalk.white('https://dave.io/go/blit'))]
  )

  // Display the table
  console.log(table.toString())
}
