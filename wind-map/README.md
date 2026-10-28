# Public Philippine Wind Map

## Current scope

This is a frontend-only feature of `isec-website`, served at
`/resources/nscp-2015-wind-map`. No backend, database, admin account, or separate
hosting is required. This supersedes the earlier Fastify/PostGIS proposal.
Search currently covers a small bundled set of approximate city-centre shortcuts,
not arbitrary addresses. The pin and coordinate fields select the actual site.

The NSCP engineering dataset is **not ready**. The deployed catalog is deliberately
empty. The tool displays no numerical design wind speeds until a reviewed release
is published. No scans, draft contours, or synthetic test datasets are public assets.

## Run and verify

Use Node.js 22.12 or newer in `isec-website`:

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run typecheck:wind
npm.cmd run test:wind
npm.cmd run lint:wind
npm.cmd run validate:wind
npm.cmd run build
```

Deploy the resulting `isec-website/dist` using the existing static-host setup.
Keep the existing SPA rewrite so direct resource URLs serve `index.html`.
`VITE_WIND_MAP_STYLE_URL` optionally overrides the default OpenFreeMap style.
Only public browser-safe provider tokens may be used here; frontend environment
variables are visible to visitors. OpenFreeMap supplies ordinary geographic data,
not NSCP wind data. Retain provider attribution.

## Source inspection

The three supplied PNG files are 1654 x 2340 scan images, without usable printed
coordinate graticules. They contain page perspective, binding shadows, text and
coastline/contour intersections. They must not be used as geographic overlays by
assigning arbitrary corner bounds.

Figure captions take precedence over filenames and the description text:

| Group | Figure | Printed page | Approximate MRI |
|---|---|---|---|
| I | 207A.5-1C | 2-40 | 1,700 years |
| II | 207A.5-1B | 2-39 | 700 years |
| III, IV, V | 207A.5-1A | 2-38 | 300 years |

The supplied notes describe nominal 3-second gust speeds in km/h at 10 m for
Exposure C, permit linear interpolation, and require additional consideration of
special wind regions and terrain. The text description gives conflicting page
references and incomplete/unverified contour ranges; do not generate the legend
from those lists. Derive it from reviewed contour features.

## Offline GIS work still required

1. Keep originals, GCP files, drafts and checkpoint evidence in the ignored
   `wind-map/private/` directory. Preserve hashes and source provenance.
2. Confirm source-use and derivative-publication rights.
3. In QGIS, georeference each scan independently against an authorized reliable
   coastline reference. Record pixel and geographic GCP coordinates, confidence,
   transformation/projection, residuals, and held-out checkpoint errors. Inspect
   scan warping; do not choose a high-order fit solely to reduce training error.
4. Trace each actual isoline and its label. Keep uncertain segments separate.
   Do not silently bridge missing lines, infer longitude strips, or treat an
   isoline as a constant-speed polygon. Review island and coastal behavior.
5. Define reviewed coverage polygons, including holes and disjoint islands.
   Coverage is not the broad rectangular map extent. Special/coastal rules need
   explicit review; the browser never extrapolates outside coverage.
6. If interpolation is used, construct and independently validate interpolation
   cells. The software supports barycentric linear interpolation on geographic
   triangles, but this is **not automatically an NSCP-approved interpretation**.
   The responsible reviewer must validate the model, vertices, continuity,
   projection assumptions, coverage and reference-point errors. Leave `zones`
   empty if a defensible interpolation model has not been established.
7. Review topology, contour intersections, duplicate lines, coverage gaps,
   overlapping cells, source labels and category assignments in GIS. The supplied
   structural validator is not a full GIS topology or engineering approval tool.
8. Obtain independent engineering sign-off and retain the signed checkpoint
   report outside the public bundle unless its publication is authorized.

No automatic extraction or georeferencing software is delivered in this scope.
These steps remain pending; the scans alone have not established control points.

## Release format and publication

Reviewed contour-only releases are supported: `coverage` may be `null` or omitted
and `zones` may be omitted. Their colored isolines and category-specific legend
are displayed, while point velocities and reports remain unavailable. Once
coverage and interpolation have been validated, they can be added in a new release.
See `GIS-DATA-REQUEST.md` for a handoff specification for the data provider.

The executable schema is `isec-website/src/features/wind/dataset.ts`.
Each release contains version, edition, group, figure, `status: approved`, review
identity/time/rights/methodology/checkpoint reference/uncertainty, coverage geometry,
a contour FeatureCollection and a reviewed-interpolation-cell FeatureCollection.
Coordinates use WGS84 longitude, latitude. Only exact approved contour hits and
covered reviewed cells can return values. Conflicting boundary values require review.
All numerical precision is retained until display; m/s = km/h / 3.6.

After approval, put a versioned JSON release in `isec-website/public/wind-data/`.
Compute its SHA-256 and add one entry for its group to `catalog.json`:

```json
{
  "schemaVersion": 1,
  "datasets": [
    {
      "group": "II",
      "version": "YOUR_REVIEWED_VERSION",
      "url": "/wind-data/YOUR_REVIEWED_VERSION.json",
      "sha256": "SHA256_OF_EXACT_FILE_BYTES"
    }
  ]
}
```

This is documentation, not a usable release; no engineering values are provided.
Run `npm.cmd run validate:wind`, unit tests and the build. Review the complete diff
and approval evidence before committing and deploying. Publication is a Git change,
not a visitor action. Remove the catalog entry to withdraw a release; restoring an
older reviewed catalog and file rolls it back. Preserve old files for traceability.
The browser checks metadata and SHA-256 before using a release. Hashes provide
integrity against accidental mismatches, not a cryptographic engineering signature.

## Reports and limitations

The report code is loaded on demand and refuses unavailable or mismatched results.
It produces A4 tables using the standard PDF Times font, not an embedded licensed
Times New Roman font. Reports are disabled while the catalog is empty. An approved
release and report-specific visual validation are needed before enabling reports
for engineering use. A basemap image, project-information form and satellite view
are not included. Never remove the unavailable state to make a preview seem complete.

Implemented: static public interface, city shortcuts, coordinates, category mapping,
MapLibre map/pin, layer controls, typed lookup states, reviewed release schema and
hash checks, software interpolation engine, report generator and software tests.
Pending: real digitization, independent GIS/engineering validation, approved data,
live report validation and source/derivative publication authorization.
