# seven — Zapier Integration

Official Zapier integration for [seven.io](https://www.seven.io) — send SMS and
text-to-speech calls, receive SMS via webhook, run phone-number lookups (HLR,
MNP, CNAM, format), and query analytics & journal data.

Source of truth for the `seven` integration on the Zapier Developer Platform
(integration ID `139390`, slug `Sms77`). Migrated from the Visual Builder on
2026-04-21; further development happens from this repo via the Zapier CLI.

## What's inside

**Triggers**
- `sms_mo` — incoming SMS (inbound webhook)
- `voice_call` — incoming voice call (inbound webhook)

**Creates**
- `send_sms` — send an SMS
- `voice` — place a text-to-speech call
- `hlr` — HLR phone-number lookup
- `mnp` — MNP (number-portability) lookup
- `cnam` — CNAM (caller-name) lookup
- `number_format` — format / validate a phone number
- `register_webhook` — subscribe a webhook on the seven side

**Searches**
- `analytics` — pull analytics data
- `journal` — query the seven journal (sent messages, status, etc.)

Authentication is OAuth 2.0 against `https://oauth.seven.io`.

## Prerequisites

- Node.js `>= 22` (matches `package.json` engines and Zapier's current runtime)
- A Zapier developer account with access to the `seven` integration
- The Zapier Platform CLI:
  ```sh
  npm install -g zapier-platform-cli
  zapier-platform login
  ```

## Setup

```sh
git clone git@github.com:seven-io/seven-zapier.git
cd seven-zapier
npm install
cp .env.example .env
# fill in CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN, REFRESH_TOKEN
```

`.zapierapprc` is committed and already links this checkout to integration
`139390`. No `zapier-platform link` / `register` needed.

## Local development

```sh
# Run the Jest test suite
npm test

# Validate the integration definition against the Zapier schema
zapier-platform validate

# Invoke a trigger/create/search against the real seven.io API without pushing
zapier-platform invoke creates send_sms --inputData '{"to":"+49...","text":"hi"}'

# Tail logs from the live integration while triggering Zaps
zapier-platform logs
```

## Deployment

The integration is **not** pushed automatically. Every release is a manual
`push` + `promote`.

```sh
# 1. Bump version in package.json (semver: patch for fixes, minor for features)

# 2. Upload this version to Zapier (creates/updates the version in the dashboard,
#    but does not affect existing users' Zaps until it's promoted)
zapier-platform push

# 3. Make sure the runtime env vars are set on the new version
zapier-platform env:set <version> CLIENT_ID=... CLIENT_SECRET=...

# 4. Promote when the new version is proven (e.g. tested by the team on their
#    own account). This makes it the default for new users.
zapier-platform promote <version>

# 5. Migrate existing users from the previous version
zapier-platform migrate <old-version> <new-version>
```

See the Zapier docs for the full
[version lifecycle](https://docs.zapier.com/platform/build/deployment) and
[migration mechanics](https://docs.zapier.com/platform/build/migrate).

## Legacy scripting runner

`scripting.js` plus the `legacy` block in `index.js` keep compatibility with
the behavior the integration had in the Visual Builder. Rewriting those pieces
as native CLI code is tracked as a long-term improvement — no action needed
for day-to-day changes.

## Conventions

- Code comments in English.
- Never push with `--no-verify`.
- Do not commit `.env` (already gitignored).
- `.zapierapprc` stays committed so checkouts are linked out of the box.

## Links

- Integration dashboard: <https://developer.zapier.com/app/139390/versions>
- Public app listing: <https://zapier.com/apps/seven/integrations>
- seven API docs: <https://docs.seven.io>
- Zapier Platform CLI docs: <https://docs.zapier.com/platform/reference/cli-docs>
