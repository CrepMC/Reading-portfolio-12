import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const prefix = process.env.RP_PREVIEW_PREFIX || "";
if (prefix && !/^\/[\w.-]+$/.test(prefix))
  throw new Error("RP_PREVIEW_PREFIX must be a single path segment.");
const server = http.createServer((req, res) => {
  let requested;
  try {
    requested = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  if (requested === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (prefix && !requested.startsWith(`${prefix}/`)) {
    res.writeHead(404);
    res.end();
    return;
  }
  requested = requested.slice(prefix.length);
  if (requested === "/") requested = "/index.html";
  const file = path.resolve(root, "." + requested);
  const permitted =
    requested === "/index.html" ||
    (/^\/(Home|First semester|Second semester)\//.test(requested) &&
      /\/(index\.html|embed\.txt)$/.test(requested));
  if (!permitted || !file.startsWith(root + path.sep) || !fs.existsSync(file)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
    return;
  }
  res.writeHead(200, {
    "Content-Type": file.endsWith(".html")
      ? "text/html; charset=utf-8"
      : "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(file).pipe(res);
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Reading Portfolio: http://127.0.0.1:${port}${prefix}/`),
);
