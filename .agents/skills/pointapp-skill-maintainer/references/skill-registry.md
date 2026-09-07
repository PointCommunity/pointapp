# PointApp project skill registry

`AGENTS.md` is live policy authority.

| Skill | Decision ownership |
|---|---|
| `pointapp-work-issue` | One-active-Issue routing, branch/PR state, platform baton, native approval loop, merge, completion |
| `pointapp-create-issue` | Research-first exact-draft approval and Backlog creation |
| `pointapp-start-issue` | Compatibility translation into Create and Work |
| `pointapp-review-issue` | Compatibility translation into Work |
| `pointapp-check-issues` | Read-only state, drift, and priority reporting |
| `pointapp-gates` | Ordered foundation, source, contract, security, native, and approval evidence |
| `pointapp-invariants` | App-shell and configuration-consumer rules |
| `pointapp-security` | Mobile and Builder-contract security assessment |
| `pointapp-skill-maintainer` | Package ownership, alignment, adapters, and validation |

Shared packages `design-taste-frontend`, `awesome-design`,
`image-to-code`, `web-design-guidelines`, and `playwright-cli` retain
their pinned provenance. Browser skills apply directly to Builder previews and
web surfaces; their transferable principles support native review, but browser
evidence never substitutes for Android or Apple validation.

Resource graph:

- `pointapp-work-issue` -> `references/issue-analysis.md`,
  `references/implementation.md`, `references/review.md`
- `pointapp-create-issue` -> `references/issue-design.md`
- `pointapp-skill-maintainer` -> this registry,
  `references/alignment-manifest.json`, and
  `scripts/audit_alignment.py`
