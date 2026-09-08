import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const [platform, ...options] = process.argv.slice(2);
if (!new Set(["android", "ios"]).has(platform)) {
  console.error("Usage: node scripts/run-native.mjs <android|ios> [options]");
  process.exit(2);
}

function optionValue(name, fallback) {
  const index = options.indexOf(name);
  return index >= 0 ? options[index + 1] : fallback;
}

const channel = optionValue("--channel", "development");
if (!new Set(["development", "beta"]).has(channel)) {
  console.error("Native development commands support only development or beta channels.");
  process.exit(2);
}

const release = options.includes("--release");
const noBundler = options.includes("--no-bundler");
const requestedDevice = optionValue("--device", undefined);
const target =
  platform === "ios"
    ? requestedDevice || process.env.POINTAPP_IOS_DEVICE || "iPhone 17 Pro"
    : requestedDevice || process.env.POINTAPP_ANDROID_DEVICE || "pointapp_phone_api_36";
const androidHome =
  process.env.ANDROID_HOME || path.join(homedir(), "Library", "Android", "sdk");
const systemJavaHome = spawnSync("/usr/libexec/java_home", ["-v", "17"], {
  encoding: "utf8",
}).stdout.trim();
const javaHomeCandidates = [
  process.env.JAVA_HOME,
  systemJavaHome,
  "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home",
  "/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home",
].filter(Boolean);
const javaHome = javaHomeCandidates.find((candidate) =>
  existsSync(path.join(candidate, "bin", "java")),
);
if (!javaHome) {
  console.error("JDK 17 is unavailable. Run npm run check:native-env for details.");
  process.exit(1);
}
const nativeEnvironment = {
  ...process.env,
  ANDROID_HOME: androidHome,
  ANDROID_SDK_ROOT: process.env.ANDROID_SDK_ROOT || androidHome,
  JAVA_HOME: javaHome,
  POINTAPP_CHANNEL: channel,
};

function run(args) {
  const result = spawnSync("npx", args, { env: nativeEnvironment, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(["expo", "prebuild", "--clean", "--no-install", "--platform", platform]);

const runArguments = ["expo", `run:${platform}`, "--device", target];
if (release) {
  runArguments.push(platform === "ios" ? "--configuration" : "--variant", "Release");
}
if (noBundler) runArguments.push("--no-bundler");
run(runArguments);
