---
name: pointapp-start-issue
description: Translate PointApp Start Issue #X, Start feature, and Start bug fix requests into the canonical Issue creation and Work Issue pipeline.
---

# PointApp Start Issue

Read `AGENTS.md` and the sibling `pointapp-work-issue` skill.

- Translate `Start Issue #X` to `Work Issue #X`.
- For `Start feature: ...` or `Start bug fix: ...`, use
  `pointapp-create-issue` first. After the approved Backlog Issue exists,
  continue through `Work Issue #X` only when the global slot is free.

This alias owns no independent branch, Project, approval, review, or merge
logic. Live state selects the canonical route.
