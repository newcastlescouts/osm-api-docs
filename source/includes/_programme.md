# Programme
This contains all API nodes accessed in the 'Programme' category of OSM.

## Get Programme Overview
Get an overview of all meetings in a term, including the date, name and parent rota information.

> Example Response

```json
{
    "items": [
        {
            "eveningid": "1111111",
            "sectionid": "12345",
            "title": "My Evening",
            "notesforparents": "Beavers will return on the first Monday of the new school term.",
            "notesforhelpingparents": null,
            "parentsrequired": "1",
            "games": "Games Notes from OSM",
            "prenotes": "Pre-Meeting Notes from OSM",
            "postnotes": "Post-Meeting Notes from OSM",
            "leaders": "Example will be unavailable \n",
            "meetingdate": "2022-04-01",
            "starttime": "18:00:00",
            "endtime": "19:00:00",
            "config": "{\"parent_help_reminder_sent\":\"2022-04-01\"}",
            "googlecalendar": null,
            "soft_deleted": "0",
            "parentsattendingcount": "1"
        }
    ]
}
```

### HTTP Request

`GET https://www.onlinescoutmanager.co.uk/ext/programme/?action=getProgrammeSummary`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | The Section ID
termid | The Term ID

## Get Badge Tag Cloud
Get an indication of which badges are covered in a term, with a weight per badge to show how many times it has been covered.

> Example Response

```json
{
    "tags": {
        "community": 1,
    },
    "tag_count": 1,
    "badges": {
        "sites\/onlinescoutmanager.co.uk\/badge_images\/img_231870.png": 1,
    }
}
```

### HTTP Request

`GET https://www.onlinescoutmanager.co.uk/ext/programme/clouds/?action=getBadgeTagCloud`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | The Section ID
termid    | The Term ID
section   | The section type (`squirrels`, `beavers`, `cubs`, `scouts`, `explorers`)


## Show Programme Risk Assessment
Show general programme risks added via OSM.

> Example Response

```json
{
    "status": true,
    "error": null,
    "data": [
        {
            "name": "Example Category"
        },
        {
            "name": "General Risks"
        }
    ],
    "meta": {
        "itemstore": {
            "identifier": "name"
        }
    }
}
```

### HTTP Request

`GET https://www.onlinescoutmanager.co.uk/v3/risk_assessments/<section id>/categories`

### Query Parameters

N/A


## Get Badge Tag Cloud
Get an indication of which badges are covered in a term, with a weight per badge to show how many times it has been covered.

> Example Response

```json
{
    "tags": {
        "community": 1,
    },
    "tag_count": 1,
    "badges": {
        "sites\/onlinescoutmanager.co.uk\/badge_images\/img_231870.png": 1,
    }
}
```

### HTTP Request

`GET https://www.onlinescoutmanager.co.uk/ext/programme/clouds/?action=getBadgeTagCloud`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | The Section ID
termid    | The Term ID
section   | The section type (`squirrels`, `beavers`, `cubs`, `scouts`, `explorers`)


## Get Meeting Details
Get details about a given meeting

> Example Response

```json
{
    "items": [
        {
            "eveningid": "1111111",
            "sectionid": "12345",
            "title": "Example Meeting",
            "notesforparents": "Beavers will return on the first Monday of the new school term.",
            "notesforhelpingparents": null,
            "parentsrequired": "1",
            "games": "",
            "prenotes": "",
            "postnotes": "",
            "leaders": "Example will be unavailable \n",
            "meetingdate": "2022-04-01",
            "starttime": "18:00:00",
            "endtime": "19:00:00",
            "config": {
                "parent_help_reminder_sent": "2022-04-01"
            },
            "googlecalendar": null,
            "soft_deleted": "0",
            "help": [
                {
                    "scoutid": "2345678",
                    "scout": "Example Child",
                    "_nclScoutsNote": "(This is a list of parent helpers)"
                }
            ],
            "unavailableleaders": [
                {
                    "member_id": 1234567,
                    "firstname": "Example",
                    "lastname": "Leader"
                }
            ]
        }
    ],
    "badgelinks": {
        "6171007": [
            {
                "picture": "sites\/onlinescoutmanager.co.uk\/badge_images\/img_231881.png",
                "link_relation_id": "9677397",
                "badge_id": "1525",
                "badge_version": "0",
                "column_id": "114235",
                "badge": "1525_0",
                "badgeLongName": "Global Issues",
                "badgetype": "activity",
                "badgetypeLongName": "Activity",
                "columnname": "114235",
                "columnnameLongName": "A: Endangered animals = Eco Evening",
                "data": "Eco Evening",
                "section": "beavers",
                "same_as": [],
                "sectionLongName": "Beavers",
                "label": "Activity: Global Issues - Endangered animals"
            }
        ]
    }
}
```

### HTTP Request
`GET  https://www.onlinescoutmanager.co.uk/ext/programme/?action=getProgramme`

### Query Parameters

Parameter | Description
--------- | -----------
sectionid | The Section ID
termid    | The Term ID
eveningid | The Meeting ID


## View Meeting Attachments
Get an indication of which badges are covered in a term, with a weight per badge to show how many times it has been covered.

> Example Response

```json
{
    "note": [
        "This contains a configuration of what files the server will accept",
        "We've never used this endpoint, so can't extensively document it."
        ]
}
```

### HTTP Request

`GET https://www.onlinescoutmanager.co.uk/ext/programme/?action=programmeAttachmentsManifest`

### Query Parameters

Parameter | Description
--------- | -----------
section_id | The Section ID
id    | The Meeting ID
evening_id   | The Meeting ID (again)
path | Unknown (`/`)
temp | Unknown (`false`)
upload_mode | Unknown (`programme`)