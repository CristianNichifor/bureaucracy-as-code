#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const SKIP_DIRS = new Set([
  ".git",
  ".pnpm-store",
  "coverage",
  "dist",
  "node_modules",
]);

const SKIP_FILES = new Set([
  "pnpm-lock.yaml",
]);

const SCANNED_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

const PATTERNS = [
  {
    name: "romanian-cnp",
    pattern: /\b[1-9]\d{12}\b/g,
  },
  {
    name: "email-address",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    name: "romanian-mobile-phone",
    pattern: /\b(?:\+40|0040|0)\s?7\d(?:[\s.-]?\d{3}){2}\b/g,
  },
  {
    name: "romanian-id-series",
    pattern: /\b(?:AX|BX|CD|CJ|CT|GL|IF|MM|MS|PH|SB|TM|VN|XR|XZ)\s?\d{6}\b/g,
  },
  {
    name: "address-like-text",
    pattern: /\b(?:strada|str\.|calea|bulevardul|bd\.)\s+[A-ZĂÂÎȘȚ][\p{L}\d .'-]{2,}/giu,
  },
];

function shouldScan(filePath) {
  if (SKIP_FILES.has(path.basename(filePath))) {
    return false;
  }

  return SCANNED_EXTENSIONS.has(path.extname(filePath));
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        files.push(...await listFiles(fullPath));
      }
      continue;
    }

    if (entry.isFile() && shouldScan(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineAndColumn(text, offset) {
  const prefix = text.slice(0, offset);
  const lines = prefix.split("\n");
  return {
    line: lines.length,
    column: lines.at(-1).length + 1,
  };
}

function preview(value) {
  return value.replace(/\s+/g, " ").slice(0, 80);
}

const findings = [];

for (const file of await listFiles(ROOT)) {
  const text = await readFile(file, "utf8");
  const relative = path.relative(ROOT, file);

  for (const { name, pattern } of PATTERNS) {
    pattern.lastIndex = 0;

    for (const match of text.matchAll(pattern)) {
      const { line, column } = lineAndColumn(text, match.index ?? 0);
      findings.push({
        file: relative,
        line,
        column,
        name,
        match: preview(match[0]),
      });
    }
  }
}

if (findings.length > 0) {
  console.error("Potential PII found in repo-authored demo content:");
  for (const finding of findings) {
    console.error(
      `- ${finding.file}:${finding.line}:${finding.column} ${finding.name}: ${finding.match}`,
    );
  }
  process.exit(1);
}

console.log("No obvious PII patterns found in repo-authored demo content.");
