<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Members

Member lists, details, patrols, and census.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/members/contact/` — Get list of members or individual member details
- `POST /ext/members/contact/` — Update a member field or contact details
- `POST /ext/members/contact/actions/` — Create, remove, or restore a member
- `GET /ext/members/patrols/` — Get patrols with members
- `POST /ext/members/patrols/` — Update patrol points
- `GET /ext/members/census/` — Get census details
- `GET /ext/members/flexirecords/` — Get flexi-records, their structure, or their data
- `POST /ext/audittrail/` — Get audit trail for a member
- `POST /v3/members/contact/{sectionid}/removalWarnings` — Get pre-removal warnings for a member
- `GET /v3/members/review/deletion/{sectionid}` — Get deletable members
- `GET /v3/members/review/elsewhere/{sectionid}` — Get members who left this section and are elsewhere
- `GET /v3/members/review/future_transfers/{sectionid}` — Get scheduled (future) member transfers
- `GET /ext/settings/parents/loginhistory/` — Get Parent Portal login history

### GET /ext/members/contact/

**Get list of members or individual member details**

Retrieves member data. The `action` parameter controls the behavior.
This endpoint is also used to return full member contact/emergency data
(use with care for GDPR compliance).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getListOfMembers" \| "getIndividual" \| "getMemberTransfers"` |  |
| `sectionid` | query | no | `string` | Section ID. |
| `termid` | query | no | `string` | Term ID. |
| `section` | query | no | `"squirrels" \| "beavers" \| "cubs" \| "scouts" \| "explorers"` | Section type. |
| `sort` | query | no | `"dob" \| "firstname" \| "lastname" \| "patrol"` | Sort order for list of members. |
| `scoutid` | query | no | `string` | Member unique identifier. |
| `context` | query | no | `"members"` | Context for member detail retrieval. |
| `mode` | query | no | `string` | Display mode (observed value `grid`). |
| `section_id` | query | no | `string` | Section ID (alternate naming). |

**Response 200** — Member data response.

`application/json`:

```ts
{
  identifier: string;
  photos?: boolean;
  items: Record<string, any>[];
  [key: string]: any;
} | {
  ok?: boolean;
  read_only?: string[];
  data?: Record<string, any>;
  meta?: Record<string, any>[];
  [key: string]: any;
} | {
  status?: boolean;
  error?: any | null;
  data?: Record<string, any>[];
  meta?: Record<string, any>[];
  [key: string]: any;
}
```

Example — Members list:

```json
{
  "identifier": "scoutid",
  "photos": true,
  "items": [
    {
      "firstname": "Jamie",
      "lastname": "River",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "patrolid": 12001,
      "patrol": "Blue",
      "sectionid": 45001,
      "enddate": null,
      "age": "10 / 2",
      "patrol_role_level_label": "Sixer",
      "active": true,
      "scoutid": 3100001,
      "full_name": "Jamie River",
      "has_invitations": false
    }
  ]
}
```

Example — Member detail:

```json
{
  "ok": true,
  "read_only": [],
  "data": {
    "scoutid": "3100001",
    "firstname": "Jamie",
    "lastname": "River",
    "photo_guid": "00000000-0000-0000-0000-000000000000",
    "dob": "2015-04-22",
    "started": "2021-09-01",
    "created_date": "2021-09-01 18:30:00",
    "last_accessed": "2025-09-15 19:00:00",
    "patrolid": "12001",
    "patrolleader": "2",
    "startedsection": "2021-09-01",
    "enddate": null,
    "age": "10 years and 4 months",
    "age_simple": "10 / 04",
    "sectionid": 45001,
    "active": true,
    "has_invitations": false,
    "moving_on_date": "2025-12-19",
    "moving_on_section_name": "Scouts"
  },
  "meta": []
}
```

Example — Member transfers:

```json
{
  "status": true,
  "error": null,
  "data": [
    {
      "direction": "from",
      "member_id": 3100002,
      "firstname": "Riley",
      "lastname": "Park",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "type": "transferred",
      "date": "2024-01-15",
      "section_id": 65001,
      "section_name": {
        "group": "1st Riverside Scouts",
        "section": "Scouts"
      },
      "section_long": "1st Riverside Scouts: Scouts",
      "mode": "outgoing",
      "id": "outgoing-123456"
    }
  ],
  "meta": []
}
```

### POST /ext/members/contact/

**Update a member field or contact details**

Updates a single field on a member record, or updates contact details
for one of their linked contacts. The `action` query parameter must be
`update`. The body is sent as `application/x-www-form-urlencoded`.

**Member field mode** — send `scoutid`, `column`, `value`, `sectionid`,
and optionally `context=members` (the web UI's patrol drag-and-drop
omits `context` and still succeeds). Known columns:

| Column          | Value format | Notes |
|-----------------|-------------|-------|
| `firstname`     | string | |
| `lastname`      | string | |
| `dob`           | `yyyy-mm-dd` | |
| `started`       | `yyyy-mm-dd` | Date started Scouting. |
| `startedsection`| `yyyy-mm-dd` | Date started this section. |
| `patrolid`      | int | Must also provide `patrolleader` in the same request body. |
| `patrolleader`  | int | 0 = no rank, 1 = APL/Seconder, 2 = PL/Sixer, 3 = SPL/Senior Sixer. |

When setting `patrolid`, the body **must also include** `patrolleader`
(the rank level integer). Conversely, `patrolleader` can be set on its
own as `column` without changing the patrol.

**Contact update mode** — send `associated_type=member`,
`associated_id=<scoutid>`, `group_id=<contact_group>`, `context=members`,
and `data[field]=value` pairs for each field. Contact group IDs:

| group_id | Contact |
|----------|---------|
| 1 | Primary Contact 1 |
| 2 | Primary Contact 2 |
| 3 | Emergency Contact |
| 4 | Doctor's Surgery |
| 6 | Member's own details |

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"update"` | Must be `update`. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  scoutid?: integer;  // Member unique identifier (member field mode).
  column?: "firstname" | "lastname" | "dob" | "started" | "startedsection" | "patrolid" | "patrolleader";  // The field to update (member field mode).
  value?: integer | string;  // The new value.
  sectionid?: string;  // Section ID the member belongs to.
  context?: "members";  // Must be `members`.
  patrolleader?: integer;  // Required when `column=patrolid`. Rank level: 0 = none, 1 = APL/Seconder, 2 = PL/Sixer, 3 = SPL/Senior Sixer.
  associated_type?: "member";  // Contact update mode — must be `member`.
  associated_id?: integer;  // Contact update mode — the member's scoutid.
  group_id?: 1 | 2 | 3 | 4 | 6;  // Contact update mode — contact group ID.
  [key: string]: any;
}
```

Example — Update a member field (e.g. patrol):

```json
{
  "scoutid": 3100001,
  "column": "patrolid",
  "value": "12002",
  "sectionid": "45001",
  "context": "members",
  "patrolleader": 0
}
```

Example — Update a contact's details:

```json
{
  "associated_type": "member",
  "associated_id": "3100001",
  "group_id": "1",
  "context": "members",
  "data[firstname]": "Morwenna",
  "data[lastname]": "River",
  "data[email1]": "morwenna.river@example.org",
  "data[phone1]": "07700900123",
  "data[phone1_sms]": "yes"
}
```

**Response 200** — Update confirmation with last-updated metadata.

`application/json`:

```ts
{
  ok?: boolean;
  meta?: {
    last_updated?: string;  // Timestamp of the update (e.g. `2025-09-15 19:42:10`).
    last_updated_by_name?: string;  // Name of the user who made the update.
  };
  [key: string]: any;
}
```

Example — example:

```json
{
  "ok": true,
  "meta": {
    "last_updated": "2025-09-15 19:42:10",
    "last_updated_by_name": "Alex Scout"
  }
}
```

### POST /ext/members/contact/actions/

**Create, remove, or restore a member**

Member lifecycle actions. The `action` query parameter controls the
behaviour. Body is `application/x-www-form-urlencoded`.

**`newMember`** — creates a new member in the section.

**`removeMember`** — removes a member from the section. The `type`
field controls how much data is retained:

| type | Effect |
|------|--------|
| `keepall` | Keep all data intact |
| `keepcontact` | Remove personal details except name and core details |
| `keepname` | Remove personal details except name |
| `delete` | Remove all personal details; use initials for names (member history retains names) |
| `erase` | Remove all personal details **including** names from history. **Irreversible.** |

When `type=erase`, an optional `additional_data_to_delete` array can
specify extra data categories to purge: `badge`, `events`, `finance`,
`register`. Each is optional.

**`returnMember`** — restores a previously removed member.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"newMember" \| "removeMember" \| "returnMember"` |  |
| `sectionid` | query | no | `string` | Section ID (required for `removeMember`). |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  firstname?: string;  // `newMember` only. First name.
  lastname?: string;  // `newMember` only. Last name.
  dob?: string /* date */;  // `newMember` only. Date of birth (`yyyy-mm-dd`).
  startedsection?: string /* date */;  // `newMember` only. Date started in this section.
  started?: string /* date */;  // `newMember` only. Date started Scouting.
  sectionid?: string;  // Section ID.
  originating_section_id?: string;  // `newMember` only. Usually same as `sectionid`.
  term_id?: string;  // `newMember` only. Term ID.
  scouts?: integer;  // `removeMember` / `returnMember`. Member scout ID.
  from_section?: string;  // `removeMember` only. Section ID to remove from.
  date?: string /* date */;  // `removeMember` only. Effective removal date (`yyyy-mm-dd`).
  type?: "keepall" | "keepcontact" | "keepname" | "delete" | "erase";  // `removeMember` only. Data retention level.
  additional_data_to_delete?: ("badge" | "events" | "finance" | "register")[];  // `removeMember` with `type=erase` only. Extra data to purge.
  [key: string]: any;
}
```

Example — Create a new member:

```json
{
  "firstname": "Rowan",
  "lastname": "Wells",
  "dob": "2016-06-15",
  "startedsection": "2025-09-05",
  "started": "2025-09-06",
  "sectionid": "45001",
  "originating_section_id": "45001",
  "term_id": "67890"
}
```

Example — Remove a member (keep all data):

```json
{
  "scouts": 3100005,
  "from_section": "45001",
  "date": "2025-08-19",
  "type": "keepall"
}
```

Example — Restore a removed member:

```json
{
  "scouts": 3100005
}
```

**Response 200** — Action result.

`application/json`:

```ts
{
  result?: "ok";
  out_of_term?: boolean;  // Whether the start date falls outside the given term.
  scoutid?: integer;  // The newly assigned member ID.
  firstname?: string;
  lastname?: string;
} | {
  ok?: boolean;
  scouts?: integer[];  // Scout IDs affected.
}
```

Example — New member created:

```json
{
  "result": "ok",
  "out_of_term": false,
  "scoutid": 3100005,
  "firstname": "Rowan",
  "lastname": "Wells"
}
```

Example — Member removed:

```json
{
  "ok": true,
  "scouts": [
    3100005
  ]
}
```

Example — Member restored:

```json
{
  "ok": true,
  "scouts": [
    3100005
  ]
}
```

### GET /ext/members/patrols/

**Get patrols with members**

Returns patrols (sixes, lodges, etc.) keyed by patrol ID, each with its
members. Negative IDs are pseudo-patrols: `-2` = Leaders, `-3` = Young
Leaders. Members with a rank also carry `patrol_role_level` (the numeric
rank, matching `patrolleader`) and `patrol_role_level_abbr` (e.g. `6er`,
`2nd`); the `patrol` field then includes the abbreviation (e.g. `Blue 6er`).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getPatrolsWithPeople"` |  |
| `sectionid` | query | yes | `string` | Section ID. |
| `termid` | query | yes | `string` | Term ID. |
| `include_no_patrol` | query | no | `"y" \| "n"` | Include pseudo-patrol for members not in a patrol. |

**Response 200** — Patrol list keyed by patrol ID.

`application/json`:

```ts
Record<string, any>
```

Example — example:

```json
{
  "12001": {
    "patrolid": "12001",
    "sectionid": "45001",
    "name": "Blue",
    "active": "1",
    "points": "2",
    "census_costs": false,
    "members": [
      {
        "firstname": "Jamie",
        "lastname": "River",
        "scout_id": 3100001,
        "photo_guid": "00000000-0000-0000-0000-000000000000",
        "patrolid": 12001,
        "patrolleader": "2",
        "patrol": "Blue 6er",
        "sectionid": 45001,
        "enddate": null,
        "age": "10 / 2",
        "patrol_role_level_label": "Sixer",
        "active": 1,
        "scoutid": 3100001,
        "patrol_role_level_abbr": "6er",
        "patrol_role_level": 2,
        "editable": true
      }
    ]
  },
  "-3": {
    "patrolid": "-3",
    "sectionid": "-2",
    "name": "Young Leaders (YLs)",
    "active": "1",
    "points": "0",
    "census_costs": false,
    "members": []
  },
  "-2": {
    "patrolid": "-2",
    "sectionid": "-2",
    "name": "Leaders",
    "active": "1",
    "points": "0",
    "census_costs": false,
    "members": []
  }
}
```

### POST /ext/members/patrols/

**Update patrol points**

Sets the points total for a patrol. `points` is the **new total**, not an
increment. The response body is an empty JSON array on success.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"updatePatrolPoints"` |  |
| `sectionid` | query | yes | `string` | Section ID. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  patrolid: string;  // Patrol ID.
  points: string;  // New points total.
}
```

Example — example:

```json
{
  "patrolid": "12001",
  "points": "3"
}
```

**Response 200** — Empty array on success.

`application/json`:

```ts
any[]
```

Example — example:

```json
[]
```

### GET /ext/members/census/

**Get census details**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getDetails"` |  |
| `sectionid` | query | yes | `string` | Section ID. |
| `termid` | query | yes | `string` | Term ID. |

**Response 200** — Census detail response.

`application/json`:

```ts
{
  identifier?: string;
  items?: Record<string, any>[];
  [key: string]: any;
}
```

Example — example:

```json
{
  "identifier": "scoutid",
  "items": [
    {
      "scoutid": "3100003",
      "firstname": "Sam",
      "lastname": "Lake",
      "joined": "2022-03-01",
      "photo_guid": null,
      "sex": "",
      "ethnicity": "",
      "disabilities": "Edit disabilities",
      "myscout": "Send Parent Portal email",
      "raw_disabilities": [],
      "_filterString": "sam lake"
    }
  ]
}
```

### GET /ext/members/flexirecords/

**Get flexi-records, their structure, or their data**

Flexi-records are section-defined spreadsheets of extra per-member data.

- `getFlexiRecords` — lists the section's flexi-records (`extraid` + `name`).
- `getStructure` — returns a flexi-record's definition. `config` is a
  JSON-encoded string of column definitions (`[{"id":"f_1","name":"…"}]`)
  and `structure` is the Dojo grid layout (a frozen name block, then the
  editable `f_N` columns).
- `getData` — returns one row per member for a term, with each custom
  column under its `f_N` key, plus `total` / `completed` summary columns.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getFlexiRecords" \| "getStructure" \| "getData"` |  |
| `sectionid` | query | yes | `string` | Section ID. |
| `archived` | query | no | `"y" \| "n"` | `getFlexiRecords` — include archived flexi-records. |
| `extraid` | query | no | `string` | Flexi-record ID (required for `getStructure` and `getData`). |
| `termid` | query | no | `string` | Term ID (required for `getData`). |
| `nototal` | query | no | `string` | `getData` — observed sent empty. |

**Response 200** — Flexi-record list, structure, or data.

`application/json`:

```ts
{
  identifier?: string;
  label?: string;
  items?: Record<string, any>[];
  [key: string]: any;
} | Record<string, any>
```

Example — Flexi-record list (action=getFlexiRecords):

```json
{
  "identifier": "extraid",
  "label": "name",
  "items": [
    {
      "extraid": "23001",
      "name": "Hike Log"
    }
  ]
}
```

Example — Flexi-record structure (action=getStructure):

```json
{
  "extraid": "23001",
  "sectionid": "45002",
  "name": "Hike Log",
  "config": "[{\"id\":\"f_1\",\"name\":\"Distance (km)\",\"width\":\"150\"}]",
  "total": "none",
  "extrafields": "[]",
  "archived": "0",
  "soft_deleted": "0",
  "archived_at": null,
  "structure": [
    {
      "rows": [
        {
          "name": "First Name",
          "field": "firstname",
          "width": "150px",
          "formatter": "boldFormatter"
        },
        {
          "name": "Last Name",
          "field": "lastname",
          "width": "150px"
        }
      ],
      "noscroll": true
    },
    {
      "rows": [
        {
          "name": "Distance (km)",
          "field": "f_1",
          "width": "150px",
          "formatter": "boldFormatter",
          "editable": true
        }
      ]
    }
  ]
}
```

Example — Flexi-record data (action=getData):

```json
{
  "identifier": "scoutid",
  "items": [
    {
      "scoutid": "3100001",
      "firstname": "Jamie",
      "lastname": "River",
      "dob": "2015-04-22",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "patrolid": "12001",
      "total": "",
      "completed": "",
      "f_1": "12",
      "age": "10 / 04",
      "patrol": "Blue",
      "_filterString": "jamie river"
    }
  ]
}
```

### POST /ext/audittrail/

**Get audit trail for a member**

Returns the audit trail (change history) for a member. Despite being
a POST, this is a read-only query — the body specifies which member
to look up. The response contains a chronological list of changes
including patrol moves, rank promotions, field edits, and section
additions.

Each entry has a `type` and `code` describing the kind of change:

| type | code | Meaning |
|------|------|---------|
| `members` | `add` | Member added to section |
| `details` | `field` | A member field was edited |
| `details` | `new` | A new detail was added (e.g. consent) |
| `patrols` | `add-to` | Member added to a patrol/six |
| `patrol-leader` | `promoted` | Rank promotion or demotion |

The `summary` field contains HTML with `<strong>` tags highlighting
names, fields, and values.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getAuditTrail"` | Must be `getAuditTrail`. |
| `section_id` | query | yes | `string` | Section ID. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  section_id: string;  // Section ID (repeated in body).
  id: string;  // Member scout ID.
  type: "member";  // Must be `member`.
}
```

Example — example:

```json
{
  "section_id": "45001",
  "id": "3100001",
  "type": "member"
}
```

**Response 200** — Audit trail entries for the member.

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: {
    date?: string;  // Human-readable date (DD/MM/YYYY HH:MM).
    date_raw?: string;  // Raw timestamp (YYYY-MM-DD HH:MM:SS).
    summary?: string;  // HTML summary of the change with `<strong>` highlights.
    verbose?: string;  // Extended details (usually empty).
    type?: "members" | "details" | "patrols" | "patrol-leader";  // Category of change.
    code?: "add" | "field" | "new" | "add-to" | "promoted";  // Specific action within the category.
    hidden?: boolean;
  }[];
  meta?: {
    hidden?: boolean;
    note_types?: string[];  // Available note type filters.
  };
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
      "date": "15/09/2025 19:42",
      "date_raw": "2025-09-15 19:42:10",
      "summary": "<strong>Jamie River</strong> has had their <strong>Consents: Photographs</strong> added as <strong>Yes</strong> by <strong>Alex Scout</strong>",
      "verbose": "",
      "type": "details",
      "code": "new",
      "hidden": false
    },
    {
      "date": "15/09/2025 19:38",
      "date_raw": "2025-09-15 19:38:31",
      "summary": "<strong>Jamie River</strong> is now a <strong>Sixer</strong> in the Blue six in <strong>Cubs</strong> (previously <strong>Seconder</strong>), changed by <strong>Alex Scout</strong>.",
      "verbose": "",
      "type": "patrol-leader",
      "code": "promoted",
      "hidden": false
    },
    "… 3 more"
  ],
  "meta": {
    "hidden": false,
    "note_types": [
      "notes",
      "received-email",
      "… 5 more"
    ]
  }
}
```

### POST /v3/members/contact/{sectionid}/removalWarnings

**Get pre-removal warnings for a member**

Checks whether there are any warnings before removing a member from a
section (e.g. outstanding payments). Call this before `removeMember`
to display confirmation prompts to the user.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  "member_ids[0]": integer;  // Scout ID of the member to check. Additional members can be sent as `member_ids[1]`, `member_ids[2]`, etc.
}
```

Example — example:

```json
{
  "member_ids[0]": 3100005
}
```

**Response 200** — Removal warnings.

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: {
    payments?: boolean;  // Whether the member has outstanding payments.
    [key: string]: any;
  };
  meta?: {
    ok?: boolean;
  };
}
```

Example — example:

```json
{
  "status": true,
  "error": null,
  "data": {
    "payments": false
  },
  "meta": {
    "ok": true
  }
}
```

### GET /v3/members/review/deletion/{sectionid}

**Get deletable members**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |
| `mode` | query | no | `string` | Display mode (observed value `grid`). |
| `section_id` | query | no | `string` | Section ID (alternate naming). |

**Response 200** — Deletable members response.

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: Record<string, any>[];
  meta?: Record<string, any>[];
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
      "firstname": "Pat",
      "lastname": "Stone",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "date_deleted": "2023-10-01",
      "left_section": "2023-07-20",
      "id": 3100004
    }
  ],
  "meta": []
}
```

### GET /v3/members/review/elsewhere/{sectionid}

**Get members who left this section and are elsewhere**

Members who have left this section (`date_left`) but are still active in
other sections, listed with the names of those sections — typically
members who have moved on to the next section.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Members now in other sections.

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
      "id": 3100007,
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "firstname": "Morgan",
      "lastname": "Hill",
      "date_left": "2025-04-11",
      "sections": [
        "1st Riverside Scouts: Scouts"
      ]
    }
  ],
  "meta": []
}
```

### GET /v3/members/review/future_transfers/{sectionid}

**Get scheduled (future) member transfers**

Lists every current member with their scheduled transfer, if any
(`future_transfer` is `null` when none is set), plus `incoming` members
due to transfer into this section.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Current and incoming future transfers.

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
  "data": {
    "current": [
      {
        "id": 3100001,
        "firstname": "Jamie",
        "lastname": "River",
        "photo_guid": "00000000-0000-0000-0000-000000000000",
        "dob": "2015-04-22",
        "future_transfer": {
          "id": 600001,
          "to_section_id": 45004,
          "to_group_name": "1st Riverside Scouts",
          "to_section_name": "1st Riverside Scouts: Scouts",
          "transfer_date": "2025-12-19"
        }
      },
      {
        "id": 3100002,
        "firstname": "Riley",
        "lastname": "Park",
        "photo_guid": "00000000-0000-0000-0000-000000000000",
        "dob": "2016-06-01",
        "future_transfer": null
      }
    ],
    "incoming": []
  },
  "meta": {
    "can_edit": true
  }
}
```

### GET /ext/settings/parents/loginhistory/

**Get Parent Portal login history**

One row per member showing the linked Parent Portal account (if any),
how often it has been used, and password / failed-login recency
(`never`, `over_30_days`, …). `id` is `<member_id>-<user_id>` (the
user part is empty when no account is linked). **Contains parents'
names and email addresses.**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getLoginHistoryMyMember"` |  |
| `section_id` | query | yes | `string` |  |

**Response 200** — Login history.

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
      "member_id": 3100001,
      "first_name": "Jamie",
      "last_name": "River",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "patrol_id": 12001,
      "access_count": 12,
      "date_last_accessed": "2025-05-12 16:27:39",
      "user_id": 200101,
      "access_type": "member",
      "user_full_name": "Morwenna River",
      "user_pic": null,
      "user_email": "parent@example.org",
      "password_last_updated": "over_30_days",
      "id": "3100001-200101",
      "last_failed_login": "never",
      "_filterString": "jamie river morwenna river parent@example.org",
      "show_unlock": false
    },
    {
      "member_id": 3100002,
      "first_name": "Riley",
      "last_name": "Park",
      "photo_guid": null,
      "patrol_id": 12002,
      "access_count": 0,
      "date_last_accessed": "",
      "user_id": 0,
      "access_type": null,
      "user_full_name": null,
      "user_pic": null,
      "user_email": null,
      "password_last_updated": "never",
      "id": "3100002-",
      "last_failed_login": "never",
      "_filterString": "riley park ",
      "show_unlock": false
    }
  ],
  "meta": {
    "itemstore": {
      "identifier": "id"
    }
  }
}
```
