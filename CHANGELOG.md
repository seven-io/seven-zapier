# Changelog

## 2.1.0

Added RCS support:

- **Add create/send_rcs** — send an RCS message. The `text` field accepts either plain text or a JSON object (richcard, carousel, file, suggestions) to avoid a forest of nested Zapier input fields. `fallback` accepts `sms` / `webview` or a JSON object.
- **Add create/delete_rcs** — revoke a not-yet-delivered RCS by message ID.
- **Add create/send_rcs_event** — send `IS_TYPING` or `READ` to improve conversational feel.
- **Add trigger/rcs** — single inbound-webhook trigger covering all RCS events (delivery/read status updates, `IS_TYPING`, inbound text, suggestion responses, user files, locations). Downstream filtering via the `content_type` / `status` fields or a Zapier filter step.
- **Update auth scopes** — added `rcs`, `groups` and `numbers` to the OAuth scope list. Existing users must re-authorize their seven connection in Zapier to obtain tokens that include the new scopes; without re-auth, RCS calls fail with 403.

## 2.0.3

Internal migration from the Zapier Visual Builder to the Zapier CLI platform. All triggers, creates, and searches behave identically to `2.0.1` — no changes to fields, auth flow, or expected data shapes.
