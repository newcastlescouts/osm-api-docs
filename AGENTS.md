# AGENTS.md

Guide for AI coding agents (and humans) working in this repo. If you only want to *use* the OSM API, read
[`llms.txt`](https://opensource.newcastlescouts.org.uk/llms.txt) instead.

## What this repo is

An unofficial, reverse-engineered OpenAPI 3.0.3 spec for the Online Scout Manager (OSM) API, published as a static
site at https://opensource.newcastlescouts.org.uk via GitHub Pages (served straight from `main`, no build step on the
server).

```
openapi.yaml          SOURCE OF TRUTH. Hand-edited.
index.html            Human viewer (Redoc 2.x, pinned). Loads openapi.yaml at runtime.
llms.txt              GENERATED. llmstxt.org index for agents.
llms-full.txt         GENERATED. Whole reference as one Markdown file.
llms/<category>.md    GENERATED. One Markdown file per OpenAPI tag.
scripts/build-llms.mjs  Generator for the three above.
redocly.yaml          Lint config.
.nojekyll             Stops GitHub Pages running Jekyll, so .md files are served raw.
```

## Workflow

1. Edit `openapi.yaml` only. Never hand-edit `llms.txt`, `llms-full.txt` or `llms/`.
2. `npm install` (once), then `npm run check`. That lints the spec and regenerates the AI docs. Commit the
   regenerated files with your spec change.
3. CI (`.github/workflows/validate-openapi.yml`) runs the same steps on every PR and fails if the generated files are stale.

## Adding endpoints from captured traffic (HAR files)

HAR files from OSM contain real personal data about children, parents and leaders, plus live session tokens.

- **Never commit a HAR file, or paste raw HAR content into the repo, an issue, or a PR.**
- Read HARs with a script that prints only structure: method, path (with numeric IDs replaced by `{id}`), `action`
  value, parameter *names*, and response *shapes* (keys and types). Avoid dumping raw values into your context.
- Write every example by hand with fictional data. Conventions used across the spec:
  - Section `45001`, parent/group section `44001`, members `31000xx`, patrols `12001`, other IDs in round
    `8xxxx`/`7xxxx` blocks.
  - Names like "Jamie River", "Alex Leader". GUIDs `00000000-0000-0000-0000-000000000000`. Emails `@example.com`.
- Before committing, check that no number of 5+ digits, name, email, filename, token or hash from the HAR appears in
  the diff.
- Say what you have *not* observed (e.g. "only an empty list has been observed") rather than inventing fields.

## Spec conventions

- OSM multiplexes many operations onto one URL via `?action=…`. Model the `action` as a required query parameter
  with an `enum`, and describe each action's behaviour in the operation `description`.
- Newer `/v3/` endpoints return the `V3Envelope` (`status`, `error`, `data`, `meta`). Reference it.
- File attachments share one pattern: use `#/components/responses/FileManifest` and tag the route `Files`.
- POST bodies are `application/x-www-form-urlencoded`, never JSON.
- Every operation needs exactly one tag from the top-level `tags:` list (it decides which `llms/*.md` file it lands in).
- Note quirks plainly: units (pence vs pounds), removed actions (HTTP 410), JavaScript-wrapped responses.
- Bump `info.version` (minor) when adding endpoints.

## Site

`index.html` is plain HTML/CSS with no build. Redoc is pinned to 2.5.4 on jsDelivr. Redoc 3 ships an ES-module bundle
that fails as a classic `<script>` ("Cannot use 'import.meta' outside a module"), so don't move to `latest` without
reworking the loader. Brand assets come from `newcastlescouts.org.uk` (the old `patrolplanner` host is gone).
