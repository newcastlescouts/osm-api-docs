# General Requests
API Requests which don't fit into another category


## Get General Data
Get an indication of which badges are covered in a term, with a weight per badge to show how many times it has been covered.

<aside class="notice">
This API endpoint returns JavaScript code rather than a JSON response. By disregarding the first 18 characters, this can be fixed (e.g. in PHP <code>$data = substr($data, 18)</code> )
</aside>

> Example Response (a lot of this data has been ommitted as it is irrelevant to 99% of use cases)

```json
var data_holder = {
    "globals": {
        "email": "your.osm.email@newcastlescouts.org.uk",
        "firstname": "Joe",
        "fullname": "Joe Bloggs",
        "hasSectionAccess": true,
        "lastname": "Bloggs",
        "member_access": {
            "12345": {
                "abbrv": "Cubs",
                "access": true,
                "config": {
                    "at_home": false,
                    "attachments": false,
                    "badges": true,
                    "chat": false,
                    "details": true,
                    "emailbolton": true,
                    "events": true,
                    "giftaid": true,
                    "payments": true,
                    "photos": true,
                    "programme": true
                },
                "group": "1st Newcastle (Example)",
                "label": "Cubs",
                "members": {
                    "_nclscoutsapinote": "This only iterates for you (and your own children)",
                    "2211000": {
                        "first_name": "Leader",
                        "last_name": "Name",
                        "photo_guid": "00000000-0000-0000-0000-000000000000",
                        "abbrv_name": "Joe",
                        "chat_rooms": [],
                        "access_type": "member",
                        "has_unread_chat_rooms": false,
                        "abbrv": "Joe",
                        "pane_abbrv": "Joe",
                        "permissions": true,
                        "patrol": "Leaders"
                    }
                }
            }
        },
        "notepads": {
            "10000": {
                "raw": "Example",
                "html": "<p>Example</p>"
            }
        },
        "sectionConfig": {
            "subscription_level": 3,
            "subscription_expires": "2022-01-01",
            "section_type": "cubs",
            "sectionType": "cubs",
            "parentSectionId": "0",
            "subscription_lastExpires": "2021-01-01",
            "subscription_active": false,
            "portal": {
                "events": 1,
                "programme": 1,
                "badges": 1,
                "details": 1,
                "emailbolton": 1,
                "eventRemindFrequency": "-1",
                "eventRemindCount": "-1",
                "programmeSummary": "1",
                "programmeTimes": "1",
                "programmeShow": "0",
                "programmeParentHelp": "no",
                "badgesPartial": "0",
                "showStore": 0,
                "personalDetailsHeader": "Personal Details Header",
                "emailAddress": "1st Example Cubs <cubs@examplescouts.org.uk>",
                "emailAddressCopy": "",
                "programmeDownloadButton": "0",
                "badgesEmail": "0",
                "charityName": "1st Newcastle (Example) Scout Group",
                "easyfundraising": "https://www.easyfundraising.org.uk/causes/49thns/",
                "email_archive_disable": true,
                "email_archive_dob": true,
                "eventIcs": 1,
                "badgesShowRequirements": true,
                "usedGiftAid": "2022-01-01",
                "programmeIcs": "1",
                "programmeShowBadges": "0",
                "programmeAllowInformedAbsence": "1",
                "badgesHomework": "badge",
                "chat": 0,
                "accounts": 1,
                "payments": 1,
                "autoGiftAid": "1",
                "paymentRemindFrequency": "5",
                "paymentRemindCount": "3",
                "invitesRequired": false,
                "photos": true,
                "showPatrol": true,
                "disabledContacts": []
            },
            "portalExpires": {
                "events": "2022-10-02",
                "eventsA": 0,
                "programme": "2022-10-02",
                "programmeA": 0,
                "badges": "2022-10-02",
                "badgesA": 0,
                "details": "2022-10-02",
                "detailsA": 0,
                "emailbolton": "2022-10-02",
                "emailboltonA": 0,
                "chat": "2021-08-29",
                "chatA": 0,
                "accountsA": 2,
                "accounts": "2023-03-22"
            },
            "hasUsedBadgeRecords": true,
            "extraRecords": {
                "5": {
                    "name": "Example Record",
                    "extraid": "12345"
                }
            },
            "qmshare": {
                "1": true
            },
            "subscription_cancelled": "2015-01-01",
            "meeting_day": "Thu",
            "config_subscriptions_checked": "2022-01-01",
            "subscription_pred_lvl": 3,
            "subscription_pred_exp": "2022-10-02",
            "gocardless": "true",
            "discountcodes": [
                "ExampleAPICode"
            ],
            "organisation_imported_section_id": "10000000",
            "hierarchy_lowest_level": "level_1",
            "hierarchy_operating_level": "level_0"
        },
        "terms": {
            "12345": [
                {
                    "enddate": "2022-01-01",
                    "master_term": null,
                    "name": "Example Term",
                    "past": true,
                    "sectionid": "12345",
                    "termid": "54321"
                } 
            ]
        }
    }
}
```

### HTTP Request

`GET https://www.onlinescoutmanager.co.uk/ext/generic/startup/?action=getData`