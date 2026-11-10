<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — User

Session keep-alive, per-user preferences, and notifications.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `POST /ext/users/auth/` — Session keep-alive ping
- `GET /ext/users/notifications/` — Get user notifications
- `POST /ext/users/notifications/` — Dismiss a notification
- `POST /ext/settings/accountpreferences/` — Set the user's default section
- `GET /v3/menu-preferences/{sectionid}` — Get menu preferences
- `GET /v3/favourites/{sectionid}` — Get favourites

### POST /ext/users/auth/

**Session keep-alive ping**

Polled by the web app to keep the session alive and detect inactivity.
`inactive` appears to be the number of seconds since the user's last
interaction.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"ping"` |  |
| `user_id` | query | yes | `string` |  |

**Response 200** — Ping result.

`application/json`:

```ts
{
  inactive?: integer;
}
```

Example — example:

```json
{
  "inactive": 34
}
```

### GET /ext/users/notifications/

**Get user notifications**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"get"` |  |
| `section_id` | query | yes | `string` |  |

**Response 200** — Notifications.

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
      "level": 2,
      "name": "SetRetentionSettings",
      "title": "Review your data retention settings",
      "hide_dismiss": false,
      "dismiss": "SetRetentionSettings-45001-0a1b2c3d4e5f60718293a4b5c6d7e8f9",
      "dismiss_expires": "2026-11-17",
      "view_component": false,
      "view_function": false,
      "view_args": [],
      "view_constructor_args": {},
      "use_slider": false,
      "video": false,
      "image": false,
      "data": [
        "Set how long OSM keeps data about members who have left."
      ],
      "skip_if_dialogs_shown": false,
      "actions": [
        {
          "label": "Open settings",
          "component": "settings",
          "view_function": "open",
          "arguments": [
            "retention"
          ],
          "dismiss": "2026-11-17",
          "colour": "blue",
          "icon": "cog",
          "size": "small"
        }
      ]
    }
  ],
  "meta": []
}
```

### POST /ext/users/notifications/

**Dismiss a notification**

Hides a notification until `expires`. `item` is the notification's
`dismiss` key from the GET response
(`<NotificationName>-<sectionId>-<hash>`). The response returns the
remaining `notifications`.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"dismiss"` |  |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  section_id: string;
  item: string;  // The notification's `dismiss` key.
  expires?: string /* date */;  // Date until which the notification stays hidden (observed one week ahead).
}
```

Example — example:

```json
{
  "section_id": "45001",
  "item": "SetRetentionSettings-45001-0a1b2c3d4e5f60718293a4b5c6d7e8f9",
  "expires": "2026-11-17"
}
```

**Response 200** — Notification dismissed.

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
    "hidden": true,
    "notifications": []
  },
  "meta": []
}
```

### POST /ext/settings/accountpreferences/

**Set the user's default section**

Sets which section opens by default after login (the `isDefault` flag in startup `roles`). No request body — everything is in the query string.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"updateDefaultSection"` |  |
| `section_id` | query | yes | `string` |  |
| `section` | query | yes | `string` | Section type. |

**Response 200** — Default section updated.

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

### GET /v3/menu-preferences/{sectionid}

**Get menu preferences**

The user's customised navigation menu for the section (`hidden` items and custom `order`).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Menu preferences.

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
    "hidden": [],
    "order": {}
  },
  "meta": []
}
```

### GET /v3/favourites/{sectionid}

**Get favourites**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |
| `term_id` | query | no | `string` |  |

**Response 200** — The user's favourited items.

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
    "items": []
  },
  "meta": []
}
```
