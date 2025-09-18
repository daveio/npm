declare module 'update-notifier' {
  interface Options {
    pkg: {
      name: string
      version: string
    }
    callback?: (error: Error | null, update?: UpdateInfo) => void
    packageName?: string
    packageVersion?: string
    updateCheckInterval?: number
    shouldNotifyInNpmScript?: boolean
    distTag?: string
  }

  interface UpdateInfo {
    latest: string
    current: string
    type: 'latest' | 'major' | 'minor' | 'patch' | 'prerelease' | 'build'
    name: string
  }

  interface Notifier {
    update?: UpdateInfo
    notify(options?: NotifyOptions): void
    check(): void
  }

  interface NotifyOptions {
    defer?: boolean
    message?: string
    isGlobal?: boolean
    boxenOptions?: object
  }

  function updateNotifier(options: Options): Notifier

  export = updateNotifier
}
