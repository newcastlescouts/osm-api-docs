<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Generic

Cross-cutting helpers (edit locks, telemetry).

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `POST /ext/generic/locks/` — Obtain or clear an edit lock
- `POST /ext/generic/featureusage/` — Record feature usage (telemetry)

### POST /ext/generic/locks/

**Obtain or clear an edit lock**

Advisory locks that stop two leaders editing the same thing at once
(observed for email campaigns, `item=campaign_<campaignId>`).

- `obtain` — returns a `lock_id`; `duration` is in seconds and the UI
  re-obtains periodically while editing.
- `clear` — releases a lock by `lock_id`.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"obtain" \| "clear"` |  |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  item?: string;  // `obtain` — what to lock, e.g. `campaign_70001`.
  duration?: string;  // `obtain` — seconds (observed `60`).
  read_allowed?: "true" | "false";  // `obtain` — whether others may read while locked.
  write_allowed?: "true" | "false";  // `obtain` — whether others may write while locked.
  type?: string;  // `obtain` — observed `write`.
  lock_id?: string;  // `clear` — lock to release.
  section_id?: string;
}
```

Example — Obtain a lock:

```json
{
  "item": "campaign_70001",
  "duration": "60",
  "read_allowed": "false",
  "write_allowed": "false",
  "type": "write",
  "section_id": "45002"
}
```

Example — Clear a lock:

```json
{
  "lock_id": "9900001",
  "section_id": "45002"
}
```

**Response 200** — Lock result.

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

Example — Lock obtained:

```json
{
  "status": true,
  "error": null,
  "data": {
    "lock_id": 9900001
  },
  "meta": []
}
```

Example — Lock cleared:

```json
{
  "status": true,
  "error": null,
  "data": [],
  "meta": []
}
```

### POST /ext/generic/featureusage/

**Record feature usage (telemetry)**

UI telemetry — the web app reports actions such as
`viewed attendance register` or `drag drop patrols`. Third-party
integrations have no need to call this.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"add"` |  |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  feature?: string;
  section_id?: string;
}
```

Example — example:

```json
{
  "feature": "viewed attendance register",
  "section_id": "45002"
}
```

**Response 200** — Recorded.

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
