<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Finance

Accounting (cashbook, bank accounts, budgets, reports), expense cards,
and invoices.

**Units:** the `/v3/finances/accounting/` endpoints use **integer pence**
(`9706` = £97.06). Event endpoints (`/v3/events/…`, `/ext/events/…`)
use **pounds**.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /v3/finances/accounting/financial_year/section/{sectionid}` — List financial years
- `GET /v3/finances/accounting/financial_year/cashbook/transactions/year/{financialYearId}` — List cashbook transactions for a financial year
- `POST /v3/finances/accounting/financial_year/cashbook/transactions/section/{sectionid}` — Create a cashbook transaction
- `POST /v3/finances/accounting/financial_year/cashbook/transactions/{transactionId}` — Update a cashbook transaction
- `GET /v3/finances/accounting/financial_year/budgets/year/{financialYearId}` — Get budgets for a financial year
- `GET /v3/finances/accounting/financial_year/annual_report/{financialYearId}` — Get annual report
- `GET /v3/finances/accounting/reports/overview/{sectionid}` — Get monthly finance overview
- `GET /v3/finances/accounting/bank_accounts/section/{sectionid}` — List bank accounts
- `GET /v3/finances/accounting/bank_accounts/{bankAccountId}/transactions` — List imported bank transactions
- `GET /v3/finances/accounting/bank_account_transactions/{bankAccountTransactionId}/guess_category` — Guess a category for a bank transaction
- `GET /v3/finances/accounting/bank_accounts/{bankAccountId}/trustees` — List expense account trustees
- `GET /v3/finances/accounting/categories/section/{sectionid}` — List accounting categories
- `GET /v3/finances/accounting/{sectionid}/existing_group_accounts` — List the group's existing accounts
- `GET /v3/comments/accounting/{sectionid}/list` — List accounting comments
- `GET /ext/finances/onlinepayments/` — Get Online Payments schemes
- `GET /ext/finances/onlinepayments/merchants/` — Get Online Payments merchant summary
- `GET /v3/finances/accounting/expense_cardholders/section/{sectionid}` — List expense cardholders
- `GET /v3/finances/accounting/items/section/{sectionid}` — List tracked finance items
- `GET /v3/finances/accounting/items/links/event/{eventId}` — List cashbook lines linked to an event
- `GET /ext/finances/invoices/summary/` — List invoices

### GET /v3/finances/accounting/financial_year/section/{sectionid}

**List financial years**

The section's financial years, newest first, each with income/expense
totals. Use the `id` with the cashbook, budget and annual report
endpoints. **All accounting amounts are integers in pence.**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Financial years.

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
      "id": 7002,
      "section_id": 45003,
      "start_date": "2025-04-06",
      "end_date": "2026-04-05",
      "created_at": "2025-04-06 09:00:00",
      "updated_at": "2025-04-06 09:00:00",
      "title": "2025 - 2026",
      "transaction_summary": {
        "total_income": 250000,
        "total_expense": 180000
      }
    }
  ],
  "meta": []
}
```

### GET /v3/finances/accounting/financial_year/cashbook/transactions/year/{financialYearId}

**List cashbook transactions for a financial year**

Paginated cashbook. Each transaction carries its category split
(`categories[]`, each with an `amount` and the resolved `category`),
and is linked to the imported bank line via `bank_account_transaction_id`.
`meta` includes year totals, the full category list
(`categories`), the categories used this year
(`categories_in_financial_year`), and tracked `items`.

Amounts are in **pence**. Payment-provider payouts are typically split
into an income category plus a `Bank Fees` expense category, so
`categories[].amount` may not sum to the headline `amount`.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `financialYearId` | path | yes | `string` | Financial year ID. |
| `page` | query | no | `integer` |  |
| `per_page` | query | no | `integer` |  |

**Response 200** — Cashbook page.

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
      "id": 800001,
      "incrementing_id": 101,
      "section_id": 45003,
      "date": "2025-10-08",
      "description": "PAYOUT REF EXAMPLE-0001",
      "description_sanitised": "PAYOUT REF EXAMPLE",
      "bank_account_reference_sanitised": "PAYOUT REF EXAMPLE",
      "bank_account_transaction_id": 900001,
      "type": "income",
      "amount": 9706,
      "locked": false,
      "categorised": 9706,
      "number_categories": 2,
      "auto_categorisation": "no guess",
      "created_at": "2025-10-10 16:24:16",
      "updated_at": "2025-10-10 16:24:16",
      "categories": [
        {
          "id": 810001,
          "category_id": 3,
          "item_id": 0,
          "transaction_id": 800001,
          "amount": 10000,
          "category": {
            "id": 3,
            "section_id": 0,
            "name": "Membership Fees",
            "type": "income",
            "icon": "membership"
          },
          "item": null
        },
        {
          "id": 810002,
          "category_id": 30,
          "item_id": 0,
          "transaction_id": 800001,
          "amount": 294,
          "category": {
            "id": 30,
            "section_id": 0,
            "name": "Bank Fees",
            "type": "expense",
            "icon": "bank"
          },
          "item": null
        }
      ],
      "attachments": 0
    }
  ],
  "meta": {
    "number_transactions": 1,
    "total_expense": 294,
    "total_income": 10000,
    "total_amount": 0,
    "categories": [
      {
        "id": 55,
        "section_id": 0,
        "name": "Admin",
        "type": "expense",
        "icon": "administration",
        "usages": []
      }
    ],
    "categories_in_financial_year": [],
    "items": [],
    "financial_year": {
      "start_date": "2025-04-06",
      "end_date": "2026-04-05"
    }
  }
}
```

### POST /v3/finances/accounting/financial_year/cashbook/transactions/section/{sectionid}

**Create a cashbook transaction**

Creates a cashbook entry, usually from an imported bank line
(`bank_account_transaction_id`). `amount` is in **pence**. `categories`
is a JSON array splitting the amount across categories:

| Field | Notes |
|-------|-------|
| `category_id` | Category ID (see the `categories` list in cashbook `meta`). |
| `item_id` | Tracked item, or `0`. |
| `amount` | Pence. |
| `description`, `payment_id`, `scheme_id`, `is_fee` | Present when the split comes from an online payment payout. |

`attachments_id` is a client-generated GUID used to upload receipts via
the cashbook uploads manifest before the transaction exists.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
{
  description: string;
  type: "income" | "expense";
  date: string /* date */;
  amount: integer;  // Pence.
  categories: string;  // JSON array of category splits.
  attachments_id?: string /* uuid */;
  bank_account_transaction_id?: string;
}
```

Example — example:

```json
{
  "description": "PAYOUT REF EXAMPLE-0002",
  "type": "income",
  "date": "2025-04-29",
  "amount": 2411,
  "categories": "[{\"category_id\":3,\"item_id\":0,\"amount\":2500},{\"category_id\":30,\"item_id\":0,\"amount\":89,\"is_fee\":true}]",
  "attachments_id": "00000000-0000-0000-0000-000000000002",
  "bank_account_transaction_id": "900002"
}
```

**Response 200** — Created transaction, with the category OSM would have guessed.

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
    "id": 800002,
    "guessed_category_id": 3,
    "guessed_item_id": 0
  },
  "meta": []
}
```

### POST /v3/finances/accounting/financial_year/cashbook/transactions/{transactionId}

**Update a cashbook transaction**

Same body as create. When editing existing splits, each entry in
`categories` includes its `id` (and the other fields returned by the
cashbook list).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `transactionId` | path | yes | `string` | Cashbook transaction ID. |

**Request body** (`application/x-www-form-urlencoded`, required)

```ts
Record<string, any>
```

Example — example:

```json
{
  "description": "PAYOUT REF EXAMPLE-0001",
  "type": "income",
  "date": "2025-10-08",
  "amount": 9706,
  "categories": "[{\"id\":810001,\"category_id\":3,\"item_id\":0,\"amount\":10000},{\"id\":810002,\"category_id\":30,\"item_id\":0,\"amount\":294}]"
}
```

**Response 200** — Transaction updated.

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

### GET /v3/finances/accounting/financial_year/budgets/year/{financialYearId}

**Get budgets for a financial year**

Every category with its budgeted `amount` (pence) for the year.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `financialYearId` | path | yes | `string` | Financial year ID. |

**Response 200** — Budgets by category.

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
      "id": 55,
      "section_id": 0,
      "name": "Admin",
      "type": "expense",
      "icon": "administration",
      "budgets": [],
      "amount": 20000
    }
  ],
  "meta": {
    "financial_year": {
      "id": 7002,
      "section_id": 45003,
      "start_date": "2025-04-06",
      "end_date": "2026-04-05"
    }
  }
}
```

### GET /v3/finances/accounting/financial_year/annual_report/{financialYearId}

**Get annual report**

Income and expense by category, balances per bank account, and a
summary (balance brought forward, carried forward, …) for the year,
optionally side-by-side with another year (`other_financial_year_id`,
`0` for none). Amounts in pence.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `financialYearId` | path | yes | `string` | Financial year ID. |
| `other_financial_year_id` | query | no | `string` | Comparison year ID, or `0`. |

**Response 200** — Annual report.

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
    "expense": [
      {
        "id": 55,
        "name": "Admin",
        "this_year_amount": 11750,
        "other_year_amount": 0
      }
    ],
    "income": [
      {
        "id": 3,
        "name": "Membership Fees",
        "this_year_amount": 250000,
        "other_year_amount": 230000
      }
    ],
    "bank_accounts": [
      {
        "id": 5001,
        "name": "Main Account",
        "this_year_amount": 400000,
        "other_year_amount": 350000
      }
    ],
    "summary": [
      {
        "id": 0,
        "name": "Account balance brought forward",
        "this_year_amount": 350000,
        "other_year_amount": 300000
      },
      {
        "id": 1,
        "name": "Account balance carried forward",
        "this_year_amount": 400000,
        "other_year_amount": 350000
      }
    ]
  },
  "meta": {
    "financial_year": {
      "id": 7002,
      "section_id": 45003,
      "start_date": "2025-04-06",
      "end_date": "2026-04-05"
    },
    "other_financial_years": [],
    "other_financial_year_id": 0,
    "bank_accounts_have_invalid_opening_balance": false
  }
}
```

### GET /v3/finances/accounting/reports/overview/{sectionid}

**Get monthly finance overview**

Rolling 12 months keyed by `yyyy-mm`, with `income`, `expense` and running `total` balance (pence).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Monthly overview.

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
    "2025-09": {
      "income": 50000,
      "expense": 11750,
      "total": 388000
    },
    "2025-10": {
      "income": 10000,
      "expense": 0,
      "total": 403000
    }
  },
  "meta": []
}
```

### GET /v3/finances/accounting/bank_accounts/section/{sectionid}

**List bank accounts**

The section's bank accounts with opening/current balances (pence) and
the last CSV import column mapping. An account with a non-null
`expense_account` is the OSM expense-card account (its value is the
payment provider's connected-account ID).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Bank accounts.

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
      "id": 5001,
      "section_id": 45003,
      "name": "Main Account",
      "opening_balance": 300000,
      "opening_date": "2021-02-05",
      "current_balance": 403000,
      "config": {
        "last_import_mapping": {
          "headers": [
            "Number",
            "Date",
            "… 4 more"
          ],
          "column_count": 6,
          "csv_layout": [
            {
              "column_number": 0,
              "column_letter": "A",
              "heading": "Number",
              "target_field": "do_not_import"
            },
            {
              "column_number": 1,
              "column_letter": "B",
              "heading": "Date",
              "target_field": "date"
            }
          ],
          "column_letters": "ABCDEF"
        }
      },
      "expense_account": null,
      "created_at": "2023-12-10 17:06:23",
      "updated_at": "2024-02-06 15:05:53",
      "deleted_at": null,
      "updated_at_local_date_time": "06/02/2024 15:05",
      "first_transaction_date": "2021-02-05",
      "last_transaction_date": "2025-10-05",
      "number_unprocessed_transactions": 0
    },
    {
      "id": 5002,
      "section_id": 45003,
      "name": "Expense Account",
      "opening_balance": 0,
      "opening_date": "2023-11-29",
      "current_balance": 0,
      "config": null,
      "expense_account": "acct_EXAMPLE0000000000",
      "created_at": "2023-11-29 16:20:55",
      "updated_at": "2023-11-29 16:20:55",
      "deleted_at": null,
      "updated_at_local_date_time": "29/11/2023 16:20",
      "first_transaction_date": null,
      "last_transaction_date": null,
      "number_unprocessed_transactions": 0
    }
  ],
  "meta": {
    "internal_transfer_difference": 0
  }
}
```

### GET /v3/finances/accounting/bank_accounts/{bankAccountId}/transactions

**List imported bank transactions**

Imported bank statement lines for an account. `mode=unprocessed`
returns lines not yet turned into cashbook entries. `meta` carries the
category and item lists for categorising them.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `bankAccountId` | path | yes | `string` | Bank account ID. |
| `mode` | query | no | `string` | Observed `unprocessed`. |
| `expense_cardholder_id` | query | no | `string` | Filter to one expense cardholder, or `0` for all. |
| `page` | query | no | `integer` |  |
| `per_page` | query | no | `integer` |  |

**Response 200** — Bank transactions.

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
    "number_transactions": 0,
    "categories": [
      {
        "id": 45,
        "section_id": 0,
        "name": "Activity Equipment",
        "type": "expense",
        "icon": "activity",
        "usages": []
      }
    ],
    "items": [
      {
        "id": 4001,
        "section_id": 45003,
        "name": "Minibus",
        "associated_type": null,
        "associated_section_id": 0,
        "associated_id": 0,
        "categories": [
          55
        ],
        "archived_at": null,
        "deleted_at": null
      }
    ]
  }
}
```

### GET /v3/finances/accounting/bank_account_transactions/{bankAccountTransactionId}/guess_category

**Guess a category for a bank transaction**

Returns OSM's suggested `category_id` / `item_id` for an imported bank
line (`0` if no guess), any payout breakdown, and the
`next_bank_transaction` to process — used to step through
uncategorised lines one at a time.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `bankAccountTransactionId` | path | yes | `string` | Imported bank transaction ID. |

**Response 200** — Category guess.

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
    "category_id": 33,
    "item_id": 0,
    "payout_details": [],
    "next_bank_transaction": {
      "id": 900003,
      "bank_account_id": 5001,
      "card_id": 0,
      "cardholder_id": 0,
      "transaction_id": 0,
      "reference": "EXAMPLE PAYEE REF",
      "description": null,
      "amount": 2500,
      "date": "2025-04-28",
      "is_transfer": false,
      "created_at": "2025-10-10 16:23:53",
      "updated_at": "2025-10-10 16:23:53"
    }
  },
  "meta": []
}
```

### GET /v3/finances/accounting/bank_accounts/{bankAccountId}/trustees

**List expense account trustees**

The people registered against the expense-card account with the
payment provider (KYC). Each person has their role flags
(`director`, `executive`, `representative`, `account_opener`, …),
outstanding `requirements`, and identity `verification` status.
**Contains personal data of adult volunteers.**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `bankAccountId` | path | yes | `string` | Bank account ID (the expense account). |

**Response 200** — Trustees.

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
    "people": [
      {
        "id": 20001,
        "account_identifier": "acct_EXAMPLE0000000000",
        "person_identifier": "person_EXAMPLE0000000001",
        "first_name": "Alex",
        "last_name": "Scout",
        "email": "leader@example.org",
        "relationship": {
          "authorizer": false,
          "director": true,
          "executive": true,
          "legal_guardian": false,
          "owner": false,
          "percent_ownership": null,
          "representative": true,
          "title": "Group Lead Volunteer",
          "account_opener": true
        },
        "requirements": {
          "alternatives": [],
          "currently_due": [],
          "errors": [],
          "eventually_due": [],
          "past_due": [],
          "pending_verification": []
        },
        "verification": {
          "additional_document": {
            "back": null,
            "details": null,
            "details_code": null,
            "front": null
          },
          "details": null,
          "details_code": null,
          "document": {
            "back": null,
            "details": null,
            "details_code": null,
            "front": null
          },
          "status": "verified"
        },
        "created_at": "2023-11-29 16:23:01",
        "updated_at": "2025-10-08 01:35:57"
      }
    ]
  },
  "meta": []
}
```

### GET /v3/finances/accounting/categories/section/{sectionid}

**List accounting categories**

Income and expense categories used to classify cashbook transactions
and budget lines. Each has a `type` (`income` or `expense`) and an
`icon` name. Soft-deleted categories carry a `deleted_at` timestamp;
`meta.has_deleted_categories` says whether any exist.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Categories.

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
      "id": 81001,
      "section_id": 45001,
      "name": "Activities",
      "type": "expense",
      "icon": "activity",
      "created_at": "2023-09-01 19:00:00",
      "updated_at": "2023-09-01 19:00:00",
      "deleted_at": null,
      "visibilities": []
    },
    {
      "id": 81002,
      "section_id": 45001,
      "name": "Subscriptions",
      "type": "income",
      "icon": "money",
      "created_at": "2023-09-01 19:00:00",
      "updated_at": "2023-09-01 19:00:00",
      "deleted_at": null,
      "visibilities": []
    }
  ],
  "meta": {
    "has_deleted_categories": false
  }
}
```

### GET /v3/finances/accounting/{sectionid}/existing_group_accounts

**List the group's existing accounts**

Bank accounts that already exist elsewhere in the section's group,
split into `expense` (expense-card accounts) and `standard` accounts.
Used when linking a section to an account instead of creating a new one.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Existing accounts.

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
    "expense": [
      {
        "id": 82001,
        "name": "Group Expense Account"
      }
    ],
    "standard": []
  },
  "meta": {
    "has_visible_categories": true
  }
}
```

### GET /v3/comments/accounting/{sectionid}/list

**List accounting comments**

Comment thread for the section's accounts. `meta` holds the current
user's comment permissions (`can_add`, `can_edit_self`,
`can_delete_others`, …) and `notification_topics`, keyed by topic
(e.g. `comments/accounting/45001`), which describes how the client
opens the thread from a notification. The path segment is the section
ID, but `section_id` is also required in the query string. Only an
empty `data` list has been observed.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |
| `section_id` | query | yes | `string` |  |

**Response 200** — Comments and permissions.

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
    "can_edit_self": true,
    "can_edit_others": false,
    "can_delete_self": true,
    "can_delete_others": false,
    "can_add": true,
    "notification_topics": {
      "comments/accounting/45001": {
        "label": "Accounts",
        "section_id": 45001,
        "permission_type": "finance",
        "permission_value": "10",
        "specified_section_id": 45001,
        "javascript_data": {
          "require": "accounting",
          "execute": "open",
          "args": [
            "comments"
          ],
          "params": {
            "id": "45001",
            "react": "Accounting",
            "props": {
              "selected_tab": "comments"
            }
          }
        }
      }
    },
    "has_uploads": false
  }
}
```

### GET /ext/finances/onlinepayments/

**Get Online Payments schemes**

Online Payments schemes for the section, with the linked
`bank_accounts` and a `config` block describing the section's
subscription (`subscription_level`, `subscription_active`, expiry
dates) and paid add-ons (`portal`, `portalExpires`). `items` is empty
when no schemes are set up; populated items have not been observed.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getSchemes"` |  |
| `sectionid` | query | yes | `string` |  |

**Response 200** — Schemes and subscription config.

`application/json`:

```ts
Record<string, any>
```

Example — example:

```json
{
  "identifier": "schemeid",
  "label": "Payment schemes",
  "has_accounts": false,
  "items": [],
  "bank_accounts": [],
  "config": {
    "subscription_level": 3,
    "subscription_expires": "2026-09-01",
    "sectionType": "cubs",
    "section_type": "cubs",
    "parentSectionId": "44001",
    "hierarchy_lowest_level": true,
    "hierarchy_operating_level": "section",
    "config_subscriptions_checked": "2026-11-01 09:00:00",
    "subscription_active": true,
    "has_expense_account": true,
    "portal": {
      "expense_cards_fees": 1,
      "accounts": 1,
      "filestorage": 1
    },
    "portalExpires": {
      "accountsA": 1,
      "accounts": "2026-09-01",
      "filestorage": "2026-09-01",
      "filestorageA": 1
    }
  }
}
```

### GET /ext/finances/onlinepayments/merchants/

**Get Online Payments merchant summary**

Payment-provider merchant accounts linked to the section. `items` is empty when none are connected; populated items have not been observed.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getSummary"` |  |
| `sectionid` | query | yes | `string` |  |

**Response 200** — Merchant summary.

`application/json`:

```ts
{
  items?: Record<string, any>[];
}
```

Example — example:

```json
{
  "items": []
}
```

### GET /v3/finances/accounting/expense_cardholders/section/{sectionid}

**List expense cardholders**

Expense cardholders for the section, each with spend limits (pence),
allowed `spending_categories`, their cards (`last4`, expiry, status),
the user, and the linked expense bank account. `meta` reports the
card-issuing status and the category list.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |

**Response 200** — Expense cardholders.

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
      "id": 6001,
      "cardholder_identifier": "ich_EXAMPLE0000000001",
      "status": "active",
      "user_id": 100001,
      "section_id": 45003,
      "bank_account_id": 5002,
      "total_amount_spent": 0,
      "total_spend_limit": 50000,
      "new_card_available": false,
      "spending_categories": [
        45,
        55
      ],
      "requirements": {
        "disabled_reason": null,
        "past_due": []
      },
      "deleted": false,
      "created_at": "2025-10-09 12:57:51",
      "created_by": 100001,
      "updated_at": "2025-10-10 14:26:19",
      "daily_spend_limit": 0,
      "weekly_spend_limit": 0,
      "monthly_spend_limit": 0,
      "uncategorised_transactions": 0,
      "periodic_limits": null,
      "cards": [
        {
          "id": 6101,
          "card_identifier": "ic_EXAMPLE0000000001",
          "status": "inactive",
          "cardholder_id": 6001,
          "last4": "0000",
          "exp_month": 1,
          "exp_year": 2030,
          "has_been_activated": false,
          "created_at": "2025-10-10 14:26:17",
          "updated_at": "2025-10-10 14:26:17"
        }
      ],
      "user": {
        "photo_url": false,
        "full_name": "Alex Scout"
      },
      "bank_account": {
        "id": 5002,
        "section_id": 45003,
        "name": "Expense Account",
        "current_balance": 0,
        "expense_account": "acct_EXAMPLE0000000000"
      }
    }
  ],
  "meta": {
    "unallocated_balance": 0,
    "has_expense_account": true,
    "requirements_due": [],
    "requirements_deadline": null,
    "future_requirements_due": [],
    "future_requirements_deadline": null,
    "bank_account_id": 5002,
    "issuing_status": "active",
    "balance": 0,
    "categories": [],
    "failed_payouts": [],
    "pending_payout_change": null,
    "card_issuing_disabled_reason": null,
    "card_issuing_status": "active",
    "account_rejected_reason": null,
    "account_rejected_details": []
  }
}
```

### GET /v3/finances/accounting/items/section/{sectionid}

**List tracked finance items**

"Items" are things you track spend against across categories (e.g. a
minibus, or an event via `associated_type`). Each item reports its
income/expense (pence) within the given financial year.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `sectionid` | path | yes | `string` | Section ID. |
| `financial_year_id` | query | no | `string` | Financial year ID. |

**Response 200** — Items.

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
      "id": 4001,
      "section_id": 45003,
      "name": "Minibus",
      "associated_type": null,
      "associated_section_id": 0,
      "associated_id": 0,
      "categories": [
        55
      ],
      "archived_at": null,
      "deleted_at": null,
      "income_expense": {
        "income": 0,
        "expense": 11750,
        "has_transactions": true
      },
      "associated_name": null,
      "categories_in_use": [
        55
      ],
      "associated_section": null
    }
  ],
  "meta": {
    "categories": {
      "55": "Admin"
    },
    "all_items": [],
    "all_categories": []
  }
}
```

### GET /v3/finances/accounting/items/links/event/{eventId}

**List cashbook lines linked to an event**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `eventId` | path | yes | `string` | Event ID. |
| `page` | query | no | `integer` |  |
| `per_page` | query | no | `integer` |  |

**Response 200** — Linked transactions with totals (pence).

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
    "number_transactions": 0,
    "total_income": 0,
    "total_expense": 0,
    "total_amount": 0
  }
}
```

### GET /ext/finances/invoices/summary/

**List invoices**

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getInvoiceSummary"` |  |
| `sectionid` | query | yes | `string` |  |
| `termid` | query | yes | `string` |  |
| `is_dgrid` | query | no | `"true"` |  |

**Response 200** — Dojo item store of invoices.

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
  "identifier": "invoiceid",
  "label": "name",
  "items": []
}
```
