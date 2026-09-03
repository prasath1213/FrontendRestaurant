// check-imports.js
// Run this INSIDE your frontend project folder (same level as src/):
//   node check-imports.js
//
// It reads src/App.jsx, resolves every relative import against the
// filesystem, and prints which ones are missing (wrong name, wrong
// case, wrong folder, or file not created yet).

const fs = require("fs");
const path = require("path");

const appPath = path.join(process.cwd(), "src", "App.jsx");

if (!fs.existsSync(appPath)) {
  console.error("Could not find src/App.jsx from this folder. Run this script from your frontend project root (the folder that contains src/).");
  process.exit(1);
}

const content = fs.readFileSync(appPath, "utf8");

// Match: import X from "./something"; (also handles named imports)
const importRegex = /import\s+(?:[\w{},\s*]+)\s+from\s+["']([^"']+)["']/g;

const extensions = [".jsx", ".js", ".tsx", ".ts"];

let match;
let missing = [];
let checked = 0;

while ((match = importRegex.exec(content)) !== null) {
  const importPath = match[1];

  // Only check relative imports (skip node_modules packages like react-router-dom)
  if (!importPath.startsWith(".")) continue;

  checked++;
  const basePath = path.join(process.cwd(), "src", importPath);

  const exists =
    fs.existsSync(basePath) ||
    extensions.some((ext) => fs.existsSync(basePath + ext)) ||
    extensions.some((ext) => fs.existsSync(path.join(basePath, "index" + ext)));

  if (!exists) {
    missing.push(importPath);
  }
}

console.log(`Checked ${checked} relative imports in src/App.jsx\n`);

if (missing.length === 0) {
  console.log("✅ All relative imports resolve to real files.");
  console.log("The problem might be inside one of those files instead (e.g. one of them fails to import something). Paste the full terminal error for the next step.");
} else {
  console.log("❌ Missing / unresolved imports:\n");
  missing.forEach((m) => console.log("  -", m));
  console.log("\nFix: create the missing file(s) above, or correct the path/casing in App.jsx.");
}
