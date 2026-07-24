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

The spec documents endpoints across these categories, with request/response examples and schemas:

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
| **Risk Assessments** | `/ext/risk_assessments/`, `/v3/risk_assessments/.../categories`                                                                                                                         | Programme RA library (get/add items), category names                                                                             |

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

- **Invalid-request blocking** — OSM also blocks traffic that repeatedly hits unknown paths or invalid `action`
  values (not only classic rate limits). Observed responses include an HTML “Blocked” page and JSON such as
  `"code": "blocked"` / “too many invalid requests”. The block can affect **both** OAuth clients and the interactive
  browser session for the same account, and the OAuth app UI may not show a blocked flag. **Do not probe** lists of
  guessed endpoints. Capture one real request from DevTools, stop on the first blocked/invalid-action storm, and wait
  before retrying. Continuing after a block can escalate. Account recovery may require a password reset (limited
  frequency) followed by a waiting period before login.

- **Privacy and GDPR** — These endpoints return personal data about young people and their families. Handle it
  responsibly. Don't store what you don't need, don't log PII, and follow your organisation's data protection policies.

## Contributing

PRs are welcome — especially for endpoints not yet documented. If you've observed a new endpoint or spotted a mistake:

1. Add or update the relevant path in `openapi.yaml`
2. Include realistic but **fictional** example data (no real names, IDs, or section data)
3. Note any quirks in the description (unusual response formats, required-but-undocumented params, etc.)

## Licence

This documentation is open source. The OSM API itself is owned by Online Scout Manager. This project is not endorsed by
or affiliated with OSM.
