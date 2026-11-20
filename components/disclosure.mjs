import { esc } from "./markup.mjs";

export const p = (text) => `<p>${esc(text)}</p>`;

export function details(label, text) {
  return `<details class="evidence-note"><summary>${esc(label)}</summary>${p(text)}</details>`;
}

// Inlined by the page builder so standalone HTML and embeds use the same behavior.
export function enhanceDisclosures(root) {
  if (!root || root.dataset.disclosuresInitialized === "true") return;
  if (typeof root.animate !== "function" || !window.matchMedia) return;
  root.dataset.disclosuresInitialized = "true";

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const active = new Set();
  motion.addEventListener("change", () => {
    if (motion.matches) [...active].forEach((finish) => finish());
  });

  root.querySelectorAll("details").forEach((element) => {
    const summary = element.querySelector(":scope > summary");
    if (!summary) return;

    const content = document.createElement("div");
    content.className = "disclosure-content";
    const nodes = [...element.childNodes].filter((node) => node !== summary);
    content.append(...nodes);
    element.append(content);

    let animation = null;
    let expanded = element.open;
    let targetHeight = 0;

    function syncState(open) {
      expanded = open;
      element.dataset.disclosureExpanded = String(open);
      summary.setAttribute("aria-expanded", String(open));
      content.inert = !open;
      content.setAttribute("aria-hidden", String(!open));
    }

    function finish() {
      const previous = animation;
      animation = null;
      element.open = expanded;
      element.style.removeProperty("height");
      delete element.dataset.disclosureAnimating;
      active.delete(finish);
      previous?.cancel();
      syncState(expanded);
    }

    function heightFor(open) {
      const frame = getComputedStyle(element);
      const label = getComputedStyle(summary);
      const spacing =
        parseFloat(frame.paddingTop) + parseFloat(frame.paddingBottom) +
        parseFloat(frame.borderTopWidth) + parseFloat(frame.borderBottomWidth) +
        parseFloat(label.marginTop) + parseFloat(label.marginBottom);
      return summary.getBoundingClientRect().height + spacing +
        (open ? content.getBoundingClientRect().height : 0);
    }

    function animateTo(open) {
      // Start reversals at the current visible height, even during a fast double click.
      const startHeight = element.getBoundingClientRect().height;
      animation?.cancel();
      animation = null;
      if (!open && content.matches(":focus-within")) {
        summary.focus({ preventScroll: true });
      }
      syncState(open);
      element.open = true;
      targetHeight = heightFor(open);

      if (motion.matches || Math.abs(startHeight - targetHeight) < 1) {
        finish();
        return;
      }

      element.dataset.disclosureAnimating = "true";
      element.style.height = `${startHeight}px`;
      const current = element.animate(
        { height: [`${startHeight}px`, `${targetHeight}px`] },
        { duration: 280, easing: "cubic-bezier(0.2, 0, 0.2, 1)", fill: "both" },
      );
      animation = current;
      active.add(finish);
      current.onfinish = () => {
        if (animation === current) finish();
      };
    }

    syncState(element.open);
    element.classList.add("disclosure-enhanced");
    summary.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (event.target.closest("a, button, input, select, textarea, label")) return;
      event.preventDefault();
      animateTo(animation ? !expanded : !element.open);
    });

    // Keep native/programmatic changes and exclusive details groups consistent.
    element.addEventListener("toggle", () => {
      if (!animation) syncState(element.open);
      else if (!element.open) {
        expanded = false;
        finish();
      }
    });

    if (typeof ResizeObserver === "function") {
      new ResizeObserver(() => {
        if (!animation) return;
        if (!element.getClientRects().length) finish();
        else if (Math.abs(heightFor(expanded) - targetHeight) > 1) {
          animateTo(expanded);
        }
      }).observe(content);
    }
  });
}

export const disclosureStyles = `
__ROOT__ .disclosure-enhanced > summary {
  position: relative;
  padding-left: 18px;
  list-style: none;
}
__ROOT__ .disclosure-enhanced > summary::-webkit-details-marker {
  display: none;
}
__ROOT__ .disclosure-enhanced > summary::before {
  content: "";
  position: absolute;
  left: 1px;
  top: 50%;
  width: 6px;
  height: 6px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateY(-50%) rotate(-45deg);
  transition: transform 280ms cubic-bezier(0.2, 0, 0.2, 1);
}
__ROOT__ .disclosure-enhanced[data-disclosure-expanded="true"] > summary::before {
  transform: translateY(-50%) rotate(45deg);
}
__ROOT__ .disclosure-content {
  display: flow-root;
}
__ROOT__ .turning-point > .disclosure-content {
  padding: 0;
}
__ROOT__ .disclosure-enhanced:not([open]) > .disclosure-content {
  display: none;
}
__ROOT__ .disclosure-enhanced[data-disclosure-animating] {
  overflow: hidden;
}
@media (prefers-reduced-motion: reduce) {
  __ROOT__ .disclosure-enhanced > summary::before {
    transition: none;
  }
}
`;
