import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const site = "https://www.ingeniare-sec.com";
const sitemap = await readFile(path.join(root, "public/sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const shellPath = path.join(dist, ".vite/seo-shell.html");
let template;
try { template = await readFile(shellPath, "utf8"); }
catch (error) {
  if (error.code !== "ENOENT") throw error;
  template = await readFile(path.join(dist, "index.html"), "utf8");
  if (!template.includes('<div id="root"></div>')) throw new Error("Run a clean Vite build before prerendering.");
  await writeFile(shellPath, template);
}
const manifest = JSON.parse(await readFile(path.join(dist, ".vite/manifest.json"), "utf8"));
const server = await createServer({ root, configLoader: "runner", server: { middlewareMode: true }, appType: "custom" });
try {
  const { render } = await server.ssrLoadModule("/src/entry-seo.jsx");
  for (const route of [...routes, "/thank-you", "/404"]) {
    const { head, body: sourceBody } = await render(route);
    const toolEntry = {
      "/resources/steel-deck-design": "src/features/deck/SteelDeckPage.jsx",
      "/resources/nscp-2015-wind-map": "src/features/wind/WindMapPage.tsx",
    }[route];
    const styles = (manifest[toolEntry]?.css || []).map((file) => `<link rel="stylesheet" href="/${file}">`).join("\n");
    let body = sourceBody;
    for (const [source, asset] of Object.entries(manifest)) {
      if (source.startsWith("src/assets/")) body = body.replaceAll(`/${source}`, `/${asset.file}`);
    }
    if (body.includes("/src/assets/")) throw new Error(`Unresolved production asset on ${route}`);
    // Remove the generic shell metadata before installing the route's Helmet tags.
    let html = template.replace(/<title>[\s\S]*?<\/title>/gi, "")
      .replace(/<meta\b(?=[^>]*(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)")[^>]*>/gi, "")
      .replace(/<link\b(?=[^>]*rel="canonical")[^>]*>/gi, "")
      .replace("</head>", `${head}\n${styles}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    if (!html.includes(`<link data-react-helmet="true" rel="canonical" href="${site}${route}"`)) {
      throw new Error(`Canonical missing or incorrect: ${route}`);
    }
    const output = route === "/404" ? path.join(dist, "404.html") : path.join(dist, route.slice(1), "index.html");
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html);
  }
  // Unknown URLs must return a real 404, rather than a homepage with status 200.
  const redirects = (await readFile(path.join(root, "public/_redirects"), "utf8"))
    .replace(/^\/\*\s+\/index\.html\s+200\s*$/m, "/* /404.html 404");
  await writeFile(path.join(dist, "_redirects"), redirects);
  console.log(`Prerendered ${routes.length} public routes, confirmation, and 404 pages.`);
} finally {
  await server.close();
}
