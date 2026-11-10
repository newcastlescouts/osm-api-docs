<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Attendance

Member attendance and badge requirements.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/members/attendance/` — Get attendance data, register structure, or badge requirements
- `POST /ext/members/attendance/` — Update attendance
- `POST /v3/members/attendance/visitors/{sectionid}` — Add or update a register visitor

### GET /ext/members/attendance/

**Get attendance data, register structure, or badge requirements**

Attendance endpoints share this path with different `action` values.

- `get` — the register: one row per member with a `yyyy-mm-dd` key for
  each meeting they have a mark for (`Yes` / `No`), plus `meetings`
  (date → meeting title), `visitors` and `parent_rota` (both objects,
  empty when unused).
- `structure` — the Dojo grid layout for the register: a frozen name
  block, then one column per meeting date (`tooltip` is the meeting title).
- `getAttendanceBadgeRequirements` — badge requirements linked to the
  meeting on `date`. With `v=2` the response is an object with `badges`
  (the requirements) and `badges_updated_at` (who last changed the
  meeting's badge links); without `v` an array of requirements is returned.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"get" \| "structure" \| "getAttendanceBadgeRequirements"` |  |
| `sectionid` | query | yes | `string` | Section ID. |
| `termid` | query | no | `string` | Term ID (required for `get` and `structure`). |
| `section` | query | yes | `string` | Section type (e.g., `cubs`). |
| `nototal` | query | no | `string` | Toggle total attendance column (observed `true`). |
| `date` | query | no | `string` | Meeting date (required for `action=getAttendanceBadgeRequirements`). |
| `v` | query | no | `"2"` | `getAttendanceBadgeRequirements` — response version. `2` returns the `{badges, badges_updated_at}` object. |

**Response 200** — Attendance, structure, or badge requirement response.

`application/json`:

```ts
{
  identifier?: string;
  label?: string;
  items?: Record<string, any>[];
  meetings?: Record<string, string>;
  [key: string]: any;
} | {
  badge?: string;
  badge_id?: string;
  badge_version?: string;
  column_id?: string;
  badgeName?: string;
  badgetype?: string;
  columngroup?: string;
  columnname?: string;
  description?: string;
  data?: string;
  eveningid?: integer;
  meetingdate?: string;
  link_from?: string;
  name?: string;
  section?: string;
  sameas_counter?: integer;
  sectionid?: integer;
  [key: string]: any;
}[] | {
  badges?: {
    badge?: string;
    badge_id?: string;
    badge_version?: string;
    column_id?: string;
    badgeName?: string;
    badgetype?: string;
    columngroup?: string;
    columnname?: string;
    description?: string;
    data?: string;
    eveningid?: integer;
    meetingdate?: string;
    link_from?: string;
    name?: string;
    section?: string;
    sameas_counter?: integer;
    sectionid?: integer;
    [key: string]: any;
  }[];
  badges_updated_at?: {
    user_name?: string;
    date_time?: string;  // `dd/mm/yyyy hh:mm`.
  }[];
  [key: string]: any;
} | {
  rows?: Record<string, any>[];
  noscroll?: boolean;
  [key: string]: any;
}[]
```

Example — Attendance list (action=get):

```json
{
  "identifier": "scoutid",
  "label": "name",
  "items": [
    {
      "2025-01-07": "Yes",
      "2025-01-14": "No",
      "total": 1,
      "firstname": "Jamie",
      "lastname": "River",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "patrolid": 12001,
      "patrolleader": "2",
      "patrol": "Blue",
      "dob": "2015-04-22",
      "sectionid": 45002,
      "startdate": "2021-09-01",
      "enddate": null,
      "age": "10 / 04",
      "patrol_role_level_label": "Sixer",
      "active": true,
      "scoutid": 3100001,
      "_filterString": "jamie river blue"
    },
    {
      "2025-01-07": "Yes",
      "total": 1,
      "firstname": "Robert",
      "lastname": "Baden Powell",
      "patrolid": -2,
      "patrol": "Leaders",
      "active": true,
      "scoutid": 3100010
    }
  ],
  "visitors": {},
  "parent_rota": {},
  "meetings": {
    "2025-01-07": "Welcome Back!",
    "2025-01-14": "Camp Skills Night"
  }
}
```

Example — Register grid layout (action=structure):

```json
[
  {
    "rows": [
      {
        "name": "First Name",
        "field": "firstname",
        "width": "100px",
        "formatter": "registerBoldFormatter"
      },
      {
        "name": "Last Name",
        "field": "lastname",
        "width": "100px",
        "formatter": "registerBoldFormatter"
      }
    ],
    "noscroll": true
  },
  {
    "rows": [
      {
        "name": "2025-01-07",
        "field": "2025-01-07",
        "formatter": "doneFormatter",
        "width": "110px",
        "tooltip": "Welcome Back!"
      }
    ]
  }
]
```

Example — Attendance badge requirements (v=2):

```json
{
  "badges": [
    {
      "badge": "0",
      "badge_id": "1002",
      "badge_version": "0",
      "column_id": "200101",
      "badgeName": "Chef",
      "badgetype": "activity",
      "columngroup": "A",
      "columnname": "a",
      "description": "Learn about the main food groups.",
      "data": "14/01/2025",
      "eveningid": 9500002,
      "meetingdate": "2025-01-14",
      "link_from": "meeting",
      "name": "Food Groups",
      "section": "cubs",
      "sameas_counter": 0,
      "sectionid": 45002
    }
  ],
  "badges_updated_at": [
    {
      "user_name": "Alex Scout",
      "date_time": "14/01/2025 20:40"
    }
  ]
}
```

Example — Attendance badge requirements (no v parameter):

```json
[
  {
    "badge_id": "1593",
    "badgeName": "Communicator",
    "column_id": "100542",
    "name": "Code",
    "meetingdate": "2025-01-14",
    "section": "cubs",
    "sectionid": 12345
  }
]
```

### POST /ext/members/attendance/

**Update attendance**

Marks one or more members present/absent for a meeting date, optionally
awarding the badge requirements linked to that meeting. The response
body is the bare JSON literal `true` on success.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"update"` |  |
| `sectionid` | query | yes | `string` |  |
| `termid` | query | yes | `string` |  |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  scouts: string;  // JSON array of member IDs.
  selectedDate: string;
  present: string;  // `Yes`, `No`, or `Absent` (observed).
  section: string;
  sectionid: string;
  completedBadges?: string;  // JSON array of badge data.
  customData?: string;  // JSON array of custom data updates.
  [key: string]: any;
}
```

Example — example:

```json
{
  "scouts": "[3100001]",
  "selectedDate": "2025-01-14",
  "present": "Yes",
  "section": "cubs",
  "sectionid": "45002",
  "completedBadges": "[]",
  "customData": "[]"
}
```

**Response 200** — The JSON literal `true` on success.

`application/json`:

```ts
boolean
```

Example — example:

```json
true
```

### POST /v3/members/attendance/visitors/{sectionid}

**Add or update a register visitor**

Records a non-member visitor (or parent helper) against a meeting date.
Visitors appear in the `visitors` object of
`GET /ext/members/attendance/?action=get`.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  name: string;  // Visitor's name (free text).
  meeting_date: string /* date */;
  present: "Yes" | "No";
  type: string;  // Observed `visitor`.
}
```

Example — example:

```json
{
  "name": "Visiting Leader",
  "meeting_date": "2025-01-14",
  "present": "Yes",
  "type": "visitor"
}
```

**Response 200** — Visitor saved.

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
  "meta": []
}
```
