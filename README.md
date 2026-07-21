# OSM API Docs

Unofficial, community-driven OpenAPI documentation for
the [Online Scout Manager](https://www.onlinescoutmanager.co.uk) (OSM) API — reverse-engineered from real traffic by the
City of Newcastle Scouts Digital Team.

OSM doesn't publish a public API specification. This project exists to fill that gap for developers building tools on
top of OSM's platform, whether you're writing a custom badge tracker, a patrol planner, or anything else that helps
leaders run their sections.

> [!WARNING]
> **This documentation is provided as-is with no guarantees.** OSM's API is undocumented and can change without notice.
> Endpoints, parameters, and response shapes described here were observed at the time of writing and may drift over time.
> Always test against the live API before relying on anything here. We are not affiliated with OSM — use at your own risk.

## What's covered

The spec documents **19 endpoints** across 9 categories, with request/response examples and schemas:

| Category             | Endpoints                                                                                                                                                                               | What you can do                                                                                                                  |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Startup**          | `/ext/generic/startup/`                                                                                                                                                                 | Bootstrap a session — get roles, terms, permissions                                                                              |
| **Members**          | `/ext/members/contact/`, `/ext/members/contact/actions/`, `/ext/members/patrols/`, `/ext/members/census/`, `/v3/members/contact/.../removalWarnings`, `/v3/members/review/deletion/...` | List members, update fields (name, DOB, patrol, rank), create/remove/restore members, get patrols, census data, deletion reviews |
| **Badges**           | `/ext/badges/records/`, `/ext/badges/badgesbyperson/`                                                                                                                                   | Available badges per section, per-member badge progress, completion records                                                      |
| **Attendance**       | `/ext/members/attendance/`                                                                                                                                                              | Register data, meeting attendance                                                                                                |
| **Custom Data**      | `/ext/customdata/`                                                                                                                                                                      | Read and update custom fields (gender, flexi-records, etc.)                                                                      |
| **Email**            | `/ext/members/email/`, `/ext/settings/emails/`                                                                                                                                          | Contact email selection, send templates, newsletter config                                                                       |
| **Programme**        | `/ext/programme/`, `/ext/programme/clouds/`                                                                                                                                             | Meeting summaries, programme details, badge tag clouds                                                                           |
| **Audit Trail**      | `/ext/audittrail/`                                                                                                                                                                      | Full change history for a member                                                                                                 |
| **Dashboard**        | `/ext/dashboard/`                                                                                                                                                                       | Dashboard summaries, upcoming events, due badges                                                                                 |
| **Risk Assessments** | `/v3/risk_assessments/.../categories`                                                                                                                                                   | Programme risk assessment categories                                                                                             |

## Contents

| File           | Description                                          |
|----------------|------------------------------------------------------|
| `openapi.yaml` | OpenAPI 3.0.3 specification — the source of truth    |
| `index.html`   | Interactive docs UI (Redoc) — just open in a browser |

## Viewing the docs

Open `index.html` in any browser. It loads `openapi.yaml` into [Redoc](https://github.com/Redocly/redoc) for a
searchable, nicely formatted reference with request/response examples.

You can also import `openapi.yaml` into tools like [Swagger Editor](https://editor.swagger.io/), Postman, or Insomnia.

## Key things to know

- **Authentication** — OSM uses OAuth 2.0. You'll need a `client_id` and `client_secret` from OSM. The bearer token goes
  in the `Authorization` header. Tokens expire and must be refreshed via the `/oauth/token` endpoint.

- **Response format quirks** — Some endpoints return JavaScript (`var data_holder = {...}`) rather than clean JSON.
  You'll need to strip the prefix before parsing. The `startup` endpoint is the main offender.

- **POST bodies** — OSM expects `application/x-www-form-urlencoded` for all POST requests, **not** JSON. Sending JSON
  will get you blocked.

- **Rate limits** — OSM enforces rate limits. Responses may include `X-RateLimit-*` or `RateLimit-*` headers. If you hit
  a `429`, back off immediately. Excessive requests will get your OAuth client banned.

- **Privacy and GDPR** — These endpoints return personal data about young people and their families. Handle it
  responsibly. Don't store what you don't need, don't log PII, and follow your organisation's data protection policies.

## Contributing

PRs are welcome — especially for endpoints not yet documented. If you've observed a new endpoint or spotted a mistake:

1. Add or update the relevant path in `openapi.yaml`
2. Include realistic but **fictional** example data (no real names, IDs, or section data)
3. Note any quirks in the description (unusual response formats, required-but-undocumented params, etc.)

### Validating the OpenAPI spec

This repo uses [Redocly CLI](https://redocly.com/docs/cli/) to lint `openapi.yaml` and make sure it bundles cleanly.
Config lives in `redocly.yaml`. To run it locally:

```bash
npx @redocly/cli@2.40.0 lint openapi.yaml
npx @redocly/cli@2.40.0 bundle openapi.yaml > /dev/null
```

GitHub Actions runs the same two commands automatically on pull requests and pushes to `main` that touch
`openapi.yaml` or `redocly.yaml` (see `.github/workflows/validate-openapi.yml`), so any issues will also be caught in CI.

## Licence

This documentation is open source. The OSM API itself is owned by Online Scout Manager. This project is not endorsed by
or affiliated with OSM.
