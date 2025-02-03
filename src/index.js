import updateNotifier from "update-notifier";
import pkg from "../package.json" with { type: "json" };

updateNotifier({ pkg }).notify();

export default function () {
  let intro = `Dave Williams (v${pkg.version})`;
  let sep = "-".repeat(intro.length);

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
