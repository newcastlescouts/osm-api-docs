<!-- Generated from openapi.yaml by scripts/build-llms.mjs. Do not edit by hand. -->

# OSM API — Startup

Session bootstrap and general metadata.

Base URL: `https://www.onlinescoutmanager.co.uk`. Auth: OAuth 2.0 bearer token. POST bodies are `application/x-www-form-urlencoded`, never JSON. Full context: https://opensource.newcastlescouts.org.uk/llms.txt

## Operations

- `GET /ext/generic/startup/` — Get startup data

### GET /ext/generic/startup/

**Get startup data**

Returns startup and session data depending on the `action` parameter.

**`action=getData` has been permanently removed** — this action was removed without
notice. HTTP 410 Gone is the only response you will ever receive for this action.
It will not be reinstated. Migrate to `action=getDataPayload`.

**`action=getDataPayload`** returns a JSON payload containing CDN resource URLs,
user globals, section roles and permissions, user preferences, terms, and session
metadata needed to bootstrap the application after login.

**`action=getConfigPayload`** returns global, non-user-specific site configuration:
section type definitions, patrol role labels, beta features, upgrade pricing, feature
flags, recipe metadata, and form configurations.

**Parameters**

| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `action` | query | yes | `"getData" \| "getDataPayload" \| "getConfigPayload"` | `getData` — **permanently removed**, HTTP 410 Gone is the only reply. `getDataPayload` — returns the full JSON startup payload. `getConfigPayload` — returns global site configuration. |

**Response 200** — JSON startup payload (schema varies by `action`; see examples).

`application/json`:

```ts
{
  status?: boolean;
  error?: any | null;
  data?: {
    cdn?: string;  // Base CDN URL for static assets.
    resources?: string[];  // Ordered list of JS/CSS resource paths to load on startup.
    config_hash?: string;  // Hash representing the current server-side configuration state.
    required_cdn_built_files?: Record<string, string>;  // Named CDN file URLs required for the app (e.g., `osm.js`, `react.js`).
    cache_bust?: string;  // Query string cache-busting token derived from built file hashes.
    globals?: {
      post_login_action?: boolean | string;  // Action to perform after login, or `false` if none.
      theme?: string;  // UI theme name (e.g., `blue`).
      userid?: integer;  // Authenticated user's numeric ID.
      roles?: {
        groupname?: string;
        groupid?: string;
        group_country?: string;
        sectionid?: string;
        sectionname?: string;
        section?: string;  // Section type slug (e.g., `cubs`, `scouts`, `adults`, `waiting`).
        isDefault?: string;
        permissions?: Record<string, any>;
        sectionConfig?: Record<string, any>;
        [key: string]: any;
      }[];  // Sections the user has access to, including permissions and config.
      active_user_member?: boolean | integer;  // Whether the user is also a member record, or `false`.
      associated_member_id?: boolean | integer;  // Associated member ID if applicable, or `false`.
      email?: string;
      firstname?: string;
      lastname?: string;
      fullname?: string;
      preferences?: Record<string, any>;  // User-specific UI and behavioural preferences.
      member_access?: Record<string, Record<string, any>>;  // Sections where the user has parent-portal member access, keyed by section ID.
      member_access_unactivated?: boolean | Record<string, any>;  // Whether any member access is pending activation.
      terms?: Record<string, {
        termid?: string;
        sectionid?: string;
        name?: string;
        startdate?: string;
        enddate?: string;
        master_term?: any | null;
        past?: boolean;
        [key: string]: any;
      }[]>;  // Terms for each section, keyed by section ID.
      global_roles?: Record<string, any>[];
      hasSectionAccess?: boolean;
      notepads?: Record<string, any>[];
      sockets?: string;  // Comma-separated `sectionid-token` pairs for WebSocket connections.
      user_socket?: string;  // Personal WebSocket token for the authenticated user.
      session_id?: string;
      security_prompt?: boolean;
      user_has_image?: string;  // Path to the user's profile photo.
      user_hash?: string;  // HMAC hash used for client-side identity verification.
      user_hash_legacy?: string;
      language?: string;
      gamification?: Record<string, {
        total_steps?: integer;
        steps_completed?: integer;
        id?: integer | string;
        [key: string]: any;
      }>;
      gamification_rank?: integer;
      gamification_total?: integer;
      features_used?: string[];  // Log of feature interactions recorded for this user account.
      unread_message_count?: integer;
      client_time?: string;  // Client Unix timestamp in milliseconds at the time of the request.
      [key: string]: any;
    };
    dojo?: {
      cacheBust?: string;
      locale?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  meta?: Record<string, any>[];
  [key: string]: any;
} | {
  status?: boolean;
  error?: any | null;
  data?: {
    site_type?: string;  // Site variant identifier (e.g., `scouts`).
    site_folder?: string;  // Server-side folder path for site-specific assets.
    siteConfig?: {
      expense_cards?: Record<string, any>;
      online_payment_gateways?: string[];
      beta?: {
        key?: string;
        title?: string;
        description?: string;
        role?: string;
        release_ts?: integer;
        feedback?: Record<string, any>;
        [key: string]: any;
      }[];  // Beta features available for opt-in.
      boltons?: Record<string, string>;  // Short-code to bolton name mapping.
      upgrade_config?: Record<string, {
        price?: number;
      }>;  // Subscription feature prices, keyed by feature name.
      sms_prices?: Record<string, number>;  // SMS bundle prices keyed by credit quantity.
      recipes?: Record<string, string[]>;  // Enumerated values for the recipe planner.
      section_types?: Record<string, Record<string, string>>;  // Human-readable section type names keyed by country code then section type slug.
      badge_types?: Record<string, string[]>;
      section_type_setup?: Record<string, Record<string, any>>;  // Per-section-type capability flags and badge definitions.
      kill?: Record<string, boolean>;  // Feature kill-switch states (all `false` means all services active).
      buy_links?: Record<string, string>;
      risk_assessments_config?: Record<string, any>;
      communicatable_contact_groups?: Record<string, Record<string, string>>;
      email_template_colours?: string[];
      campaign_template_designs?: string[];
      remove_member_allowed_functions?: Record<string, string[]>;
      [key: string]: any;
    };  // Global feature flags, upgrade pricing, section type definitions, and configuration.
    patrolLabels?: Record<string, {
      patrol?: string;
      patrols?: string;
    }>;  // Patrol/group label names per section type.
    patrolRoles?: Record<string, Record<string, any>[] | Record<string, Record<string, any>>>;  // Patrol role definitions per section type. Youth sections use an array ordered by level; adult sections use an object keyed by level number.
    extraSectionTypes?: Record<string, string>;  // Display names for non-standard section types.
    featurelevels?: Record<string, integer>;  // Minimum subscription level required to access each feature.
    changedlevels?: Record<string, any>[];
    availableRoles?: Record<string, string>;  // Global role slugs mapped to display names.
    globalAccessRoles?: {
      user_role?: string;
      access_type?: string;
      id?: string;
      [key: string]: any;
    }[];  // Access control rules granting global roles specific access types.
    terminology?: Record<string, string>;  // Hierarchy level names for the site (Group, District, County, etc.).
    forms?: Record<string, any>[];  // Dynamic form definitions (accident forms, medication history, etc.).
    default_terminology?: Record<string, string>;
    leaderPatrolIds?: integer[];  // Patrol IDs reserved for leaders (typically -2 and -3).
    [key: string]: any;
  };
  meta?: Record<string, any>[];
  [key: string]: any;
}
```

Example — Response for action=getDataPayload:

```json
{
  "status": true,
  "error": null,
  "data": {
    "cdn": "https://oymcdn.co.uk/",
    "resources": [
      "/built/postlogin-combined/postlogin-combined-abc123.js",
      "/built/global/global-abc123.js",
      "… 5 more"
    ],
    "config_hash": "abc123def456abc123def456abc123de",
    "required_cdn_built_files": {
      "osm.js": "https://oymcdn.co.uk/built/osm/osm-abc123.js",
      "react.js": "https://oymcdn.co.uk/built/react/react-abc123.js"
    },
    "cache_bust": "v=abc123",
    "globals": {
      "post_login_action": false,
      "theme": "blue",
      "userid": 100001,
      "roles": [
        {
          "groupname": "Example Scout Group",
          "groupid": "10001",
          "group_country": "uk",
          "sectionid": "45001",
          "sectionname": "Beavers",
          "section": "beavers",
          "isDefault": "0",
          "permissions": {
            "badge": 20,
            "member": 20,
            "user": 100,
            "register": 20,
            "programme": 20,
            "events": 20,
            "flexi": 20,
            "finance": 100,
            "quartermaster": 20
          },
          "sectionConfig": {
            "subscription_level": 3,
            "subscription_expires": "2027-01-01",
            "section_type": "beavers",
            "sectionType": "beavers",
            "parentSectionId": "0",
            "subscription_active": false,
            "meeting_day": "Mon",
            "hierarchy_lowest_level": false,
            "hierarchy_operating_level": "level_0"
          }
        },
        {
          "groupname": "Example Scout Group",
          "groupid": "10001",
          "group_country": "uk",
          "sectionid": "45002",
          "sectionname": "Cubs",
          "section": "cubs",
          "isDefault": "1",
          "permissions": {
            "badge": 20,
            "member": 20,
            "user": "100",
            "register": 20,
            "programme": 20,
            "events": 20,
            "flexi": 20,
            "quartermaster": 20,
            "finance": 100
          },
          "sectionConfig": {
            "subscription_level": 3,
            "subscription_expires": "2027-01-01",
            "section_type": "cubs",
            "sectionType": "cubs",
            "parentSectionId": "0",
            "subscription_active": false,
            "meeting_day": "Wed",
            "hierarchy_lowest_level": false,
            "hierarchy_operating_level": "level_0"
          }
        },
        "… 1 more"
      ],
      "active_user_member": false,
      "associated_member_id": false,
      "email": "leader@example.org",
      "firstname": "Alex",
      "lastname": "Scout",
      "fullname": "Alex Scout",
      "preferences": {
        "logins": "100",
        "theme": "blue",
        "date": "uk",
        "sort": "dob",
        "has_assistive_technology": false,
        "hotkeys_enabled": false,
        "disable_animations": false,
        "beta": false,
        "beta_functions": []
      },
      "member_access": {
        "45002": {
          "name": "Example Scout Group: Cubs",
          "group": "Example Scout Group",
          "section": "Cubs",
          "abbrv": "Cubs",
          "type": "cubs",
          "label": "Cubs",
          "members": {
            "2100001": {
              "first_name": "Alex",
              "last_name": "Scout",
              "photo_guid": "00000000-0000-0000-0000-000000000000",
              "abbrv_name": "Alex",
              "chat_rooms": [],
              "access_type": "member",
              "has_unread_chat_rooms": false,
              "permissions": true,
              "patrol": "Leaders"
            }
          },
          "access": true,
          "config": {
            "badges": true,
            "programme": true,
            "emailbolton": true,
            "details": true,
            "events": true,
            "chat": false,
            "at_home": false,
            "email_address": "Example Scout Group Cubs <cubs@example.org>",
            "giftaid": true,
            "payments": true,
            "attachments": false,
            "photos": true
          },
          "noticeboard": false,
          "patrol_label": "Six"
        }
      },
      "member_access_unactivated": false,
      "terms": {
        "45002": [
          {
            "termid": "200001",
            "sectionid": "45002",
            "name": "Summer 2025",
            "startdate": "2025-04-01",
            "enddate": "2025-07-31",
            "master_term": null,
            "past": true
          },
          {
            "termid": "200002",
            "sectionid": "45002",
            "name": "Autumn 2025",
            "startdate": "2025-09-01",
            "enddate": "2025-12-31",
            "master_term": null,
            "past": false
          }
        ]
      },
      "global_roles": [],
      "hasSectionAccess": true,
      "notepads": [],
      "sockets": "45001-abc123,45002-abc123,45003-abc123",
      "user_socket": "100001-abc123",
      "session_id": "abc123def456abc123def456abc123def456abc123def456abc123def456abc1",
      "security_prompt": false,
      "user_has_image": "/sites/onlinescoutmanager.co.uk/public/user_photos/100000/100001/00000000-0000-0000-0000-000000000000",
      "user_hash": "abc123def456abc123def456abc123def456abc123def456abc123def456abc1",
      "user_hash_legacy": "abc123def456abc123def456abc123def456abc123def456abc123def456abc1",
      "language": "en-GB",
      "gamification": {
        "1": {
          "total_steps": 3,
          "steps_completed": 2,
          "id": 1
        },
        "events": {
          "total_steps": 10,
          "steps_completed": 7,
          "id": 2
        }
      },
      "gamification_rank": 500,
      "gamification_total": 100000,
      "features_used": [
        "accessed",
        "viewed events",
        "… 2 more"
      ],
      "unread_message_count": 0,
      "client_time": "1700000000000"
    },
    "dojo": {
      "cacheBust": "v=abc123",
      "locale": "en-gb"
    }
  },
  "meta": []
}
```

Example — Response for action=getConfigPayload:

```json
{
  "status": true,
  "error": null,
  "data": {
    "site_type": "scouts",
    "site_folder": "sites/onlinescoutmanager.co.uk/site",
    "siteConfig": {
      "disableParentRota": false,
      "expense_cards": {
        "fees": {
          "card_issuing": 10,
          "lost_dispute": 20,
          "fx_percentage": 3,
          "cross_border": {
            "percentage": 2,
            "fixed": 0.3
          }
        },
        "maximum_overdrawn_charges": 10
      },
      "online_payment_gateways": [
        "gocardless",
        "stripe"
      ],
      "beta": [
        {
          "key": "recipes",
          "title": "Recipes & Event Menus",
          "description": "Community driven recipe database with instructions for young people.",
          "role": "all",
          "release_ts": 1638205905
        },
        {
          "key": "waiting_list_invites",
          "title": "Waiting List Invites",
          "description": "Adds survey and invitation features to waiting list Personal Details.",
          "role": "all",
          "release_ts": 1772443731,
          "feedback": {
            "min_usage": 1,
            "mode": "new",
            "feature": "waiting list survey or invitation"
          }
        },
        "… 2 more"
      ],
      "boltons": {
        "b": "badges",
        "c": "campsiteexternalbookings",
        "d": "details",
        "e": "events",
        "m": "emailbolton",
        "p": "programme",
        "a": "accounts",
        "f": "filestorage",
        "r": "chat",
        "i": "ai",
        "t": "tasks",
        "h": "at_home"
      },
      "hasOnlinePayments": true,
      "upgrade_config": {
        "badges": {
          "price": 1
        },
        "events": {
          "price": 10
        },
        "ai": {
          "price": 7.5
        },
        "programme": {
          "price": 1
        },
        "details": {
          "price": 2.5
        },
        "emailbolton": {
          "price": 4.5
        },
        "filestorage": {
          "price": 5
        },
        "silver": {
          "price": 18
        },
        "gold": {
          "price": 24
        },
        "campsiteexternalbookings": {
          "price": 36
        },
        "chat": {
          "price": 2.5
        },
        "at_home": {
          "price": 10
        },
        "accounts": {
          "price": 20
        },
        "tasks": {
          "price": 2.5
        }
      },
      "sms_prices": {
        "250": 14.25,
        "500": 28,
        "1000": 55
      },
      "hideSmsOriginator": false,
      "filestorage_bolton": true,
      "chat_bolton": true,
      "whatsnew": true,
      "risk_assessments": true,
      "recipes": {
        "meals": [
          "breakfast",
          "snack",
          "… 4 more"
        ],
        "methods": [
          "stove",
          "oven",
          "… 4 more"
        ],
        "suitability": [
          "vegetarian",
          "vegan",
          "… 9 more"
        ],
        "allergies": [
          "meat",
          "animal",
          "… 9 more"
        ],
        "aisles": [
          "dairy",
          "deli",
          "… 15 more"
        ]
      },
      "hideMyPermissions": false,
      "events_attachments_quota": 50,
      "events_attachments_quota_private": -1,
      "user_can_delete_section": true,
      "add_invoices_to_events": false,
      "hide_user_active_subscriptions": false,
      "user_can_rename_self": true,
      "members_discoverable": false,
      "event_approvals_config": {
        "assign": false
      },
      "events_force_allow_changes": "configurable",
      "events_prevent_deadline_change": false,
      "hide_age_after": 25,
      "hq_terms": false,
      "default_currency": "GBP",
      "ask_communication_preferences": false,
      "email_list_domain": "lists.onlinescoutmanager.co.uk",
      "waiting_list_application": [
        "contact_primary_1",
        "contact_primary_2"
      ],
      "myscout": "Parent Portal",
      "communicatable_emails_use_opt_ins": [],
      "allowFutureJoinedMovement": false,
      "joinedMovementOptional": false,
      "hideExternalAccess": false,
      "support_network": false,
      "support_network_personal": false,
      "support_network_disabled_section_types": [],
      "event_shared_member_record_cards": false,
      "…": "105 more keys"
    },
    "patrolLabels": {
      "scouts": {
        "patrol": "Patrol",
        "patrols": "Patrols"
      },
      "cubs": {
        "patrol": "Six",
        "patrols": "Sixes"
      },
      "beavers": {
        "patrol": "Lodge",
        "patrols": "Lodges"
      },
      "explorers": {
        "patrol": "Patrol",
        "patrols": "Patrols"
      },
      "network": {
        "patrol": "Patrol",
        "patrols": "Patrols"
      },
      "adults": {
        "patrol": "Section / Role",
        "patrols": "Sections"
      },
      "earlyyears": {
        "patrol": "Nest",
        "patrols": "Nests"
      },
      "juniornavigators": {
        "patrol": "Team",
        "patrols": "Teams"
      },
      "seniornavigators": {
        "patrol": "Team",
        "patrols": "Teams"
      },
      "aucubs": {
        "patrol": "Six",
        "patrols": "Sixes"
      }
    },
    "patrolRoles": {
      "scouts": [
        {
          "level": 0,
          "label": "Normal",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        {
          "level": 1,
          "label": "Assistant Patrol Leader",
          "abbr": "APL",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "… 2 more"
      ],
      "cubs": [
        {
          "level": 0,
          "label": "Normal",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        {
          "level": 1,
          "label": "Seconder",
          "abbr": "2nd",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "… 2 more"
      ],
      "beavers": [
        {
          "level": 0,
          "label": "Normal",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        {
          "level": 1,
          "label": "Assistant Lodge Leader",
          "abbr": "ALL",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "… 2 more"
      ],
      "explorers": [
        {
          "level": 0,
          "label": "Normal",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        {
          "level": 1,
          "label": "Assistant Patrol Leader",
          "abbr": "APL",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "… 2 more"
      ],
      "earlyyears": [
        {
          "level": 0,
          "label": "Normal",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        }
      ],
      "adults": {
        "0": {
          "level": 0,
          "label": "Unspecified",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "1": {
          "level": 1,
          "label": "Section Team Member",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "2": {
          "level": 2,
          "label": "Section Team Leader",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "3": {
          "level": 3,
          "label": "Young Leader",
          "abbr": "YL",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "6": {
          "level": 6,
          "label": "Group Lead Volunteer",
          "abbr": "GLV",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "7": {
          "level": 7,
          "label": "Chair",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "8": {
          "level": 8,
          "label": "Treasurer",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "9": {
          "level": 9,
          "label": "Secretary",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        },
        "15": {
          "level": 15,
          "label": "Trustee",
          "abbr": "",
          "changes": null,
          "census_costs": false,
          "visibility": 0,
          "allow_duplicates": true,
          "archived": 0
        }
      }
    },
    "extraSectionTypes": {
      "staged": "n/a",
      "adults": "Adults",
      "aucubs": "Australian Cubs",
      "zadventure": "Adventure",
      "campsite": "Campsite",
      "national": "National Office"
    },
    "featurelevels": {
      "addbadge": 3,
      "badgeeligibility": 3,
      "badge_records": 1,
      "badgepdf": 3,
      "badgespreadsheet": 3,
      "calendarsync": 3,
      "census": 3,
      "eventdownload": 3,
      "events": 2,
      "eventsharing": 2,
      "exportemail": 2,
      "exportpatrolpdf": 3,
      "extrapdf": 3,
      "extras": 2,
      "filestorage": 3,
      "finances": 3,
      "genericpdf": 3,
      "giftaid": 3,
      "helloworld": 99,
      "ics": 3,
      "intouchpdf": 2,
      "mobile": 2,
      "outstanding": 2,
      "printoutstanding": 3,
      "programmepdf": 3,
      "quartermaster": 3,
      "recordcard": 3,
      "register": 2,
      "registerpdf": 3,
      "reporting": 1,
      "sendemail": 2,
      "sharebadgestock": 3,
      "showprogrammeinbadgerecords": 3,
      "spreadsheet": 3,
      "survey": 3,
      "recipes": 3,
      "risk_assessments": 3,
      "badgewizard": 3,
      "activity": 2,
      "badgestock": 1,
      "…": "2 more keys"
    },
    "changedlevels": [],
    "availableRoles": {
      "nobody": "Nobody",
      "siteadministrator": "OSM Site Administrator"
    },
    "globalAccessRoles": [
      {
        "user_role": "siteadministrator",
        "access_type": "kill_switches",
        "id": "n/a"
      },
      {
        "user_role": "_support",
        "access_type": "audit_member_support",
        "id": "*"
      },
      "… 3 more"
    ],
    "terminology": {
      "Level_1": "Group",
      "Level_2": "District",
      "Level_3": "County",
      "Level_4": "Region/Area",
      "Level_5": "Country",
      "Level_6": "Association"
    },
    "forms": [
      {
        "name": "Accident Forms",
        "menu_config": [
          {
            "reference": "ext.members.health",
            "menu": "members",
            "area": "members",
            "offline": false,
            "order": 10,
            "subscription_feature": "accidentforms",
            "title": "Accident Forms",
            "title_is_translated": true,
            "react": "ext_forms_FormListPane"
          }
        ]
      },
      {
        "name": "Medication History",
        "menu_config": [
          {
            "reference": "ext.members.medication",
            "menu": "members",
            "area": "members",
            "offline": false,
            "order": 11,
            "subscription_feature": "accidentforms",
            "title": "Medication History",
            "title_is_translated": true,
            "react": "ext_forms_FormListPane"
          }
        ]
      },
      "… 2 more"
    ],
    "default_terminology": {
      "section": "section",
      "sections": "sections",
      "Section": "Section",
      "Sections": "Sections",
      "Group": "Group",
      "group": "group",
      "District": "District",
      "Level_1": "Group",
      "Level_2": "District",
      "Level_3": "Area",
      "Level_4": "Country",
      "Level_5": "",
      "Level_6": ""
    },
    "leaderPatrolIds": [
      -2,
      -3
    ]
  },
  "meta": []
}
```

**Response 410** — Gone — `action=getData` has been permanently removed. HTTP 410 Gone is the only reply you will ever receive for that action.
