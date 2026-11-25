# Slide diagrams: style rules

Hand-drawn SVGs shown beside the bullets of a lesson slide (`imageUrl` in the lesson's `slides`).
They load as `<img>`, so no web fonts, no CSS from the site, and every `<defs>` lives in the file.

## Canvas
- `viewBox="0 0 600 480"`, background `#fafaf9` (a scene may use a flat sky `#eef6fc`).
- Flat shapes only: no gradients, shadows, glows, 3D, clip-art or emoji.
- One idea per diagram. Comparisons are panels with identical framing; processes are 2–4 steps.

## Color (each color always means the same thing)
| Use | Stroke / solid | Tint fill |
|---|---|---|
| Ink, main labels | `#1f2937` | |
| Secondary text | `#57534e` | |
| Hairlines, outlines | `#d6d3d1` / `#a8a29e` | |
| Heat, sun, magma | `#c2410c`, `#f59e0b` | `#fde7d1` |
| Water, cold, rain | `#2563eb` | `#dbeafe` |
| Wind, flow, motion | `#047857` | |
| Rock, soil | `#a8a29e` | `#e7dcc6` |
| High pressure H | `#1d4ed8` | |
| Low pressure L, danger | `#b91c1c` | |

## Type
- `font-family="Arial, Helvetica, sans-serif"` (Arial carries Hebrew on every OS the class uses).
- Labels 15 bold `#1f2937`; secondary 13 regular `#57534e`; panel titles 17 bold. Nothing under 13.
- About 8 labels at most. Use the slide's own words and numbers.
- Labels that cross shapes get a halo: `stroke="#fafaf9" stroke-width="4" paint-order="stroke"`.

## Lines
- Outlines 1.5, arrows 3 with the one arrowhead path `M0,0 L10,5 L0,10 z` (one marker per color).
- Return flows and secondary paths: 2, dashed `6 5`, `#57534e`.

## Hebrew and direction
- Root `<svg direction="rtl">`; prefer `text-anchor="middle"`. In RTL, `start` is the right edge.
- Never mix a number and Hebrew words with punctuation in one run. Put the number on its own line
  or in `<tspan direction="ltr">`. No parentheses next to numbers or Latin letters.
- Latin symbols (H, L, P, S, CO₂) are separate `<text direction="ltr">` elements.
- Steps and time read right → left (step 1 on the right, arrows point left).
- Maps and cross-sections of real places keep west on the left and north up.
- Graph x-axes run left → right, as in the textbooks and the existing climographs.
- Proportion bars fill from the right.

## Check before attaching
1. Open the SVG in the browser pane and run the overlap check (every `<text>` bounding box against
   every other and against the viewBox).
2. Look at it at ~480px wide (slide) and full size (lightbox), and read every label for direction.
3. Fact-check every number against a primary source.
