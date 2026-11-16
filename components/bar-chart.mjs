import { esc } from "./markup.mjs";

export function bars(rows, max, unit = "") {
  return `<div class="bars">${rows
    .map(
      ([label, value]) => `<div class="bar-row">
    <div class="bar-label"><span>${esc(label)}</span><strong>${value}${esc(unit)}</strong></div>
    <div class="bar-track"><span style="width:${(value / max) * 100}%"></span></div>
  </div>`,
    )
    .join("")}</div>`;
}

export const chartNote = (text) => `<p class="caption">${esc(text)}</p>`;
