declare module 'chalk' {
  type ChalkFunction = (text: string) => string & ChalkInstance

  namespace chalk {
    interface ChalkInstance {
      (text: string): string
      red: ChalkFunction
      green: ChalkFunction
      blue: ChalkFunction
      yellow: ChalkFunction
      magenta: ChalkFunction
      cyan: ChalkFunction
      white: ChalkFunction
      gray: ChalkFunction
      grey: ChalkFunction
      black: ChalkFunction
      dim: ChalkFunction
      bold: ChalkFunction
      italic: ChalkFunction
      underline: ChalkFunction
      inverse: ChalkFunction
      hidden: ChalkFunction
      strikethrough: ChalkFunction
      visible: ChalkFunction
      reset: ChalkFunction
      greenBright: ChalkFunction
    }

    type ChalkFunction = (text: string) => string & ChalkInstance
  }

  const chalk: chalk.ChalkInstance
  export default chalk
}
