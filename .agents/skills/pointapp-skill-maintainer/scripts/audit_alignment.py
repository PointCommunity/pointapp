#!/usr/bin/env python3
"""Audit PointApp repository-owned skill alignment without mutating files."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path


REQUIRED_RESOURCES = {
    "pointapp-work-issue": [
        "references/issue-analysis.md",
        "references/implementation.md",
        "references/review.md",
    ],
    "pointapp-create-issue": ["references/issue-design.md"],
    "pointapp-skill-maintainer": [
        "references/skill-registry.md",
        "references/alignment-manifest.json",
        "scripts/audit_alignment.py",
    ],
    "awesome-design": [
        "references/PROVENANCE.md",
        "references/UPSTREAM-LICENSE.txt",
    ],
    "design-taste-frontend": [
        "references/PROVENANCE.md",
        "references/UPSTREAM-LICENSE.txt",
        "references/taste-playbook.md",
    ],
    "image-to-code": [
        "references/PROVENANCE.md",
        "references/UPSTREAM-LICENSE.txt",
    ],
    "web-design-guidelines": [
        "references/PROVENANCE.md",
        "references/UPSTREAM-LICENSE.txt",
        "references/web-interface-guidelines.md",
    ],
    "playwright-cli": [
        "references/PROVENANCE.md",
        "references/UPSTREAM-LICENSE.txt",
        "references/official-cli-reference.md",
        "references/element-attributes.md",
        "references/playwright-tests.md",
        "references/request-mocking.md",
        "references/running-code.md",
        "references/session-management.md",
        "references/storage-state.md",
        "references/test-generation.md",
        "references/tracing.md",
        "references/video-recording.md",
    ],
}

FORBIDDEN_POINTAPP_TERMS = (
    "Project Pepper",
    "FLPTracker",
    "FL Studio",
    "Spectrune/spectrune",
    "orgs/Spectrune/projects",
)


def frontmatter_name(text: str) -> str | None:
    match = re.search(r"\A---\n(?P<body>.*?)\n---\n", text, re.DOTALL)
    if not match:
        return None
    name = re.search(r"^name:\s*[\"']?([^\"'\n]+)", match.group("body"), re.MULTILINE)
    return name.group(1).strip() if name else None


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def audit(repo: Path) -> dict[str, object]:
    errors: list[str] = []
    warnings: list[str] = []
    manifest_path = repo / ".agents/skills/pointapp-skill-maintainer/references/alignment-manifest.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return {"ok": False, "errors": [f"manifest: {exc}"], "warnings": []}

    agents_path = repo / manifest.get("agents_file", "AGENTS.md")
    if not agents_path.is_file():
        errors.append(f"missing policy: {agents_path.relative_to(repo)}")
    else:
        actual_hash = sha256(agents_path)
        expected_hash = manifest.get("agents_sha256")
        if expected_hash != actual_hash:
            errors.append(
                "AGENTS.md hash differs from alignment manifest "
                f"(expected {expected_hash}, actual {actual_hash})"
            )

    managed = sorted(
        manifest.get("workflow_skills", []) + manifest.get("shared_design_skills", [])
    )
    for name in managed:
        skill_dir = repo / ".agents/skills" / name
        skill_file = skill_dir / "SKILL.md"
        if not skill_file.is_file():
            errors.append(f"missing skill: {name}/SKILL.md")
            continue
        text = skill_file.read_text(encoding="utf-8")
        if frontmatter_name(text) != name:
            errors.append(f"frontmatter name mismatch: {name}")
        adapter = repo / ".claude/skills" / name / "SKILL.md"
        if not adapter.is_file():
            errors.append(f"missing Claude adapter: {name}")
        for relative in REQUIRED_RESOURCES.get(name, []):
            if not (skill_dir / relative).is_file():
                errors.append(f"missing resource: {name}/{relative}")

        if name.startswith("pointapp-"):
            for forbidden in FORBIDDEN_POINTAPP_TERMS:
                if forbidden in text:
                    errors.append(f"{name} retains unrelated term: {forbidden}")

    shared_count = len(manifest.get("shared_design_skills", []))
    workflow_count = len(manifest.get("workflow_skills", []))
    if workflow_count != 9:
        errors.append(f"expected 9 workflow skills, found {workflow_count}")
    if shared_count != 5:
        errors.append(f"expected 5 shared design skills, found {shared_count}")
    design_references = list(
        (repo / ".agents/skills/awesome-design/references/design-md").glob(
            "*/DESIGN.md"
        )
    )
    if len(design_references) != 74:
        errors.append(
            "expected 74 pinned awesome-design references, "
            f"found {len(design_references)}"
        )

    return {
        "ok": not errors,
        "policy_sha256": sha256(agents_path) if agents_path.is_file() else None,
        "workflow_skill_count": workflow_count,
        "shared_design_skill_count": shared_count,
        "errors": errors,
        "warnings": warnings,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    result = audit(Path(args.repo).resolve())
    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        print("PointApp skill alignment:", "PASS" if result["ok"] else "FAIL")
        for error in result["errors"]:
            print(f"- {error}")
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
