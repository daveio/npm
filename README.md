# `dave.io`

> Because every developer needs a metapackage that does almost nothing, but does it with style.

Metapackage for Dave Williams.

It's a package. For Dave. By Dave. About Dave. If you were expecting more, well, that's on you.

With thanks - and apologies - to [@zachleat](https://github.com/zachleat).

---

## Table of Contents

- [Why?](#why)
- [Usage](#usage)
  - [CLI](#cli)
  - [Programmatic](#programmatic)
- [Development](#development)
- [Incoming](#incoming)
- [Changelog](#changelog)
- [License](#license)
- [Just show me the output](#just-show-me-the-output)

---

## Why?

![it is a mystery](assets/mystery.png)

## Usage

### CLI

```sh
npx dave.io
```

### Programmatic

> For those who want to automate their disappointment.

First, install the package:

```bash
npm install dave.io
```

Then you can pull it in to your heart's content:

```js
import dave from "dave.io";

dave();
```

Or, if you're still clinging to CommonJS:

```js
const dave = await import("dave.io");

dave();
```

## Development

- Written in **TypeScript**, because more code is more better.
- Built and tested (no, really) with `bun`, because  `npm` and `yarn` don't break enough.
- Linted with `biome`, because someone has to care about code style.

If you want to contribute, ask yourself: why?

## Incoming

Believe it or not, features are planned!

- `--cv` / `-c` parameter to dump out my CV.
- Fetching links (and CV, when implemented) from a remote.
  - There will always be a static fallback.
- Literally anything useful.

## Changelog

- `1.0.1` First release! May angels rejoice.
- `1.0.2` (current) Minor dependency bump and twiddle to remove Node from `engines`.

## License

MIT.

Because you should be free to do whatever you want with this, including ignoring it entirely.

## Just show me the output

Oh, alright then.

![Output](assets/npm.gif)
