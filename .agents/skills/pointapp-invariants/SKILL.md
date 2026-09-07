---
name: pointapp-invariants
description: Apply PointApp engineering invariants for a data-only Builder contract, stable component registry, safe releases, offline recovery, user data, and Android/Apple parity.
---

# PointApp Engineering Invariants

- Remote Builder output is data, never executable code. Validate before render.
- Contract decisions are platform-neutral and directly tested; native UI
  coordinates validated models.
- Component, route, content, organization, release, and capability IDs are
  stable and separate from labels.
- Every accepted release is immutable, canonically hashed, capability-checked,
  organization-scoped, and written atomically.
- A bundled bootstrap and last-known-good release keep the app usable across
  first launch, offline launch, corruption, partial download, and outage.
- Development, beta, and production use isolated app IDs, storage, endpoints,
  visual identity, signing, and release histories.
- Android and Apple are equal targets. Shared changes are tested on both;
  intentional differences live in platform adapters and are documented.
- Phone and tablet layouts respond to the current usable window, not a device
  label: compact below 600 logical pixels, medium at 600–839, and expanded at
  840 or above. Rotation, split view, foldables, and resizing reclassify live.
- Builder data can choose compiled semantic layout variants and bounded tokens;
  it cannot define breakpoints, arbitrary native styles, or layout code.
- Deep links, WebViews, remote images/media, push payloads, and auth callbacks
  use explicit validation and allowlists. No arbitrary privileged bridge.
- Tokens use platform secure storage. Secrets and private member data never
  enter source, fixtures, logs, screenshots, Issues, or PRs.
- Permission requests are minimal, contextual, and justified by compiled
  capability.
- Accessibility includes screen readers, focus order, text scaling, contrast,
  reduced motion, touch targets, safe areas, orientation, and keyboard behavior
  where applicable.
- Migrations are versioned, forward-compatible within the support window,
  fixture-tested from prior versions, and recoverable without silently deleting
  user state.
- Every bug fix starts with a reproducing test. Every user-visible or
  operational change updates `CHANGELOG.html`.
- All tracked text is LF. Dependencies are pinned and added only within
  approved scope.
