import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readings } from "./readings.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modules =
  process.argv[2] || path.join(root, "tools", ".qa", "node_modules");
const { chromium } = await import(
  pathToFileURL(path.join(modules, "playwright-core", "index.mjs"))
);
const browser = await chromium.launch({
  executablePath:
    process.env.RP_BROWSER ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const axe = fs.readFileSync(
  path.join(modules, "axe-core", "axe.min.js"),
  "utf8",
);
const base = process.env.RP_BASE_URL || "http://127.0.0.1:4173";
const result = {
  checkedAt: new Date().toISOString(),
  standard: "Automated axe WCAG 2.0/2.1 A and AA checks",
  pages: [],
  violations: [],
};
for (const file of [
  "index.html",
  "Home/index.html",
  "First semester/index.html",
  "Second semester/index.html",
  ...readings.map((r) => r.path),
]) {
  await page.goto(
    `${base}/${file.split("/").map(encodeURIComponent).join("/")}`,
  );
  await page.addScriptTag({ content: axe });
  const audit = await page.evaluate(() =>
    axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    }),
  );
  result.pages.push({
    path: file,
    passedRules: audit.passes.length,
    violations: audit.violations.length,
    incompleteRules: audit.incomplete.map((rule) => rule.id),
  });
  result.violations.push(
    ...audit.violations.map((rule) => ({
      path: file,
      id: rule.id,
      impact: rule.impact,
      description: rule.description,
      nodes: rule.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  );
}
const screenshots = path.resolve(
  process.env.TEMP || root,
  "reading-portfolio-qa",
);
await page.goto(`${base}/First%20semester/Book-1-1/index.html`);
await page.screenshot({ path: path.join(screenshots, "reading-top.png") });
await page.locator("#rp-book-1-1-lab").scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshots, "reading-lab.png") });
await page.setViewportSize({ width: 360, height: 900 });
await page.goto(`${base}/`);
await page.screenshot({ path: path.join(screenshots, "home-mobile-top.png") });
await page.goto(`${base}/Second%20semester/Book-7-2/index.html`);
await page.screenshot({
  path: path.join(screenshots, "reading-mobile-top.png"),
});
await browser.close();
fs.writeFileSync(
  path.join(root, "tools", "accessibility-results.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
if (result.violations.length) process.exitCode = 1;
