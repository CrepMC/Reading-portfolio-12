import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readings } from "./readings.mjs";
import { coverArt } from "../components/art.mjs";
import { renderPage } from "../components/layout.mjs";
import { library } from "../components/library.mjs";
import { pad } from "../components/markup.mjs";
import { route } from "../components/navigation.mjs";
import { readingPage } from "../components/reading-page.mjs";

const semesters = [
  {
    id: "First semester",
    ordinal: "First",
    numeral: "I",
    n: 1,
    count: 8,
    title: "People, platforms<br>& possibilities.",
    description:
      "From the teams we join to the systems that shape our choices. Eight readings about wellbeing, technology and food.",
    question: "How do the systems around us shape the choices available to us?",
    synthesis:
      "A promising resource is useful only if people can access it. Neilson’s sports article and McBirney’s food-access explanation both connect individual wellbeing with financial and practical barriers. The platform readings add another layer: company incentives shape which choices become easy or difficult.",
    prompt:
      "Compare a personal solution with a structural one. Who has the power to make each change, and what evidence would show whether it helped?",
  },
  {
    id: "Second semester",
    ordinal: "Second",
    numeral: "II",
    n: 2,
    count: 7,
    title: "Journeys, justice<br>& belonging.",
    description:
      "Seven readings about the places we move through, the barriers we encounter and the traditions that bring us home.",
    question: "What makes a place accessible—and what makes it feel like home?",
    synthesis:
      "Sallis and Everitt examine shared spaces from different perspectives: one argues for safer transport design, while the other shows the daily cost of obstructed access. McAndrew, Lyall and Graf then explore belonging through places, memories and rituals. A space can be physically present without offering equal access or a sense of connection.",
    prompt:
      "Compare access with belonging. Can a place provide one without the other? Develop a claim using two readings.",
  },
];

function home(ctx) {
  return `<main id="${ctx.root}-main"><section class="cover"><div class="cover-copy"><span class="eyebrow">A GRADE 12 READING PORTFOLIO · 2026—2027</span><h1>Between<br>the <em>Lines.</em></h1><p>A collection of readings, questions and discoveries.<br>Looking closer at the words—and the world<br>they open up.</p><div class="cover-actions"><a class="cta" href="#${ctx.root}-library">Explore the readings <span aria-hidden="true">↗</span></a><a class="text-link" href="#${ctx.root}-collections">The collections ↓</a></div></div>${coverArt()}</section><div class="collection-strip"><p class="strip-note">Every text begins<br>a different conversation.</p><div class="stat"><strong>15</strong><span>Readings<br>to explore</span></div><div class="stat"><strong>02</strong><span>Semester<br>collections</span></div><div class="stat"><strong>05</strong><span>Connected<br>themes</span></div></div><section id="${ctx.root}-collections"><div class="section-heading"><div><span class="eyebrow">TWO CHAPTERS. ONE READING JOURNEY.</span><h2>The collections.</h2></div><p>From evidence to interpretation,<br>and from a text to your own thinking.</p></div><div class="semester-grid">${semesters.map((s) => `<article class="semester-card"><div><span class="eyebrow">COLLECTION ${pad(s.n)} · ${pad(s.count)} READINGS</span><h3>${s.ordinal} semester</h3><p>${s.description}</p>${route(ctx, `${s.id}/index.html`, "Explore the collection ↗", 'class="text-link"')}</div><span class="roman" aria-hidden="true">${s.numeral}</span></article>`).join("")}</div><p class="collection-note">Semester groups follow source order: eight readings, then seven. This allocation is provisional.</p></section>${library(ctx, readings)}<section id="about-project" class="closing-note"><h2>About this project</h2><p>Between the Lines is a Grade 12 reading portfolio. Each entry includes a summary, textual analysis, vocabulary, an activity and a written reflection. The collection spans 15 readings across two semesters.</p></section></main>`;
}
function semester(ctx, s) {
  return `<main id="${ctx.root}-main"><div class="breadcrumb">${route(ctx, "index.html", "Home")}<span>/</span><span>${s.id}</span></div><section class="semester-hero"><div><span class="eyebrow">COLLECTION ${pad(s.n)} · ${pad(s.count)} READINGS</span><h1>${s.ordinal}<br><em>semester.</em></h1><p>${s.description}</p></div><div class="semester-quote"><span class="eyebrow">THE CONNECTING QUESTION</span><p>${s.question}</p></div></section><aside class="synthesis"><span class="eyebrow">READING ACROSS TEXTS</span><h3>${s.title}</h3><p>${s.synthesis}</p><details><summary>A question to carry between readings</summary><p>${s.prompt}</p></details></aside>${library(
    ctx,
    readings.filter((r) => r.semester === s.n),
    false,
  )}<p class="collection-note" style="margin:25px 0 45px">Collection order is provisional and follows the supplied source compilation.</p></main>`;
}
const homeTitle = "Between the Lines — A Grade 12 Reading Portfolio";
const pages = [
  {
    path: "index.html",
    id: "Website home",
    title: homeTitle,
    render: home,
    standaloneOnly: true,
  },
  { path: "Home/index.html", id: "Home", title: homeTitle, render: home },
  ...semesters.map((s) => ({
    path: `${s.id}/index.html`,
    id: s.id,
    title: `${s.id} — Between the Lines`,
    render: (ctx) => semester(ctx, s),
  })),
  ...readings.map((r) => ({
    path: r.path,
    id: r.id,
    title: `${r.title} — Between the Lines`,
    reading: r,
    render: (ctx) => readingPage(ctx, r),
  })),
];
const outputRoot = fileURLToPath(new URL("../", import.meta.url));
for (const page of pages) {
  const destination = path.join(outputRoot, page.path);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, renderPage(page, false), "utf8");
  if (!page.standaloneOnly) {
    fs.writeFileSync(
      path.join(path.dirname(destination), "embed.txt"),
      renderPage(page, true),
      "utf8",
    );
  }
}
console.log("Built 19 standalone pages and 18 embed fragments.");
