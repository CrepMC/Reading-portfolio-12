import {details, p} from './disclosure.mjs';
import {esc} from './markup.mjs';

export function sort(id, heading, options, rows) {
  const categories = options.map((option, i) => `<option value="${i}">${esc(option)}</option>`).join('');
  const inputs = rows.map(([label, answer, why], i) => `<div class="sort-row">
    <label for="${id}-${i}">${esc(label)}</label>
    <select id="${id}-${i}" data-answer="${answer}" data-why="${esc(why)}"><option value="">Choose a category</option>${categories}</select>
    <p class="sort-feedback" aria-live="polite"></p>
  </div>`).join('');
  const reference = rows.map(([label, answer, why]) => `${label}: ${options[answer]}. ${why}`).join(' ');

  return `${p(heading)}<div data-sort="${id}">
    <div class="sort-list">${inputs}</div>
    <div class="action-row enhanced-only">
      <button type="button" class="solid" data-check-sort>Check the categories</button>
      <button type="button" data-reset-sort>Try again</button>
    </div>
    <p class="feedback" data-sort-status aria-live="polite"></p>
  </div>${details('Reference key & reasoning', reference)}`;
}
