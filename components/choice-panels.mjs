import { esc, pad } from "./markup.mjs";

export function choices(id, tabs, intro = "") {
  const buttons = tabs
    .map(
      ([title], i) =>
        `<button type="button" data-choice="${i}" aria-pressed="${i === 0}">${esc(title)}</button>`,
    )
    .join("");
  const panels = tabs
    .map(
      ([title, body], i) => `<article class="lab-panel" data-panel="${i}">
    <span class="eyebrow">Perspective ${pad(i + 1)}</span><h3>${esc(title)}</h3>${body}
  </article>`,
    )
    .join("");

  return `${intro}<div class="explorer" data-explorer="${esc(id)}">
    <div class="choice-strip enhanced-only" role="group" aria-label="Explore ${esc(id)}">${buttons}</div>
    <div class="panels">${panels}</div>
    <p class="sr-only" data-explorer-status aria-live="polite"></p>
  </div>`;
}
