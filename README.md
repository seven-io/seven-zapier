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
# Run the Jest test suite. NOTE: the generated tests hit the real seven.io API
# and require a valid ACCESS_TOKEN / REFRESH_TOKEN in .env to pass. They are
# intentionally not part of CI — treat them as a local smoke-test tool.
npm test

# Validate the integration definition against the Zapier schema
zapier-platform validate

# Invoke a trigger/create/search against the real seven.io API without pushing
zapier-platform invoke creates send_sms --inputData '{"to":"+49...","text":"hi"}'

# Tail logs from the live integration while triggering Zaps
zapier-platform logs
```

## Deployment

Version bumps + `zapier-platform push` are automated via a GitHub Actions
**Release** workflow you trigger manually. Promote and migrate stay on your
laptop because they touch real user Zaps.

**Full step-by-step: [RELEASING.md](./RELEASING.md).** Read it before your
first release.

TL;DR:

1. GitHub → **Actions** → **Release** → Run workflow → pick bump type.
2. Test the new private version on your own Zapier account.
3. `zapier-platform promote <new-version>` — default for new users.
4. `zapier-platform migrate <old-version> <new-version>` — move existing users.

## CI / CD

Two GitHub Actions workflows live in `.github/workflows/`:

- **`pr.yml`** — runs on every PR against `main` and on pushes to `main`.
  Installs deps and runs `zapier-platform validate`. No secrets needed.
- **`release.yml`** — `workflow_dispatch` only. Bumps the version (patch /
  minor / major), tags it, and pushes to Zapier. Requires the repository
  secret `ZAPIER_DEPLOY_KEY`.

### One-time setup: `ZAPIER_DEPLOY_KEY`

1. Log in to the Zapier CLI locally: `zapier-platform login`
2. Grab the deploy key from `~/.zapierrc` (the `deployKey` field)
3. In GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**, name it `ZAPIER_DEPLOY_KEY`, paste the value.

Without this secret the release workflow will fail at the push step, but the
version bump and tag will still have been created — so rerun after adding it
or clean up the orphan tag manually.

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
