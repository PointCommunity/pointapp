import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const platform = process.argv[2];
if (!new Set(["android", "ios"]).has(platform)) {
  console.error("Usage: node scripts/native-smoke.mjs <android|ios>");
  process.exit(2);
}

const applicationId = process.env.POINTAPP_APPLICATION_ID || "org.pointcommunity.pointapp.dev";
const outputDirectory = path.join("artifacts", "local", "native-smoke");
mkdirSync(outputDirectory, { recursive: true });

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "Native smoke command failed.\n");
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
}

if (platform === "ios") {
  const device = process.env.POINTAPP_IOS_DEVICE || "iPhone 17 Pro";
  const boot = spawnSync("xcrun", ["simctl", "boot", device], { encoding: "utf8" });
  if (boot.status !== 0 && !/current state: Booted/i.test(boot.stderr)) {
    process.stderr.write(boot.stderr || "Unable to boot the requested iOS Simulator.\n");
    process.exit(boot.status ?? 1);
  }
  run("xcrun", ["simctl", "bootstatus", device, "-b"]);
  run("xcrun", ["simctl", "get_app_container", device, applicationId]);
  run("xcrun", ["simctl", "launch", device, applicationId]);
  run("xcrun", ["simctl", "io", device, "screenshot", path.join(outputDirectory, "ios.png")]);
  console.log(`PointApp iOS smoke PASS on ${device}`);
} else {
  const adb = path.join(
    process.env.ANDROID_HOME || path.join(homedir(), "Library", "Android", "sdk"),
    "platform-tools",
    "adb",
  );
  const devices = run(adb, ["devices"]);
  if (!/^emulator-\d+\s+device$/m.test(devices)) {
    console.error("No booted Android Emulator is available. Start the intended PointApp AVD first.");
    process.exit(1);
  }
  run(adb, ["shell", "pm", "path", applicationId]);
  run(adb, ["shell", "monkey", "-p", applicationId, "1"]);
  const screenshot = spawnSync(adb, ["exec-out", "screencap", "-p"], { encoding: null });
  if (screenshot.status !== 0 || !screenshot.stdout?.length) {
    console.error("Android screenshot capture failed.");
    process.exit(screenshot.status ?? 1);
  }
  await import("node:fs/promises").then(({ writeFile }) =>
    writeFile(path.join(outputDirectory, "android.png"), screenshot.stdout),
  );
  console.log("PointApp Android smoke PASS on the booted emulator");
}
