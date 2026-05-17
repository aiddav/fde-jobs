import { readFile } from "node:fs/promises";

const css = await readFile("src/styles/globals.css", "utf8");
const bannedFonts = ["Inter", "Roboto", "Arial", "system-ui", "Space Grotesk"];
const banned = bannedFonts.filter((font) => css.includes(font));

if (banned.length > 0) {
  throw new Error(`Banned font references found: ${banned.join(", ")}`);
}

if (/box-shadow|drop-shadow|filter:\s*drop-shadow/i.test(css)) {
  throw new Error("Shadow usage is not allowed.");
}

const largeRadius = [...css.matchAll(/border-radius:\s*(\d+(?:\.\d+)?)px/g)]
  .map((match) => Number(match[1]))
  .filter((value) => value > 4);

if (largeRadius.length > 0) {
  throw new Error(`Border radius above 4px found: ${largeRadius.join(", ")}`);
}

const hexMatches = [...css.matchAll(/#[0-9a-fA-F]{3,8}/g)].map((match) => match[0]);
const variableBlock = css.match(/:root\s*{[\s\S]*?}\s*@media/)?.[0] ?? "";
const themeBlocks = css.match(/:root\[data-theme="(?:light|dark)"\]\s*{[\s\S]*?}/g)?.join("\n") ?? "";
const allowedHex = new Set([...variableBlock.matchAll(/#[0-9a-fA-F]{3,8}/g), ...themeBlocks.matchAll(/#[0-9a-fA-F]{3,8}/g)].map((match) => match[0]));
const disallowedHex = hexMatches.filter((hex) => !allowedHex.has(hex));

if (disallowedHex.length > 0) {
  throw new Error(`Colors must be declared only in theme variables: ${disallowedHex.join(", ")}`);
}

if (/letter-spacing:\s*-/i.test(css)) {
  throw new Error("Negative letter-spacing is not allowed.");
}

if (/font-size:\s*clamp\(|font-size:[^;]*(vw|vh|vmin|vmax)/i.test(css)) {
  throw new Error("Viewport-scaled font sizes are not allowed.");
}

console.log("CSS constraints passed.");
