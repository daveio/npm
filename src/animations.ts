import ansiEscapes from 'ansi-escapes'
import chalk from 'chalk'
import figlet from 'figlet'
import { atlas, cristal, vice } from 'gradient-string'
import { ANIMATION_CONFIG } from './constants.ts'
import { getTerminalDimensions, isTerminalSupported, shouldSkipAnimations, sleep } from './utils.ts'

function initializeMatrixDrops(width: number, height: number): Float32Array {
  const drops = new Float32Array(width)
  for (let x = 0; x < width; x++) {
    drops[x] = Math.floor(Math.random() * -height)
  }
  return drops
}

function calculateAdaptiveDelay(width: number, height: number): number {
  const pixelCount = width * height
  return pixelCount > ANIMATION_CONFIG.matrixRain.performanceThreshold
    ? ANIMATION_CONFIG.matrixRain.frameDelay * 2
    : ANIMATION_CONFIG.matrixRain.frameDelay
}

function renderMatrixFrame(width: number, height: number, drops: Float32Array, charArray: readonly string[]): string[] {
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
        lineChars[x] = chalk.greenBright(randomChar)
      } else if (dropY === y - 1) {
        lineChars[x] = chalk.green(randomChar)
      } else if (y > dropY && y < dropY + ANIMATION_CONFIG.matrixRain.trailLength) {
        lineChars[x] = chalk.gray(randomChar)
      } else {
        lineChars[x] = ' '
      }
    }
    lines[y] = lineChars.join('')
  }

  frameBuffer.push(...lines)
  if (height > 0) {
    frameBuffer.push('\n')
  }

  return frameBuffer
}

function updateDropPositions(drops: Float32Array, width: number, height: number): void {
  for (let x = 0; x < width; x++) {
    if (drops[x] >= height && Math.random() > ANIMATION_CONFIG.matrixRain.respawnChance) {
      drops[x] = 0
    }
    drops[x]++
  }
}

export async function matrixRain(duration = ANIMATION_CONFIG.matrixRain.defaultDuration): Promise<void> {
  if (shouldSkipAnimations() || !isTerminalSupported()) {
    return
  }

  return new Promise<void>((resolve) => {
    const { width: termWidth, height: termHeight } = getTerminalDimensions()
    const width = Math.min(termWidth, ANIMATION_CONFIG.matrixRain.maxWidth)
    const height = Math.min(termHeight, ANIMATION_CONFIG.matrixRain.maxHeight)

    if (width > ANIMATION_CONFIG.memoryLimits.maxDropsArraySize) {
      console.warn('Terminal width exceeds memory limits, skipping animation')
      resolve()
      return
    }

    const drops = initializeMatrixDrops(width, height)
    const charArray = ANIMATION_CONFIG.matrixRain.chars.split('')
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

      const estimatedFrameSize = width * height * 10
      if (estimatedFrameSize > ANIMATION_CONFIG.memoryLimits.maxFrameBufferSize) {
        clearInterval(interval)
        process.stdout.write(ansiEscapes.clearScreen)
        process.stdout.write(ansiEscapes.cursorShow)
        resolve()
        return
      }

      const frameBuffer = renderMatrixFrame(width, height, drops, charArray)
      process.stdout.write(frameBuffer.join('\n'))

      updateDropPositions(drops, width, height)
    }, adaptiveDelay)
  })
}

export async function particleEffect(
  text: string,
  duration = ANIMATION_CONFIG.particleEffect.defaultDuration
): Promise<void> {
  if (shouldSkipAnimations() || !isTerminalSupported()) {
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

export async function generateAsciiArt(text: string): Promise<string> {
  if (!isTerminalSupported()) {
    return text
  }

  return new Promise((resolve) => {
    const { width } = getTerminalDimensions()
    figlet.text(
      text,
      {
        font: ANIMATION_CONFIG.asciiArt.font,
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: Math.min(width, ANIMATION_CONFIG.asciiArt.maxWidth),
        whitespaceBreak: true
      },
      (err, data) => {
        resolve(err ? text : data || text)
      }
    )
  })
}

export async function glitchEffect(
  text: string,
  iterations = ANIMATION_CONFIG.glitchEffect.defaultIterations
): Promise<void> {
  if (shouldSkipAnimations() || !isTerminalSupported()) {
    console.log(text)
    return
  }

  const {glitchChars} = ANIMATION_CONFIG.glitchEffect

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
  } catch {
    console.log(text)
  }
}
