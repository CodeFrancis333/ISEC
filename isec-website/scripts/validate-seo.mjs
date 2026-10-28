import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const site = "https://www.ingeniare-sec.com";
const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const titles = new Set();
for (const route of [...routes, "/thank-you", "/404"]) {
  const html = await readFile(route === "/404" ? path.join(dist, "404.html") : path.join(dist, route.slice(1), "index.html"), "utf8");
  assert.equal([...html.matchAll(/<title\b/g)].length, 1, `${route}: one title`);
  const title = html.match(/<title\b[^>]*>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${route}: unique title`);
  titles.add(title);
  const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
  assert.equal(canonicals.length, 1, `${route}: one canonical`);
  assert.equal(canonicals[0][1], `${site}${route}`);
  assert.equal([...html.matchAll(/<meta\b[^>]*name="description"/g)].length, 1, `${route}: one description`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: one rendered H1`);
  assert.ok(!html.includes("/src/assets/"), `${route}: production asset URLs`);
  assert.ok(!html.includes("opacity:0;"), `${route}: visible prerendered content`);
  assert.ok(html.includes('name="robots" content="' + (["/404", "/thank-you"].includes(route) ? "noindex" : "index")), `${route}: indexing policy`);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@id"] === `${site}/#organization`), `${route}: organization schema`);
  for (const image of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
    if (image[1].startsWith("/") && !image[1].startsWith("//")) await access(path.join(dist, decodeURI(image[1].split("?")[0])));
  }
  const socialImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(socialImage, `${route}: sharing image`);
  if (socialImage.startsWith(site)) await access(path.join(dist, new URL(socialImage).pathname));
  if (route === "/resources/crack-mapping") {
    assert.ok(schemas.some((schema) => schema["@type"] === "SoftwareApplication"));
    assert.ok(schemas.some((schema) => schema["@type"] === "BreadcrumbList"));
    assert.ok(html.includes("Crack Mapping") && html.includes("Android"));
  }
}
assert.ok((await readFile(path.join(dist, "_redirects"), "utf8")).includes("/* /404.html 404"));
assert.ok((await readFile(path.join(dist, "robots.txt"), "utf8")).includes(`${site}/sitemap.xml`));
console.log(`SEO checks passed for ${routes.length} public routes and two non-indexable pages.`);
