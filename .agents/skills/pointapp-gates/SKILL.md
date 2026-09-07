---
name: pointapp-gates
description: Run PointApp foundation, source, Builder-contract, security, native Android, native Apple, and exact-candidate approval gates in order.
---

# PointApp Gates

Read live `AGENTS.md` and discover the actual commands in `package.json`.
Record branch, commit, tree, host, target, app/runtime versions, configuration
fixture ID/digest, and result for each applicable gate.

## Foundation and source

Run current repository checks. During the planning-only foundation these are:

```text
npm run check:foundation
npm test
npm run check
git diff --check
```

After app scaffolding, also run the focused test first, then every implemented
type, lint, unit, contract, integration, security, and build command defined by
the repository. Unexpected test-count reductions and skipped required checks
are failures, not passing evidence.

## Contract

Exercise valid releases plus unknown schema/capability, wrong organization,
digest/signature failure, unsafe URL, interruption, corrupt cache, offline
launch, last-known-good recovery, and rollback fixtures. Require deterministic
canonicalization and renderer parity evidence.

## Native target

Commit the complete candidate before the native build. Build locally without
submission, verify artifact identity and freshness, install and launch the
exact candidate, then provide:

- target, device/simulator, artifact, commit, tree, versions, and config
  release/digest;
- agent-review findings with code/non-code classification;
- a concrete changed-behavior and regression checklist;
- the post-approval route.

Wait for explicit `Beta approved - Android` or `Beta approved - Apple`.
A finding repeats remediation, fresh source/contract gates, a fresh native
candidate, and fresh human validation. TestFlight, Play internal testing,
successful installation, screenshots, and agent tests are supporting evidence,
not approval.

## Publication and merge

Immediately before push or merge, verify the approved tree and clean worktree.
Classify the complete delta. Runtime-affecting code invalidates the affected
native approval; policy/docs/tests/changelog/format-only changes preserve it
when the runtime tree is mechanically unchanged. Both target approvals and all
required CI checks must refer to the exact latest PR head before merge.
