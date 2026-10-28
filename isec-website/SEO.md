# Ingeniare SEO

`npm run build` creates the Vite client bundle, then prerenders every public URL in `public/sitemap.xml`, plus the noindex confirmation and 404 pages. `postbuild` also runs SEO validation; a failure stops the release. Deploy the full `dist` directory. Calling `vite build` directly skips the postbuild SEO step.

Each generated page contains its visible React content, route-specific title, description, canonical URL, social metadata, and JSON-LD before JavaScript runs. Imported images resolve to hashed production files. The client continues to render the existing interactive application; effects and analytics are not run during prerendering. No browser or network fetch is needed for the prerender step.

The generated Netlify `_redirects` preserves the existing domain redirect and replaces the generic SPA fallback with `/404.html` and HTTP 404. All current routes have generated HTML, so Netlify's static-file shadowing serves them normally. Add future public pages to both the sitemap and `src/entry-seo.jsx`; the build fails if they disagree. If you introduce a private or dynamic route, explicitly provide its hosting rule before deploying.

Ingeniare's existing contact and address details supply the ProfessionalService schema. The generic LinkedIn homepage was removed from `sameAs`; add the actual business profile only when confirmed. Organization and WebSite identifiers are shared across pages. Crack Mapping adds SoftwareApplication and BreadcrumbList data without claiming ratings, test results, or an independent security certification. App schema does not guarantee a rich search result.

Validation: `npm run validate:seo` checks built output for unique titles, exactly one canonical and H1, descriptions, indexing policies, parseable JSON-LD, organization data, local image paths, Crack Mapping schemas, sitemap discovery, and the 404 rule. Thank-you and 404 pages are excluded from the sitemap and set to noindex.

After deployment:

1. Confirm the production domain is `https://www.ingeniare-sec.com` and the existing phone, email, and Muntinlupa address are current.
2. Check direct page requests and view source, including `/resources/crack-mapping`; confirm unknown URLs return HTTP 404 on Netlify.
3. Verify domain ownership in Google Search Console and submit `https://www.ingeniare-sec.com/sitemap.xml`. Request indexing for the Resources and Crack Mapping pages.
4. Test representative URLs using Google's Rich Results Test and URL Inspection. Validate real social previews after publishing.
5. Review Core Web Vitals using production traffic. The GIF and APK are large; consider dedicated release hosting for the APK as documented in `CRACK-MAPPING.md`.

No Search Console submission, production deployment, ranking measurement, or browser visual QA was performed as part of these local changes. Search visibility and ranking depend on indexing and other factors beyond metadata.

Reference: [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
