<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Files

Several features share a common file-attachment API. Each exposes a
`manifest` action (sometimes namespaced, e.g. `emailerAttachmentsManifest`
or `programmeAttachmentsManifest`) on its own URL, taking `id`, `path`
(usually `/`), `section_id`, `temp`, plus a feature-specific ID.

The response's `data.config.endpoints` tells you the `action` names to
use on the same URL for each file operation (`put`, `get`, `preview`,
`rename`, `delete`, `putTemp`/`commitTemp`/`revertTemp` for staged
uploads, `partPut` for chunked uploads); an operation is `false` where
it is not allowed. `config` also gives allowed extensions/MIME types and
size limits, and `meta.size` the remaining quota.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/finances/accounting/financial_year/cashbook/transactions/uploads/` — Cashbook receipt attachments manifest
- `POST /ext/finances/accounting/financial_year/cashbook/transactions/uploads/` — Cashbook receipt attachments manifest (POST)
- `GET /ext/finances/accounting/financial_year/cashbook/transactions/uploads/index.php` — Preview a cashbook receipt
- `GET /ext/finances/accounting/bank_accounts/uploads/` — Bank account attachments manifest
- `GET /ext/programme/activities/attachments/files/` — Activity attachments manifest
- `GET /ext/mymember/programme/leader_resources/` — Meeting leader-resources manifest
- `GET /ext/mymember/events/leader_resources/` — Event leader-resources manifest
- `GET /ext/risk_assessments/uploads/` — Risk assessment attachments manifest

### GET /ext/finances/accounting/financial_year/cashbook/transactions/uploads/

**Cashbook receipt attachments manifest**

File manifest for receipts attached to a cashbook transaction. With
`temp=true`, `id` is the client-generated `attachments_id` GUID used
before the transaction is created. See [Files](#tag/Files).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"manifest"` |  |
| `id` | query | yes | `string` | Transaction ID, or the `attachments_id` GUID when `temp=true`. |
| `section_id` | query | yes | `string` |  |
| `path` | query | no | `string` |  |
| `temp` | query | no | `"true" \| "false"` |  |
| `bank_account_transaction_id` | query | no | `string` |  |

**Response 200** — File manifest (see the Files tag for the shape).

`application/json`:

```ts
{
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
  "status": true,
  "error": null,
  "data": {
    "manifest": [],
    "config": {
      "endpoints": {
        "put": "put",
        "get": "get",
        "preview": "preview",
        "rename": "rename",
        "move": "move",
        "delete": "delete",
        "createDirectory": "createDirectory",
        "getDirectory": "getDirectory",
        "renameDirectory": "renameDirectory",
        "moveDirectory": "moveDirectory",
        "deleteDirectory": "deleteDirectory",
        "putTemp": "putTemp",
        "commitTemp": "commitTemp",
        "revertTemp": "revertTemp",
        "partPut": "partPut"
      },
      "can_delete_own_files": false,
      "allowed_extensions": [
        "pdf",
        "bmp",
        "… 3 more"
      ],
      "allowed_mime": [
        "application/pdf",
        "image/*"
      ],
      "max_file_size": 26214400,
      "max_file_size_human": "25.0 MB",
      "allow_empty": false,
      "single_file_size_limit": 10485760,
      "single_file_size_limit_human": "10.0 MB",
      "max_files": 10,
      "directory_limit": 1,
      "total_files_size_limit": 40789606,
      "total_files_size_limit_human": "38.9 MB",
      "upload_available_space": 10,
      "upload_limit": 10,
      "chunked_uploads": false,
      "preview_sizes": [
        "dialog"
      ]
    }
  },
  "meta": {
    "size": {
      "remaining": 40789606,
      "remaining_human": "38.9 MB",
      "total": 40789606,
      "total_human": "38.9 MB"
    }
  }
}
```

### POST /ext/finances/accounting/financial_year/cashbook/transactions/uploads/

**Cashbook receipt attachments manifest (POST)**

The web client also fetches the cashbook manifest with a POST. All
parameters, including `action=manifest`, are in the query string and
there is no body. The response matches the GET form.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"manifest"` |  |
| `id` | query | yes | `string` | Transaction ID, or the `attachments_id` GUID when `temp=true`. |
| `section_id` | query | yes | `string` |  |
| `path` | query | no | `string` |  |
| `temp` | query | no | `"true" \| "false"` |  |
| `bank_account_transaction_id` | query | no | `string` |  |

**Response 200** — File manifest (see the Files tag for the shape).

`application/json`:

```ts
{
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
  "status": true,
  "error": null,
  "data": {
    "manifest": [],
    "config": {
      "endpoints": {
        "put": "put",
        "get": "get",
        "preview": "preview",
        "rename": "rename",
        "move": "move",
        "delete": "delete",
        "createDirectory": "createDirectory",
        "getDirectory": "getDirectory",
        "renameDirectory": "renameDirectory",
        "moveDirectory": "moveDirectory",
        "deleteDirectory": "deleteDirectory",
        "putTemp": "putTemp",
        "commitTemp": "commitTemp",
        "revertTemp": "revertTemp",
        "partPut": "partPut"
      },
      "can_delete_own_files": false,
      "allowed_extensions": [
        "pdf",
        "bmp",
        "… 3 more"
      ],
      "allowed_mime": [
        "application/pdf",
        "image/*"
      ],
      "max_file_size": 26214400,
      "max_file_size_human": "25.0 MB",
      "allow_empty": false,
      "single_file_size_limit": 10485760,
      "single_file_size_limit_human": "10.0 MB",
      "max_files": 10,
      "directory_limit": 1,
      "total_files_size_limit": 40789606,
      "total_files_size_limit_human": "38.9 MB",
      "upload_available_space": 10,
      "upload_limit": 10,
      "chunked_uploads": false,
      "preview_sizes": [
        "dialog"
      ]
    }
  },
  "meta": {
    "size": {
      "remaining": 40789606,
      "remaining_human": "38.9 MB",
      "total": 40789606,
      "total_human": "38.9 MB"
    }
  }
}
```

### GET /ext/finances/accounting/financial_year/cashbook/transactions/uploads/index.php

**Preview a cashbook receipt**

Image preview of an attached file, served as `image/png` (or the format
in `fm`). Use the `preview` URLs from the manifest
(`data.manifest[*].preview` / `preview_sizes`) as they are: `s` is a
server-generated signature over the other parameters, so changing
`w`, `h` or `fit` yourself will not work. Other features' `uploads/`
endpoints follow the same pattern.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"preview"` |  |
| `file` | query | yes | `string` | File path within the manifest. |
| `id` | query | yes | `string` | Transaction ID. |
| `bank_account_transaction_id` | query | no | `string` |  |
| `section_id` | query | yes | `string` |  |
| `cb` | query | no | `string` | Cache-buster. |
| `_bypass_service_worker` | query | no | `"1"` |  |
| `fm` | query | no | `string` | Output format (observed `png`). |
| `fit` | query | no | `string` | Resize mode (observed `crop`). |
| `w` | query | no | `integer` |  |
| `h` | query | no | `integer` |  |
| `s` | query | yes | `string` | Signature generated by OSM; copy it from the manifest. |

**Response 200** — Preview image.

`image/png`:

```ts
string /* binary */
```

### GET /ext/finances/accounting/bank_accounts/uploads/

**Bank account attachments manifest**

File manifest for documents attached to a bank account (e.g.
statements). `manifest` is an empty array when there are no files.
See [Files](#tag/Files).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"manifest"` |  |
| `id` | query | yes | `string` | Bank account ID. |
| `section_id` | query | yes | `string` |  |
| `path` | query | no | `string` |  |

**Response 200** — File manifest (see the Files tag for the shape).

`application/json`:

```ts
{
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
  "status": true,
  "error": null,
  "data": {
    "manifest": [],
    "config": {
      "endpoints": {
        "put": "put",
        "get": "get",
        "preview": "preview",
        "rename": "rename",
        "move": "move",
        "delete": "delete",
        "createDirectory": "createDirectory",
        "getDirectory": "getDirectory",
        "renameDirectory": "renameDirectory",
        "moveDirectory": "moveDirectory",
        "deleteDirectory": "deleteDirectory",
        "putTemp": "putTemp",
        "commitTemp": "commitTemp",
        "revertTemp": "revertTemp",
        "partPut": "partPut"
      },
      "can_delete_own_files": false,
      "allowed_extensions": [
        "pdf",
        "bmp",
        "… 3 more"
      ],
      "allowed_mime": [
        "application/pdf",
        "image/*"
      ],
      "max_file_size": 26214400,
      "max_file_size_human": "25.0 MB",
      "allow_empty": false,
      "single_file_size_limit": 10485760,
      "single_file_size_limit_human": "10.0 MB",
      "max_files": 10,
      "directory_limit": 1,
      "total_files_size_limit": 40789606,
      "total_files_size_limit_human": "38.9 MB",
      "upload_available_space": 10,
      "upload_limit": 10,
      "chunked_uploads": false,
      "preview_sizes": [
        "dialog"
      ]
    }
  },
  "meta": {
    "size": {
      "remaining": 40789606,
      "remaining_human": "38.9 MB",
      "total": 40789606,
      "total_human": "38.9 MB"
    }
  }
}
```

### GET /ext/programme/activities/attachments/files/

**Activity attachments manifest**

File manifest for an activity's attachments. Unlike other manifests,
this one is populated: each entry in `manifest` is keyed by path and
has the file's `mime`, `bytes`, human `size`, upload/access dates,
`access_count`, and `preview` URLs. See [Files](#tag/Files).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"manifest"` |  |
| `id` | query | yes | `string` | Activity ID. |
| `activity_id` | query | yes | `string` | Activity ID. |
| `activity_unique_id` | query | no | `string` | The activity version's unique ID (`details.id` from `getActivity`). |
| `section_id` | query | no | `string` | Observed `0`. |
| `path` | query | no | `string` |  |
| `temp` | query | no | `string` |  |

**Response 200** — Activity file manifest.

`application/json`:

```ts
{
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
  "status": true,
  "error": null,
  "data": {
    "manifest": {
      "/knot-relay.pdf": {
        "upload_id": 700001,
        "path": "/knot-relay.pdf",
        "directory": "/",
        "name": "knot-relay.pdf",
        "mime": "application/pdf",
        "extension": "pdf",
        "icon": "pdf",
        "bytes": 990000,
        "size": "967 KB",
        "lost": false,
        "temp": false,
        "date_uploaded": "08/10/2025 22:25",
        "date_last_accessed": "10/10/2025 16:52",
        "access_count": 13,
        "platform": "s3cache",
        "meta": [],
        "uploader_id": 0,
        "preview": "/ext/programme/activities/attachments/files/?action=preview&…",
        "preview_sizes": {
          "dialog": "/ext/programme/activities/attachments/files/?action=preview&size=dialog&…"
        },
        "props": []
      }
    },
    "config": {
      "endpoints": {
        "put": "put",
        "get": "get",
        "preview": "preview"
      },
      "single_file_size_limit_human": "5.0 MB",
      "directory_limit": 99,
      "chunked_uploads": false
    }
  },
  "meta": {
    "size": {
      "remaining": false,
      "remaining_human": false,
      "total": false,
      "total_human": false
    }
  }
}
```

### GET /ext/mymember/programme/leader_resources/

**Meeting leader-resources manifest**

Read-only file manifest of leader resources shared to the Parent
Portal for a meeting (`id` = meeting ID). Upload endpoints are `false`
in `config.endpoints`. See [Files](#tag/Files).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"manifest"` |  |
| `id` | query | yes | `string` | Meeting ID. |
| `section_id` | query | yes | `string` |  |
| `path` | query | no | `string` |  |
| `temp` | query | no | `string` |  |

**Response 200** — File manifest (see the Files tag for the shape).

`application/json`:

```ts
{
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
  "status": true,
  "error": null,
  "data": {
    "manifest": [],
    "config": {
      "endpoints": {
        "put": "put",
        "get": "get",
        "preview": "preview",
        "rename": "rename",
        "move": "move",
        "delete": "delete",
        "createDirectory": "createDirectory",
        "getDirectory": "getDirectory",
        "renameDirectory": "renameDirectory",
        "moveDirectory": "moveDirectory",
        "deleteDirectory": "deleteDirectory",
        "putTemp": "putTemp",
        "commitTemp": "commitTemp",
        "revertTemp": "revertTemp",
        "partPut": "partPut"
      },
      "can_delete_own_files": false,
      "allowed_extensions": [
        "pdf",
        "bmp",
        "… 3 more"
      ],
      "allowed_mime": [
        "application/pdf",
        "image/*"
      ],
      "max_file_size": 26214400,
      "max_file_size_human": "25.0 MB",
      "allow_empty": false,
      "single_file_size_limit": 10485760,
      "single_file_size_limit_human": "10.0 MB",
      "max_files": 10,
      "directory_limit": 1,
      "total_files_size_limit": 40789606,
      "total_files_size_limit_human": "38.9 MB",
      "upload_available_space": 10,
      "upload_limit": 10,
      "chunked_uploads": false,
      "preview_sizes": [
        "dialog"
      ]
    }
  },
  "meta": {
    "size": {
      "remaining": 40789606,
      "remaining_human": "38.9 MB",
      "total": 40789606,
      "total_human": "38.9 MB"
    }
  }
}
```

### GET /ext/mymember/events/leader_resources/

**Event leader-resources manifest**

Read-only file manifest of leader resources for an event. See [Files](#tag/Files).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"manifest"` |  |
| `id` | query | yes | `string` | Event ID. |
| `event_id` | query | yes | `string` | Event ID. |
| `section_id` | query | yes | `string` |  |
| `path` | query | no | `string` |  |
| `temp` | query | no | `string` |  |

**Response 200** — File manifest (see the Files tag for the shape).

`application/json`:

```ts
{
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
  "status": true,
  "error": null,
  "data": {
    "manifest": [],
    "config": {
      "endpoints": {
        "put": "put",
        "get": "get",
        "preview": "preview",
        "rename": "rename",
        "move": "move",
        "delete": "delete",
        "createDirectory": "createDirectory",
        "getDirectory": "getDirectory",
        "renameDirectory": "renameDirectory",
        "moveDirectory": "moveDirectory",
        "deleteDirectory": "deleteDirectory",
        "putTemp": "putTemp",
        "commitTemp": "commitTemp",
        "revertTemp": "revertTemp",
        "partPut": "partPut"
      },
      "can_delete_own_files": false,
      "allowed_extensions": [
        "pdf",
        "bmp",
        "… 3 more"
      ],
      "allowed_mime": [
        "application/pdf",
        "image/*"
      ],
      "max_file_size": 26214400,
      "max_file_size_human": "25.0 MB",
      "allow_empty": false,
      "single_file_size_limit": 10485760,
      "single_file_size_limit_human": "10.0 MB",
      "max_files": 10,
      "directory_limit": 1,
      "total_files_size_limit": 40789606,
      "total_files_size_limit_human": "38.9 MB",
      "upload_available_space": 10,
      "upload_limit": 10,
      "chunked_uploads": false,
      "preview_sizes": [
        "dialog"
      ]
    }
  },
  "meta": {
    "size": {
      "remaining": 40789606,
      "remaining_human": "38.9 MB",
      "total": 40789606,
      "total_human": "38.9 MB"
    }
  }
}
```

### GET /ext/risk_assessments/uploads/

**Risk assessment attachments manifest**

File manifest for documents attached to a risk assessment. See [Files](#tag/Files).

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"manifest"` |  |
| `id` | query | yes | `string` | Meeting (or event) ID. |
| `type` | query | yes | `string` | Observed `meeting`. |
| `section_id` | query | yes | `string` |  |
| `path` | query | no | `string` | Observed `/meeting/`. |
| `temp` | query | no | `string` |  |

**Response 200** — File manifest (see the Files tag for the shape).

`application/json`:

```ts
{
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
  "status": true,
  "error": null,
  "data": {
    "manifest": [],
    "config": {
      "endpoints": {
        "put": "put",
        "get": "get",
        "preview": "preview",
        "rename": "rename",
        "move": "move",
        "delete": "delete",
        "createDirectory": "createDirectory",
        "getDirectory": "getDirectory",
        "renameDirectory": "renameDirectory",
        "moveDirectory": "moveDirectory",
        "deleteDirectory": "deleteDirectory",
        "putTemp": "putTemp",
        "commitTemp": "commitTemp",
        "revertTemp": "revertTemp",
        "partPut": "partPut"
      },
      "can_delete_own_files": false,
      "allowed_extensions": [
        "pdf",
        "bmp",
        "… 3 more"
      ],
      "allowed_mime": [
        "application/pdf",
        "image/*"
      ],
      "max_file_size": 26214400,
      "max_file_size_human": "25.0 MB",
      "allow_empty": false,
      "single_file_size_limit": 10485760,
      "single_file_size_limit_human": "10.0 MB",
      "max_files": 10,
      "directory_limit": 1,
      "total_files_size_limit": 40789606,
      "total_files_size_limit_human": "38.9 MB",
      "upload_available_space": 10,
      "upload_limit": 10,
      "chunked_uploads": false,
      "preview_sizes": [
        "dialog"
      ]
    }
  },
  "meta": {
    "size": {
      "remaining": 40789606,
      "remaining_human": "38.9 MB",
      "total": 40789606,
      "total_human": "38.9 MB"
    }
  }
}
```
