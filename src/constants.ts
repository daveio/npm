export const ANIMATION_CONFIG = {
  matrixRain: {
    defaultDuration: 2000,
    maxWidth: 200,
    maxHeight: 50,
    fps: 20,
    frameDelay: 50,
    trailLength: 10,
    respawnChance: 0.95,
    performanceThreshold: 2000,
    chars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  },
  particleEffect: {
    defaultDuration: 2000,
    frameDelay: 100,
    particles: ['∙∙∙∙∙', '●∙∙∙∙', '∙●∙∙∙', '∙∙●∙∙', '∙∙∙●∙', '∙∙∙∙●', '∙∙∙∙∙'] as const
  },
  glitchEffect: {
    defaultIterations: 15,
    frameDelay: 50,
    glitchThreshold: 0.7,
    glitchChars: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
  },
  asciiArt: {
    maxWidth: 80,
    font: 'ANSI Shadow' as const
  },
  loadingSequence: {
    spinnerDelay: 500
  },
  finalAnimation: {
    iterations: 3,
    frameDelay: 300
  },
  memoryLimits: {
    maxDropsArraySize: 1000,
    maxFrameBufferSize: 50000
  }
} as const

export const LAYOUT = {
  separatorWidth: 94,
  columnWidth: 44,
  padding: 20
} as const

export const CAREER_START_DATE = new Date('2007-01-01')

export const ALLOWED_PROTOCOLS = ['http:', 'https:'] as const

export const TABLE_CHARS = {
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
  middle: '   '
} as const

export const TABLE_STYLE = {
  'padding-left': 2,
  'padding-right': 2,
  border: []
} as const
