# GIS contour data request

Please provide geographically referenced NSCP 2015 basic wind-speed **isolines**
for the Philippines as three separate category groups:

| Dataset | Occupancy categories | Source figure |
|---|---|---|
| Category I | I | 207A.5-1C |
| Category II | II | 207A.5-1B |
| Category III-IV-V | III, IV, V | 207A.5-1A |

Preferred delivery: GeoJSON FeatureCollections in WGS84 / EPSG:4326, using
`[longitude, latitude]` coordinate order. Each feature should be a LineString or
MultiLineString, with a unique ID and a **numeric** `velocity_kmh` attribute.
Also include the category group and source-figure mapping, either per feature or
as layer metadata. Do not mix units or categories within a layer.

If GeoJSON is unavailable, a GeoPackage or complete zipped shapefile set (including
the .prj, .shp, .shx and .dbf files) is suitable for offline conversion. State the
original coordinate reference system explicitly. A screenshot, PNG or pixel-space
tracing is not a georeferenced GIS dataset.

Please include:

- Source edition, figure and provenance; confirm this is NSCP design wind data.
- Digitization/georeferencing method, positional uncertainty and any ambiguous segments.
- Reviewer identity, review date, independent validation/checkpoint evidence and version.
- Terms permitting use and publication of the derived contour data on a public website.
- Full island/coastal coverage notes; identify missing areas instead of filling them by assumption.

Reviewed geographic coverage polygons and a validated interpolation model are
welcome but **not required to display contour lines and their color legend**.
Point-based wind velocities will remain unavailable until the lookup coverage and
interpretation are independently validated. Isolines must not be converted into
arbitrary uniform-speed zones.

Website behavior: category selection loads the corresponding layer, each line is
colored by its actual km/h value, and the legend lists only values in that layer.
The same numerical value retains its color across categories. Data integration and
release metadata packaging will be completed offline before publication through Git.
