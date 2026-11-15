#!/usr/bin/env node
// Content-safety guard for the redesign.
// Extracts every piece of human-readable text (JSX text + string literals that are not styling)
// from app/, components/ and lib/, so a restyle can be proven not to have changed content.
//
//   node scripts/content-snapshot.mjs --write   # record baseline (.content-snapshot.json)
//   node scripts/content-snapshot.mjs --diff    # compare the working tree against the baseline
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const DIRS = ["app", "components", "lib"];
const OUT = path.join(ROOT, ".content-snapshot.json");
const STYLE_ATTRS = new Set(["className", "class", "style", "strokeWidth", "viewBox", "d", "fill", "stroke", "href", "src", "type", "dir", "key", "id", "name", "rel", "target"]);
const STYLE_CALLS = new Set(["cn", "clsx", "cva", "twMerge"]);
// A token that looks like a Tailwind/CSS class or other identifier, not prose.
const CLASSY = /^[!-]?[a-z0-9@][\w:/.\[\]()%#,'&*>~+=-]*$/i;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

function isStyling(node) {
  for (let n = node.parent; n; n = n.parent) {
    if (ts.isJsxAttribute(n) && STYLE_ATTRS.has(n.name.getText())) return true;
    if (ts.isCallExpression(n) && STYLE_CALLS.has(n.expression.getText())) return true;
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return true;
  }
  return false;
}

function isProse(text) {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return false;
  if (/[\u0590-\u05FF]/.test(t)) return true; // Hebrew is always content
  const tokens = t.split(" ");
  // Pure class lists / identifiers / paths are styling or code, not content.
  if (tokens.every((x) => CLASSY.test(x)) && (tokens.length === 1 || tokens.some((x) => /[-:\[/]/.test(x)))) return false;
  return /[A-Za-z]{2,}/.test(t) || /\p{Extended_Pictographic}/u.test(t);
}

function extract(file) {
  const src = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out = [];
  const add = (node, text) => {
    const t = text.replace(/\s+/g, " ").trim();
    if (isProse(t) && !isStyling(node)) out.push(t);
  };
  const visit = (node) => {
    if (ts.isJsxText(node)) add(node, node.text);
    else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node, node.text);
    else if (ts.isTemplateExpression(node)) {
      add(node, node.head.text);
      node.templateSpans.forEach((s) => add(node, s.literal.text));
    }
    ts.forEachChild(node, visit);
  };
  visit(src);
  return out;
}

function snapshot() {
  const snap = {};
  for (const d of DIRS) for (const f of walk(path.join(ROOT, d))) {
    const strings = extract(f);
    if (strings.length) snap[path.relative(ROOT, f)] = strings;
  }
  return snap;
}

const counts = (arr) => arr.reduce((m, s) => m.set(s, (m.get(s) || 0) + 1), new Map());

const mode = process.argv[2];
if (mode === "--write") {
  const snap = snapshot();
  fs.writeFileSync(OUT, JSON.stringify(snap, null, 1));
  const n = Object.values(snap).reduce((a, b) => a + b.length, 0);
  console.log(`Baseline written: ${Object.keys(snap).length} files, ${n} strings`);
} else if (mode === "--diff") {
  const base = JSON.parse(fs.readFileSync(OUT, "utf8"));
  const now = snapshot();
  // Text may legitimately move between files (shared components), so compare per file AND globally.
  const allBase = counts(Object.values(base).flat());
  const allNow = counts(Object.values(now).flat());
  let lost = 0;
  for (const file of new Set([...Object.keys(base), ...Object.keys(now)])) {
    const b = counts(base[file] || []), n = counts(now[file] || []);
    const removed = [], added = [];
    for (const [s, c] of b) if ((n.get(s) || 0) < c) removed.push(s);
    for (const [s, c] of n) if ((b.get(s) || 0) < c) added.push(s);
    if (!removed.length && !added.length) continue;
    console.log(`\n${file}`);
    for (const s of removed) {
      const gone = (allNow.get(s) || 0) < (allBase.get(s) || 0);
      if (gone) lost++;
      console.log(`  ${gone ? "- LOST " : "- moved"} ${s.slice(0, 160)}`);
    }
    for (const s of added) console.log(`  + ${s.slice(0, 160)}`);
  }
  console.log(lost ? `\n${lost} string(s) no longer exist anywhere — review each one.` : "\nNo content lost.");
  process.exit(lost ? 1 : 0);
} else {
  console.log("usage: content-snapshot.mjs --write | --diff");
  process.exit(2);
}
