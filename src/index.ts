import cfonts from 'cfonts'
import chalk from 'chalk'
import cliSpinners from 'cli-spinners'
import gradientString, { atlas, pastel } from 'gradient-string'
import { get as getEmoji } from 'node-emoji'
import ora from 'ora'
import sparkly from 'sparkly'
import updateNotifier from 'update-notifier'
import pkg from '../package.json' with { type: 'json' }
import { generateAsciiArt, glitchEffect, matrixRain, particleEffect } from './animations.ts'
import { ANIMATION_CONFIG, CAREER_START_DATE, LAYOUT } from './constants.ts'
import {
  calculateYearsOfExperience,
  createStyledTable,
  isTerminalSupported,
  type SocialLink,
  shouldSkipAnimations,
  sleep,
  terminalLink
} from './utils.ts'

const notifier = updateNotifier({ pkg })
if (notifier.update) {
  notifier.notify()
}

const SOCIAL_LINKS: readonly SocialLink[] = [
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
    link: (text: string) => chalk.dim(text)
  }
] as const

const QUICK_LINKS = [
  {
    icon: '📄',
    name: 'CV/Resume',
    url: 'https://dave.io/go/cv',
    detail: 'View my experience'
  },
  {
    icon: '🧩',
    name: 'Give me a TODO',
    url: 'https://dave.io/go/todo',
    detail: 'Random task generator'
  },
  {
    icon: '🎤',
    name: 'Watch a talk',
    url: 'https://dave.io/go/wat',
    detail: 'WAT: A Tale of JavaScript'
  },
  {
    icon: '🦜',
    name: 'Read a story',
    url: 'https://dave.io/go/blit',
    detail: 'The Blit Chronicles'
  }
] as const

const LOADING_SPINNERS = [
  { text: 'Initializing quantum flux capacitor', spinner: cliSpinners.dots12 },
  { text: 'Calibrating neural pathways', spinner: cliSpinners.bouncingBall },
  { text: 'Syncing with the mainframe', spinner: cliSpinners.circleHalves },
  { text: 'Decrypting profile matrix', spinner: cliSpinners.shark },
  { text: 'Loading awesome', spinner: cliSpinners.aesthetic }
] as const

function displayTitle(): void {
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
  console.log(titleRender !== false ? titleRender.string : chalk.cyan('DAVE.IO'))
}

async function runLoadingSequence(): Promise<void> {
  if (shouldSkipAnimations() || !isTerminalSupported()) {
    console.log('Loading profile...')
    return
  }

  for (const { text, spinner } of LOADING_SPINNERS) {
    const oraSpinner = ora({ text, spinner }).start()
    await sleep(ANIMATION_CONFIG.loadingSequence.spinnerDelay)
    oraSpinner.succeed()
  }
}

function displayProfile(): void {
  const separator = chalk.cyan('─'.repeat(LAYOUT.separatorWidth))
  console.log()
  console.log(separator)
  console.log()

  const profileLines = [
    `${getEmoji('rocket')}  Dave Williams`,
    `${getEmoji('wrench')}  Weapons-grade DevOps Engineer`,
    `${getEmoji('house')}  Berlin, Germany`,
    `${getEmoji('cake')}  Coding for ${calculateYearsOfExperience(CAREER_START_DATE)} years`,
    `${getEmoji('heart')}  TypeScript, Rust, Go, Infrastructure as Code`,
    `${getEmoji('briefcase')}  Building the future of developer tools`
  ]

  const padding = ' '.repeat(LAYOUT.padding)
  for (const line of profileLines) {
    console.log(padding + line)
  }

  console.log()
  console.log(separator)
  console.log()
}

function renderSeparator(char: string, color: chalk.ChalkFunction): void {
  console.log(color(char.repeat(LAYOUT.separatorWidth)))
}

function displaySocialLinks(): void {
  console.log()
  renderSeparator('─', chalk.magenta)
  console.log(chalk.bold(chalk.magenta('   🔗 Social Links')))
  renderSeparator('─', chalk.magenta)
  console.log()

  const quickLinksTable = createStyledTable()

  quickLinksTable.push([
    `🌐  ${chalk.greenBright('Web')}\n    ${chalk.greenBright(terminalLink('dave.io', 'https://dave.io'))}\n    ${chalk.white('https://dave.io')}`,
    `⚧  ${chalk.blue('Pronouns')}\n    ${chalk.blue(terminalLink('they/them', 'https://dave.io/gender'))}\n    ${chalk.white('https://dave.io/gender')}`
  ])
  quickLinksTable.push(['', ''])

  for (let i = 0; i < SOCIAL_LINKS.length; i += 2) {
    const link1 = SOCIAL_LINKS[i]
    const link2 = SOCIAL_LINKS[i + 1]

    const cell1 = `${link1.icon}  ${link1.link(link1.name)}\n    ${chalk.white(link1.url)}`
    const cell2 = link2 ? `${link2.icon}  ${link2.link(link2.name)}\n    ${chalk.white(link2.url)}` : ''

    quickLinksTable.push([cell1, cell2])
  }

  console.log(quickLinksTable.toString())
}

function displayActionLinks(): void {
  console.log()
  renderSeparator('─', chalk.yellow)
  console.log(chalk.bold(chalk.yellow('   ⚡ Quick Actions')))
  renderSeparator('─', chalk.yellow)
  console.log()

  const actionsTable = createStyledTable()
  const linkColors = [chalk.yellowBright, chalk.magentaBright, chalk.cyanBright, chalk.redBright] as const

  for (let i = 0; i < QUICK_LINKS.length; i += 2) {
    const row: string[] = []
    for (let j = 0; j < 2 && i + j < QUICK_LINKS.length; j++) {
      const link = QUICK_LINKS[i + j]
      const colorFn = linkColors[i + j]
      const content = `${link.icon}  ${terminalLink(chalk.underline(colorFn(link.name)), link.url)}\n    ${chalk.white(link.url)}`
      row.push(content)
    }
    actionsTable.push(row)
  }

  console.log(actionsTable.toString())
}

async function main(): Promise<void> {
  if (isTerminalSupported()) {
    console.clear()
  }

  await matrixRain(ANIMATION_CONFIG.matrixRain.defaultDuration)
  displayTitle()

  await particleEffect(`v${pkg.version}`, ANIMATION_CONFIG.particleEffect.defaultDuration * 0.75)
  console.log()

  await runLoadingSequence()
  console.log()

  const data = [50, 100, 75, 88, 92, 70, 65, 80, 90, 100] as const
  console.log(`${chalk.cyan('Activity Matrix: ')}${sparkly(data as unknown as number[])}`)
  console.log()

  const nameArt = await generateAsciiArt('DAVE')
  console.log(atlas.multiline(nameArt))

  displayProfile()

  await glitchEffect('>>> LOADING SOCIAL MATRIX <<<', ANIMATION_CONFIG.glitchEffect.defaultIterations)
  console.log('\n')

  displaySocialLinks()
  displayActionLinks()

  console.log()
  console.log()

  const finalLine = '═'.repeat(LAYOUT.separatorWidth)
  if (!shouldSkipAnimations() && isTerminalSupported()) {
    console.log(pastel(finalLine))
    for (let i = 0; i < ANIMATION_CONFIG.finalAnimation.iterations; i++) {
      await sleep(ANIMATION_CONFIG.finalAnimation.frameDelay)
      process.stdout.write(`\r${gradientString.rainbow(finalLine)}`)
    }
    console.log()
  } else if (isTerminalSupported()) {
    console.log(chalk.magenta(finalLine))
  } else {
    console.log(finalLine)
  }

  console.log()
  console.log(pastel('✨ All links above are clickable in supported terminals ✨'))
  console.log()
}

export default main
