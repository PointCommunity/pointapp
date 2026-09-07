# PointApp native review and completion

Use this route for the second native target or a remediation revalidation.

1. Verify the exact Issue, PR, branch, sole assignee, target baton, and
   `Pending Review` state. Move to `In review` only when pickup truly begins.
2. Fetch `main` and the feature branch. Compare base, merge-base, head, full
   patch, specification, tests, configuration fixtures, native paths,
   permissions, data safety, and release evidence.
3. Bring the branch current safely when required. A runtime-affecting
   synchronization creates a new candidate and invalidates affected approvals.
4. Run `pointapp-gates`, commit any intended remediation, build and launch the
   exact native beta for the current target, disclose agent findings, present
   the complete checklist, and wait for explicit approval or findings.
5. If remediation changed runtime code, publish it to the same branch and send
   the target baton back through `Pending Review` for required revalidation.
6. If the exact latest head has no unresolved finding, current approvals for
   both targets, current `main`, and passing CI, merge every required linked
   PR and complete the Issue according to `AGENTS.md`.

Use `--force-with-lease` only for an authorized controlled branch rewrite.
Never use unrestricted force.
