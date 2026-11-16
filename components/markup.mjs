const htmlEntities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function esc(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) => htmlEntities[character],
  );
}

export function pad(number) {
  return String(number).padStart(2, "0");
}
