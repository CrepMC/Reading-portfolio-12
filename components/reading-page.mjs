import {readings} from '../tools/readings.mjs';
import {lab} from '../tools/labs.mjs';
import {artwork} from './art.mjs';
import {esc, pad} from './markup.mjs';
import {route} from './navigation.mjs';

function readingSection(ctx, id, number, title, body) {
  const sectionId = `${ctx.root}-${id}`;
  return `<section class="reading-section" id="${sectionId}" aria-labelledby="${sectionId}-title">
    <div class="section-title"><span>${number}</span><h2 id="${sectionId}-title">${esc(title)}</h2></div>
    ${body}
  </section>`;
}

function readingHero(reading) {
  const sourceAlert = reading.incomplete
    ? '<div class="source-alert"><strong>Excerpt — incomplete source</strong>Analysis is based on the supplied opening and vocabulary notes.</div>'
    : '';
  return `<header class="reading-hero">
    <div>
      <span class="eyebrow">READING ${pad(reading.number)} / 15 &nbsp; · &nbsp; ${esc(reading.theme)}</span>
      <h1>${esc(reading.title)}</h1>
      <p class="byline">${esc(reading.author)} &nbsp; / &nbsp; ${reading.year} &nbsp; / &nbsp; ${esc(reading.genre)}</p>
      <p class="hero-question">${esc(reading.question)}</p>${sourceAlert ? `\n      ${sourceAlert}` : ''}
    </div>
    <figure class="hero-visual">
      <div class="visual-header"><span>BETWEEN THE LINES</span><span>${pad(reading.number)}</span></div>
      ${artwork(reading.motif, `Illustrative motif for ${reading.short}`)}
      <figcaption>${esc(reading.short)}<small>AN ILLUSTRATIVE READING MOTIF</small></figcaption>
    </figure>
  </header>`;
}

function readingContents(ctx, reading) {
  const activity = lab(reading);
  const evidence = reading.evidence.map(([claim, citation, explanation]) => `<article class="evidence-item">
    <span class="label-word">CLAIM</span><h3>${esc(claim)}</h3>
    <p><span class="label-word">EVIDENCE · PARAPHRASED</span>${esc(citation)}</p>
    <p class="explain"><span class="label-word">WHY IT MATTERS</span>${esc(explanation)}</p>
  </article>`).join('');
  const vocabulary = reading.vocab.map(([word, definition, example]) => `<details class="vocab-card">
    <summary>${esc(word)}</summary><p>${esc(definition)}</p><p class="example">${esc(example)}</p>
  </details>`).join('');
  const related = reading.related.map(id => {
    const other = readings.find(item => item.id === id);
    return route(ctx, other.path, `${id} · ${esc(other.short)} ↗`);
  }).join('');

  return [
    ['summary', 'What I read', `<p class="summary-text">${esc(reading.summary)}</p>
      <aside class="reading-focus"><span class="eyebrow">READING FOCUS</span><p>${esc(reading.focus)}</p></aside>`],
    ['evidence', 'Evidence & analysis', evidence],
    ['lab', 'Explore the idea', `<div class="lab">
      <span class="eyebrow">${esc(activity.type)}</span><h3>${esc(activity.title)}</h3>${activity.html}
      <noscript><p class="caption">Interactive controls need JavaScript. All explanations and reference keys remain available on this page.</p></noscript>
    </div>`],
    ['vocabulary', 'Words to keep', `<p class="section-intro">Open a word to reveal its meaning and an original example. Each word appears in the supplied reading.</p>
      <div class="vocab-grid">${vocabulary}</div>`],
    ['reflection', 'Your response', `<div class="written-response"><p>${esc(reading.reflection)}</p></div>`],
    ['source', 'Source & connections', `<p class="source-copy">${esc(reading.source)}</p>
      <p class="source-copy">Summaries, analysis, examples and reflections are original study notes based on the supplied text.</p>
      <div class="related-links">${related}</div>`],
  ];
}

export function readingPage(ctx, reading) {
  const sections = readingContents(ctx, reading);
  const contents = sections.map(([id, title], i) => `<a href="#${ctx.root}-${id}"><span>${pad(i + 1)}</span>${esc(title)}</a>`).join('');
  const body = sections.map(([id, title, content], i) => readingSection(ctx, id, pad(i + 1), title, content)).join('');
  const semester = reading.semester === 1 ? 'First semester' : 'Second semester';
  const earlier = readings[reading.number - 2];
  const later = readings[reading.number];

  return `<main id="${ctx.root}-main">
    <div class="breadcrumb">${route(ctx, 'index.html', 'Home')}<span>/</span>${route(ctx, `${semester}/index.html`, semester)}<span>/</span><span>${reading.id}</span></div>
    ${readingHero(reading)}
    <div class="reading-layout">
      <nav class="contents" aria-label="On this reading page"><span class="eyebrow">CONTENTS</span>${contents}</nav>
      <div class="reading-body">${body}</div>
    </div>
    <nav class="page-turn" aria-label="Previous and next reading">
      <div><span class="eyebrow">${earlier ? 'PREVIOUS READING' : 'BACK TO THE COLLECTION'}</span>${route(ctx, earlier?.path || 'First semester/index.html', earlier ? `← ${esc(earlier.short)}` : '← First semester')}</div>
      <div><span class="eyebrow">${later ? 'NEXT READING' : 'BACK TO THE INDEX'}</span>${route(ctx, later?.path || 'index.html', later ? `${esc(later.short)} →` : 'All readings →')}</div>
    </nav>
  </main>`;
}
