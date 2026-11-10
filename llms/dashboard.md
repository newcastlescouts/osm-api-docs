<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Dashboard

Dashboard summaries and next things.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/dashboard/` — Get next things dashboard data

### GET /ext/dashboard/

**Get next things dashboard data**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getNextThings"` |  |
| `sectionid` | query | yes | `string` | Section ID. |
| `termid` | query | yes | `string` | Term ID. |
| `section` | query | yes | `"squirrels" \| "beavers" \| "cubs" \| "scouts" \| "explorers" \| "adults"` | Section type. |
| `parts` | query | no | `"core" \| "agenda" \| "section_widgets" \| "user_widgets"` | Returns only one slice of the dashboard. The web UI now makes four requests, one per part; every response echoes `parts` back. Keys observed per part: \| `parts` \| Keys returned \| \|---------\|---------------\| \| `core` \| `is_full_admin`, `duplicate_admin_names`, `permissions` \| \| `agenda` \| `conf`, `patrols`, `birthdays`, `programme`, `events` \| \| `section_widgets` \| `notepad`, `subscription_expiring_soon`, `members`, `outstandingpayments`, `shop_orders_to_dispatch`, `badge_homework`, `deletable_members`, `due_badges`, `meetings_needing_badge_updates`, `pending_applicant_count`, `thanks` \| \| `user_widgets` \| `programme_reviews`, `badge_supplier_review_prompt`, `blocked_expense_card_transactions`, `chat_highlights`, `expense_cards`, `feature_request_voting`, `pending_expense_cardholder_application`, `recommendation`, `unanswered_question`, `user_to_do_tasks`, `whats_new` \| Omit `parts` to receive the combined response shown in the example. |

**Response 200** — Dashboard next things response.

`application/json`:

```ts
{
  conf?: Record<string, integer>;
  is_full_admin?: boolean;
  permissions?: Record<string, any>;
  patrols?: Record<string, any>[];
  birthdays?: Record<string, any>[];
  programme?: Record<string, any>[];
  events?: Record<string, any>[];
  outstandingpayments?: Record<string, any>[];
  surveys?: boolean | Record<string, any>;
  notepad?: Record<string, any>;
  subscription_expiring_soon?: boolean;
  programme_reviews?: Record<string, any>[];
  deletable_members?: Record<string, any>;
  due_badges?: Record<string, any>;
  expense_cards?: Record<string, any>;
  feature_request_voting?: Record<string, any>;
  pending_expense_cardholder_application?: Record<string, any>;
  thanks?: Record<string, any>;
  unanswered_question?: Record<string, any>;
  user_to_do_tasks?: Record<string, any>;
  whats_new?: Record<string, any>;
  [key: string]: any;
}
```

Example — example:

```json
{
  "conf": {
    "birthdays": 1,
    "programme": 1,
    "events": 1
  },
  "is_full_admin": true,
  "permissions": {
    "badge": 20,
    "member": 20,
    "user": "100"
  },
  "patrols": [
    {
      "patrolid": "12001",
      "sectionid": "45001",
      "name": "Blue",
      "active": "1",
      "points": "0",
      "census_costs": false
    }
  ],
  "birthdays": [
    {
      "member_id": 3100006,
      "firstname": "Casey",
      "lastname": "Brook",
      "photo_guid": "00000000-0000-0000-0000-000000000000",
      "dob": "2016-02-02",
      "age": 9
    }
  ],
  "programme": [
    {
      "meetingdate": "2024-11-01",
      "title": "Camp Skills Night",
      "eveningid": "9500001"
    }
  ],
  "events": [
    {
      "eventid": "1700001",
      "name": "District Camp",
      "date": "2025-06-19",
      "end_date": "2025-06-21",
      "yes": 1
    }
  ],
  "outstandingpayments": [
    {
      "name": "Subscriptions",
      "amount": 45,
      "scheme_id": "47001",
      "currency": "GBP"
    }
  ],
  "surveys": false,
  "notepad": {
    "raw": "0",
    "html": "<p></p>"
  },
  "subscription_expiring_soon": false,
  "programme_reviews": [],
  "deletable_members": {
    "count": 2
  },
  "due_badges": {
    "count": 5
  },
  "expense_cards": {
    "cardholders": [],
    "number_cardholders": 0
  },
  "feature_request_voting": {
    "has_feature_request": false
  },
  "pending_expense_cardholder_application": {
    "data_required": false
  },
  "thanks": {
    "messages": []
  },
  "unanswered_question": {
    "has_questions": false
  },
  "user_to_do_tasks": {
    "tasks": [],
    "users": {}
  },
  "whats_new": {
    "title": "Example Update",
    "msg": "<p>Example message.</p>",
    "story_id": 100,
    "like_count": 0,
    "user_has_liked": false
  }
}
```
