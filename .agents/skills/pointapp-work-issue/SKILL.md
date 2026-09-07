---
name: pointapp-work-issue
description: Reconstruct and execute the one-active-Issue PointApp pipeline across Android and Apple native validation. Use for Work Issue, Work Issue #X, and the canonical route behind Start or Review aliases.
---

# PointApp Work Issue

Run the current pipeline from live evidence. `AGENTS.md` is authoritative.

## Establish authority

1. Resolve the Git root, verify `PointCommunity/pointapp`, and read
   `AGENTS.md` completely.
2. Record host, branch, `HEAD`, tree, remotes, and worktree state. Preserve
   every unknown local change.
3. Verify authenticated GitHub and dedicated PointApp Project access. Discover
   the Project and field IDs; do not borrow IDs from another repository.
4. Inspect every open Issue and Project card plus relevant PRs, branches,
   assignees, checks, approvals, findings, and durable status comments.
5. Count `In progress`, `Pending Review`, and `In review` cards. Verify
   the one active Issue's Issue-to-PR-to-branch mapping, sole assignee, current
   target-platform baton, candidate identity, and next gate.

Remain read-only until this evidence assigns the current invocation a safe
action. Read [Issue analysis](references/issue-analysis.md) when prioritizing
or validating a Backlog choice.

## Route live state

- Multiple active Issues or contradictory authority: report the drift and
  remain read-only.
- One active Issue: continue only its recorded gate. A different requested
  Issue waits.
- No active Issue and no number: rank ready Backlog work and wait for selection.
- No active Issue and `Work Issue #X`: verify readiness, reserve the slot,
  assign the sole owner, set `In progress`, and follow
  [implementation](references/implementation.md).
- `Pending Review` or `In review`: follow
  [native review and completion](references/review.md).

## Candidate contract

Runtime-affecting work is authored for both Android and Apple. Tests prove
source and contracts; installed native builds plus explicit target-specific
`Beta approved` prove the candidate on each target. A code remediation makes a
new candidate and repeats affected approvals. Policy, documentation, tests,
formatting, changelog, and workflow-record-only corrections preserve native
approval when the runtime tree is unchanged.

At completion, verify every required PR, exact head, CI check, native approval,
and release condition; merge, close, clear assignment, settle `Done`, return
the checkout to current `main`, and read back all local and GitHub state.
