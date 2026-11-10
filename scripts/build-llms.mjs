#!/usr/bin/env node
// Generates the AI-readable docs from openapi.yaml:
//   llms.txt          index (https://llmstxt.org) linking to everything below
//   llms/<tag>.md     one Markdown reference per category
//   llms-full.txt     every category concatenated into one file
//
// Run `npm run build` after editing openapi.yaml. CI fails if outputs are stale.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://opensource.newcastlescouts.org.uk";
const METHODS = ["get", "post", "put", "patch", "delete"];

const spec = parse(readFileSync(join(ROOT, "openapi.yaml"), "utf8"));

// ---------- helpers ----------

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const oneLine = (s = "") => s.replace(/\s+/g, " ").trim();
const firstPara = (s = "") => oneLine(s.trim().split(/\n\s*\n/)[0]);
const cell =(s = "") => oneLine(s).replace(/\|/g, "\\|");

function resolve(obj) {
  let seen = 0;
  while (obj && obj.$ref && seen++ < 20) {
    obj = obj.$ref
      .replace(/^#\//, "")
      .split("/")
      .reduce((o, k) => o?.[k.replace(/~1/g, "/").replace(/~0/g, "~")], spec);
  }
  return obj;
}
const refName = (o) => (o?.$ref ? o.$ref.split("/").pop() : null);

// Compact TypeScript-ish rendering of a schema. Named component schemas are
// expanded once per operation, then referred to by name.
function renderSchema(schema, indent = "", seen = new Set(), depth = 0) {
  if (!schema) return "any";
  const name = refName(schema);
  if (name) {
    if (seen.has(name) || depth > 6) return name;
    seen = new Set(seen).add(name);
  }
  const s = resolve(schema);
  if (!s) return "any";

  for (const k of ["oneOf", "anyOf"]) {
    if (s[k]) return s[k].map((x) => renderSchema(x, indent, seen, depth + 1)).join(" | ");
  }
  if (s.allOf) return s.allOf.map((x) => renderSchema(x, indent, seen, depth + 1)).join(" & ");

  let out;
  if (s.enum) out = s.enum.map((v) => JSON.stringify(v)).join(" | ");
  else if (s.type === "array" || s.items) out = `${wrap(renderSchema(s.items, indent, seen, depth + 1))}[]`;
  else if (s.type === "object" || s.properties || s.additionalProperties) {
    const props = Object.entries(s.properties || {});
    const lines = props.map(([k, v]) => {
      const opt = (s.required || []).includes(k) ? "" : "?";
      const rv = resolve(v) || {};
      const desc = rv.description ? `  // ${oneLine(rv.description).slice(0, 160)}` : "";
      const nullable = rv.nullable ? " | null" : "";
      return `${indent}  ${safeKey(k)}${opt}: ${renderSchema(v, indent + "  ", seen, depth + 1)}${nullable};${desc}`;
    });
    if (s.additionalProperties) {
      const ap = s.additionalProperties === true ? "any" : renderSchema(s.additionalProperties, indent + "  ", seen, depth + 1);
      lines.push(`${indent}  [key: string]: ${ap};`);
    }
    if (!props.length && s.additionalProperties) {
      const ap = s.additionalProperties === true ? "any" : renderSchema(s.additionalProperties, indent, seen, depth + 1);
      out = `Record<string, ${ap}>`;
    } else {
      out = lines.length ? `{\n${lines.join("\n")}\n${indent}}` : "Record<string, any>";
    }
  } else {
    out = s.type || "any";
    if (s.format) out += ` /* ${s.format} */`;
  }
  return out;
}
const wrap = (t) => (/[|&]/.test(t) && !t.startsWith("{") ? `(${t})` : t);
const safeKey = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k));

// Shrink examples so they stay readable: keep the first few array items and
// clip long strings. The result is still valid JSON.
function shrink(v, depth = 0) {
  if (Array.isArray(v)) {
    const head = v.slice(0, 2).map((x) => shrink(x, depth + 1));
    if (v.length > 2) head.push(`… ${v.length - 2} more`);
    return head;
  }
  if (v && typeof v === "object") {
    const entries = Object.entries(v);
    const keep = entries.slice(0, 40).map(([k, x]) => [k, shrink(x, depth + 1)]);
    if (entries.length > 40) keep.push(["…", `${entries.length - 40} more keys`]);
    return Object.fromEntries(keep);
  }
  if (typeof v === "string" && v.length > 200) return v.slice(0, 200) + "…";
  return v;
}

function examplesOf(media) {
  if (!media) return [];
  if (media.example !== undefined) return [["example", media.example]];
  return Object.entries(media.examples || {}).map(([k, e]) => [resolve(e)?.summary || k, resolve(e)?.value]);
}

function fence(v) {
  const body = typeof v === "string" ? v : JSON.stringify(shrink(v), null, 2);
  const lang = typeof v === "string" ? "text" : "json";
  return "```" + lang + "\n" + body + "\n```";
}

// ---------- per-operation rendering ----------

function renderOperation(path, method, op, pathItem) {
  const out = [];
  out.push(`### ${method.toUpperCase()} ${path}`);
  if (op.summary) out.push(`**${oneLine(op.summary)}**`);
  if (op.deprecated) out.push("> **Deprecated.**");
  if (op.description) out.push(op.description.trim());

  const params = [...(pathItem.parameters || []), ...(op.parameters || [])].map(resolve);
  if (params.length) {
    const rows = params.map((p) => {
      const t = oneLine(renderSchema(p.schema));
      return `| \`${p.name}\` | ${p.in} | ${p.required ? "yes" : "no"} | \`${cell(t)}\` | ${cell(p.description)} |`;
    });
    out.push("**Parameters**", ["| Name | In | Required | Type | Description |", "|---|---|---|---|---|", ...rows].join("\n"));
  }

  const body = resolve(op.requestBody);
  if (body?.content) {
    for (const [type, media] of Object.entries(body.content)) {
      out.push(`**Request body** (\`${type}\`${body.required ? ", required" : ""})`);
      if (body.description) out.push(body.description.trim());
      if (media.schema) out.push("```ts\n" + renderSchema(media.schema) + "\n```");
      for (const [name, ex] of examplesOf(media)) out.push(`Example — ${name}:`, fence(ex));
    }
  }

  for (const [code, r0] of Object.entries(op.responses || {})) {
    const r = resolve(r0);
    out.push(`**Response ${code}** — ${oneLine(r?.description || "")}`);
    for (const [type, media] of Object.entries(r?.content || {})) {
      if (media.schema) out.push(`\`${type}\`:`, "```ts\n" + renderSchema(media.schema) + "\n```");
      for (const [name, ex] of examplesOf(media)) out.push(`Example — ${name}:`, fence(ex));
    }
  }
  return out.join("\n\n");
}

// ---------- group by tag ----------

const tags = (spec.tags || []).map((t) => ({ ...t, ops: [] }));
const tagByName = Object.fromEntries(tags.map((t) => [t.name, t]));
for (const [path, item] of Object.entries(spec.paths)) {
  for (const m of METHODS) {
    const op = item[m];
    if (!op) continue;
    const name = op.tags?.[0] || "Other";
    if (!tagByName[name]) tags.push((tagByName[name] = { name, ops: [] }));
    tagByName[name].ops.push({ path, method: m, op, item });
  }
}
const used = tags.filter((t) => t.ops.length);

// ---------- write files ----------

const HEADER = "<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->";
const files = {};

const overview = spec.info.description.trim();

for (const t of used) {
  const parts = [
    HEADER,
    `# OSM API — ${t.name}`,
    t.description?.trim() || "",
    `Base URL: \`${spec.servers[0].url}\`. Auth: OAuth 2.0 bearer token. POST bodies are \`application/x-www-form-urlencoded\`, never JSON. ` +
      `Full context: ${SITE}/llms.txt`,
    "## Operations",
    t.ops.map((o) => `- \`${o.method.toUpperCase()} ${o.path}\` — ${oneLine(o.op.summary || "")}`).join("\n"),
    ...t.ops.map((o) => renderOperation(o.path, o.method, o.op, o.item)),
  ];
  files[`llms/${slug(t.name)}.md`] = parts.filter(Boolean).join("\n\n") + "\n";
}

const opCount = used.reduce((n, t) => n + t.ops.length, 0);
files["llms.txt"] = [
  `# ${spec.info.title}`,
  `> Community-maintained, reverse-engineered reference for the Online Scout Manager (OSM) API: ${Object.keys(spec.paths).length} paths, ${opCount} operations. ` +
    `Not affiliated with OSM; behaviour may drift, so verify against the live API.`,
  [
    "Essentials before writing any code:",
    "- Base URL `https://www.onlinescoutmanager.co.uk`; OAuth 2.0 authorization-code flow, bearer token in `Authorization`.",
    "- Every POST body must be `application/x-www-form-urlencoded`. Sending JSON gets the OAuth client blocked.",
    "- Many URLs multiplex behaviour through an `action` query parameter; the action is part of the operation's identity.",
    "- Respect `X-RateLimit-*` headers and back off on HTTP 429 (`Retry-After`). Repeat offenders are permanently blocked.",
    "- `/v3/finances/accounting/` amounts are integer pence; event endpoints use pounds.",
    "- Responses contain personal data about young people. Do not log or retain more than needed.",
  ].join("\n"),
  "## Reference by category\n\n" +
    used
      .map((t) => `- [${t.name}](${SITE}/llms/${slug(t.name)}.md): ${firstPara(t.description)} (${t.ops.length} operation${t.ops.length === 1 ? "" : "s"})`)
      .join("\n"),
  "## Source\n\n" +
    [
      `- [openapi.yaml](${SITE}/openapi.yaml): OpenAPI ${spec.openapi} spec, the source of truth (load into codegen, Postman, etc.)`,
      `- [llms-full.txt](${SITE}/llms-full.txt): all categories above in a single file`,
      `- [Human docs](${SITE}/): Redoc viewer`,
    ].join("\n"),
  "## Optional\n\n" + `- [Repository guide for agents](${SITE}/AGENTS.md): how to add or correct endpoints in this repo`,
].join("\n\n") + "\n";

files["llms-full.txt"] = [
  `# ${spec.info.title} — full reference`,
  overview,
  ...used.map((t) => files[`llms/${slug(t.name)}.md`].replace(HEADER + "\n\n", "").replace(/^# /, "# ")),
].join("\n\n---\n\n");

rmSync(join(ROOT, "llms"), { recursive: true, force: true });
mkdirSync(join(ROOT, "llms"), { recursive: true });
for (const [rel, content] of Object.entries(files)) {
  writeFileSync(join(ROOT, rel), content.replace(/\r\n/g, "\n"));
}
console.log(`Wrote ${Object.keys(files).length} files (${used.length} categories, ${opCount} operations).`);
