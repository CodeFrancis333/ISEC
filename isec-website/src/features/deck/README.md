# Steel deck gravity worksheet

Route: `/resources/steel-deck-design`, linked from Resources. Runs locally in the existing React app; no server or new production dependency is required. The existing jsPDF dependency generates a downloadable A4 report directly from the current inputs and the same calculation function used on screen.

Users must select manufacturer and profile before calculating or exporting. The supported list currently contains Architecks Metal Systems Inc. / DN Steel Deck Four. Catalog properties are read-only and automatically selected by thickness and overall slab depth. Unsupported manufacturer/profile identifiers are rejected. Section changes clear optional entered construction resistances and inertia confirmation to prevent stale values from carrying into a different section.

The version 1.1 report starts with the check summary and a labeled typical transverse composite slab section on page one. Catalog properties and human-readable project inputs follow, then grouped formula/substitution/result cards, assumptions, references and review blanks. `crossSection.js` supplies the shared drawing geometry used by the website SVG and PDF vector rendering. It is schematic and does not invent manufacturer rib dimensions or reinforcement specifications.

## Engineering scope

This is a preliminary **comparison worksheet**, not a complete composite deck design or code-compliance certificate. It always retains the incomplete-design warning. It implements uniform gravity demand and instantaneous elastic deflection for a simply supported one-metre strip. Construction and final spans are separate inputs. Strength demand takes the maximum of 1.4D and 1.2D + 1.6L. Deflection denominators are project inputs, not implied code requirements.

Source: user-supplied `architecks-metal-systems-inc-pdf_compress.pdf`, page 6, DECK FOUR. Exact rows for t = 0.80/1.00/1.20 mm and overall slab depths = 100/125/150/180 mm only. Deck I values in mm4/mm are multiplied by 1000 for the one-metre strip. Composite Iave is already mm4/m. Concrete volume is taken from Vol, not A or overall slab depth. Composite comparisons provisionally use the oM and oV columns, rather than the different OM column. Supplier confirmation of resistance basis and concrete properties is mandatory.

The second supplied PDF is a one-page spreadsheet result summary for different profile geometry and lightweight concrete. It lacks sufficient formulas to reproduce all reported results and contains an inconsistent construction result label. It is a contextual reference, not an authoritative standard or numeric test oracle. Its personal details and license statement are not copied into this tool.

NSCP C101-15 (2015), Volume I, is the stated Philippine gravity basis for engineer confirmation. This implementation does not establish the currently adopted edition for a particular permit. SDI identifies ANSI/SDI SD-2022 as the consolidated successor of C-2017; the app does not claim that the newer US standard is automatically adopted in the Philippines.

Outstanding checks are listed in the interface and every exported report: bond/longitudinal shear, effective cold-formed section strength, construction point loads, ponding, actual bearing, connections, reinforcement, fire, vibration, long-term/staged deflection, seismic and diaphragm design. Blank construction resistances remain NOT CHECKED. Catalog comparisons marked Passed do not verify the supplier resistance basis.

## Verification

From `isec-website`, run `node --test src/features/deck/calculations.test.js` and `npm run build`. Tests independently reproduce the one-metre-strip gravity arithmetic, unit conversion, span scaling, combination envelope, boundary comparison, invalid-input rejection, all 12 catalog selections, and PDF content generation.

Report input/property units, formulas, substitutions, results, ratios, sources, limitations, version and review blanks are included. Comparisons use full precision; displayed numbers use up to four decimal places. No proprietary spreadsheet formulas or supplier capacity formulas are reverse-engineered.

The supplier does not identify the reference material for Iave. The default leaves its transformation basis unconfirmed and suppresses composite deflection results. A user must explicitly confirm steel or concrete basis; the calculator then pairs Iave with Es or Ec, respectively. Both bases and inverse-modulus scaling are regression tested.
