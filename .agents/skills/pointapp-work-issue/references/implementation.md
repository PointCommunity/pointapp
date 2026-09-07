# PointApp implementation route

Use this route after live state proves a free slot and safe ownership.

1. Assign the Issue's sole owner, set `In progress`, and read both back.
2. Start from current `origin/main` on one canonical
   `issue/<number>-<slug>` branch. Record Issue, branch, base/head, active
   slot, assignee, planned Android/Apple validation order, and next gate.
3. Update or create the dark-mode HTML spec, plan, and tasks. Obtain required
   human specification decisions before application implementation.
4. Implement one test-first vertical slice at a time. Keep the Builder contract
   data-only and preserve app-shell invariants.
5. Run `pointapp-gates`, commit the complete candidate locally, build and
   launch the first native beta, present the exact checklist, and wait for
   target-specific approval or findings.
6. After first-target approval, confirm the tree is unchanged, push the branch,
   create the canonical linked PR, complete every outgoing record, set the next
   native target, then use `Pending Review` as the final ready signal.

Do not merge after first-target approval. The second target must validate the
exact pushed head.
