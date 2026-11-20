import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readings } from "./readings.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modules =
  process.argv[2] || path.join(root, "tools", ".qa", "node_modules");
const { chromium } = await import(
  pathToFileURL(path.join(modules, "playwright-core", "index.mjs"))
);
const { parse, parseFragment } = await import(
  pathToFileURL(path.join(modules, "parse5", "dist", "index.js"))
);
const browserPath =
  process.env.RP_BROWSER ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = process.env.RP_BASE_URL || "http://127.0.0.1:4173";
const pages = [
  "Home/index.html",
  "First semester/index.html",
  "Second semester/index.html",
  ...readings.map((r) => r.path),
];
const results = {
  checkedAt: new Date().toISOString(),
  checks: [],
  failures: [],
  pageCount: pages.length,
  viewports: [1440, 768, 360],
  browser: "Chromium (installed Google Chrome)",
  actualGoogleSites: false,
};
const qaDir = path.resolve(process.env.TEMP || root, "reading-portfolio-qa");
fs.mkdirSync(qaDir, { recursive: true });
let checks = 0;
function check(condition, label) {
  checks++;
  if (!condition) results.failures.push(label);
}
const allNodes = (node) => [node, ...(node.childNodes || []).flatMap(allNodes)];
const attr = (node, name) => node.attrs?.find((x) => x.name === name)?.value;
const textContent = (node) =>
  node.nodeName === "#text"
    ? node.value
    : (node.childNodes || []).map(textContent).join("");
const normalized = (t) => t.replace(/\s+/g, " ").trim();
const getClass = (nodes, cls) =>
  nodes.filter((n) => (attr(n, "class") || "").split(" ").includes(cls));
const rootIds = [];
const externalFooterLinks = [
  "https://crepmc.github.io/",
  "https://github.com/CrepMC",
  "mailto:nhan069069@stu.vinschool.edu.vn",
];

for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const fragment = fs.readFileSync(
    path.join(root, path.dirname(file), "embed.txt"),
    "utf8",
  );
  const errors = [];
  const doc = parse(html, { onParseError: (error) => errors.push(error.code) });
  const nodes = allNodes(doc);
  const embedErrors = [];
  const embedded = allNodes(
    parseFragment(fragment, {
      onParseError: (error) => embedErrors.push(error.code),
    }),
  );
  check(!errors.length, `${file}: HTML parse errors ${errors}`);
  check(!embedErrors.length, `${file}: embed parse errors ${embedErrors}`);
  check(
    !html.includes("\uFFFD") && !fragment.includes("\uFFFD"),
    `${file}: UTF-8 replacement character`,
  );
  check(
    nodes.filter((n) => n.tagName === "h1").length === 1,
    `${file}: exactly one h1`,
  );
  check(
    embedded.filter((n) => n.tagName === "h1").length === 1,
    `${file}: embed exactly one h1`,
  );
  check(
    attr(
      nodes.find((n) => n.tagName === "html"),
      "lang",
    ) === "en",
    `${file}: English document language`,
  );
  const ids = nodes.map((n) => attr(n, "id")).filter(Boolean);
  check(ids.length === new Set(ids).size, `${file}: duplicate IDs`);
  const embedIds = embedded.map((n) => attr(n, "id")).filter(Boolean);
  check(
    embedIds.length === new Set(embedIds).size,
    `${file}: duplicate embed IDs`,
  );
  const pageRoot = nodes.find((n) => attr(n, "data-page"));
  rootIds.push(attr(pageRoot, "id"));
  for (const node of nodes.filter((n) => n.tagName === "a")) {
    const href = attr(node, "href");
    if (externalFooterLinks.includes(href)) continue;
    const [destination, anchor] = href.split("#");
    const target = path.resolve(
      root,
      path.dirname(file),
      decodeURIComponent(destination || path.basename(file)),
    );
    const exists = fs.existsSync(target);
    check(exists, `${file}: broken route ${href}`);
    if (exists && anchor) {
      const targetNodes = destination
        ? allNodes(parse(fs.readFileSync(target, "utf8")))
        : nodes;
      check(
        targetNodes.some(
          (item) => attr(item, "id") === decodeURIComponent(anchor),
        ),
        `${file}: missing anchor ${href}`,
      );
    }
  }
  for (const node of embedded.filter((n) => n.tagName === "a")) {
    const href = attr(node, "href");
    check(
      href.startsWith("#")
        ? embedIds.includes(href.slice(1))
        : externalFooterLinks.includes(href),
      `${file}: invalid embed link ${href}`,
    );
  }
  check(
    !/<(?:html|head|body)\b|<!doctype|```/i.test(fragment),
    `${file}: embed contains document shell or fence`,
  );
  for (const tree of [nodes, embedded]) {
    for (const node of tree.filter((n) => n.tagName === "script")) {
      try {
        new vm.Script(textContent(node));
        checks++;
      } catch (e) {
        check(false, `${file}: JS syntax ${e.message}`);
      }
    }
    check(
      !tree.some((n) => attr(n, "src") || n.tagName === "link"),
      `${file}: runtime asset dependency`,
    );
    const footer = getClass(tree, "site-footer");
    check(footer.length === 1, `${file}: exactly one shared footer`);
    const links = footer
      .flatMap(allNodes)
      .filter((node) => node.tagName === "a")
      .map((node) => attr(node, "href"));
    check(
      externalFooterLinks.every((href) => links.includes(href)),
      `${file}: footer contact and profile links`,
    );
  }
  for (const cls of [
    "summary-text",
    "evidence-item",
    "lab",
    "vocab-card",
    "written-response",
    "source-copy",
    "site-footer",
  ]) {
    check(
      JSON.stringify(
        getClass(nodes, cls).map((n) => normalized(textContent(n))),
      ) ===
        JSON.stringify(
          getClass(embedded, cls).map((n) => normalized(textContent(n))),
        ),
      `${file}: standalone/embed content differs in ${cls}`,
    );
  }
}
check(
  rootIds.length === new Set(rootIds).size,
  "Unique root IDs across all pages",
);
for (const r of readings) {
  check(
    r.vocab.length >= 4 && r.vocab.length <= 6,
    `${r.id}: vocabulary count`,
  );
  const words = r.summary.split(/\s+/).length;
  if (!r.incomplete)
    check(words >= 80 && words <= 130, `${r.id}: summary length ${words}`);
}
results.checks.push(
  "18 documents + 18 fragments: syntax, semantics, IDs, relative links, anchors, UTF-8, inline assets and content parity",
);
console.log("Static checks completed. Starting browser checks.");

const browser = await chromium.launch({
  executablePath: browserPath,
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const browserErrors = [];
const requests = [];
page.on("pageerror", (error) => browserErrors.push(error.message));
page.on("request", (request) => {
  if (!request.url().startsWith(base) && !request.url().startsWith("file:"))
    requests.push(request.url());
});
const homePath = path.join(root, "index.html");
await page.goto(pathToFileURL(homePath).href);
check(
  (await page.locator("[data-reading-row]").count()) === readings.length,
  "Root entry: opens offline with all readings",
);
for (const width of results.viewports) {
  await page.setViewportSize({ width, height: 1000 });
  const response = await page.goto(`${base}/`);
  check(
    response?.ok() && (await page.locator("h1").isVisible()),
    `Root entry: serves correctly at ${width}px`,
  );
  check(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `Root entry: no horizontal overflow at ${width}px`,
  );
}
await page.locator("input[data-search]").fill("tet");
check(
  (await page.locator("[data-reading-row]:visible").count()) === 1,
  "Root entry: search filters the catalog",
);
await page.locator("[data-reading-row]:visible h3 a").click();
check(
  page.url() === `${base}/Second%20semester/Book-7-2/index.html`,
  "Root entry: opens a reading by a relative URL",
);
await page.getByRole("link", { name: "Home", exact: true }).first().click();
check(
  page.url() === `${base}/index.html`,
  "Reading navigation returns to the root entry",
);
check(
  await page
    .locator(".site-footer h2")
    .allTextContents()
    .then((labels) => labels.join(", ") === "Contact, Legal, Updates, Pages"),
  "Root entry: shared footer sections",
);
results.checks.push(
  "Root index.html opens offline and at all three widths, with catalog search and navigation under the configured base path",
);
for (const width of results.viewports) {
  await page.setViewportSize({ width, height: 1000 });
  for (const file of pages) {
    await page.goto(
      `${base}/${file.split("/").map(encodeURIComponent).join("/")}`,
    );
    await page.locator('[data-initialized="true"]').waitFor();
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    check(
      layout.scroll <= width && layout.body <= width,
      `${file}: horizontal overflow at ${width}: ${JSON.stringify(layout)}`,
    );
    check(
      await page.locator("h1").isVisible(),
      `${file}: heading visible at ${width}`,
    );
    if (file === "Home/index.html")
      await page.screenshot({
        path: path.join(qaDir, `home-${width}.png`),
        fullPage: width === 360,
      });
  }
  console.log(`Layout checked: all 18 pages at ${width}px.`);
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${base}/Home/index.html`);
await page.locator('[data-filter-semester="1"]').click();
check(
  (await page.locator("[data-reading-row]:visible").count()) === 8,
  "Home: first semester filter",
);
await page.locator("select[data-theme]").selectOption("Technology & society");
check(
  (await page.locator("[data-reading-row]:visible").count()) === 3,
  "Home: theme and semester combined",
);
await page.locator("input[data-search]").fill("TikTok");
check(
  (await page.locator("[data-reading-row]:visible").count()) === 1,
  "Home: combined text search",
);
await page.locator("input[data-search]").fill("not-a-reading-title");
check(await page.locator("[data-empty]").isVisible(), "Home: empty state");
await page.locator("input[data-search]").fill("tet");
await page.locator("select[data-theme]").selectOption("all");
await page.locator('[data-filter-semester="all"]').click();
check(
  (await page.locator("[data-reading-row]:visible").count()) === 1,
  "Home: accent-insensitive Tết search",
);
for (const sem of ["First", "Second"]) {
  await page.goto(`${base}/${sem}%20semester/index.html`);
  await page.locator("input[data-search]").fill("zzzz");
  check(
    await page.locator("[data-empty]").isVisible(),
    `${sem} semester search`,
  );
}
results.checks.push(
  "Home combined search/semester/theme filters, empty state, diacritic search, both semester searches",
);

for (const r of readings) {
  await page.goto(
    `${base}/${r.path.split("/").map(encodeURIComponent).join("/")}`,
  );
  check(
    (await page.locator(".written-response").innerText()) === r.reflection,
    `${r.id}: shows its written response`,
  );
  check(
    (await page.locator("textarea, [data-quiz], [data-save-note]").count()) ===
      0,
    `${r.id}: retired quiz and note form are absent`,
  );
  check(
    (await page
      .getByRole("heading", { name: "Reading check", exact: true })
      .count()) === 0,
    `${r.id}: retired quiz heading is absent`,
  );
  const card = page.locator(".vocab-card").first();
  await card.locator("summary").click();
  check(
    (await card.getAttribute("open")) !== null,
    `${r.id}: vocabulary opens`,
  );
  await card.locator("summary").click();
  await page.waitForFunction(() => !document.querySelector(".vocab-card[data-disclosure-animating]"));
  check(
    (await card.getAttribute("open")) === null,
    `${r.id}: vocabulary closes`,
  );
  for (const explorer of await page.locator("[data-explorer]").all()) {
    const buttons = explorer.locator("[data-choice]");
    for (let i = 0; i < (await buttons.count()); i++) {
      await buttons.nth(i).click();
      check(
        await explorer.locator(`[data-panel="${i}"]`).isVisible(),
        `${r.id}: activity panel ${i}`,
      );
      check(
        (await explorer.locator("[data-panel]:visible").count()) === 1,
        `${r.id}: activity has one active panel`,
      );
    }
  }
  for (const sorter of await page.locator("[data-sort]").all()) {
    await sorter.locator("[data-check-sort]").click();
    check(
      (await sorter.locator("[data-sort-status]").innerText()).startsWith(
        "0 of",
      ),
      `${r.id}: unanswered classification`,
    );
    const selects = await sorter.locator("select").all();
    for (const select of selects)
      await select.selectOption(await select.getAttribute("data-answer"));
    await sorter.locator("[data-check-sort]").click();
    check(
      (await sorter.locator("[data-sort-status]").innerText()).startsWith(
        `${selects.length} of ${selects.length}`,
      ),
      `${r.id}: correct classification`,
    );
    await sorter.locator("[data-reset-sort]").click();
    check(
      await sorter
        .locator("select")
        .evaluateAll((els) => els.every((el) => el.value === "")),
      `${r.id}: classification resets`,
    );
  }
  if (r.id === "Book-8-1") {
    await page.locator("[data-setting]").selectOption("rural");
    await page.locator('[data-barrier][value="cost"]').check();
    const response = await page.locator("[data-access-result]").innerText();
    check(
      response.includes("Rural context") && response.includes("poverty"),
      "Food access: setting and barrier update",
    );
  }
  if (r.id === "Book-5-2") {
    await page.locator('[data-survey="3"]').click();
    check(
      (await page.locator("[data-survey-result]").innerText()).includes("15%"),
      "Home survey changes explanation",
    );
  }
  if (r.id === "Book-6-2") {
    await page.locator(".turning-point summary").click();
    check(
      (await page.locator(".turning-point").getAttribute("open")) !== null,
      "Thanksgiving: turning point opens",
    );
  }
}
results.checks.push(
  "All 15 written responses, shared footers, vocabulary decks and existing interactive learning activities",
);

// Animation regressions: reversals must finish in the last requested state.
await page.goto(`${base}/First%20semester/Book-1-1/index.html`);
const animatedCard = page.locator(".vocab-card").first();
for (const direction of ["open", "close"]) {
  const motion = await animatedCard.evaluate(async (element) => {
    const heights = [element.getBoundingClientRect().height];
    element.querySelector("summary").click();
    const started = performance.now();
    do {
      await new Promise(requestAnimationFrame);
      heights.push(element.getBoundingClientRect().height);
    } while (element.hasAttribute("data-disclosure-animating") && performance.now() - started < 1500);
    return {
      heights,
      open: element.open,
      height: element.style.height,
      animating: element.hasAttribute("data-disclosure-animating"),
    };
  });
  const distinctHeights = new Set(motion.heights.map(height => Math.round(height)));
  check(distinctHeights.size > 3, `Disclosure: ${direction} has intermediate animation frames`);
  check(motion.open === (direction === "open"), `Disclosure: ${direction} finishes in its requested state`);
  check(!motion.height && !motion.animating, `Disclosure: ${direction} restores natural height`);
}

const reversed = await animatedCard.evaluate(async (element) => {
  const summary = element.querySelector("summary");
  const frame = () => new Promise(requestAnimationFrame);
  summary.click();
  await frame();
  await frame();
  summary.click();
  await frame();
  summary.click();
  const started = performance.now();
  while (element.hasAttribute("data-disclosure-animating") && performance.now() - started < 1500) await frame();
  return { open: element.open, height: element.style.height, expanded: summary.getAttribute("aria-expanded") };
});
check(reversed.open && reversed.expanded === "true" && !reversed.height, "Disclosure: rapid open/close/open finishes expanded");
await animatedCard.locator("summary").focus();
await page.keyboard.press("Space");
await page.waitForFunction(() => !document.querySelector("[data-disclosure-animating]"));
check(await animatedCard.getAttribute("open") === null, "Disclosure: Space collapses with the keyboard");
await page.keyboard.press("Enter");
await page.waitForFunction(() => !document.querySelector("[data-disclosure-animating]"));
check(await animatedCard.getAttribute("open") !== null, "Disclosure: Enter expands with the keyboard");
await animatedCard.locator("summary").click();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.waitForFunction(() => !document.querySelector("[data-disclosure-animating]"));
check(await animatedCard.getAttribute("open") === null, "Disclosure: enabling reduced motion settles an active collapse");
const reduced = await animatedCard.evaluate(element => {
  element.querySelector("summary").click();
  return { open: element.open, animations: element.getAnimations().length, height: element.style.height };
});
check(reduced.open && reduced.animations === 0 && !reduced.height, "Disclosure: reduced motion opens immediately");
await page.emulateMedia({ reducedMotion: "no-preference" });
await animatedCard.locator("summary").click();
await page.setViewportSize({ width: 360, height: 1000 });
await page.waitForFunction(() => !document.querySelector("[data-disclosure-animating]"));
await animatedCard.locator("summary").click();
await page.setViewportSize({ width: 768, height: 1000 });
await page.waitForFunction(() => !document.querySelector("[data-disclosure-animating]"));
check(await animatedCard.evaluate(element => element.open && !element.style.height && element.scrollHeight <= element.clientHeight + 1), "Disclosure: resize during opening leaves content unclipped");
await page.setViewportSize({ width: 1440, height: 1000 });
results.checks.push("Expand/collapse animation frames, fast reversals, keyboard activation, resizing and reduced motion");
console.log(
  "All reading interactions checked. Testing file access and embeds.",
);

await page.goto(
  `${base}/${encodeURIComponent("First semester")}/Book-1-1/index.html`,
);
await page
  .getByRole("navigation", { name: "Footer pages" })
  .getByRole("link", { name: "About this project" })
  .click();
check(
  page.url() === `${base}/index.html#about-project`,
  "Footer About link works under the repository base path",
);
await page
  .locator(".site-footer")
  .screenshot({ path: path.join(qaDir, "reading-footer-desktop.png") });
await page.setViewportSize({ width: 360, height: 900 });
await page
  .locator(".site-footer")
  .screenshot({ path: path.join(qaDir, "reading-footer-mobile.png") });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.screenshot({
  path: path.join(qaDir, "reading-desktop.png"),
  fullPage: true,
});
for (const file of pages) {
  await page.goto(pathToFileURL(path.join(root, file)).href);
  check(
    (await page.locator('[data-initialized="true"]').count()) === 1,
    `${file}: file protocol initialization`,
  );
}
await page.goto(pathToFileURL(path.join(root, "Home/index.html")).href);
await page.getByRole("link", { name: "First semester", exact: true }).click();
check(
  page.url().includes("First%20semester"),
  "file protocol relative navigation with spaces",
);
results.checks.push(
  "All pages open with file:// and support relative file navigation",
);

for (const file of pages) {
  const fragment = fs.readFileSync(
    path.join(root, path.dirname(file), "embed.txt"),
    "utf8",
  );
  await page.goto(`${base}/Home/index.html`);
  await page.setContent(
    '<!doctype html><html lang="en"><body><p id="host">Host content remains intact</p><iframe title="Embed test" sandbox="allow-scripts" style="width:100%;height:900px;border:0"></iframe></body></html>',
  );
  await page.locator("iframe").evaluate((el, html) => {
    el.srcdoc = html;
  }, fragment);
  const frame = page.frameLocator("iframe");
  await frame.locator('[data-initialized="true"]').waitFor();
  check(
    await frame.locator("h1").isVisible(),
    `${file}: sandbox embed initialized`,
  );
  check(
    (await page.locator("#host").innerText()) === "Host content remains intact",
    `${file}: host untouched`,
  );
  const footerLinks = await frame
    .locator(".site-footer a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  check(
    externalFooterLinks.every((href) => footerLinks.includes(href)),
    `${file}: sandbox footer links`,
  );
  const r = readings.find((r) => r.path === file);
  if (r) {
    check(
      (await frame.locator(".written-response").innerText()) === r.reflection,
      `${r.id}: written response in sandbox`,
    );
    check(
      (await frame
        .locator("textarea, [data-quiz], [data-save-note]")
        .count()) === 0,
      `${r.id}: retired controls are absent from embed`,
    );
  }
}
results.checks.push(
  "All 18 fragments in isolated sandbox iframes, including written responses and footer links",
);

const noJs = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 360, height: 900 },
});
const plain = await noJs.newPage();
for (const file of pages) {
  await plain.goto(
    `${base}/${file.split("/").map(encodeURIComponent).join("/")}`,
  );
  check(await plain.locator("h1").isVisible(), `${file}: no-JS heading`);
  if (file.includes("Book-")) {
    check(
      await plain.locator(".summary-text").isVisible(),
      `${file}: no-JS summary`,
    );
    check(
      await plain.locator(".written-response").isVisible(),
      `${file}: no-JS written response`,
    );
    for (const panel of await plain.locator("[data-panel]").all())
      check(await panel.isVisible(), `${file}: no-JS activity explanations`);
    await plain.locator(".vocab-card summary").first().click();
    check(
      (await plain.locator(".vocab-card[open]").count()) === 1,
      `${file}: native flashcard without JS`,
    );
  }
}
results.checks.push(
  "All 18 pages with JavaScript disabled; summaries, static explanations, study keys and native flashcards available",
);
await page.goto(`${base}/Home/index.html`);
await page.keyboard.press("Tab");
check(
  await page
    .locator(".skip-link")
    .evaluate((el) => el === document.activeElement),
  "Keyboard skip link",
);
await page.emulateMedia({ reducedMotion: "reduce" });
check(
  (await page
    .locator("button")
    .first()
    .evaluate((el) => getComputedStyle(el).transitionDuration)) === "0s",
  "Reduced motion removes transitions",
);
check(
  browserErrors.length === 0,
  `Browser errors: ${browserErrors.join("; ")}`,
);
check(requests.length === 0, `External requests: ${requests.join("; ")}`);
results.checks.push(
  "Keyboard entry/skip link, reduced motion, no uncaught JavaScript errors or external asset requests",
);
await browser.close();
results.assertions = checks;
results.passed = results.failures.length === 0;
fs.writeFileSync(
  path.join(root, "tools", "test-results.json"),
  JSON.stringify(results, null, 2) + "\n",
);
console.log(JSON.stringify(results, null, 2));
if (!results.passed) process.exitCode = 1;
