<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Events

Events, event attendance and payments, Parent Portal settings, and kit lists.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/events/summary/` — List events or the event audit log
- `GET /v3/events/event/{eventId}/basic_details` — Get event basic details
- `GET /v3/events/event/{eventId}/summary` — Get event summary
- `GET /v3/events/event/{eventId}/members/attendance` — Get event attendance
- `GET /v3/events/event/{eventId}/members/payments` — Get event payments
- `GET /v3/events/event/{eventId}/parent_portal` — Get event Parent Portal settings
- `GET /v3/events/event/{eventId}/timetable` — Get event timetable
- `GET /v3/events/event/{eventId}/activities` — Get event "at home" activities
- `GET /v3/kit/{sectionid}/event` — Get kit list items and collections
- `POST /v3/kit/{sectionid}/event/{collectionId}` — Update a kit list collection

### GET /ext/events/summary/

**List events or the event audit log**

- `get` — events for the term with headline attendance counts
  (`yes` = total attending, split into `yes_members` / `yes_yls` /
  `yes_leaders`; plus `no`, `invited`, `reserved`, `shown`). Dates come
  in both UK (`dd/mm/yyyy`) and ISO (`startdate_g`) forms. `cost` is a
  decimal string in pounds.
- `getEvents` — a lightweight list (`eventid`, `name`, `startdate`,
  `attachments`). With `onlyArchived=1`, returns archived events only.
- `getAudit` — recent attendance changes made by parents through the
  Parent Portal (`type=portal`), newest first.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"get" \| "getEvents" \| "getAudit"` |  |
| `sectionid` | query | yes | `string` | Section ID. |
| `termid` | query | no | `string` | Term ID (`get`, `getEvents`). |
| `onlyArchived` | query | no | `"1"` | `getEvents` — only return archived events. |
| `type` | query | no | `"portal"` | `getAudit` — audit source (observed `portal`). |

**Response 200** — Dojo item store of events or audit entries.

`application/json`:

```ts
{
  identifier?: string;
  label?: string;
  items?: Record<string, any>[];
  [key: string]: any;
}
```

Example — Events with attendance counts (action=get):

```json
{
  "identifier": "eventid",
  "items": [
    {
      "eventid": "1700001",
      "name": "Winter Sleepover",
      "date": "06/12/2025",
      "startdate_g": "2025-12-06",
      "startdate": "06/12/2025",
      "enddate": "07/12/2025",
      "starttime": "11:00:00",
      "endtime": "14:00:00",
      "cost": "40.00",
      "location": "Riverside Scout Hut",
      "approval_status": null,
      "rota_offered": 0,
      "rota_accepted": 0,
      "rota_required": null,
      "yes": 18,
      "yes_members": 15,
      "yes_yls": 0,
      "yes_leaders": 3,
      "reserved": 0,
      "no": 2,
      "absent": 0,
      "invited": 4,
      "shown": 0,
      "x": 1
    }
  ]
}
```

Example — Archived events (action=getEvents&onlyArchived=1):

```json
{
  "identifier": "eventid",
  "label": "name",
  "items": [
    {
      "eventid": "1700002",
      "name": "District Camp",
      "startdate": "2024-06-19",
      "attachments": false
    }
  ]
}
```

Example — Parent Portal changes (action=getAudit&type=portal):

```json
{
  "identifier": "auditid",
  "items": [
    {
      "auditid": "50000001",
      "eventid": "1700001",
      "name": "Winter Sleepover",
      "firstname": "Jamie",
      "lastname": "River",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "member_id": "3100001",
      "updatedate": "2025-11-07 13:16:11",
      "date": "07/11/2025 13:16",
      "generic_date": "2025-11-07 13:16:11",
      "updatedby": "Jamie",
      "type": "attendance",
      "desc": "Attendance: Yes"
    }
  ]
}
```

### GET /v3/events/event/{eventId}/basic_details

**Get event basic details**

Name, location, dates/times, cost (number, in **pounds**), and
attendance limit. `meta` reports lock state (`past_locked`,
`shared_locked`) and whether the event is on the Parent Portal.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eventId` | path | yes | `string` | Event ID. |

**Response 200** — Event basic details.

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
    "name": "Winter Sleepover",
    "location": "Riverside Scout Hut",
    "start_date": "2025-12-06",
    "start_time": "11:00:00",
    "end_date": "2025-12-07",
    "end_time": "14:00:00",
    "cost": 40,
    "attendance_limit": 24,
    "attendance_limit_includes_leaders": false,
    "extra": {
      "at_home": {
        "enabled": false,
        "introduction": "",
        "parent_uploads_enabled": false,
        "chat_enabled": false,
        "activities": []
      },
      "sharing": {
        "sharee": false,
        "deleted": false
      }
    },
    "approval_status": null,
    "properties": []
  },
  "meta": {
    "read_only": false,
    "past_locked": false,
    "shared_locked": false,
    "maximum_attendance_limit": 0,
    "has_parent_portal": true
  }
}
```

### GET /v3/events/event/{eventId}/summary

**Get event summary**

The event overview page. `data` holds the attending members, online
payment totals, linked finance totals, "at home" activity counts and
risk-assessment counts. `meta.event` is the full event record including
**every invited member with their date of birth**, payment schedule
(`payment_dates`) and kit list collection — treat as sensitive.

Money units differ within this response: `cost` is in pounds, while
`online_payments.received` / `expected` are also in pounds (expected =
attendees × cost).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eventId` | path | yes | `string` | Event ID. |

**Response 200** — Event summary.

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
    "members": [
      {
        "member_id": 3100001,
        "full_name": "Jamie River",
        "photo_guid": "00000000-0000-0000-0000-000000000000",
        "patrol_id": 12001
      }
    ],
    "reserved": [],
    "sharing": false,
    "online_payments": {
      "received": 40,
      "expected": 720,
      "number_payments": 1
    },
    "transactions": {
      "income": 0,
      "expense": 0
    },
    "at_home": {
      "enabled": false,
      "comments_count": 0,
      "uploads_count": 0,
      "activities_count": 0
    },
    "risk_assessments": {
      "event": 0,
      "activity": 0
    },
    "cost": 40
  },
  "meta": {
    "has_attachments": false,
    "archived": false,
    "isPastEventAndLocked": false,
    "isSharedAndParentPortalSettingsLocked": false,
    "event": {
      "eventid": 1700001,
      "name": "Winter Sleepover",
      "type": null,
      "startdate": "2025-12-06",
      "enddate": "2025-12-07",
      "starttime": "11:00:00",
      "endtime": "14:00:00",
      "cost": 40,
      "location": "Riverside Scout Hut",
      "latitude": "51.5007",
      "longitude": "-0.1246",
      "notes": "",
      "notepad": "",
      "publicnotes": "<h1>Winter Sleepover</h1><p>Bring a sleeping bag.</p>",
      "config": null,
      "sectionid": 45002,
      "kit_list_collection_id": 4401,
      "googlecalendar": null,
      "archived": false,
      "soft_deleted": false,
      "confdate": "2025-11-30",
      "allowchanges": false,
      "disablereminders": false,
      "attendancelimit": 24,
      "limitincludesleaders": false,
      "allowbooking": true,
      "attendancereminder": 0,
      "approval_status": null,
      "created_at": "2025-08-25 20:47:25",
      "created_by": 100001,
      "members": [
        {
          "eventid": 1700001,
          "scoutid": 3100001,
          "attending": "Yes",
          "payment": "Manual",
          "details": null,
          "member": {
            "scoutid": 3100001,
            "firstname": "Jamie",
            "lastname": "River",
            "photo_guid": "00000000-0000-0000-0000-000000000000",
            "dob": "2015-04-22",
            "started": "2021-09-01",
            "created_date": "2021-09-01 18:30:00",
            "last_accessed": "2025-09-15 19:00:00"
          }
        }
      ],
      "payment_dates": [
        {
          "paymentid": 900001,
          "schemeid": 47001,
          "date": "2025-11-19",
          "amount": "40.00",
          "name": "Winter Sleepover",
          "archived": 0,
          "description": null,
          "order_id": null
        }
      ],
      "activities": [],
      "kit_list_collection": {
        "id": 4401,
        "associated_type": "event",
        "section_id": 45002,
        "name": "Sleepovers",
        "instructions": "Please label all kit.",
        "created_at": "2023-09-27 20:59:35",
        "updated_at": "2023-09-27 20:59:35"
      }
    },
    "read_only": false
  }
}
```

### GET /v3/events/event/{eventId}/members/attendance

**Get event attendance**

One row per member in the section with their invitation/attendance
state. `attending` is lowercase (`yes`, `no`, `invited`, or empty for
not invited). `age_at_start` is `years / months`, or `25+` for adults.
`meta.structure` lists any custom event columns.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eventId` | path | yes | `string` | Event ID. |
| `term_id` | query | yes | `string` | Term ID. |

**Response 200** — Event attendance.

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
      "patrol_id": 12001,
      "first_name": "Jamie",
      "last_name": "River",
      "_filterString": "jamie river",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "attending": "yes",
      "emailable": true,
      "details": [],
      "age_at_start": "10 / 07"
    }
  ],
  "meta": {
    "maximum_attendance_limit": 0,
    "has_parent_portal": true,
    "can_set_absent": false,
    "structure": [],
    "rota_accepted": 0,
    "structure_read_only": false,
    "attendance_read_only": false,
    "columns_read_only": false,
    "approval_locked": false,
    "shared_deadline_locked": false,
    "approval_status": null
  }
}
```

### GET /v3/events/event/{eventId}/members/payments

**Get event payments**

Same rows as `members/attendance`, plus `payment` (`manual` or
`automatic`) and `received_income` / `expected_income` in **pounds**.
`meta.structure` lists one read-only column per payment scheme charge
(`field` is `p<paymentid>`).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eventId` | path | yes | `string` | Event ID. |
| `term_id` | query | yes | `string` | Term ID. |

**Response 200** — Event payments.

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
      "patrol_id": 12001,
      "first_name": "Jamie",
      "last_name": "River",
      "_filterString": "jamie river",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "attending": "yes",
      "emailable": true,
      "payment": "automatic",
      "details": [],
      "received_income": 40,
      "expected_income": 40
    }
  ],
  "meta": {
    "maximum_attendance_limit": 0,
    "has_parent_portal": true,
    "can_set_absent": false,
    "structure": [
      {
        "name": "Winter Sleepover",
        "field": "p900001",
        "read_only": true
      }
    ],
    "structure_read_only": false,
    "attendance_read_only": false,
    "columns_read_only": false,
    "approval_locked": false,
    "shared_deadline_locked": false,
    "approval_status": null,
    "has_payments": true
  }
}
```

### GET /v3/events/event/{eventId}/parent_portal

**Get event Parent Portal settings**

Booking settings shown to parents: confirmation deadline, whether
changes/bookings are allowed, reminder settings, the linked kit list
collection, and the map location. `meta.kit_list_collections` lists the
section's collections (name suffixed with the item count).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eventId` | path | yes | `string` | Event ID. |

**Response 200** — Parent Portal settings.

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
    "start_date": "2025-12-06",
    "confirmation_deadline": "2025-11-30",
    "cost": 40,
    "allow_changes_before_deadline": false,
    "allow_booking_when_show_in_portal": true,
    "disable_invitation_reminders": false,
    "send_attendance_reminders": 0,
    "kit_list_collection_id": 4401,
    "latitude": "51.5007",
    "longitude": "-0.1246"
  },
  "meta": {
    "read_only": false,
    "past_locked": false,
    "shared_locked": false,
    "confirmation_deadline_locked": false,
    "has_parent_portal": true,
    "currency": "GBP",
    "kit_list_collections": [
      {
        "id": 4401,
        "name": "Sleepovers (12)"
      }
    ]
  }
}
```

### GET /v3/events/event/{eventId}/timetable

**Get event timetable**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eventId` | path | yes | `string` | Event ID. |

**Response 200** — Event timetable.

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
    "start_date": "2025-12-06",
    "end_date": "2025-12-07",
    "start_time": "11:00:00",
    "end_time": "14:00:00",
    "entries": []
  },
  "meta": {
    "read_only": false,
    "past_locked": false,
    "shared_locked": false,
    "details_locked": false
  }
}
```

### GET /v3/events/event/{eventId}/activities

**Get event "at home" activities**

Activities attached to the event (the "at home" / remote activity
feature). `meta.extra` mirrors the event's `extra` settings.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eventId` | path | yes | `string` | Event ID. |

**Response 200** — Event activities.

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
    "extra": {
      "at_home": {
        "enabled": false,
        "introduction": "",
        "parent_uploads_enabled": false,
        "chat_enabled": false,
        "activities": []
      },
      "sharing": {
        "sharee": false,
        "deleted": false
      }
    }
  }
}
```

### GET /v3/kit/{sectionid}/event

**Get kit list items and collections**

Kit lists ("what to bring") for events. `data` is the catalogue of kit
items (OSM-wide items have `section_id: 0`), grouped by `heading`;
`meta.collections` are the section's named kit lists.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Kit items and collections.

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
      "id": 39,
      "associated_type": "event",
      "section_id": 0,
      "heading": "Activities",
      "name": "Bike",
      "description": "Check brakes and gears work.",
      "purchase_link": "",
      "multiple": false,
      "created_at": "2022-07-05 13:11:40",
      "updated_at": "2022-07-05 13:11:40",
      "collection_items": []
    }
  ],
  "meta": {
    "collections": [
      {
        "id": 4401,
        "associated_type": "event",
        "section_id": 45002,
        "name": "Sleepovers",
        "instructions": "Please label all kit.",
        "created_at": "2023-09-27 20:59:35",
        "updated_at": "2023-09-27 20:59:35"
      }
    ]
  }
}
```

### POST /v3/kit/{sectionid}/event/{collectionId}

**Update a kit list collection**

Saves a kit list collection. `items` is a JSON array of
`{"item_id": <kit item id>, "quantity": <n>}` and **replaces** the
collection's contents.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |
| `collectionId` | path | yes | `string` | Kit list collection ID. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  name?: string;
  instructions?: string;
  items?: string;  // JSON array of `{item_id, quantity}`.
}
```

Example — example:

```json
{
  "name": "Sleepovers",
  "instructions": "Please label all kit.",
  "items": "[{\"item_id\":39,\"quantity\":1},{\"item_id\":40,\"quantity\":1}]"
}
```

**Response 200** — Collection saved.

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
