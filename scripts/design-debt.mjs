#!/usr/bin/env node
// Counts leftovers of the old look per file, so the redesign's progress is measurable.
//   node scripts/design-debt.mjs          # table of files that still carry debt
import fs from "node:fs";
import path from "node:path";

const CHECKS = {
  hex: /(?:bg|text|border|from|via|to|ring|shadow)-\[#[0-9a-fA-F]{3,8}/g,
  ternary: /isLight\s*\?|isDarkMode\s*\?/g,
  blur: /backdrop-blur|blur-(?:2xl|3xl)|glass-card/g,
  glow: /glow|drop-shadow-\[|shadow-\[0_/g,
  gradient: /bg-gradient-to|bg-clip-text/g,
  black: /font-black|font-extrabold/g,
};
const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
};
const rows = [];
const total = Object.fromEntries(Object.keys(CHECKS).map((k) => [k, 0]));
for (const f of ["app", "components", "lib"].flatMap((d) => walk(d))) {
  const src = fs.readFileSync(f, "utf8");
  const row = { file: f };
  let sum = 0;
  for (const [k, re] of Object.entries(CHECKS)) {
    row[k] = (src.match(re) || []).length;
    total[k] += row[k];
    sum += row[k];
  }
  if (sum) rows.push({ ...row, sum });
}
rows.sort((a, b) => b.sum - a.sum);
console.table(rows);
console.log("TOTAL", total, "files with debt:", rows.length);
