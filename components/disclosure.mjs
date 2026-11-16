import {esc} from './markup.mjs';

export const p = text => `<p>${esc(text)}</p>`;

export function details(label, text) {
  return `<details class="evidence-note"><summary>${esc(label)}</summary>${p(text)}</details>`;
}
