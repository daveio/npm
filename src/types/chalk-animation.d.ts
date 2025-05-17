declare module 'chalk-animation' {
  interface ChalkAnimationInstance {
    start(): void
    stop(): void
    replace(text: string): void
    render(): void
  }

  interface ChalkAnimation {
    rainbow(text: string): ChalkAnimationInstance
    pulse(text: string): ChalkAnimationInstance
    glitch(text: string): ChalkAnimationInstance
    radar(text: string): ChalkAnimationInstance
    neon(text: string): ChalkAnimationInstance
    karaoke(text: string): ChalkAnimationInstance
  }

  const chalkAnimation: ChalkAnimation
  export default chalkAnimation
}
