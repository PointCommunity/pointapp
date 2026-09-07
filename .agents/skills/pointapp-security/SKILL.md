---
name: pointapp-security
description: Assess and validate PointApp source, dependencies, Builder configuration, native packages, permissions, identity, storage, and mobile release security.
---

# PointApp Security

Read `AGENTS.md` and keep pipeline ownership with
`pointapp-work-issue`, validation sequencing with `pointapp-gates`, Issue
creation with `pointapp-create-issue`, and skill alignment with
`pointapp-skill-maintainer`.

For a security initiative, research current official advisories and trust
boundaries, show the complete Issue draft and metadata, and obtain exact
creation approval before using the creation skill.

For active work, inspect:

- remote configuration authenticity, canonicalization, schema/capability
  validation, replay/rollback, cache poisoning, and cross-organization access;
- deep links, WebViews, URL allowlists, media, push, auth callbacks, API and
  webhook boundaries;
- token storage, logging/redaction, analytics, consent, retention, deletion,
  moderation, and child-safety implications;
- Android manifest and Apple entitlement/usage-description least privilege;
- runtime and development dependencies, lockfiles, native packages, signing,
  artifact provenance, and build-secret custody.

Use pinned repository tools once established. A clean report means zero
unresolved or suppressed actionable findings in the named fresh suite. A stale
advisory database, unavailable scanner, skipped required target, broad ignore,
or unreviewed native permission blocks that claim. Store reports as redacted
machine evidence plus self-contained dark-mode HTML.

Follow the full target-specific beta gates after remediation. Never expose
credentials, signing keys, tokens, member data, or sensitive paths.
