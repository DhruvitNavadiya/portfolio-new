// Renders resume.html to an A4 PDF with headless Chromium.
// Usage: node resume/build.mjs
// Needs the `playwright` package (the project's, or a global install) and a Chromium it can launch.
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  const globalRoot = execSync("npm root -g").toString().trim();
  ({ chromium } = createRequire(path.join(globalRoot, "noop.js"))("playwright"));
}

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, "Dhruvit_Navadiya_Resume.pdf");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(dir, "resume.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
await browser.close();

const pages = (readFileSync(out, "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`wrote ${path.relative(process.cwd(), out)} (${pages} page${pages === 1 ? "" : "s"})`);
