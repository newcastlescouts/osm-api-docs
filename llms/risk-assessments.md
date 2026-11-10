<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Risk Assessments

Programme and meeting risk assessments.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /v3/risk_assessments/{sectionId}/categories` — Show programme risk assessment categories
- `GET /v3/risk_assessments/reviews/{sectionId}` — List risk assessment review status
- `GET /ext/risk_assessments/` — Get a risk assessment

### GET /v3/risk_assessments/{sectionId}/categories

**Show programme risk assessment categories**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionId` | path | yes | `string` | Section ID. |

**Response 200** — Risk assessment categories response.

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: Record<string, any>[];
  meta?: Record<string, any>;
  [key: string]: any;
}
```

Example — example:

```json
{
  "status": true,
  "error": null,
  "data": [
    {
      "name": "General Risks"
    }
  ],
  "meta": {
    "itemstore": {
      "identifier": "name"
    }
  }
}
```

### GET /v3/risk_assessments/reviews/{sectionId}

**List risk assessment review status**

Review schedule for the section's risk assessments. Each entry gives
when it was last reviewed and by whom, `next_review_on`,
`days_until_due` (negative when overdue) and `status` (observed
`overdue`). `type` is the kind of thing assessed (observed `programme`)
and `associated_id` its ID. `is_implicit` appears to mark entries OSM
created automatically. `meta.review_months` is the review interval.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionId` | path | yes | `string` | Section ID. |

**Response 200** — Review entries.

`application/json`:

```ts
{
  status?: boolean;
  error?: string | null;
  data?: any;  // Endpoint-specific payload (object, array, or null).
  meta?: any;  // Endpoint-specific metadata (object, or `[]` when empty).
  [key: string]: any;
}
```

Example — example:

```json
{
  "status": true,
  "error": null,
  "data": [
    {
      "reviewed_on": "2025-09-10",
      "reviewed_by_name": "Alex Leader",
      "next_review_on": "2026-09-10",
      "status": "overdue",
      "days_until_due": -61,
      "is_implicit": false,
      "type": "programme",
      "associated_id": 45001,
      "title": "General meeting risk assessment",
      "last_used_on": "2026-11-03"
    }
  ],
  "meta": {
    "review_months": 12
  }
}
```

### GET /ext/risk_assessments/

**Get a risk assessment**

The hazards recorded against a meeting, activity, or event. `data` is
an array of hazards (a Dojo item store: `meta.itemstore` gives the
identifier `hazard_id` and label `hazard`). For `activity` and
`generic_event` assessments, `meta` also carries `review` (last review,
or `null`) and `review_months` (review interval, observed `12`).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getRiskAssessment"` |  |
| `section_id` | query | yes | `string` |  |
| `type` | query | yes | `string` | What the assessment is attached to. Observed: `meeting`, `activity`, `generic_event`. |
| `associated_id` | query | yes | `string` | ID of the meeting / activity / event. Observed `0` with `type=generic_event` (the section's generic event assessment). |

**Response 200** — Hazards.

`application/json`:

```ts
{
  status?: boolean;
  error?: string | null;
  data?: any;  // Endpoint-specific payload (object, array, or null).
  meta?: any;  // Endpoint-specific metadata (object, or `[]` when empty).
  [key: string]: any;
}
```

Example — example:

```json
{
  "status": true,
  "error": null,
  "data": [],
  "meta": {
    "itemstore": {
      "identifier": "hazard_id",
      "label": "hazard"
    },
    "review": null,
    "review_months": 12
  }
}
```
