import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const [platform, ...options] = process.argv.slice(2);
if (!new Set(["android", "ios"]).has(platform) || !options.includes("--no-submit")) {
  console.error(
    "Usage: npm run build:beta:<android|ios> -- --no-submit (the safety flag is required)",
  );
  process.exit(2);
}

const runner = fileURLToPath(new URL("run-native.mjs", import.meta.url));
const result = spawnSync(
  process.execPath,
  [runner, platform, "--channel", "beta", "--release", "--no-bundler"],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
