<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Programme

Programme summaries, meetings, and attachments.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/programme/` — Programme endpoints
- `POST /ext/programme/` — Update programme meeting parts
- `GET /ext/programme/activities/` — Activity library
- `GET /v3/programme/{eveningId}/bookings` — Get meeting with parent bookings
- `GET /v3/todo/projects/{sectionId}` — List to-do projects
- `GET /v3/todo/tasks/meeting/{eveningId}` — Get to-do tasks for a meeting
- `GET /ext/recipes/` — List recipes

### GET /ext/programme/

**Programme endpoints**

Programme endpoints share this path with different `action` values.
Use `getProgrammeSummary` for term overview, `getProgramme` for details,
`getMembersForParentRota` for parent rota members, or
`programmeAttachmentsManifest` for attachment metadata.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getProgrammeSummary" \| "getProgramme" \| "programmeAttachmentsManifest" \| "getMembersForParentRota"` |  |
| `sectionid` | query | no | `string` | Section ID. |
| `termid` | query | no | `string` | Term ID. |
| `eveningid` | query | no | `string` | Meeting ID. |
| `section_id` | query | no | `string` | Section ID. |
| `id` | query | no | `string` | Meeting ID. |
| `evening_id` | query | no | `string` | Meeting ID. |
| `verbose` | query | no | `string` | Set to `1` to add `badges` and `unavailable_leaders` to each summary item. |
| `path` | query | no | `string` | `programmeAttachmentsManifest` — directory within the manifest (observed `/`). |
| `temp` | query | no | `string` | `programmeAttachmentsManifest` — include uncommitted uploads (observed `false`). |
| `upload_mode` | query | no | `string` | `programmeAttachmentsManifest` — observed `programme`. |

**Response 200** — Programme response.

`application/json`:

```ts
{
  items?: Record<string, any>[];
  [key: string]: any;
} | {
  items?: {
    eveningid?: string;  // Meeting ID.
    sectionid?: string;
    title?: string;
    notesforparents?: string;  // Notes shown to parents in the parent portal.
    notesforhelpingparents?: string | null;  // Notes for parents on the helper rota.
    parentsrequired?: string;  // Number of parent helpers needed, as a string.
    prenotes?: string;  // Leader notes for the start of the meeting.
    games?: string;  // Leader notes for games.
    postnotes?: string;  // Leader notes for the end of the meeting.
    leaders?: string;  // Free text, typically the leaders running the meeting.
    meetingdate?: string /* date */;
    starttime?: string;
    endtime?: string;
    primary_leader_id?: string;  // ID of the leader in charge.
    config?: {
      has_badges?: boolean;
      [key: string]: any;
    };
    soft_deleted?: string;  // "1" if the meeting has been deleted.
    help?: Record<string, any>[];  // Parent helpers. Items include `scoutid` and `scout` (full name).
    unavailableleaders?: Record<string, any>[];
    activities?: Record<string, any>[];
    badgelinks?: Record<string, any>[];  // Empty array when there are no links (PHP empty map).
    seasonal_suggestions?: Record<string, any>[];  // Activity ideas from OSM's shared activity library.
    [key: string]: any;
  }[];
  [key: string]: any;
} | {
  status?: boolean;
  error?: any | null;
  data?: Record<string, any>[];
  meta?: Record<string, any>[];
  [key: string]: any;
} | {
  status?: boolean;
  error?: string | null;
  data?: {
    manifest?: any[] | Record<string, {
      upload_id?: integer;
      path?: string;
      directory?: string;
      name?: string;
      mime?: string;
      extension?: string;
      bytes?: integer;
      size?: string;
      date_uploaded?: string;
      preview?: string;
      [key: string]: any;
    }>;
    config?: {
      endpoints?: Record<string, any>;
      allowed_extensions?: string[];
      allowed_mime?: string[];
      max_file_size?: integer | null;
      single_file_size_limit?: integer | null;
      max_files?: any;  // Integer limit, `null`, or `false` when unlimited.
      chunked_uploads?: boolean;
      [key: string]: any;
    };
  };
  meta?: Record<string, any>;
  [key: string]: any;
}
```

Example — Programme summary:

```json
{
  "items": [
    {
      "eveningid": "9500001",
      "title": "Camp Skills Night",
      "parentsrequired": "1",
      "meetingdate": "2024-11-01",
      "parentsattendingcount": "0",
      "primary_leader": false
    }
  ]
}
```

Example — Programme summary with verbose=1:

```json
{
  "items": [
    {
      "eveningid": "9500001",
      "title": "Camp Skills Night",
      "parentsrequired": "0",
      "meetingdate": "2024-11-01",
      "location": null,
      "parentsattendingcount": "0",
      "primary_leader": false,
      "badges": [
        {
          "name": "Teamwork",
          "img": "sites/onlinescoutmanager.co.uk/badge_images/img_000000.png"
        }
      ],
      "unavailable_leaders": 0
    }
  ]
}
```

Example — Programme details (getProgramme with sectionid, termid and eveningid):

```json
{
  "items": [
    {
      "eveningid": "9500001",
      "sectionid": "45001",
      "title": "Camp Skills Night",
      "notesforparents": "Bring a warm coat.",
      "notesforhelpingparents": null,
      "parentsrequired": "1",
      "games": "",
      "prenotes": "",
      "postnotes": "",
      "leaders": "",
      "meetingdate": "2024-11-01",
      "starttime": "18:00:00",
      "endtime": "19:30:00",
      "primary_leader_id": "0",
      "config": {
        "has_badges": true,
        "badges_updated_at": [
          {
            "user_id": 100001,
            "date_time": "2024-10-25 19:56:16"
          }
        ]
      },
      "soft_deleted": "0",
      "latitude": null,
      "longitude": null,
      "location": null,
      "help": [
        {
          "scoutid": "3100005",
          "scout": "Quinn Wood"
        }
      ],
      "unavailableleaders": [],
      "activities": [],
      "badgelinks": [
        {
          "picture": "sites/onlinescoutmanager.co.uk/badge_images/img_000000.png",
          "link_relation_id": "40000001",
          "badge_id": "1001",
          "badge_version": "0",
          "column_id": "200001",
          "badge": "1001_0",
          "badgeLongName": "Teamwork",
          "badgetype": "challenge",
          "badgetypeLongName": "Challenge",
          "columnname": "200001",
          "columnnameLongName": "B: Examples = Camp Skills Night",
          "data": "Camp Skills Night",
          "section": "cubs",
          "same_as": [],
          "sectionLongName": "Cubs",
          "label": "Challenge: Teamwork - Examples"
        }
      ],
      "seasonal_suggestions": [
        {
          "activityid": "10",
          "title": "Team Building",
          "description": "Various team building activities.",
          "runningtime": "60",
          "location": "indoors",
          "shared": "2",
          "visibility": "all",
          "site_type": "scouts",
          "rating": 86,
          "icons": [
            "popular",
            "runningtime-60"
          ],
          "tags": [
            "team building"
          ],
          "review_summary": {
            "writeup": {
              "rating": 4.5,
              "number_reviews": 3
            },
            "activity": {
              "rating": 4.5,
              "number_reviews": 120
            }
          }
        }
      ]
    }
  ],
  "badgelinks": {}
}
```

Example — Parent rota members:

```json
{
  "status": true,
  "error": null,
  "data": [
    {
      "scoutid": "3100010",
      "firstname": "Robert",
      "lastname": "Baden Powell",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "patrol_id": -2
    }
  ],
  "meta": []
}
```

### POST /ext/programme/

**Update programme meeting parts**

Fields left out of `parts` are unchanged. Unlike `getProgramme`, the
response is a flat object with no `items` wrapper or `status`.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"editEveningParts"` |  |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  sectionid: string;
  eveningid: string;
  parts: string;  // JSON-encoded object of `ProgrammeMeeting` fields to change. Observed: `title`, `prenotes`, `games`, `postnotes`, `notesforparents`.
  [key: string]: any;
}
```

Example — Rename a meeting:

```json
{
  "sectionid": "12345",
  "eveningid": "9464403",
  "parts": "{\"title\":\"Astronomy Night 2\"}"
}
```

Example — Clear the notes for parents:

```json
{
  "sectionid": "12345",
  "eveningid": "9464403",
  "parts": "{\"notesforparents\":\"\"}"
}
```

**Response 200** — The full meeting after the update.

`application/json`:

```ts
{
  eveningid?: string;  // Meeting ID.
  sectionid?: string;
  title?: string;
  notesforparents?: string;  // Notes shown to parents in the parent portal.
  notesforhelpingparents?: string | null;  // Notes for parents on the helper rota.
  parentsrequired?: string;  // Number of parent helpers needed, as a string.
  prenotes?: string;  // Leader notes for the start of the meeting.
  games?: string;  // Leader notes for games.
  postnotes?: string;  // Leader notes for the end of the meeting.
  leaders?: string;  // Free text, typically the leaders running the meeting.
  meetingdate?: string /* date */;
  starttime?: string;
  endtime?: string;
  primary_leader_id?: string;  // ID of the leader in charge.
  config?: {
    has_badges?: boolean;
    [key: string]: any;
  };
  soft_deleted?: string;  // "1" if the meeting has been deleted.
  help?: Record<string, any>[];  // Parent helpers. Items include `scoutid` and `scout` (full name).
  unavailableleaders?: Record<string, any>[];
  activities?: Record<string, any>[];
  badgelinks?: Record<string, any>[];  // Empty array when there are no links (PHP empty map).
  seasonal_suggestions?: Record<string, any>[];  // Activity ideas from OSM's shared activity library.
  [key: string]: any;
}
```

Example — example:

```json
{
  "eveningid": "9464403",
  "sectionid": "12345",
  "title": "Astronomy Night",
  "notesforparents": "Bring a torch.",
  "notesforhelpingparents": null,
  "parentsrequired": "0",
  "games": "Stars and planets tag",
  "prenotes": "Set up the telescope before the meeting.",
  "postnotes": "",
  "leaders": "",
  "meetingdate": "2025-01-21",
  "starttime": "17:30:00",
  "endtime": "18:45:00",
  "primary_leader_id": "1000001",
  "config": {
    "has_badges": false
  },
  "soft_deleted": "0",
  "help": [],
  "unavailableleaders": [],
  "activities": [],
  "badgelinks": [],
  "seasonal_suggestions": [
    {
      "activityid": "10",
      "title": "Team Building",
      "description": "Various team building activities."
    }
  ]
}
```

### GET /ext/programme/activities/

**Activity library**

OSM's shared activity library.

- `getActivity` — one activity (`id` + `version`) with its full
  details, attached `files`, available `versions`, suitable `sections`,
  and whether the current user owns it.
- `searchByNewActivities` — the newest shared activities (up to 100
  `items`; `num` is the total, `query` echoes `newest activities`).
- `getTags` — every activity tag in use OSM-wide (a very large list —
  over ten thousand entries).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getActivity" \| "searchByNewActivities" \| "getTags"` |  |
| `id` | query | no | `string` | Activity ID (`getActivity`). |
| `version` | query | no | `string` | Activity version (`getActivity`). |
| `activity_unique_id` | query | no | `string` | `getActivity` — observed `0`. |
| `section` | query | no | `string` | Section type. |
| `sectionid` | query | no | `string` | Section ID (`getActivity`). |
| `section_id` | query | no | `string` | Section ID (`searchByNewActivities`). |

**Response 200** — Activity, search results, or tags.

`application/json`:

```ts
Record<string, any>
```

Example — One activity (action=getActivity):

```json
{
  "details": {
    "id": "500001",
    "activityid": "50001",
    "version": "0",
    "userid": "100002",
    "site_type": "scouts",
    "user_name": "Sam Example",
    "title": "Knot Relay",
    "description": "Teams race to tie a set of knots.",
    "resources": "Rope lengths",
    "instructions": "Split into teams…",
    "runningtime": "15",
    "location": "both",
    "shared": "2",
    "visibility": "all",
    "rating": 5,
    "updated_at": "2025-10-08 21:27:17",
    "generic": "0",
    "created_at": "2025-10-08 21:27:17",
    "updatetime": "2025-10-08 21:27:17",
    "icons": [
      "runningtime-15",
      "inandoutdoors"
    ],
    "tags": [],
    "review_summary": {
      "writeup": {
        "rating": 0,
        "number_reviews": 0
      },
      "activity": {
        "rating": 0,
        "number_reviews": 0
      }
    }
  },
  "files": [
    {
      "fileid": 600001,
      "activityid": "50001",
      "filename": "knot-relay.pdf",
      "type": "application/pdf",
      "icon": "page_white_acrobat",
      "preview": "/ext/programme/activities/attachments/files/?action=preview&…",
      "from": "uploads",
      "name": "knot-relay.pdf"
    }
  ],
  "thumb": false,
  "rating": 5,
  "used": 0,
  "similar": [],
  "sections": [
    "beavers",
    "cubs",
    "… 2 more"
  ],
  "versions": [
    {
      "value": "0",
      "user_name": "Sam Example",
      "updatetime": "2025-10-08 21:27:17",
      "selected": true,
      "current": true
    }
  ],
  "tags": [],
  "is_owner": false,
  "can_delete": false
}
```

Example — Newest activities (action=searchByNewActivities):

```json
{
  "items": [
    {
      "activityid": "50001",
      "title": "Knot Relay",
      "description": "Teams race to tie a set of knots.",
      "runningtime": "15",
      "location": "both",
      "shared": "2",
      "visibility": "all",
      "site_type": "scouts",
      "rating": 5,
      "icons": [
        "runningtime-15",
        "inandoutdoors"
      ],
      "tags": [],
      "review_summary": {
        "writeup": {
          "rating": 0,
          "number_reviews": 0
        },
        "activity": {
          "rating": 0,
          "number_reviews": 0
        }
      }
    }
  ],
  "num": 1,
  "query": "newest activities"
}
```

Example — All activity tags (action=getTags):

```json
{
  "identifier": "name",
  "label": "name",
  "items": [
    {
      "name": "camp"
    },
    {
      "name": "knots"
    }
  ]
}
```

### GET /v3/programme/{eveningId}/bookings

**Get meeting with parent bookings**

The meeting record (same fields as `getProgramme`, numeric types) plus `bookings` for parent helper slots.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eveningId` | path | yes | `string` | Meeting ID. |

**Response 200** — Meeting with bookings.

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
    "eveningid": 9500001,
    "sectionid": 45002,
    "title": "Camp Skills Night",
    "notesforparents": "Bring a warm coat.",
    "notesforhelpingparents": null,
    "parentsrequired": 0,
    "games": "",
    "prenotes": "",
    "postnotes": "",
    "leaders": "",
    "meetingdate": "2024-11-01",
    "starttime": "18:00:00",
    "endtime": "19:30:00",
    "primary_leader_id": 0,
    "config": {
      "has_badges": true
    },
    "googlecalendar": null,
    "soft_deleted": 0,
    "latitude": null,
    "longitude": null,
    "location": null,
    "bookings": []
  },
  "meta": []
}
```

### GET /v3/todo/projects/{sectionId}

**List to-do projects**

To-do projects (groups of tasks) for the section. Only an empty list
has been observed, so the item shape is unknown.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionId` | path | yes | `string` | Section ID. |

**Response 200** — Projects.

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

### GET /v3/todo/tasks/meeting/{eveningId}

**Get to-do tasks for a meeting**

Tasks attached to a meeting. `meta.users` maps user IDs to the leaders tasks can be assigned to.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eveningId` | path | yes | `string` | Meeting ID. |
| `section_id` | query | yes | `string` |  |

**Response 200** — Tasks.

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
    "can_read": true,
    "can_edit": true,
    "users": {
      "100001": {
        "name": "Alex Scout",
        "photo_url": null,
        "user_id": 100001
      }
    }
  }
}
```

### GET /ext/recipes/

**List recipes**

The recipe database (OSM-wide and the section's own). Each recipe has
meal/cooking-method tags, a `suitability` map of dietary flags (`true`
= suitable for that diet / free from that allergen), and an estimated
`my_cost_per_person` in pounds.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getRecipes"` |  |
| `section_id` | query | yes | `string` |  |

**Response 200** — Recipes.

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
      "recipe_id": 5,
      "title": "Campfire Bananas",
      "description": "Easy dessert cooked in foil.",
      "cache": {
        "tags": {
          "meals": [
            "pudding"
          ],
          "cooking_methods": [
            "campfire"
          ]
        },
        "suitability": {
          "vegetarian": true,
          "vegan": false,
          "gluten": true,
          "dairy": false,
          "nuts": true,
          "wheat": true,
          "fish": true,
          "shellfish": true,
          "egg": true,
          "soya": true,
          "oatmeal": true
        }
      },
      "cooking_time": "20",
      "image_lastupdated": null,
      "last_updated": "2025-10-10 14:07:03",
      "image": "upload",
      "original_recipe_id": "0",
      "tags": [
        "pudding",
        "campfire"
      ],
      "image_url": "/ext/recipes/thumbnails/?recipe_id=5",
      "review_summary": {
        "recipe": {
          "rating": 0,
          "number_reviews": 0
        }
      },
      "my_cost_per_person": 0.35
    }
  ],
  "meta": []
}
```
