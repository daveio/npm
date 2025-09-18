declare module 'cli-spinners' {
  interface Spinner {
    interval: number
    frames: string[]
  }

  interface Spinners {
    [key: string]: Spinner
    dots: Spinner
    dots2: Spinner
    dots3: Spinner
    dots4: Spinner
    dots5: Spinner
    dots6: Spinner
    dots7: Spinner
    dots8: Spinner
    dots9: Spinner
    dots10: Spinner
    dots11: Spinner
    dots12: Spinner
    line: Spinner
    line2: Spinner
    pipe: Spinner
    simpleDots: Spinner
    simpleDotsScrolling: Spinner
    star: Spinner
    star2: Spinner
    flip: Spinner
    hamburger: Spinner
    growVertical: Spinner
    growHorizontal: Spinner
    balloon: Spinner
    balloon2: Spinner
    noise: Spinner
    bounce: Spinner
    boxBounce: Spinner
    boxBounce2: Spinner
    triangle: Spinner
    arc: Spinner
    circle: Spinner
    squareCorners: Spinner
    circleQuarters: Spinner
    circleHalves: Spinner
    squish: Spinner
    toggle: Spinner
    toggle2: Spinner
    toggle3: Spinner
    toggle4: Spinner
    toggle5: Spinner
    toggle6: Spinner
    toggle7: Spinner
    toggle8: Spinner
    toggle9: Spinner
    toggle10: Spinner
    toggle11: Spinner
    toggle12: Spinner
    toggle13: Spinner
    arrow: Spinner
    arrow2: Spinner
    arrow3: Spinner
    bouncingBar: Spinner
    bouncingBall: Spinner
    smiley: Spinner
    monkey: Spinner
    hearts: Spinner
    clock: Spinner
    earth: Spinner
    moon: Spinner
    runner: Spinner
    pong: Spinner
    shark: Spinner
    dqpb: Spinner
    weather: Spinner
    christmas: Spinner
    grenade: Spinner
    point: Spinner
    layer: Spinner
    betaWave: Spinner
    aesthetic: Spinner
  }

  const spinners: Spinners
  export default spinners
}
