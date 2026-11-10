<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Email

Member contact email selection and templates.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/members/email/` — Get selected contact emails, or the email attachments manifest
- `POST /ext/members/email/` — Resolve recipient emails or send an email
- `GET /ext/settings/emails/` — Get email configuration or delivery reports for a section
- `GET /ext/members/email/campaigns/` — List email campaign templates
- `GET /v3/members/email/campaigns/snippets/{campaignId}` — Get a campaign's content snippets
- `GET /v3/members/email/compose/{sectionid}` — Get members for the email composer
- `GET /v3/members/email/draft/{sectionid}` — List draft emails
- `POST /v3/members/email/draft` — Save a draft email
- `GET /ext/members/sms/` — Get SMS delivery report

### GET /ext/members/email/

**Get selected contact emails, or the email attachments manifest**

- `getSelectedEmailsFromContacts` — resolves the email addresses for every
  member in the section using their default contact groups. The web UI
  now sends this as a **POST** with an explicit member list (see below);
  the GET form is kept here as previously observed.
- `emailerAttachmentsManifest` — returns the attachment manifest for an
  email being composed. The `guid` / `id` identify the draft (the same
  GUID later sent to `sendTemplate` and `/v3/members/email/draft`). See
  [File manifests](#tag/Files) for the response shape.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getSelectedEmailsFromContacts" \| "emailerAttachmentsManifest"` |  |
| `sectionid` | query | no | `string` | Section ID (`getSelectedEmailsFromContacts`). |
| `section_id` | query | no | `string` | Section ID (`emailerAttachmentsManifest`). |
| `id` | query | no | `string /* uuid */` | Draft email GUID (`emailerAttachmentsManifest`). |
| `guid` | query | no | `string /* uuid */` | Draft email GUID — same value as `id` (`emailerAttachmentsManifest`). |
| `path` | query | no | `string` | Directory within the manifest (observed `/`). |
| `temp` | query | no | `"true" \| "false"` | Include uncommitted (temporary) uploads. |

**Response 200** — Selected emails for contacts, or a file manifest.

`application/json`:

```ts
{
  emails?: Record<string, {
    emails?: string[];
    firstname?: string;
    lastname?: string;
    photo_guid?: string;
    member_id?: integer;
    [key: string]: any;
  }>;
  count?: integer;
  blocks?: Record<string, any>[];
  daily_limit_reached?: boolean;
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

Example — example:

```json
{
  "emails": {
    "3100001": {
      "emails": [
        "parent@example.org",
        "guardian@example.org"
      ],
      "firstname": "Jamie",
      "lastname": "River",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "member_id": 3100001
    }
  },
  "count": 2,
  "blocks": [],
  "daily_limit_reached": false
}
```

### POST /ext/members/email/

**Resolve recipient emails or send an email**

Two `action` values share this POST endpoint:

**`getSelectedEmailsFromContacts`** (`sectionid` in the query string) —
resolves the addresses for a chosen set of members and contact groups.
Body fields:

| Field | Format | Notes |
|-------|--------|-------|
| `scouts` | comma-separated member IDs | e.g. `3100001,3100002` |
| `contactGroups` | JSON array of contact group identifiers | e.g. `["contact_primary_1","contact_primary_2","contact_primary_member"]` |

The response is the same shape as the GET form (keyed by member ID).
`count` is the number of addresses, not members.

**`sendTemplate`** — sends (or schedules) an email. `emails` is the JSON
object returned by `getSelectedEmailsFromContacts` (optionally with an
`order` per member); `edits` is a JSON object of template regions
`{ regionId: { blockIndex: { "text": "<html>" } } }`. For a plain email
the region ID is `"0"`; when a campaign template is used, the region IDs
are the campaign's `snippet_id`s (see
`/v3/members/email/campaigns/snippets/{campaignId}`).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getSelectedEmailsFromContacts" \| "sendTemplate"` |  |
| `sectionid` | query | no | `string` | Section ID (required for `getSelectedEmailsFromContacts`). |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  scouts?: string;  // `getSelectedEmailsFromContacts` — comma-separated member IDs.
  contactGroups?: string;  // `getSelectedEmailsFromContacts` — JSON array of contact group identifiers.
  subject?: string;  // `sendTemplate` — email subject.
  from?: string;  // `sendTemplate` — sender, formatted `Display Name <address>`.
  cc?: string;  // `sendTemplate` — CC addresses (may be empty).
  save_email_from?: "true" | "false";  // `sendTemplate` — remember `from` as the default sender.
  emails?: string;  // `sendTemplate` — JSON object of recipients keyed by member ID.
  edits?: string;  // `sendTemplate` — JSON object of template region content.
  sectionid?: string;  // `sendTemplate` — section ID.
  current_section_id?: string;  // `sendTemplate` — section the user is currently viewing.
  campaign_id?: string;  // `sendTemplate` — campaign template ID, or `0` for a plain email.
  email_session_key?: string;  // `sendTemplate` — observed `blank`.
  guid?: string /* uuid */;  // `sendTemplate` — draft GUID (ties attachments to the email).
  draft_email_id?: string;  // `sendTemplate` — ID returned by `POST /v3/members/email/draft`.
  scheduled_email_id?: string;  // `sendTemplate` — scheduled email being sent, or `0`.
  [key: string]: any;
}
```

Example — Resolve recipient emails (action=getSelectedEmailsFromContacts):

```json
{
  "scouts": "3100001,3100002",
  "contactGroups": "[\"contact_primary_1\",\"contact_primary_2\",\"contact_primary_member\"]"
}
```

Example — Send an email (action=sendTemplate):

```json
{
  "cc": "",
  "from": "1st Riverside Cubs <cubs@example.org>",
  "save_email_from": "false",
  "subject": "Weekly Meeting Reminder",
  "emails": "{\"3100001\":{\"firstname\":\"Jamie\",\"lastname\":\"River\",\"member_id\":3100001,\"order\":0,\"photo_guid\":\"00000000-0000-0000-0000-000000000000\",\"emails\":[\"parent@example.org\"]}}",
  "edits": "{\"0\":{\"0\":{\"text\":\"<p>Don't forget to bring your swimming kit this week!</p>\"}}}",
  "sectionid": "45002",
  "current_section_id": "45002",
  "campaign_id": "0",
  "email_session_key": "blank",
  "guid": "00000000-0000-0000-0000-000000000001",
  "draft_email_id": "80000001",
  "scheduled_email_id": "0"
}
```

**Response 200** — Selected emails (`getSelectedEmailsFromContacts`) or send confirmation (`sendTemplate`).

`application/json`:

```ts
{
  emails?: Record<string, {
    emails?: string[];
    firstname?: string;
    lastname?: string;
    photo_guid?: string;
    member_id?: integer;
    [key: string]: any;
  }>;
  count?: integer;
  blocks?: Record<string, any>[];
  daily_limit_reached?: boolean;
  [key: string]: any;
} | {
  ok: boolean;
  [key: string]: any;
}
```

Example — Email sent:

```json
{
  "ok": true
}
```

### GET /ext/settings/emails/

**Get email configuration or delivery reports for a section**

- `getConfig` — the email/newsletter configuration for a section,
  including available events and patrols that can be used as recipient
  filters when composing emails. Also indicates whether the section has
  a newsletter slug configured and if it is live.
- `getDeliveryReport` — the section's sent (and, with
  `include_scheduled=true`, scheduled) emails. The response is a **bare
  array**: the first element is an `ALL` summary row
  (`{id: "0", name: "ALL", type: "all", count}`), followed by one row per
  email with send status, recipient/error/open counts and tracked links.
- `getDeliveryReportRows` — per-recipient delivery status for one email
  (`email_id`). `status` is the display status (`sent`, `opened`, …) and
  `status_raw` the provider status (`delivered`, `open`, …).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getConfig" \| "getDeliveryReport" \| "getDeliveryReportRows"` |  |
| `sectionid` | query | no | `string` | Section ID (`getConfig`, `getDeliveryReport`). |
| `section_id` | query | no | `string` | Section ID (`getDeliveryReportRows`). |
| `email_id` | query | no | `string` | Email ID from `getDeliveryReport` (required for `getDeliveryReportRows`). |
| `generic_date` | query | no | `"true"` | `getDeliveryReport` — return `date` as `yyyy-mm-dd hh:mm:ss`. |
| `include_scheduled` | query | no | `"true"` | `getDeliveryReport` — include scheduled (not yet sent) emails. |

**Response 200** — Email configuration, delivery report, or delivery report rows.

`application/json`:

```ts
{
  found?: boolean;
  result?: {
    sectionid?: string;
    slug?: string;  // Newsletter slug for the section.
    numemails?: string;  // Number of emails sent (as string).
    live?: "0" | "1";  // Whether the newsletter is live.
  };
  events?: {
    name?: string;
    slug?: string;
  }[];  // Upcoming events that can be used as email filters.
  patrols?: {
    name?: string;
    slug?: string;
  }[];  // Patrols/sixes in the section.
  leaders?: boolean;  // Whether leaders are available as recipients.
  [key: string]: any;
} | Record<string, any>[] | {
  status?: boolean;
  error?: string | null;
  data?: any;  // Endpoint-specific payload (object, array, or null).
  meta?: any;  // Endpoint-specific metadata (object, or `[]` when empty).
  [key: string]: any;
}
```

Example — Email configuration (action=getConfig):

```json
{
  "found": true,
  "result": {
    "sectionid": "45001",
    "slug": "1stRiversideCubs",
    "numemails": "0",
    "live": "1"
  },
  "events": [
    {
      "name": "Summer Camp 2025",
      "slug": "SummerCamp2025"
    },
    {
      "name": "Investiture Ceremony",
      "slug": "InvestitureCeremony"
    }
  ],
  "patrols": [
    {
      "name": "Blue",
      "slug": "Blue"
    },
    {
      "name": "Green",
      "slug": "Green"
    }
  ],
  "leaders": true
}
```

Example — Delivery report (action=getDeliveryReport):

```json
[
  {
    "id": "0",
    "name": "ALL",
    "type": "all",
    "count": 1
  },
  {
    "id": 80000001,
    "type": "email",
    "date": "2025-01-10 13:05:00",
    "subject": "Weekly Meeting Reminder",
    "status": "SENT",
    "sent": 2,
    "errors": 0,
    "warnings": 0,
    "opens": 1,
    "hascontent": true,
    "config": null,
    "scheduled_recipient_count": 0,
    "failure_reason": null,
    "from_email": "cubs@example.org",
    "has_attachments": false,
    "links": [
      {
        "url": "https://www.example.org/kit-list",
        "click_count": 0,
        "last_clicked": null
      }
    ],
    "user_id": 100001,
    "photo_url": false,
    "from_name": "Alex Scout"
  }
]
```

Example — Per-recipient status (action=getDeliveryReportRows):

```json
{
  "status": true,
  "error": null,
  "data": [
    {
      "emailid": "80000001",
      "sendtime": "10/01/2025 13:05",
      "subject": "Weekly Meeting Reminder",
      "email": "parent@example.org",
      "status": "opened",
      "lastupdated": "10/01/2025 17:46",
      "member_id": "3100001",
      "hascontent": true,
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "firstname": "Jamie",
      "lastname": "River",
      "status_raw": "open",
      "id": "0123456789abcdef0123456789abcdef",
      "email_key": "parentexampleorg"
    }
  ],
  "meta": {
    "ids": [
      "0123456789abcdef0123456789abcdef"
    ],
    "total": 1,
    "has_attachments": false,
    "can_be_forwarded_status": "empty",
    "itemstore": {
      "identifier": "id"
    }
  }
}
```

### GET /ext/members/email/campaigns/

**List email campaign templates**

Saved campaign (newsletter) templates. `campaign_preview` is a relative
URL to an HTML preview. Load a campaign's content with
`/v3/members/email/campaigns/snippets/{campaignId}`.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"listCampaigns"` |  |
| `section_id` | query | yes | `string` |  |

**Response 200** — Campaigns.

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
      "campaign_id": 70001,
      "title": "Termly Newsletter",
      "template": "turquoise",
      "created_at": "2024-12-19 21:10:35",
      "last_used": "2024-12-20 20:46:18",
      "updated_at": "2024-12-19 21:10:42",
      "campaign_preview": "/ext/members/email/campaigns/?action=preview&campaign_id=70001",
      "has_scheduled_email": false
    }
  ],
  "meta": []
}
```

### GET /v3/members/email/campaigns/snippets/{campaignId}

**Get a campaign's content snippets**

The ordered content blocks (`snippets`) of a campaign template, the
HTML `snippet_templates` used to render each block type
(`fullwidth_text`, `text_text`, `splitter`), and the template's `body`
and `style`. When sending, each `snippet_id` becomes a region key in
`sendTemplate`'s `edits`. Fetching a campaign for editing is preceded
by `POST /ext/generic/locks/?action=obtain` with `item=campaign_<id>`.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `campaignId` | path | yes | `string` | Campaign ID. |

**Response 200** — Campaign snippets.

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
    "snippets": [
      {
        "snippet_id": 300001,
        "snippet": "fullwidth_text",
        "contents": [
          {
            "text": "<h1>Termly Newsletter</h1>"
          }
        ],
        "config": null,
        "order": 1
      }
    ],
    "snippet_templates": {
      "fullwidth_text": "<tr id=\"s___snippet_id[0]\">…</tr>",
      "text_text": "__css__\n<tr id=\"s___snippet_id[0]\">…</tr>",
      "splitter": "<tr id=\"s___snippet_id[0]\">…</tr>"
    },
    "campaign_template": "turquoise",
    "body": "<div class=\"body\">…</div>",
    "style": ".template_editor_turquoise { … }"
  },
  "meta": []
}
```

### GET /v3/members/email/compose/{sectionid}

**Get members for the email composer**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |
| `term_id` | query | yes | `string` |  |

**Response 200** — Members available as recipients.

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
      "firstname": "Jamie",
      "lastname": "River",
      "patrol_id": 12001,
      "patrol": "Blue"
    }
  ],
  "meta": []
}
```

### GET /v3/members/email/draft/{sectionid}

**List draft emails**

The current user's draft emails for the section. `edits` is the decoded
region array (the same structure sent to `sendTemplate`).
`meta.template_count` is the number of saved campaigns.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Drafts.

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
      "emailid": 80000001,
      "guid": "00000000-0000-0000-0000-000000000001",
      "status": "DRAFT",
      "sectionid": 45002,
      "emailtype": "MANUAL",
      "subject": "",
      "sendtime": "2025-09-22 20:52:04",
      "content": null,
      "edits": [
        [
          {
            "text": "<p>Draft text</p>"
          }
        ]
      ],
      "campaign_id": 0,
      "to": null,
      "user_id": 100001,
      "from_email": "",
      "full_from_email": "",
      "config": null
    }
  ],
  "meta": {
    "template_count": 3
  }
}
```

### POST /v3/members/email/draft

**Save a draft email**

Autosaves the email being composed. Called repeatedly while editing;
the `guid` identifies the draft so repeated saves update the same
record. Returns the draft's ID, which is then passed to `sendTemplate`
as `draft_email_id`.

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  subject?: string;
  guid?: string /* uuid */;
  section_id?: string;
  campaign_id?: string;
  edits?: string;  // JSON object of template regions (see `sendTemplate`).
}
```

Example — example:

```json
{
  "subject": "Weekly Meeting Reminder",
  "guid": "00000000-0000-0000-0000-000000000001",
  "section_id": "45002",
  "campaign_id": "0",
  "edits": "{\"0\":{\"0\":{\"text\":\"<p>Draft text</p>\"}}}"
}
```

**Response 200** — Draft saved.

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
    "id": 80000001
  },
  "meta": []
}
```

### GET /ext/members/sms/

**Get SMS delivery report**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getDeliveryReport"` |  |
| `sectionid` | query | yes | `string` |  |
| `dateFormat` | query | no | `"uk"` |  |

**Response 200** — Dojo item store of sent SMS messages.

`application/json`:

```ts
{
  identifier?: string;
  label?: string;
  items?: Record<string, any>[];
  [key: string]: any;
}
```

Example — example:

```json
{
  "identifier": "smsid",
  "items": []
}
```
