# PointApp Issue design

Research technical facts first; ask the human only for unresolved product
intent that changes the outcome.

Always resolve:

- user, problem, current behavior, desired end-to-end outcome, and observable
  acceptance;
- trigger plus empty, loading, success, failure, cancellation, offline,
  recovery, and restart states;
- scope, preserved behavior, out-of-scope work, dependencies, and overlap;
- automated evidence and concrete Android/Apple native checks;
- Priority, Impact, Effort, ordering, and release implications.

When relevant, resolve:

- Builder contract schema, stable IDs, capabilities, version compatibility,
  canonicalization, integrity, atomic publication, rollback, and parity;
- user-owned data, secure storage, migrations, backup, deletion, retention, and
  recovery;
- deep links, WebViews, media, notifications, permissions, authentication,
  networking, rate limits, retries, privacy, moderation, and audit;
- native target differences, application IDs, signing, packaging, store policy,
  accessibility, safe areas, keyboard/screen-reader behavior, orientation,
  performance, and real-device needs;
- whether the change belongs in the app shell, PointApp Builder, or both with a
  contract-first sequence.

Draft the Issue for cold-start execution with goal, current and desired
behavior, scope, data/security rules, Builder contract, native behavior,
failure/recovery, exclusions, dependencies, acceptance criteria, tests, and
dual-platform approval. Preserve proprietary-code, branding, and documentation
boundaries when using competitor behavior as evidence.
