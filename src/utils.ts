import type chalk from 'chalk'
import Table from 'cli-table3'
import { ALLOWED_PROTOCOLS, LAYOUT, TABLE_CHARS, TABLE_STYLE } from './constants.ts'

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export function terminalLink(text: string, url: string): string {
  try {
    const validUrl = new URL(url)
    if (!ALLOWED_PROTOCOLS.includes(validUrl.protocol as (typeof ALLOWED_PROTOCOLS)[number])) {
      return text
    }
    // biome-ignore lint/suspicious/noControlCharactersInRegex: Security requirement
    const sanitizedUrl = url.replace(/[\x00-\x1F\x7F]/g, '')
    return `\u001B]8;;${sanitizedUrl}\u0007${text}\u001B]8;;\u0007`
  } catch {
    return text
  }
}

export function createStyledTable(options: Record<string, unknown> = {}): Table.Table {
  return new Table({
    chars: TABLE_CHARS,
    style: {
      ...TABLE_STYLE,
      ...options
    },
    colWidths: [LAYOUT.columnWidth, LAYOUT.columnWidth]
  })
}

export function calculateYearsOfExperience(startDate: Date): number {
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000
  return Math.floor((Date.now() - startDate.getTime()) / msPerYear)
}

export function getTerminalDimensions(): { width: number; height: number } {
  return {
    width: process.stdout.columns || 80,
    height: process.stdout.rows || 24
  }
}

export function isTerminalSupported(): boolean {
  return Boolean(process.stdout.isTTY && process.env.NO_COLOR !== 'true')
}

export function shouldSkipAnimations(): boolean {
  return process.env.NO_ANIMATIONS === 'true'
}

export interface SocialLink {
  readonly icon: string
  readonly name: string
  readonly url: string
  readonly color: chalk.ChalkFunction
  readonly link: (text: string) => string
}
