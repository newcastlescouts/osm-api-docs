<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Badges

Badge-related programme metadata.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/badges/records/` — Get badge records or available badges
- `GET /ext/badges/badgesbyperson/` — Load badges grouped by member
- `GET /ext/programme/clouds/` — Get badge tag cloud

### GET /ext/badges/records/

**Get badge records or available badges**

Returns badge data. The `action` parameter controls the behavior:
- `getBadgeRecords` — returns per-member completion records for a specific badge.
- `getAvailableBadges` — returns the list of badges available for a section and type.
  When called with `asNumericArray=y&liveOnly=y&addGroupToName=y` (as the
  attendance register does), the response is a Dojo item store
  (`identifier` / `label` / `items`) containing every live badge for the
  section across all types, and `type_id` / `term_id` are not needed.
  Either `sectionid` or `section_id` is accepted.
- `getColumnsForBadge` — returns the requirement columns (the individual
  criteria, grouped into lettered modules) for one badge version.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getBadgeRecords" \| "getAvailableBadges" \| "getColumnsForBadge"` |  |
| `section` | query | yes | `"squirrels" \| "beavers" \| "cubs" \| "scouts" \| "explorers"` | Section type. |
| `section_id` | query | no | `string` | Section ID (used with `getAvailableBadges`). |
| `sectionid` | query | no | `string` | Section ID (alternate naming, used with some actions). |
| `term_id` | query | no | `string` | Term ID (not sent by the item-store form of `getAvailableBadges`). |
| `type_id` | query | no | `"1" \| "2" \| "3" \| "4"` | Badge type ID. 1 = Challenge, 2 = Activity, 3 = Staged, 4 = Core. Not sent by the item-store form of `getAvailableBadges`. |
| `asNumericArray` | query | no | `"y"` | `getAvailableBadges` — return `items` as a flat array. |
| `liveOnly` | query | no | `"y"` | `getAvailableBadges` — only include current (live) badge versions. |
| `addGroupToName` | query | no | `"y"` | `getAvailableBadges` — prefix `name` with the badge group where one is set. |
| `noHidden` | query | no | `"y"` | `getColumnsForBadge` — exclude hidden columns. |
| `editable` | query | no | `"y"` | `getColumnsForBadge` — only include columns that can be edited. |
| `badge_id` | query | no | `string` | Badge ID (required for `getBadgeRecords` and `getColumnsForBadge`). |
| `badge_version` | query | no | `string` | Badge version (required for `getBadgeRecords` and `getColumnsForBadge`). |
| `payload` | query | no | `"1"` | Include full payload (observed value `1`). |
| `context` | query | no | `"none"` | Context (observed value `none` for `getAvailableBadges`). |
| `member_id` | query | no | `string` | Member ID filter (observed value `0` for all members). |

**Response 200** — Badge records or available badges.

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: Record<string, any>[];
  meta?: Record<string, any>[];
  [key: string]: any;
} | {
  identifier?: string;
  label?: string;
  items?: Record<string, any>[];
  [key: string]: any;
}
```

Example — Available badges (asNumericArray=y&liveOnly=y&addGroupToName=y):

```json
{
  "identifier": "badge_identifier",
  "label": "name",
  "items": [
    {
      "badge_id": "1001",
      "badge_version": "0",
      "shortname": "1001",
      "badge_identifier": "1001_0",
      "name": "Teamwork",
      "picture": "sites/onlinescoutmanager.co.uk/badge_images/img_000000.png",
      "description": "Work as part of a team on a range of activities.",
      "parents_description": "",
      "config": "{\"requires\":[[\"a\"],[\"b\"]]}",
      "portal_config": "{\"always_show_in_list\":false}",
      "userid": "1",
      "sharing": "default-locked",
      "latest": "0",
      "badge_order": "0",
      "group_name": "",
      "created_at": "2015-01-27 10:00:00",
      "lastupdated": "2025-01-01 10:00:00",
      "type_id": "1",
      "badge_id_version": "1001_0"
    }
  ]
}
```

Example — Requirement columns for a badge (action=getColumnsForBadge):

```json
{
  "identifier": "column_id",
  "label": "label",
  "items": [
    {
      "label": "Team game",
      "description": "Take part in a team game.",
      "column_id": "200001",
      "field_type": "text",
      "points": "0",
      "module_id": "3001",
      "module_letter": "a",
      "custom_columns": "0",
      "section_id": "0",
      "sameas_column_id": "0",
      "same_as": [],
      "custom": false
    }
  ]
}
```

Example — Available badges list:

```json
{
  "status": true,
  "error": null,
  "data": [
    {
      "badge_id": 1001,
      "badge_version": 0,
      "name": "Teamwork",
      "picture": "badges/teamwork.png",
      "type_id": 1,
      "config": "{}",
      "has_stock": false
    }
  ],
  "meta": []
}
```

Example — Badge records for a specific badge:

```json
{
  "status": true,
  "error": null,
  "data": [
    {
      "scoutid": 3100001,
      "firstname": "Jamie",
      "lastname": "River",
      "completed": "1",
      "awarded": "1",
      "status": 1
    }
  ],
  "meta": []
}
```

### GET /ext/badges/badgesbyperson/

**Load badges grouped by member**

Returns badge progress grouped by member. Each member entry includes
an array of their badge statuses across all badge types.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"loadBadgesByMember"` | Must be `loadBadgesByMember`. |
| `section` | query | yes | `"squirrels" \| "beavers" \| "cubs" \| "scouts" \| "explorers"` | Section type. |
| `sectionid` | query | yes | `string` | Section ID. |
| `term_id` | query | yes | `string` | Term ID. |

**Response 200** — Badges by member.

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: {
    scoutid?: integer;
    firstname?: string;
    lastname?: string;
    patrol?: string;
    active?: boolean;
    badges?: {
      badge_id?: integer;
      badge_version?: integer;
      completed?: string;
      awarded?: string;
      status?: number;
      [key: string]: any;
    }[];
    [key: string]: any;
  }[];
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
      "scoutid": 3100001,
      "firstname": "Jamie",
      "lastname": "River",
      "patrol": "Blue",
      "active": true,
      "badges": [
        {
          "badge_id": 1001,
          "badge_version": 0,
          "completed": "1",
          "awarded": "1",
          "status": 1
        }
      ]
    }
  ],
  "meta": []
}
```

### GET /ext/programme/clouds/

**Get badge tag cloud**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getBadgeTagCloud"` |  |
| `sectionid` | query | yes | `string` | Section ID. |
| `termid` | query | yes | `string` | Term ID. |
| `section` | query | yes | `"squirrels" \| "beavers" \| "cubs" \| "scouts" \| "explorers"` | Section type. |

**Response 200** — Badge tag cloud response.

`application/json`:

```ts
{
  tags?: Record<string, integer>;
  tag_count?: integer;
  badges?: Record<string, integer>;
  [key: string]: any;
}
```

Example — example:

```json
{
  "tags": {
    "community": 1
  },
  "tag_count": 1,
  "badges": {
    "sites/onlinescoutmanager.co.uk/badge_images/img_000000.png": 1
  }
}
```
