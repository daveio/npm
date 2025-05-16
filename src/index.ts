// @ts-expect-error: No types for 'update-notifier'
import updateNotifier from "update-notifier";
import pkg from "../package.json" assert { type: "json" };

updateNotifier({ pkg }).notify();

export default function (): void {
  const intro = `Dave Williams (v${pkg.version})`;
  const sep = "-".repeat(intro.length);

  console.log(`${intro}
${sep}
xxxxxxxx https://xxxxxxx
xxxxxxxx https://xxxxxxx
xxxxxxxx https://xxxxxxx
xxxxxxxx https://xxxxxxx
xxxxxxxx https://xxxxxxx
xxxxxxxx https://xxxxxxx
xxxxxxxx https://xxxxxxx
xxxxxxxx https://xxxxxxx
xxxxxxxx https://xxxxxxx
`);
}
