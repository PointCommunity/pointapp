# PointApp development and release governance

Everything a future agent needs to resume this repository from live evidence.
Read this file completely before changing application, contract, pipeline, or
release state. Keep it current in the same change as any policy or architecture
decision it governs.

## 0. Authority and repository identity

- The canonical production mobile source is the private repository
  `PointCommunity/pointapp`. Its default branch will be `main` after the
  initial approved publication.
- This repository owns the Android and Apple app shell, the compiled component
  registry, the configuration-consumer contract, local fixtures, native build
  tooling, tests, and store-release evidence.
- PointApp Builder is a separate application and repository. Builder code,
  deployment, roles, drafts, and authoring UI do not live here.
- Builder deployment, Builder access, and content publication are separate
  authorities. None of them authorizes a PointApp binary release.
- Live Git, GitHub, Project, pull-request, CI, store, and Builder state outrank
  old chat context or recorded examples. Discover identifiers at runtime.
- Human-facing documents and diagrams are dark-mode HTML. `AGENTS.md`,
  repository skills, machine-readable schemas, source, fixtures, and generated
  build metadata are operational files and may use their native formats.
- Commits, pushes, Project creation, Issue creation, releases, store
  submissions, production configuration publication, and deployments require
  the authority stated by the applicable workflow. The current local
  foundation may be edited and validated without publishing it.

At the September 7, 2026 foundation audit, the GitHub repository existed but
had no default branch, Issues, pull requests, or dedicated PointApp Project.
Treat that only as historical context. Re-read live state before every
operational decision. Until a dedicated Project with the controlled fields
below exists, Issue execution remains read-only and reports that setup blocker.

## 1. How project policy and skills work together

Canonical packages live under `.agents/skills/`. Load the matching package
when its trigger applies:

| Skill | Use it for |
|---|---|
| `pointapp-work-issue` | Discover and execute the current Issue pipeline stage |
| `pointapp-create-issue` | Research, draft, approve, create, and classify one Backlog Issue |
| `pointapp-start-issue` | Translate `Start Issue #X` into the canonical work router |
| `pointapp-review-issue` | Translate `Review Issue #X` into the canonical work router |
| `pointapp-check-issues` | Read-only Issue inventory, pipeline health, and priority |
| `pointapp-gates` | Select and run source, contract, native, and release gates |
| `pointapp-invariants` | Apply app-shell and Builder-contract engineering rules |
| `pointapp-security` | Review trust boundaries and run security validation |
| `pointapp-skill-maintainer` | Keep repository skills aligned with this file |
| `design-taste-frontend` | Turn a brief into a coherent visual direction |
| `awesome-design` | Select and adapt a local visual reference without copying identity |
| `image-to-code` | Implement an approved screenshot or mockup faithfully |
| `web-design-guidelines` | Audit Builder previews and other web surfaces |
| `playwright-cli` | Capture repeatable browser evidence for web surfaces |

The five shared design packages are adopted from Spectrune with pinned
provenance. For native Android and Apple UI, transfer their design, content,
accessibility, responsive, and verification principles through the native test
stack; do not pretend browser evidence proves native behavior.

When this file changes workflow or skill ownership, run
`pointapp-skill-maintainer` in the same pass.

## 2. Product model

PointApp is a Point Community Church app delivered through Apple and Google app
stores for phones and tablets. The installed binary is a durable native shell.
PointApp Builder authors and publishes versioned data that the shell validates
and renders.

The product has two independent release planes:

| Plane | What changes | Normal path |
|---|---|---|
| Native binary | Compiled capabilities, native dependencies, permissions, identifiers, signing, runtime | local development -> native beta on Android and Apple -> store production |
| App configuration | Content, navigation, layout, theme tokens, media references, feature settings supported by the compiled registry | draft -> preview -> staging -> exact-candidate production |

A configuration release never introduces code, native modules, executable
scripts, arbitrary component names, arbitrary WebView bridges, permissions, or
capabilities absent from the installed binary. Native functionality changes
require a new tested binary and store release.

Point Community Church is the only required tenant for the first release.
Organization IDs and versioned interfaces remain explicit so a future
multi-organization product does not require replacing the contract.

## 3. Builder-to-app publication contract

The Builder publishes immutable configuration releases. The app fetches only a
channel pointer plus its referenced immutable release. The minimum release
envelope is:

- schema version and contract version;
- immutable release ID, organization ID, channel, and publication timestamp;
- minimum supported client/runtime version and required compiled capabilities;
- ordered navigation and page/block configuration using stable registered IDs;
- content and media references plus accessibility and localization metadata;
- integrity metadata, including canonical content digest and authenticity
  evidence;
- rollback ancestry or previous-known-good release reference.

The app must:

1. ship a valid bundled bootstrap configuration;
2. fetch through a compiled HTTPS endpoint selected by build channel;
3. reject unknown schemas, unsupported capabilities, invalid integrity,
   cross-organization data, expired or malformed releases, and unsafe URLs;
4. write an accepted release atomically;
5. retain the last-known-good release and recover after offline launch, partial
   download, corrupt cache, or server failure;
6. make the active release ID, schema, digest, source channel, and fallback
   reason observable in diagnostics without exposing secrets or member data.

Builder preview, staging, and production must use the same canonicalization,
schema validation, capability rules, and renderer fixtures as the app. Exact
visual parity is established by rendered evidence on both native targets at
compact, medium, and expanded widths, not by matching JSON alone.

Production publication follows the PointSite Builder role boundary unless the
PointApp Builder repository later adopts a stricter rule: Editors edit drafts;
Publishers may publish an exact candidate to Staging; only an Administrator may
promote that exact verified Staging candidate to Production. The production
app remains read-only.

## 4. Architecture boundaries

- Use React Native with Expo SDK 57 and TypeScript for the application, shared
  schemas, fixtures, and tooling, as accepted in ADR 0002. Revisit the pinned
  SDK through a later dependency decision rather than silently following
  latest.
- Keep contract parsing, canonicalization, capability negotiation, URL policy,
  cache decisions, release selection, and fallback decisions in platform-neutral
  modules with direct tests.
- Native views render already-validated domain models. They do not decide
  whether an untrusted release is acceptable.
- The component registry uses stable IDs independent of labels. Removing or
  changing a registered component requires a compatibility and migration plan.
- Platform adapters own Android/Apple differences. Shared code must not scatter
  platform tests or silently make one platform the default.
- Layout decisions use the current usable window rather than device names.
  Classify width centrally as compact below 600 logical pixels, medium from
  600 through 839, and expanded at 840 or above; recompute when the window,
  orientation, split view, fold state, or text scale changes.
- Builder configuration may select only compiled semantic layout variants and
  bounded layout tokens. It never supplies arbitrary breakpoints, native style
  objects, absolute device assumptions, or executable layout logic.
- Remote content is data. Never evaluate it as JavaScript, import it as a
  module, treat it as JSX, or expose a privileged native bridge to arbitrary
  URLs.
- Treat deep links, media URLs, forms, authentication callbacks, and WebViews
  as explicit allowlisted trust boundaries.
- Secrets, store credentials, signing material, private keys, service tokens,
  and production administrative credentials never enter source, fixtures,
  Issues, PRs, logs, screenshots, or chat.

## 5. Planned repository shape

The app source does not exist yet. The accepted implementation plan will create
this structure incrementally:

```text
src/
  app/                 native routes and navigation composition
  components/          compiled configurable component registry
  config/              release envelope, validation, canonicalization, cache
  domains/             content, media, events, groups, profile, notifications
  platform/            Android and Apple adapters
  diagnostics/         safe release/build diagnostics
contracts/             machine-readable schemas and examples
fixtures/              deterministic Builder releases and failure cases
tests/                 unit, contract, integration, and native-flow tests
scripts/               platform-neutral orchestration and thin native wrappers
specs/                 dark-mode HTML specifications, plans, tasks, and research
docs/decisions/        dark-mode HTML architecture decisions
artifacts/             ignored local validation output unless intentionally recorded
```

Do not create placeholder domains simply to fill the tree. Each vertical slice
adds only the paths its accepted scope requires.

## 6. Specifications, plans, and tasks

- Significant work begins with a dark-mode HTML specification, plan, and task
  breakdown under one numbered `specs/<number>-<slug>/` directory.
- Surface assumptions and unresolved product choices before implementation.
- A spec defines objective, actors, requirements, commands, structure, style,
  testing, boundaries, acceptance criteria, and open questions.
- The human reviews the specification before application implementation begins.
- Tasks are vertical, normally touch no more than five files, identify
  dependencies, and include observable acceptance and verification.
- Update the spec first when scope or architecture changes.
- Significant irreversible choices receive an HTML ADR. Accepted ADRs are
  append-only; supersede them with a later record rather than erasing history.

## 7. Test-first implementation and change discipline

- Write a failing focused test before new decision logic or a bug fix. Confirm
  the failure proves the intended gap, implement the smallest solution, then
  refactor while green.
- Work in thin vertical slices. Each slice leaves the repository runnable and
  testable.
- Preserve unknown local changes and untracked files. Never reset, clean,
  overwrite, or stash them without explicit direction.
- Use LF for every tracked text file. Review `git diff --check` and the diff
  scale before any commit.
- Every user-visible or operational change receives one accurate entry in the
  dark-mode `CHANGELOG.html` in the same pass.
- Dependency additions, identifier changes, permissions, schema breaking
  changes, signing changes, CI behavior, and production endpoints require an
  explicit recorded decision or Issue scope.

## 8. Current and future commands

The foundation currently supports:

```text
npm run check:foundation
npm test
npm run skills:check
npm run check
```

The accepted mobile scaffold must expose stable, cross-platform commands with
these outcomes, although exact implementations are created and proven in that
Issue:

```text
npm run dev
npm run ios
npm run android
npm run typecheck
npm run lint
npm run test:unit
npm run test:contract
npm run test:integration
npm run test:e2e:ios
npm run test:e2e:android
npm run build:beta:ios -- --no-submit
npm run build:beta:android -- --no-submit
```

Do not claim or invoke a planned command until it exists in the checked-out
`package.json` and its behavior is covered by repository evidence.

## 9. Canonical Issue pipeline

PointApp adopts Spectrune's Issue-first, one-active-Issue pipeline and adjusts
its native hand-off for two target platforms that may be tested from the same
Mac.

The future private PointCommunity Project must provide:

- Status: `Backlog`, `On Hold`, `In progress`, `Pending Review`,
  `In review`, `Done`;
- Priority: `P0`, `P1`, `P2`, `P3`;
- Impact: `High`, `Medium`, `Low`;
- Effort: `XS`, `S`, `M`, `L`, `XL`;
- exactly one active Issue across `In progress`, `Pending Review`, and
  `In review`.

Discover the Project owner, number, fields, options, repository link, workflows,
and access at runtime. Never borrow Project IDs from Spectrune, PointGuide, or
PointSite Builder.

The Issue is the work unit. Its Project card owns the lane; its sole assignee
owns the next human/agent action; its linked PR owns branch/head/check evidence.
A durable Issue or PR record additionally identifies the current native target
because Android and Apple validation can share the same assignee and host.

### Human commands

- `Work Issue` audits live state and recommends ready work when the slot is
  free.
- `Work Issue #X` reconstructs state and performs the next authorized action.
- `Start Issue #X` and `Review Issue #X` are compatibility aliases for the
  same router.
- `Status Issue #X` is read-only status reconstruction.
- `Beta finding - Android: ...` or `Beta finding - Apple: ...` records a
  native failure against the current exact candidate.
- `Beta approved - Android` or `Beta approved - Apple` explicitly approves
  the current target's complete checklist and exact candidate.
- `Pause Issue #X` preserves a safe checkpoint and moves it to `On Hold`.
- `Cancel Issue #X` closes it as not planned and settles `Done`.

Natural-language equivalents are valid only when equally explicit. Passing
tests, building, launching, screenshots, or saying “looks good” is not native
approval.

### State flow

```text
approved Issue creation                              -> Backlog, unassigned
Work Issue #X with a free slot                       -> In progress
first native target approved and exact branch pushed -> Pending Review
second target validation begins                     -> In review
code remediation needs earlier target revalidation   -> Pending Review
explicit pause                                       -> On Hold
all required PRs merged and release condition met    -> Done
```

Agents perform and verify Git, GitHub, assignment, Project, PR, synchronization,
and merge operations. The human chooses work, approves exact Issue drafts,
performs native checklists, supplies findings/approval, and authorizes store or
production configuration publication when required.

### Entry and fail-closed rules

Every `Work Issue` invocation:

1. reads this file completely;
2. verifies repository identity, branch, `HEAD`, tree, remote, and worktree;
3. reads every open Issue, Project card, open PR, linked branch, assignee,
   checks, comments needed for durable pipeline state, and current `main`;
4. counts active Issues and verifies one Issue-to-PR-to-branch mapping;
5. verifies the sole assignee and current target-platform baton;
6. remains read-only on missing Project access, multiple active Issues,
   conflicting mappings, unpublished required work, or ambiguous authority;
7. confirms branch and `HEAD` again immediately before any file or GitHub
   mutation.

Use the existing checkout. Do not create an extra clone or worktree for Issue
execution; local simulators, emulators, caches, and build directories must map
unambiguously to the candidate under test.

## 10. Native candidate and dual-platform approval

For any runtime, native build, packaging, permission, dependency, migration,
configuration-consumer, renderer, or filesystem-affecting code change:

1. implement both Android and Apple paths in one canonical feature branch;
2. run focused tests, the complete source suite, contract fixtures, static
   checks, security checks, and the current target's native build;
3. commit the complete candidate locally before native testing; record commit,
   tree, app version, runtime version, config release ID/digest, target,
   simulator/device identity, artifact identity/checksum, and test evidence;
4. install and launch the exact local beta; present agent-review findings and a
   concrete behavior/regression checklist;
5. wait for explicit target-specific `Beta approved` or a finding;
6. after the first target approves, publish the exact branch and linked PR, then
   validate the other target against that exact pushed head;
7. if remediation changes runtime code, create a new candidate and repeat every
   affected native approval. Shared code normally invalidates both target
   approvals; narrowly isolated target-only code invalidates at least that
   target and must be justified in the durable record;
8. merge only when the latest exact head has complete required approvals and
   checks with no unresolved finding.

Simulator/emulator validation is required for rapid local iteration. A real
Android device and a real Apple device are required before public store
production for notifications, deep links, permissions, background audio,
authentication hand-off, media/casting, performance, and other hardware or
store-distribution behavior applicable to the release.

The current Mac foundation audit found Xcode 26.6 and Node 22 available, but no
installed iOS Simulator runtime/device, Android SDK tools, Android emulator,
usable Java runtime, or Watchman. Recheck; do not treat that snapshot as a
permanent fact.

## 11. Configuration release validation

Builder/configuration work is tested against fixtures before any production
publication:

- canonical serialization and digest stability;
- schema compatibility across supported client versions;
- registered capability negotiation and unknown-element rejection;
- URL/deep-link allowlists and external hand-off;
- organization isolation;
- atomic cache replacement, interruption, corruption, and last-known-good
  fallback;
- offline cold/warm launch;
- preview/staging/native parity on Android and Apple at compact, medium, and
  expanded widths, including Android tablet and iPad resizing;
- publication concurrency, audit trail, exact-candidate promotion, rollback,
  and propagation.

A Builder production deployment is not a configuration production release.
Configuration production publication must identify the exact Staging release
ID and digest being promoted and verify the production pointer afterward.

## 12. Native release channels

- Development builds use isolated application IDs, storage, endpoints, icons,
  and visible labels.
- Beta builds use separate storage and Builder Staging by default. TestFlight
  and Google Play internal/closed tracks are distribution mechanisms, not
  approval by themselves.
- Production builds use production IDs, production endpoints, production
  signing, and store-controlled rollout.
- Never let development or beta state overwrite production app storage.
- A native promotion records source commit/tree, runtime and app versions,
  artifact checksum, signing identity reference, configuration compatibility,
  both target approvals, store upload/build IDs, rollout, monitoring, and
  rollback.
- No agent submits or releases to a store without explicit authorization for
  that exact candidate.

## 13. Security, privacy, and content safety

- Treat Builder configuration, content, media, deep links, webhook input, push
  payloads, authentication callbacks, and cached state as untrusted input.
- Validate at boundaries, fail safely, and preserve a usable last-known-good
  experience.
- Apply least privilege to native permissions and ask in context.
- Maintain separate administrative and end-user identities.
- Encrypt transport; use platform secure storage for tokens; never place
  secrets in ordinary async storage.
- Minimize member data and analytics. Define consent, retention, deletion,
  export, moderation, reporting, and child-safety behavior before implementing
  affected domains.
- Pin and audit dependencies. Security completion means zero unresolved or
  suppressed actionable findings in the defined, freshly run suite—not a
  universal claim that no vulnerability exists.

## 14. Completion evidence

Before any completion claim, run the full current commands fresh, read their
complete result, inspect `git diff --check`, and verify every requirement
line-by-line. Report limitations instead of extrapolating from partial checks.

Foundation adoption is complete only when:

- this policy, the pipeline policy, revised specification, plan, tasks, ADRs,
  changelog, repository skills, adapters, audit script, and CI workflow align;
- the old parity plan points to the new production-shell plan;
- every human document is dark-mode HTML;
- the skill audit and foundation test suite pass;
- no app implementation, commit, push, Project creation, Issue creation,
  Builder change, deployment, configuration publication, or store action is
  represented as completed.
