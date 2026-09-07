import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (relative) => readFile(new URL(relative, root), "utf8");

test("the Expo scaffold exposes the governed command interface", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  assert.equal(packageJson.main, "index.ts");
  assert.match(packageJson.dependencies.expo, /^~57\./);
  assert.equal(packageJson.overrides.uuid, "11.1.1");
  for (const command of [
    "dev",
    "ios",
    "android",
    "typecheck",
    "lint",
    "test:unit",
    "test:contract",
    "test:integration",
    "test:e2e:ios",
    "test:e2e:android",
    "build:beta:ios",
    "build:beta:android",
  ]) {
    assert.ok(packageJson.scripts[command], `missing npm script: ${command}`);
  }
});

test("the development app identity supports phone and tablet viewports", async () => {
  const config = await read("app.config.ts");

  assert.match(config, /org\.pointcommunity\.pointapp\.dev/);
  assert.match(config, /supportsTablet:\s*true/);
  assert.match(config, /orientation:\s*["']default["']/);
  assert.doesNotMatch(config, /https?:\/\//);
  assert.doesNotMatch(config, /permissions:\s*\[[^\]]+\]/s);
});

test("the Android shell blocks permissions that the compiled foundation does not use", async () => {
  const config = await read("app.config.ts");

  for (const permission of [
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "SYSTEM_ALERT_WINDOW",
    "VIBRATE",
  ]) {
    assert.match(config, new RegExp(`blockedPermissions:[\\s\\S]*${permission}`));
  }
});

test("the bundled bootstrap screen has no remote or Builder dependency", async () => {
  const screen = await read("src/app/App.tsx");

  assert.match(screen, /Point Community Church/);
  assert.match(screen, /Bundled foundation/);
  assert.doesNotMatch(screen, /fetch\s*\(|WebView|https?:\/\//);
});

test("native wrappers reject unsafe or ambiguous invocations", () => {
  const beta = spawnSync(process.execPath, ["scripts/local-beta-build.mjs", "ios"], {
    encoding: "utf8",
  });
  const smoke = spawnSync(process.execPath, ["scripts/native-smoke.mjs", "web"], {
    encoding: "utf8",
  });

  assert.equal(beta.status, 2);
  assert.match(beta.stderr, /safety flag is required/i);
  assert.equal(smoke.status, 2);
  assert.match(smoke.stderr, /android\|ios/i);
});

test("unknown build channels fail closed", () => {
  const config = spawnSync("npx", ["expo", "config", "--type", "public", "--json"], {
    encoding: "utf8",
    env: { ...process.env, POINTAPP_CHANNEL: "unknown" },
  });

  assert.notEqual(config.status, 0);
  assert.match(`${config.stdout}\n${config.stderr}`, /Unsupported PointApp channel/);
});
