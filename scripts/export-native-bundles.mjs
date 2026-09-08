import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

for (const platform of ["android", "ios"]) {
  const outputDirectory = path.join("artifacts", "local", `export-${platform}`);
  rmSync(outputDirectory, { force: true, recursive: true });
  const result = spawnSync(
    "npx",
    ["expo", "export", "--platform", platform, "--output-dir", outputDirectory],
    {
      env: { ...process.env, NODE_ENV: "production", POINTAPP_CHANNEL: "development" },
      stdio: "inherit",
    },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("PointApp Android and Apple production bundles PASS");
