# Releasing a new version

End-to-end checklist for shipping a new version of the seven Zapier
integration. Work through it top to bottom — skip no step.

## TL;DR (happy path)

1. Merge all PRs to `main`.
2. GitHub → **Actions** → **Release** → **Run workflow** → pick bump type → **Run**.
3. Wait for the workflow to finish green. A new private CLI version now lives on Zapier.
4. Install it on your own Zapier account via the private share link and test.
5. When happy: `zapier-platform promote <new-version>` — makes it default for new users.
6. After a day or two: `zapier-platform migrate <old-version> <new-version>` — moves existing users over.

---

## 0 — Before you start

- [ ] Working tree clean? (`git status`)
- [ ] Up to date with `origin/main`? (`git pull`)
- [ ] Zapier CLI logged in? (`zapier-platform integrations` should list seven)
- [ ] **`CHANGELOG.md` updated with a new `## <new-version>` section** describing user-facing changes. Zapier refuses to `promote` without this. Use "Update" / "Fix" prefixes and `trigger|create|search/<key>` identifiers where applicable — see Zapier's [changelog format](https://docs.zapier.com/platform/reference/cli-docs#changelogmd).
- [ ] GitHub repo has the `ZAPIER_DEPLOY_KEY` secret set (Settings → Secrets → Actions). Without it, step 1 of the workflow will fail.
- [ ] Decide which bump type you want:

  | Bump | When | Example |
  |---|---|---|
  | `patch` | Bug fix, typo, docs, internal cleanup. No user-visible change. | `2.0.2` → `2.0.3` |
  | `minor` | New trigger / create / search, new optional input field. Backwards-compatible. | `2.0.2` → `2.1.0` |
  | `major` | Breaking change — renamed / removed fields, auth changes, changed output shape. Existing Zaps will need adjustment. | `2.0.2` → `3.0.0` |

  **If in doubt, pick `patch`.** You can always release another.

## 1 — Run the Release workflow

1. Open <https://github.com/seven-io/seven-zapier/actions/workflows/release.yml>
2. Click **Run workflow** (top right)
3. Select the bump type from the dropdown
4. Click the green **Run workflow** button and wait

The workflow does, in order:

1. `zapier-platform validate` — aborts if the integration is broken
2. `npm version <bump>` — bumps `package.json` + creates a commit + git tag
3. `git push --follow-tags origin main` — tag and commit land on `main`
4. `zapier-platform push` — uploads the new version to Zapier (private, not live yet)
5. `gh release create` — creates a GitHub Release with auto-generated notes

If step 4 or 5 fails, the bump commit is already on `main`. See **Recovery** below.

## 2 — (First CLI release only) Set runtime env vars

Only needed the very first time you push a CLI version to Zapier. On later
releases these values are copied forward automatically.

```sh
git pull
zapier-platform env:set $(node -p 'require("./package.json").version') \
    CLIENT_ID=<prod-client-id> \
    CLIENT_SECRET=<prod-client-secret>
```

Verify with:

```sh
zapier-platform env:get $(node -p 'require("./package.json").version')
```

## 3 — Test on your own account

The new version is **private** — only you and teammates invited by share link can install it.

### 3a — Automated auth smoke (if `ZAPIER_CI_AUTH_ID` is configured)

The Release workflow already ran `zapier-platform invoke auth test` against the new version on Zapier's production servers. Green = OAuth + HTTP + response parsing all work end-to-end. See "One-time smoke-test setup" at the bottom of this doc if it's being skipped.

Run it locally against any pushed version:

```sh
export CI_AUTH_ID=<your-zapier-app-connection-id>
npm run smoke
```

### 3b — Manual UI test (still required before promoting)

The auth smoke does **not** verify the Zap editor UX, dropdowns, sample data or trigger subscription logic. Do this manually:

1. Open <https://developer.zapier.com/app/139390/versions>
2. Find the new version → click it → use the private share link to install on your own Zapier account
3. Build a minimal test Zap covering whatever you changed
4. Run it against a sandbox seven account. Confirm expected behaviour.
5. Tail runtime logs if anything feels off:
   ```sh
   zapier-platform logs
   ```

**Do not continue to step 4 until both 3a and 3b are green.**

## 4 — Promote

```sh
zapier-platform promote <new-version>
```

Effect: the new version becomes the **default** for anyone signing up from now on. Existing users' Zaps are **not touched** by this — they keep running on whatever version they originally created Zaps against.

If this fails with **"Changelog not found"**, you forgot step 0 — add a `## <new-version>` section to `CHANGELOG.md`, commit it, re-push (`zapier-platform push` — works because the version is still private), then retry `promote`.

## 5 — Migrate existing users

Wait 24–48 hours after promoting before migrating, so you have a chance to catch problems from new signups first.

```sh
# Start small — migrate 10% of users on the old version
zapier-platform migrate <old-version> <new-version> 10

# Check status
zapier-platform jobs

# If no errors surface after a few hours, migrate the rest (100 is default)
zapier-platform migrate <old-version> <new-version>
```

For **non-breaking** changes, users are migrated silently — they don't get notified. For **breaking** (major) changes, `migrate` is the wrong tool — use `zapier-platform deprecate <old-version> <YYYY-MM-DD>` instead, which sets a sunset date and tells users to update their Zaps.

## Recovery

### The Release workflow failed at "Push new version to Zapier"

The bump commit + tag are already on `main`, but the version is not on Zapier.

1. Check the workflow logs for the actual error
2. Common causes:
   - `ZAPIER_DEPLOY_KEY` secret missing or expired → refresh it in repo settings
   - **"Version X requires Y to exist"** → Zapier enforces sequential pushes. If
     there's a version gap (e.g. Visual Builder was on `2.0.1` and you bumped
     directly to `2.0.3`), you need to push the missing intermediate version
     first:
     ```sh
     git checkout <parent-of-bump-commit>   # package.json at 2.0.2
     zapier-platform push                   # pushes 2.0.2
     git checkout main                      # package.json at 2.0.3
     zapier-platform push                   # pushes 2.0.3
     ```
     This only happens on the very first CLI push after converting from
     Visual Builder, or if you manually skip versions. Normal releases go
     sequentially and are fine.
3. Once the push succeeds, create the GitHub Release that the workflow missed:
   ```sh
   gh release create vX.Y.Z --generate-notes --title vX.Y.Z
   ```

**Do not** re-run the workflow from scratch — it would bump the version again.

### I promoted a version with a critical bug

- If the previous version is still around: `zapier-platform promote <previous-version>` — flips the default back. Then ship a fix and promote that.
- If you'd already migrated users: `zapier-platform migrate <bad-version> <previous-version>` — migrates them back.

### The tag was created but not pushed to GitHub

```sh
git push --tags origin main
```

### I want to see all the release machinery in motion

- Version list: <https://developer.zapier.com/app/139390/versions>
- Active migration/promotion jobs: `zapier-platform jobs`
- Past jobs: `zapier-platform history`

## One-time smoke-test setup

The Release workflow includes an auth-ping step that runs
`zapier-platform invoke -r auth test` against the just-pushed version on
Zapier's production servers. It verifies OAuth + HTTP + response parsing
end-to-end without sending any SMS or incurring cost.

It is skipped until you configure it (you'll see a warning in the workflow
run log). To enable:

1. On any Zapier account (your own dev account works fine), install the seven
   integration and complete the OAuth connection flow.
2. Visit <https://zapier.com/app/assets/connections>, find the seven connection,
   and copy its ID — see <https://zpr.io/z8SjFTdnTFZ2> for where to find it in the UI.
3. In the GitHub repo: **Settings → Secrets and variables → Actions → New
   repository secret**. Name it `ZAPIER_CI_AUTH_ID` and paste the connection ID.

After this, every release runs the smoke test automatically. The connection
persists — no token refresh to worry about. If you ever revoke the Zapier
connection, the secret becomes stale and the smoke step will fail; repeat
steps 1–3 to replace it.

You can also run the same smoke test locally:

```sh
export CI_AUTH_ID=<connection-id>
npm run smoke
```
