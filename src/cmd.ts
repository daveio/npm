#!/usr/bin/env bun

import pkg from '../package.json' with { type: 'json' }
import main from './index.ts'

const args = process.argv.slice(2)
const isVersionFlag = args.some((arg) => arg === '--version' || arg === '-v')

if (isVersionFlag) {
  console.log(pkg.version)
  process.exit(0)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error occurred'
  console.error('An error occurred:', message)
  process.exit(1)
})
