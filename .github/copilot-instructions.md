# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Build the project
bun run build

# Lint the code
bun run lint        # Check for issues
bun run lint:fix    # Auto-fix issues

# Run tests
bun test

# Run the CLI locally
bun start           # Or: bun src/cmd.ts

# Docker operations
bun run docker      # Build and run in container

# Prepare for npm publish (runs lint, test, and build)
bun run prepublishOnly
```

## Architecture

This is a visual CLI package that displays Dave Williams' profile with animated terminal effects.

### Key Files

- `src/cmd.ts` - CLI entry point that handles --version flag and executes main
- `src/index.ts` - Core logic with all animations and display functions

### Animation System

The package implements multiple visual effects that respect terminal capabilities:

- **Matrix Rain** - Opening animation with falling characters
- **Particle Effects** - Animated particles around text
- **Glitch Effects** - Text distortion animations
- **ASCII Art** - Figlet-based text rendering

Performance is optimized through:

- Adaptive frame delays based on terminal size
- Memory limits for animation buffers
- Float32Array for efficient drop position tracking
- Early termination for oversized terminals

### Terminal Features

- OSC-8 hyperlink sequences for clickable links
- Environment variables for accessibility:
  - `NO_ANIMATIONS=true` - Skip all animations
  - `NO_COLOR=true` - Disable colored output
- Responsive layout adapting to terminal dimensions

### Technology Stack

- **Runtime**: Bun (v1.2.22+)
- **Language**: TypeScript with ESM modules
- **Linter**: Biome with custom rules
- **Type System**: Custom definitions in `src/types/` for untyped packages
- **CI**: GitHub Actions with Claude Code integration

### Display Components

1. Title section using CFonts with gradient effects
2. Profile information with emoji indicators
3. Two-column tables for social links and quick actions
4. Activity matrix using sparkly visualization
5. Separator lines with gradient animations

All animations degrade gracefully in non-TTY environments or when disabled via environment variables.
