import fs from "node:fs";
import { footer, footerStyles } from "./footer.mjs";
import { header } from "./header.mjs";
import { esc } from "./markup.mjs";

const theme = fs.readFileSync(new URL("./theme.css", import.meta.url), "utf8");
const runtime = fs.readFileSync(
  new URL("./runtime.js", import.meta.url),
  "utf8",
);

export function renderPage(page, embed) {
  const root = `rp-${page.id.toLowerCase().replaceAll(" ", "-")}`;
  const ctx = { ...page, root, embed };
  const style = `${theme}\n${footerStyles}`.replaceAll("__ROOT__", `#${root}`);
  const script = runtime.replaceAll("__ROOT_ID__", root);
  const accent = page.reading ? ` style="--accent:${page.reading.color}"` : "";
  const content = `<div id="${root}" data-page="${esc(page.id)}"${accent}>
  <div class="shell">
    ${header(ctx)}
    ${page.render(ctx)}
    ${footer(ctx)}
  </div>
</div>`;

  if (embed)
    return `<style>\n${style}\n</style>\n${content}\n<script>\n${script}</script>\n`;

  const description =
    page.reading?.question ||
    "An interactive Grade 12 reading portfolio with 15 readings, two semester collections and written reflections.";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(description)}">
<title>${esc(page.title)}</title>
<style>
html, body { margin: 0; padding: 0; }
html { background: #f7f4ed; }
${style}
</style>
</head>
<body>
${content}
<script>
${script}</script>
</body>
</html>
`;
}
