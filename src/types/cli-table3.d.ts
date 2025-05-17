declare module 'cli-table3' {
  interface TableOptions {
    head?: string[]
    colWidths?: number[]
    colAligns?: string[]
    style?: {
      head?: string[]
      border?: string[]
      [key: string]: string[] | number | boolean | undefined
    }
    chars?: {
      top?: string
      'top-mid'?: string
      'top-left'?: string
      'top-right'?: string
      bottom?: string
      'bottom-mid'?: string
      'bottom-left'?: string
      'bottom-right'?: string
      left?: string
      'left-mid'?: string
      mid?: string
      'mid-mid'?: string
      right?: string
      'right-mid'?: string
      middle?: string
    }
    wordWrap?: boolean
    [key: string]: string[] | number[] | string | number | boolean | object | undefined
  }

  class Table {
    constructor(options?: TableOptions)
    push(...rows: (string | number | boolean | null | undefined)[][]): void
    toString(): string
  }

  export default Table
}
