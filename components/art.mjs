import { esc } from "./markup.mjs";
const line = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
export function artwork(kind, label = "An illustrative reading motif") {
  let shape = "";
  switch (kind) {
    case "court":
      shape =
        '<rect x="75" y="56" width="270" height="250" rx="2"/><path d="M75 181h270M210 56v250"/><circle cx="210" cy="181" r="54"/><path d="M75 108h55v146H75M345 108h-55v146h55"/><circle cx="257" cy="210" r="28" fill="var(--paper)"/><path d="M231 202q28 0 37 33M250 183q-3 30 33 37"/>';
      break;
    case "balance":
      shape =
        '<path d="M210 71v225M135 296h150M102 112h216M135 112l-48 99h96zM285 112l-48 99h96z"/><circle cx="210" cy="100" r="16" fill="var(--accent)"/><path d="M87 211q48 65 96 0M237 211q48 65 96 0"/>';
      break;
    case "field":
      shape =
        '<rect x="70" y="76" width="280" height="212"/>' +
        Array.from({ length: 7 }, (_, i) =>
          line(105 + i * 35, 76, 105 + i * 35, 288),
        ).join("") +
        '<path d="M115 235c65-150 110 20 186-95" stroke-dasharray="6 8"/><path d="M280 135l21 5-7 20"/><circle cx="115" cy="235" r="13" fill="var(--paper)"/>';
      break;
    case "screen":
      shape =
        '<rect x="135" y="48" width="150" height="265" rx="18"/><path d="M178 69h65M187 291h45"/><path d="M156 150h26l13-31 28 68 18-37h23"/><path d="M96 110q-45 70 0 140M324 110q45 70 0 140" stroke-dasharray="4 8"/>';
      break;
    case "sound":
      shape =
        Array.from({ length: 19 }, (_, i) => {
          const h = 35 + Math.abs(Math.sin(i * 0.64)) * 155;
          return line(57 + i * 17, 180 - h / 2, 57 + i * 17, 180 + h / 2);
        }).join("") +
        '<circle cx="210" cy="180" r="112" stroke-opacity=".35"/><path d="M54 292h312"/>';
      break;
    case "policy":
      shape =
        '<rect x="112" y="57" width="196" height="247"/><path d="M151 105h118M151 131h90M151 157h111M151 183h58"/><path d="M220 207l48-19 48 19v42q-7 42-48 59-41-17-48-59z" fill="var(--paper)"/><path d="M244 249l17 17 31-39"/>';
      break;
    case "fish":
      shape =
        '<path d="M80 180q120-136 232 0-112 136-232 0zM80 180l-42-57v114zM220 112l-15-37 62 48M200 246l-5 33 59-46"/><circle cx="275" cy="169" r="5" fill="currentColor"/><path d="M258 146q-27 32 0 65M95 291q20-15 40 0t40 0t40 0t40 0t40 0M95 67q20-15 40 0t40 0" stroke-opacity=".5"/>';
      break;
    case "map":
      shape =
        '<path d="M55 87l95-28 119 31 94-29v228l-94 28-119-30-95 28zM150 59v228M269 90v227"/><path d="M97 239q-8-118 94-70t122-27" stroke-dasharray="7 8"/><circle cx="97" cy="239" r="10" fill="var(--paper)"/><path d="M291 125q0-35 27-35t27 35q0 23-27 50-27-27-27-50z" fill="var(--paper)"/><circle cx="318" cy="119" r="8"/>';
      break;
    case "ledger":
      shape =
        '<rect x="92" y="53" width="240" height="257"/><path d="M127 53v257M92 104h240M92 155h240M92 206h240M92 257h240M253 104v206"/><path d="M157 81h140M149 132h63M149 181h75M149 232h55M277 129h29M277 180h18M277 230h23"/><circle cx="280" cy="279" r="45" fill="var(--paper)"/><path d="M280 256v46M292 262h-18q-14 12 6 18t7 17h-19"/>';
      break;
    case "street":
      shape =
        '<path d="M44 286L176 63M190 309L261 63M287 309L337 63"/><path d="M108 282l17-29m20-34 17-29m20-34 17-29m20-34 13-23" stroke-dasharray="5 5"/><circle cx="235" cy="223" r="24" fill="var(--paper)"/><circle cx="327" cy="223" r="24" fill="var(--paper)"/><path d="M235 223h91l-17-91h-31M306 151h-26"/>';
      break;
    case "journey":
      shape =
        '<path d="M66 96h124v76h126v111H96" stroke-dasharray="8 9"/><circle cx="66" cy="96" r="17" fill="var(--paper)"/><circle cx="190" cy="172" r="17" fill="var(--paper)"/><circle cx="316" cy="283" r="17" fill="var(--paper)"/><path d="M76 261h40v44H76zM240 61h85v105h-85zM253 80h59M253 100h59M253 120h59"/>';
      break;
    case "snow":
      shape =
        '<path d="M69 224q-8-174 141-164t108 170-185 34q-58-28-40-82t127-27" stroke-dasharray="6 10"/>' +
        [
          [75, 74],
          [337, 67],
          [217, 291],
          [336, 310],
          [44, 285],
          [269, 188],
        ]
          .map(
            ([x, y]) =>
              `<path d="M${x - 10} ${y}h20M${x} ${y - 10}v20M${x - 7} ${y - 7}l14 14M${x - 7} ${y + 7}l14-14"/>`,
          )
          .join("") +
        '<path d="M152 177l58-46 58 46v82H152zM194 259v-49h32v49"/>';
      break;
    case "home":
      shape =
        '<circle cx="210" cy="180" r="132" stroke-dasharray="2 9"/><path d="M98 173l112-92 112 92M124 152v131h172V152M187 283v-82h47v82M145 180h21v30h-21M255 180h21v30h-21"/><path d="M140 69q70-36 140 0M159 312q51 17 102 0"/>';
      break;
    case "table":
      shape =
        '<ellipse cx="210" cy="192" rx="150" ry="104"/><circle cx="210" cy="192" r="67"/><circle cx="210" cy="192" r="51"/><path d="M137 132v123M126 132v35q11 18 22 0v-35M283 132v123M283 132q29 30 0 49"/><path d="M182 170q28-26 56 0M180 191q30-26 60 0M188 211q22-22 44 0"/>';
      break;
    case "tet":
      shape =
        '<path d="M85 307q-16-153 79-252M109 172q86 17 174-65M101 217q88 31 194-9"/><path d="M257 124v60M294 217v62"/><rect x="236" y="153" width="42" height="58" fill="var(--paper)"/><rect x="274" y="264" width="42" height="58" fill="var(--paper)"/><path d="M245 164l12 15 12-15M283 275l12 15 12-15"/>' +
        [
          [123, 101],
          [156, 137],
          [195, 143],
          [235, 230],
          [133, 236],
          [296, 103],
        ]
          .map(
            ([x, y]) =>
              `<g transform="translate(${x} ${y})">${Array.from({ length: 5 }, (_, i) => `<ellipse cy="-9" rx="5" ry="9" transform="rotate(${i * 72})" fill="var(--paper)"/>`).join("")}<circle r="3" fill="currentColor"/></g>`,
          )
          .join("");
      break;
    default:
      shape =
        '<path d="M68 99q73-23 142 12 69-35 142-12v194q-78-25-142 10-65-35-142-10zM210 111v192"/><path d="M86 127q56-16 106 9M86 152q56-16 106 9M86 177q56-16 106 9M229 136q56-25 105-9M229 161q56-25 105-9M229 186q56-25 105-9"/><path d="M242 59q29-34 64-12-21 31-64 12M254 47l-25 39"/>';
  }
  return `<svg class="motif" viewBox="0 0 420 360" role="img" aria-label="${esc(label)}"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${shape}</g></svg>`;
}
export function coverArt() {
  return `<div class="cover-art"><div class="cover-orbit" aria-hidden="true"></div><div class="book-object"><div class="book-spine" aria-hidden="true"></div><div class="book-face"><div class="book-kicker">NOTES ON READING<br>& THE WORLD AROUND US</div><div class="book-title">A world<br>between<br><em>the lines.</em></div>${artwork("book", "Original line illustration of an open book and a leaf")}<div class="book-footer">A READING COLLECTION <span>VOL. 01</span></div></div></div><span class="art-caption">FIFTEEN TEXTS. MANY WAYS TO SEE.</span></div>`;
}
