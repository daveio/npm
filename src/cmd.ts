#!/usr/bin/env bun

import index from './index.ts'
import pkg from '../package.json' with { type: 'json' }

// Check for --version flag
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(pkg.version)
  process.exit(0)
}

// Execute the main function
index().catch((error: Error) => {
  console.error('An error occurred:', error)
  process.exit(1)
})

export default {}
