#!/usr/bin/env node

import index from './index.ts'

// Execute the main function
index().catch((error: Error) => {
  console.error('An error occurred:', error)
  process.exit(1)
})

export default {}
