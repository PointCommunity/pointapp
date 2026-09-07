---
name: pointapp-skill-maintainer
description: Audit and repair the nine PointApp workflow skills and five adopted shared design skills against current AGENTS.md.
---

# PointApp Skill Maintainer

Read `AGENTS.md`, [the skill registry](references/skill-registry.md), the
alignment manifest, audit script, every managed `SKILL.md`, and each required
linked resource. Begin with a read-only audit.

Run:

```text
python3 .agents/skills/pointapp-skill-maintainer/scripts/audit_alignment.py --repo . --json
```

When policy and skills align, report evidence. When `AGENTS.md` changed
without semantic drift, refresh the manifest hash. When a managed package
drifted, repair only the affected skill resources and re-run the audit.
Application code, GitHub state, releases, deployments, and memory remain
outside this maintenance skill.

Keep one owner per decision, narrow triggers, action-first language, portable
paths, canonical packages in `.agents/skills/`, and thin ordinary-file
adapters under `.claude/skills/`. Shared design skills assist implementation;
they never own PointApp pipeline or product policy.
