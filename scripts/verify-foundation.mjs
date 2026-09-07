import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const canonicalWorkflowSkills = [
  "pointapp-check-issues",
  "pointapp-create-issue",
  "pointapp-gates",
  "pointapp-invariants",
  "pointapp-review-issue",
  "pointapp-security",
  "pointapp-skill-maintainer",
  "pointapp-start-issue",
  "pointapp-work-issue",
];

export const sharedDesignSkills = [
  "awesome-design",
  "design-taste-frontend",
  "image-to-code",
  "playwright-cli",
  "web-design-guidelines",
];

const requiredFiles = [
  "AGENTS.md",
  "CHANGELOG.html",
  ".agents/pointapp-pipeline-policy.html",
  ".specify/memory/constitution.html",
  "docs/decisions/0001-separate-app-shell-and-builder-contract.html",
  "docs/decisions/0002-react-native-expo-foundation.html",
  "docs/decisions/0003-adaptive-viewport-layout.html",
  "specs/001-platform-parity/spec.html",
  "specs/002-production-shell-builder-contract/research.html",
  "specs/002-production-shell-builder-contract/spec.html",
  "specs/002-production-shell-builder-contract/plan.html",
  "specs/002-production-shell-builder-contract/tasks.html",
  "specs/002-production-shell-builder-contract/environment-matrix.html",
  "specs/002-production-shell-builder-contract/checklists/requirements.html",
];

async function read(root, relative) {
  return readFile(path.join(root, relative), "utf8");
}

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(target)));
    if (entry.isFile()) result.push(target);
  }
  return result;
}

function frontmatterName(text) {
  return text.match(/^---\n[\s\S]*?^name:\s*["']?([^\n"']+)/m)?.[1]?.trim();
}

export async function auditFoundation(rootUrl) {
  const root = fileURLToPath(rootUrl);
  const errors = [];

  for (const relative of requiredFiles) {
    try {
      await read(root, relative);
    } catch {
      errors.push(`missing required file: ${relative}`);
    }
  }

  const gitConfig = await read(root, ".git/config");
  if (!gitConfig.includes("github.com/PointCommunity/pointapp.git")) {
    errors.push("origin is not PointCommunity/pointapp");
  }

  const skills = [...canonicalWorkflowSkills, ...sharedDesignSkills];
  for (const name of skills) {
    const canonical = `.agents/skills/${name}/SKILL.md`;
    const adapter = `.claude/skills/${name}/SKILL.md`;
    try {
      const source = await read(root, canonical);
      if (frontmatterName(source) !== name) {
        errors.push(`skill frontmatter mismatch: ${name}`);
      }
    } catch {
      errors.push(`missing canonical skill: ${name}`);
    }
    try {
      const source = await read(root, adapter);
      if (!source.includes(`../../../.agents/skills/${name}/SKILL.md`)) {
        errors.push(`adapter does not target canonical skill: ${name}`);
      }
    } catch {
      errors.push(`missing skill adapter: ${name}`);
    }
  }

  const humanRoots = [".agents", ".specify", "docs", "product", "specs"];
  const htmlFiles = [path.join(root, "CHANGELOG.html")];
  for (const relative of humanRoots) {
    const files = await walk(path.join(root, relative));
    htmlFiles.push(...files.filter((file) => file.endsWith(".html")));
  }
  for (const file of htmlFiles) {
    const source = await readFile(file, "utf8");
    const relative = path.relative(root, file);
    if (!/^<!doctype html>/i.test(source.trimStart())) {
      errors.push(`human document lacks HTML doctype: ${relative}`);
    }
    if (!/<title>[^<]+<\/title>/i.test(source)) {
      errors.push(`human document lacks title: ${relative}`);
    }
    if (!/color-scheme\s*:\s*dark/i.test(source)) {
      errors.push(`human document is not explicitly dark mode: ${relative}`);
    }
  }

  const oldSpec = await read(root, "specs/001-platform-parity/spec.html");
  if (
    !oldSpec.includes("Superseded") ||
    !oldSpec.includes("../002-production-shell-builder-contract/spec.html")
  ) {
    errors.push("the original parity spec does not point to Specification 002");
  }

  const activeSpec = await read(
    root,
    "specs/002-production-shell-builder-contract/spec.html",
  );
  for (const phrase of [
    "PointCommunity/pointapp",
    "declarative data",
    "last-known-good",
    "Beta approved - Android",
    "Beta approved - Apple",
  ]) {
    if (!activeSpec.includes(phrase)) {
      errors.push(`active specification lacks required contract: ${phrase}`);
    }
  }

  const evidence = JSON.parse(
    await read(root, "product/research/subsplash-public-docs-index.json"),
  );
  if (evidence.stats?.articleCount !== 444 || evidence.stats?.collectionCount !== 15) {
    errors.push("Subsplash evidence index counts changed unexpectedly");
  }

  return {
    errors,
    htmlDocumentCount: new Set(htmlFiles).size,
    skillCount: skills.length,
  };
}

async function main() {
  const rootUrl = new URL("..", import.meta.url);
  const result = await auditFoundation(rootUrl);
  if (result.errors.length) {
    console.error(JSON.stringify(result, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log(
    `PointApp foundation PASS: ${result.skillCount} skills, ${result.htmlDocumentCount} dark HTML documents.`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
