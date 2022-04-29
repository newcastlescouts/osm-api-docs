# Members
This contains all API nodes accessed in the 'Members' category of OSM.

## Get List of Members
Get a list of all members in a given section.

> Example Response

```json
{
    "identifier": "scoutid",
    "photos": true,
    "items": [
        {
            "firstname": "Joe",
            "lastname": "Smith",
            "photo_guid": "00000000-0000-0000-0000-000000000000",
            "patrolid": 12345,
            "patrol": "Green",
            "sectionid": 54321,
            "enddate": null,
            "age": "6 \/ 0",
            "patrol_role_level_label": "",
            "active": true,
            "scoutid": 1000001,
            "full_name": "Joe Smith"
        },
        {
            "firstname": "Jane",
            "lastname": "Smith",
            "photo_guid": "00000000-0000-0000-0000-000000000000",
            "patrolid": 12346,
            "patrol": "Blue",
            "sectionid": 54321,
            "enddate": null,
            "age": "6 \/ 5",
            "patrol_role_level_label": "",
            "active": false,
            "scoutid": 1000002,
            "full_name": "Jane Smith"
        }
    ]
}
```

### HTTP Request

`GET https://onlinescoutmanager.co.uk/ext/members/contact/?action=getListOfMembers`

### Query Parameters

Parameter | Description
--------- | -----------
sort | What the returned members should be sorted by (`dob`, `firstname`, `lastname`, `patrol`)
sectionid | The Section ID
termid | The Term ID
section | The type of section (`squirrels`, `beavers`, `cubs`, `scouts`, `explorers`)

## Get Individual Member Info
Get information about an individual member.

> Example Response

```json
{
    "ok": true,
    "read_only": [],
    "data": {
        "scoutid": "1234567",
        "firstname": "Joseph",
        "lastname": "Thomas",
        "photo_guid": null,
        "dob": "2016-01-10",
        "started": "2022-01-01",
        "created_date": "2021-09-18 00:00:00",
        "last_accessed": "2022-04-21 00:00:00",
        "patrolid": "10001",
        "patrolleader": "0",
        "startedsection": "2022-02-01",
        "enddate": null,
        "age": "6 years and 0 months",
        "age_simple": "06 \/ 00",
        "sectionid": 12345,
        "active": true,
        "meetings": "0"
    },
    "meta": []
}
```

### HTTP Request

`GET https://onlinescoutmanager.co.uk/ext/members/contact/?action=getIndividual`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | The Section ID
scoutid   | The member's unique identifier
termid    | The term to retrieve data for
context   | The context you are requesting data in (`members`)

## Get  Member's Data
Get personal data about a member.

<aside class="warning">
This endpoint will return <strong>all</strong> contact data and emergency data. For GDPR purposes, ensure this is used safely.
</aside>

> Example Response

```json
{"note": "This is a ~1000 line JSON document per child. To read it, we'd suggest opening Inspect Element -> Network while using OSM."}
```

### HTTP Request

`GET https://onlinescoutmanager.co.uk/ext/members/contact/?action=getIndividual`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | The Section ID
scoutid   | The member's unique identifier
termid    | The term to retrieve data for
context   | The context you are requesting data in (`members`)

## Get Patrols
Get a list of all patrols/sixes/lodges with members.

<aside class="notice">
Patrols with negative IDs are 'special patrols' - notably, -3: Young Leaders, -2: Leaders (usually).
</aside>

> Example Response

```json
{
    "-3": {
        "patrolid": "-3",
        "sectionid": "-2",
        "name": "Young Leaders (YLs)",
        "active": "1",
        "points": "0",
        "census_costs": false,
        "members": []
    },
    "-2": {
        "patrolid": "-2",
        "sectionid": "-2",
        "name": "Leaders",
        "active": "1",
        "points": "0",
        "census_costs": false,
        "members": []
    },
    "12345": {
        "patrolid": "10001",
        "sectionid": "12345",
        "name": "Blue",
        "active": "1",
        "points": "4",
        "census_costs": false,
        "members": [
            {
                "firstname": "John",
                "lastname": "Smith",
                "scout_id": 1234567,
                "photo_guid": "00000000-0000-0000-0000-000000000000",
                "patrolid": 12345,
                "patrolleader": "0",
                "patrol": "Blue",
                "sectionid": 54321,
                "enddate": null,
                "age": "7 \/ 10",
                "patrol_role_level_label": "",
                "active": 1,
                "scoutid": 1234567,
                "editable": true
            }
        ]
    }
}
```

### HTTP Request

`GET https://onlinescoutmanager.co.uk/ext/members/patrols/?action=getPatrolsWithPeople`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | Section ID
termid    | The term to retrieve data for
include_no_patrol   | Include a pseudo-patrol for members not in a patrol (ID -1). (`y`, `n`)

## Get Census Details
Get a list of all members who do not have census data entered for them.

> Example Response

```json
{
    "identifier": "scoutid",
    "items": [
        {
            "scoutid": "1234567",
            "firstname": "Example",
            "lastname": "User",
            "joined": "2022-03-01",
            "photo_guid": null,
            "sex": "",
            "ethnicity": "",
            "disabilities": "Edit disabilities",
            "myscout": "Send Parent Portal email",
            "raw_disabilities": [],
            "_filterString": "example user"
        }
    ]
}
```

### HTTP Request

`GET https://onlinescoutmanager.co.uk/ext/members/census/?action=getDetails`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | Section ID
termid    | Term ID to get data for

## Get Flexi-Records
Get a list of all flexi-records.

> Example Response

```json
{
    "identifier": "extraid",
    "label": "name",
    "items": [
        {
            "extraid": "23456",
            "name": "My Flexi-Record"
        }
    ]
}
```

### HTTP Request

`GET https://onlinescoutmanager.co.uk/ext/members/flexirecords/?action=getPatrolsWithPeople`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | Section ID
archived  | Toggle archived or non-archived flexi-records (you cannot show both at the same time). (`y`, `n`)

## Get Members Pending Transfer
Get a list of all members pending a transfer to/from another group/section.

> Example Response

```json
{
    "status": true,
    "error": null,
    "data": [
        {
            "direction": "from",
            "member_id": 1234567,
            "firstname": "Josh",
            "lastname": "Smith",
            "photo_guid": "00000000-0000-0000-0000-000000000000",
            "type": "transferred",
            "date": "2022-02-01",
            "section_id": 654321,
            "section_name": {
                "group": "Example Newcastle",
                "section": "Scouts"
            },
            "section_long": "Example Newcastle: Scouts",
            "mode": "outgoing",
            "id": "outgoing-987654"
        }
    ],
    "meta": []
}
```

### HTTP Request

`GET https://www.onlinescoutmanager.co.uk/ext/members/contact/?action=getMemberTransfers`

### Query Parameters

Parameter  | Description
---------  | -----------
mode       | The display mode (we're only aware of the value `grid` being used here)
section_id | Section ID

## Get Deletable Members
Get a list of members who have been in your section, yet are no longer active in any OSM section.

> Example Response

```json
{
    "status": true,
    "error": null,
    "data": [
        {
            "firstname": "Example",
            "lastname": "Cub",
            "date_deleted": "2022-04-01",
            "id": 1234567
        }
    ],
    "meta": []
}
```

### HTTP Request

`GET https://www.onlinescoutmanager.co.uk/v3/members/review/deletion/<sectionid>`

### Query Parameters

Parameter  | Description
---------  | -----------
mode       | The display mode (we're only aware of the value `grid` being used here)
section_id | Section ID