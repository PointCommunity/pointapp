#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SUPPORT_HOME = "https://support.subsplash.com/en";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const productDir = resolve(scriptDir, "..");
const researchDir = resolve(productDir, "research");
const generatedAt = new Date().toISOString();

const relevanceByCollection = {
  Dashboard: "core",
  Apps: "core",
  Media: "core",
  Events: "core",
  "Groups & Messaging": "core",
  "End User & Donor Resources": "core",
  "Developer Resources": "core",
  Live: "adjacent",
  Giving: "adjacent",
  "Analytics & Reports": "adjacent",
  "Plugins & Integrations": "adjacent",
  "Church Management": "expansion",
  Websites: "expansion",
  "Subsplash Tap": "expansion",
  "Trends AI": "expansion",
};

function extractJsonObject(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find ${marker} in the support-center response.`);
  }

  const start = source.indexOf("{", markerIndex + marker.length);
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }

    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error(`Could not find the closing brace for ${marker}.`);
}

function flattenCollection(collection, parentPath = []) {
  const collectionPath = [...parentPath, collection.name];
  const articles = (collection.articles ?? []).map((article) => ({
    id: article.id,
    title: article.title,
    url: article.url,
    topLevelCollection: collectionPath[0],
    collectionPath,
    relevance: relevanceByCollection[collectionPath[0]] ?? "unclassified",
    reviewStatus: "indexed",
  }));

  const nested = (collection.subcollections ?? []).flatMap((child) =>
    flattenCollection(child, collectionPath),
  );

  return [...articles, ...nested];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderHtml(catalog) {
  const cards = catalog.collections
    .map(
      (collection) => `
        <article class="card">
          <div class="card-top">
            <span class="pill ${collection.relevance}">${escapeHtml(collection.relevance)}</span>
            <strong>${collection.articleCount}</strong>
          </div>
          <h3>${escapeHtml(collection.name)}</h3>
          <a href="${escapeHtml(collection.url)}">Open source collection</a>
        </article>`,
    )
    .join("");

  const rows = catalog.articles
    .map(
      (article) => `
        <tr data-collection="${escapeHtml(article.topLevelCollection)}" data-relevance="${article.relevance}" data-search="${escapeHtml(`${article.title} ${article.collectionPath.join(" ")}`.toLowerCase())}">
          <td><a href="${escapeHtml(article.url)}">${escapeHtml(article.title)}</a></td>
          <td>${escapeHtml(article.collectionPath.join(" › "))}</td>
          <td><span class="pill ${article.relevance}">${article.relevance}</span></td>
          <td><span class="status">Indexed</span></td>
        </tr>`,
    )
    .join("");

  const collectionOptions = catalog.collections
    .map((collection) => `<option value="${escapeHtml(collection.name)}">${escapeHtml(collection.name)}</option>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Subsplash Public Documentation Evidence Index</title>
  <style>
    :root { color-scheme: dark; --bg:#090d14; --panel:#111827; --panel2:#172033; --text:#edf2f7; --muted:#9ca9ba; --line:#2b3850; --accent:#68d8ff; --core:#65e6a5; --adjacent:#ffd166; --expansion:#b9a7ff; }
    * { box-sizing: border-box; }
    body { margin:0; background:radial-gradient(circle at top right,#152746 0,#090d14 36rem); color:var(--text); font:15px/1.55 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    main { width:min(1440px,calc(100% - 32px)); margin:0 auto; padding:48px 0 72px; }
    h1 { margin:0 0 8px; font-size:clamp(30px,5vw,54px); letter-spacing:-.04em; }
    h2 { margin:42px 0 16px; font-size:24px; }
    h3 { margin:14px 0 8px; }
    p { color:var(--muted); max-width:82ch; }
    a { color:var(--accent); text-decoration:none; }
    a:hover { text-decoration:underline; }
    .meta { display:flex; gap:12px; flex-wrap:wrap; margin:24px 0; }
    .metric { padding:14px 18px; border:1px solid var(--line); border-radius:14px; background:rgba(17,24,39,.82); }
    .metric strong { display:block; font-size:24px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
    .card { min-height:150px; padding:18px; border:1px solid var(--line); border-radius:16px; background:linear-gradient(150deg,rgba(23,32,51,.96),rgba(13,19,31,.96)); }
    .card-top { display:flex; justify-content:space-between; align-items:center; }
    .pill,.status { display:inline-flex; align-items:center; border-radius:999px; padding:3px 9px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
    .pill.core { color:var(--core); background:rgba(101,230,165,.1); }
    .pill.adjacent { color:var(--adjacent); background:rgba(255,209,102,.1); }
    .pill.expansion { color:var(--expansion); background:rgba(185,167,255,.1); }
    .status { color:#b7c3d4; background:#253146; }
    .controls { position:sticky; top:0; z-index:2; display:grid; grid-template-columns:minmax(240px,1fr) 240px 180px; gap:10px; padding:14px; border:1px solid var(--line); border-radius:14px; background:rgba(9,13,20,.94); backdrop-filter:blur(14px); }
    input,select { width:100%; border:1px solid var(--line); border-radius:10px; padding:11px 12px; background:#0e1624; color:var(--text); }
    .table-wrap { overflow:auto; margin-top:14px; border:1px solid var(--line); border-radius:14px; }
    table { width:100%; border-collapse:collapse; min-width:850px; background:rgba(14,22,36,.8); }
    th,td { padding:12px 14px; text-align:left; vertical-align:top; border-bottom:1px solid var(--line); }
    th { position:sticky; top:69px; background:#121b2b; color:#c9d3e1; }
    tr:last-child td { border-bottom:0; }
    .note { border-left:3px solid var(--accent); padding:12px 16px; background:rgba(104,216,255,.07); border-radius:0 10px 10px 0; }
    @media (max-width:760px) { .controls { grid-template-columns:1fr; position:static; } th { top:0; } }
  </style>
</head>
<body>
<main>
  <header>
    <h1>Subsplash public documentation evidence index</h1>
    <p>A traceable inventory for an independent, extensible app-building platform. This index records source metadata and derived relevance only; it does not reproduce the source articles.</p>
    <div class="meta">
      <div class="metric"><strong>${catalog.stats.collectionCount}</strong>top-level collections</div>
      <div class="metric"><strong>${catalog.stats.articleCount}</strong>unique public articles</div>
      <div class="metric"><strong>${catalog.stats.reviewedCount}</strong>fully reviewed so far</div>
    </div>
    <p class="note"><strong>Provisional scope:</strong> Core means directly relevant to the app builder, content manager, mobile app, user identity, or developer surface. Adjacent and expansion areas remain indexed because they can influence future parity.</p>
  </header>

  <h2>Collections</h2>
  <section class="grid">${cards}</section>

  <h2>Article inventory</h2>
  <section class="controls" aria-label="Article filters">
    <input id="search" type="search" placeholder="Search article titles and paths…">
    <select id="collection"><option value="">All collections</option>${collectionOptions}</select>
    <select id="relevance"><option value="">All relevance</option><option value="core">Core</option><option value="adjacent">Adjacent</option><option value="expansion">Expansion</option></select>
  </section>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Article</th><th>Collection path</th><th>Relevance</th><th>Review</th></tr></thead>
      <tbody id="rows">${rows}</tbody>
    </table>
  </div>
  <p>Generated ${escapeHtml(generatedAt)} from <a href="${SUPPORT_HOME}">Subsplash Support</a>. Article availability and titles may change.</p>
</main>
<script>
  const search = document.querySelector('#search');
  const collection = document.querySelector('#collection');
  const relevance = document.querySelector('#relevance');
  const rows = [...document.querySelectorAll('#rows tr')];
  function filterRows() {
    const query = search.value.trim().toLowerCase();
    for (const row of rows) {
      const matchesQuery = !query || row.dataset.search.includes(query);
      const matchesCollection = !collection.value || row.dataset.collection === collection.value;
      const matchesRelevance = !relevance.value || row.dataset.relevance === relevance.value;
      row.hidden = !(matchesQuery && matchesCollection && matchesRelevance);
    }
  }
  search.addEventListener('input', filterRows);
  collection.addEventListener('change', filterRows);
  relevance.addEventListener('change', filterRows);
</script>
</body>
</html>`;
}

const response = await fetch(SUPPORT_HOME, {
  headers: { "user-agent": "Independent product research indexer/1.0" },
});
if (!response.ok) throw new Error(`Support center returned HTTP ${response.status}.`);

const html = await response.text();
const navbar = JSON.parse(extractJsonObject(html, '"v2Navbar":'));
const collections = navbar.collections.map((collection) => {
  const articles = flattenCollection(collection);
  return {
    id: collection.id,
    name: collection.name,
    url: collection.url,
    relevance: relevanceByCollection[collection.name] ?? "unclassified",
    articleCount: articles.length,
  };
});

const deduplicated = new Map();
for (const collection of navbar.collections) {
  for (const article of flattenCollection(collection)) {
    if (!deduplicated.has(article.url)) deduplicated.set(article.url, article);
  }
}

const articles = [...deduplicated.values()].sort((left, right) =>
  left.topLevelCollection.localeCompare(right.topLevelCollection) || left.title.localeCompare(right.title),
);

const catalog = {
  source: SUPPORT_HOME,
  generatedAt,
  scopeNote: "Relevance classifications are provisional and do not exclude features from the parity roadmap.",
  stats: {
    collectionCount: collections.length,
    articleCount: articles.length,
    reviewedCount: articles.filter((article) => article.reviewStatus === "reviewed").length,
  },
  collections,
  articles,
};

await mkdir(researchDir, { recursive: true });
await writeFile(resolve(researchDir, "subsplash-public-docs-index.json"), `${JSON.stringify(catalog, null, 2)}\n`);
await writeFile(resolve(researchDir, "subsplash-public-docs-index.html"), renderHtml(catalog));

console.log(JSON.stringify(catalog.stats));
