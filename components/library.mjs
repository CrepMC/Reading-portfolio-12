import { artwork } from "./art.mjs";
import { esc, pad } from "./markup.mjs";
import { route } from "./navigation.mjs";

function rows(ctx, items) {
  return items
    .map(
      (r) =>
        `<article class="reading-row" data-reading-row data-semester="${r.semester}" data-theme="${esc(r.theme)}" data-search="${esc(`${r.title} ${r.author} ${r.theme} ${r.id}`)}" style="--accent:${r.color}"><span class="row-number">${pad(r.number)}</span><div class="mini-cover" aria-hidden="true"><span class="eyebrow">READING ${pad(r.number)}</span>${artwork(r.motif)}</div><div class="row-copy"><h3>${route(ctx, r.path, esc(r.title))}</h3><p>${esc(r.author)} · ${r.year} · ${esc(r.genre)}</p><p>${r.id} · Semester ${r.semester}</p>${r.incomplete ? '<span class="status-tag">Excerpt — incomplete source</span>' : ""}</div><span class="row-theme">${esc(r.theme)}</span>${ctx.embed ? "" : route(ctx, r.path, "↗", `class="row-arrow" aria-label="Open ${esc(r.title)}"`)}</article>`,
    )
    .join("");
}
export function library(ctx, items, all = true) {
  return `<section id="${ctx.root}-library" aria-labelledby="${ctx.root}-library-title"><div class="section-heading"><div><span class="eyebrow">THE READING INDEX</span><h2 id="${ctx.root}-library-title">${all ? "Find your next perspective." : "Inside this collection."}</h2></div><p>Explore a subject. Follow a question.<br>Make a connection of your own.</p></div>${all ? '<div class="filter-top enhanced-only" role="group" aria-label="Filter by semester"><button type="button" data-filter-semester="all" aria-pressed="true">All readings</button><button type="button" data-filter-semester="1" aria-pressed="false">First semester</button><button type="button" data-filter-semester="2" aria-pressed="false">Second semester</button></div>' : ""}<div class="filters enhanced-only"><label><span class="field-label">Search the collection</span><span class="search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input type="search" data-search placeholder="Title, author or topic…" aria-label="Search title, author or topic"></span></label><label><span class="field-label">Theme</span><select data-theme><option value="all">All themes</option>${[...new Set(items.map((r) => r.theme))].map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join("")}</select></label></div><div class="list-info"><span data-result-count aria-live="polite">${items.length} readings in view</span><span>TEXTS & PERSPECTIVES</span></div>${ctx.embed ? '<p class="collection-note">Open a reading using the Google Sites page menu and its Book label.</p>' : ""}<div class="reading-list">${rows(ctx, items)}</div><p class="empty-state" data-empty hidden>No readings match these filters. Try a different title or theme.</p></section>`;
}
