<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Custom Data

Custom data groups and updates.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/customdata/` — Get custom data for a member
- `POST /ext/customdata/` — Update custom data for a member

### GET /ext/customdata/

**Get custom data for a member**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getData"` |  |
| `section_id` | query | yes | `string` | Section ID. |
| `associated_id` | query | yes | `string` | Member ID. |
| `associated_type` | query | yes | `"member"` |  |
| `associated_is_section` | query | no | `string` | Section association flag (observed null). |
| `varname_filter` | query | no | `string` | Filter by variable name (observed null). |
| `context` | query | yes | `"members"` |  |
| `group_order` | query | no | `string` | Group ordering (observed "section"). |

**Response 200** — Custom data groups and columns.

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: {
    group_id?: integer;
    config?: Record<string, any> | null;
    group_type?: string;
    identifier?: string;
    name?: string;
    description?: string;
    description_mymember?: string;
    is_considered_core?: string;
    allow_new_columns?: string;
    display?: string;
    columns?: {
      column_id?: integer;
      type?: string;
      required?: string;
      display_in_advanced_view?: string;
      display_if_empty?: string;
      hide_from_group_display?: string;
      config?: Record<string, any>;
      varname?: string;
      label?: string;
      value?: any | null;
      is_core?: string;
      order?: string;
      force_read_only?: string;
      special_permissions?: string;
      permissions?: string[];
      orig_label?: string;
      [key: string]: any;
    }[];
    custom_order?: integer;
    [key: string]: any;
  }[];
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
      "group_id": 7,
      "group_type": "floating",
      "identifier": "floating",
      "name": "Other",
      "columns": [
        {
          "column_id": 34,
          "type": "select",
          "varname": "gender",
          "label": "Gender",
          "value": "Male"
        }
      ]
    }
  ],
  "meta": {
    "group_name": "1st Riverside Scouts",
    "section_name": "Cubs"
  }
}
```

### POST /ext/customdata/

**Update custom data for a member**

Updates custom data fields on a member. Two `action` values are supported:

- `update` — bulk update using `data[field]=value` pairs (e.g. contact details).
- `updateColumn` — update a single custom data column by `column_id`.

Column IDs are section-specific. The only well-known core column is
`column_id=34` for Gender (values: Male, Female, Self-identify,
Prefer not to say, Other, Unspecified). Other column IDs vary per
section — inspect HTTP traffic to discover them.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"update" \| "updateColumn"` |  |
| `section_id` | query | yes | `string` | Section ID. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  associated_id?: string;  // Member scout ID.
  associated_type?: "member";
  associated_is_section?: string;  // Section association flag (observed `false`).
  group_id?: string;  // Custom data group ID. For `update` action this matches the contact group (1–6). For `updateColumn` this is the custom data group containing the column.
  column_id?: integer;  // Column ID to update (`updateColumn` action only).
  value?: string;  // New value for the column (`updateColumn` action only).
  context?: "members";
  [key: string]: any;
}
```

Example — Bulk update contact details (action=update):

```json
{
  "associated_id": "3100003",
  "associated_type": "member",
  "group_id": "2",
  "context": "members",
  "service": "desktop",
  "data[firstname]": "Hazel",
  "data[lastname]": "Park"
}
```

Example — Update a single custom column (action=updateColumn):

```json
{
  "associated_type": "member",
  "associated_id": "3100005",
  "associated_is_section": "false",
  "group_id": "7",
  "column_id": 34,
  "value": "Male",
  "context": "members"
}
```

**Response 200** — Custom data update response.

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: Record<string, any>;
  meta?: Record<string, any>;
  [key: string]: any;
} | {
  status?: boolean;
  error?: any | null;
  data?: {
    column_id?: integer;
    type?: string;  // Column type (e.g. `select`, `text`).
    required?: "yes" | "no";
    varname?: string;  // Variable name (e.g. `gender`).
    label?: string;  // Human-readable label.
    value?: string;  // The updated value.
    is_core?: "yes" | "no";
    order?: string;
    config?: Record<string, any>;  // Column configuration including options for select fields.
    [key: string]: any;
  };
  meta?: {
    last_updated?: {
      last_updated?: string;
      last_updated_by_name?: string;
    };
  };
  [key: string]: any;
}
```

Example — Bulk update response:

```json
{
  "status": true,
  "error": null,
  "data": {
    "lastname": "Park"
  },
  "meta": {
    "last_updated": {
      "last_updated": "2025-09-12 18:30:45",
      "last_updated_by_name": "Alex Scout"
    },
    "updated": {
      "lastname": "Last Name"
    }
  }
}
```

Example — Column update response:

```json
{
  "status": true,
  "error": null,
  "data": {
    "column_id": 34,
    "type": "select",
    "required": "no",
    "varname": "gender",
    "label": "Gender",
    "value": "Male",
    "is_core": "yes",
    "order": "12"
  },
  "meta": {
    "last_updated": {
      "last_updated": "2025-09-15 19:43:22",
      "last_updated_by_name": "Alex Scout"
    }
  }
}
```
