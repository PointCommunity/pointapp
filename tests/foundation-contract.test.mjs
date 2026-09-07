import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  auditFoundation,
  canonicalWorkflowSkills,
  isCanonicalOrigin,
  sharedDesignSkills,
} from "../scripts/verify-foundation.mjs";

test("the repository foundation has no policy or structure violations", async () => {
  const result = await auditFoundation(new URL("..", import.meta.url));
  assert.deepEqual(result.errors, []);
});

test("canonical GitHub checkout URLs work with or without the optional git suffix", () => {
  assert.equal(isCanonicalOrigin("https://github.com/PointCommunity/pointapp.git"), true);
  assert.equal(isCanonicalOrigin("https://github.com/PointCommunity/pointapp"), true);
  assert.equal(isCanonicalOrigin("https://github.com/PointCommunity/not-pointapp"), false);
});

test("the adapted Spectrune workflow and shared design skill sets are complete", () => {
  assert.deepEqual(canonicalWorkflowSkills, [
    "pointapp-check-issues",
    "pointapp-create-issue",
    "pointapp-gates",
    "pointapp-invariants",
    "pointapp-review-issue",
    "pointapp-security",
    "pointapp-skill-maintainer",
    "pointapp-start-issue",
    "pointapp-work-issue",
  ]);
  assert.deepEqual(sharedDesignSkills, [
    "awesome-design",
    "design-taste-frontend",
    "image-to-code",
    "playwright-cli",
    "web-design-guidelines",
  ]);
});

test("the approved mobile foundation records adaptive tablet support and channel identities", async () => {
  const [frameworkAdr, adaptiveAdr, matrix] = await Promise.all([
    readFile(
      new URL("../docs/decisions/0002-react-native-expo-foundation.html", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../docs/decisions/0003-adaptive-viewport-layout.html", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../specs/002-production-shell-builder-contract/environment-matrix.html",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  assert.match(frameworkAdr, /Accepted/);
  assert.match(adaptiveAdr, /Accepted/);
  assert.match(matrix, /org\.pointcommunity\.pointapp/);
  assert.match(matrix, /Android tablet/i);
  assert.match(matrix, /compact.*600/si);
  assert.match(matrix, /medium.*600.*839/si);
  assert.match(matrix, /expanded.*840/si);
  assert.match(matrix, /iOS and iPadOS 16\.4\+/);
  assert.match(matrix, /Android 7\+/);
});
