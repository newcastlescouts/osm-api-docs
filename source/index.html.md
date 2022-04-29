---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - json

toc_footers:
  - <a href='https://onlinescoutmanager.co.uk'>Online Scout Manager</a>
  - <a href='https://github.com/newcastlescouts/osm-api-docs'>Available on GitHub</a>

includes:
  - members
  - programme

search: true

code_clipboard: true

meta:
  - name: description
    content: Documentation of the Online Scout Manager API
---

# Introduction

Welcome to the unofficial Online Scout Manager documentation. This is an (incomplete) mapping of the OSM API, as observed in HTTP requests.

This documentation only really contains API routes we've used internally within City of Newcastle Scouts, though external contribution is always welcome - simply submit a pull request on GitHub!

# Authentication

By visiting `Settings` -> `My Account Details` -> `Developer Tools`, you are able to create a new application and create an OAuth client.

### A note on rate limiting
OSM has rate limits on all API Endpoints. If your application is sending too many requests, you can be temporarily or permenantely blocked from the API.

To avoid being rate limited, monitor the following headers in any response:
- **X-RateLimit-Limit** - how many requests/hour your client can perform
- **X-RateLimit-Remaining** - how many requests are remaining until your client will be blocked
- **X-RateLimit-Reset** - how long unnntil the ratelimit is reset (in seconds).

A HTTP 429 status code will be sent if your application has been rate limited.

<aside class="notice">
It is strongly encouraged to enforce your own ratelimits on any application, rather than relying on OSM's applications - especially if unauthenticated users are able to manipulate data, e.g. by joining a waiting list.
</aside>
