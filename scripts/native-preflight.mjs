import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { homedir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

export const requiredAndroidPackages = [
  "platform-tools",
  "emulator",
  "platforms/android-35",
  "platforms/android-36",
  "build-tools/36.0.0",
  "system-images/android-36/google_apis/arm64-v8a",
];

const requiredAvds = {
  phone: "pointapp_phone_api_36",
  tablet: "pointapp_tablet_api_36",
};

function executableCandidates(name) {
  return (process.env.PATH ?? "")
    .split(path.delimiter)
    .filter(Boolean)
    .map((directory) => path.join(directory, name));
}

async function firstExecutable(candidates) {
  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Continue through standard, non-secret-bearing locations.
    }
  }
  return undefined;
}

async function run(command, args = [], options = {}) {
  if (!command) return "";
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
      ...options,
    });
    return `${stdout}${stderr}`.trim();
  } catch (error) {
    return `${error.stdout ?? ""}${error.stderr ?? ""}`.trim();
  }
}

function parseSimulatorNames(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.match(/^\s+(.+?)\s+\([0-9A-F-]{8,}\)\s+\(/i)?.[1])
    .filter(Boolean);
}

function parseRuntimeNames(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.match(/^(.+?)\s+-\s+com\.apple\.CoreSimulator\.SimRuntime\./)?.[1])
    .filter(Boolean);
}

export function parseInstalledAndroidPackages(output) {
  const packages = [];
  let readingInstalled = false;
  for (const line of output.split(/\r?\n/)) {
    if (line.trim() === "Installed packages:") {
      readingInstalled = true;
      continue;
    }
    if (line.trim() === "Available packages:") break;
    if (!readingInstalled || /^\s*\(/.test(line)) continue;
    const packageName = line.trim().split(/\s{2,}/)[0];
    if (packageName) packages.push(packageName);
  }
  return packages;
}

export function evaluateNativeEnvironment(environment) {
  const errors = [];
  const node = environment.nodeVersion?.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!node || Number(node[1]) < 22 || (Number(node[1]) === 22 && Number(node[2]) < 11)) {
    errors.push("Node 22.11.0 or newer is required.");
  }
  if (!/^Xcode\s+\d+/m.test(environment.xcodeVersion ?? "")) {
    errors.push("Xcode is unavailable.");
  }
  if (!(environment.iosRuntimes ?? []).some((name) => /^iOS\s+/i.test(name))) {
    errors.push("An available iOS Simulator runtime is required.");
  }
  if (!(environment.iosDevices ?? []).some((name) => /iphone/i.test(name))) {
    errors.push("A PointApp-compatible iPhone simulator is required.");
  }
  if (!(environment.iosDevices ?? []).some((name) => /ipad/i.test(name))) {
    errors.push("A PointApp-compatible iPad simulator is required.");
  }
  if (!/version\s+"17\./i.test(environment.javaVersion ?? "")) {
    errors.push("JDK 17 is required.");
  }
  if (!/^\d{4}\.\d{2}/.test(environment.watchmanVersion ?? "")) {
    errors.push("Watchman is required.");
  }
  if (!environment.androidSdkRoot) {
    errors.push("The Android SDK root is unavailable.");
  }
  for (const packageName of requiredAndroidPackages) {
    if (!(environment.androidPackages ?? []).includes(packageName)) {
      errors.push(`Missing Android package: ${packageName}.`);
    }
  }
  if (!(environment.androidAvds ?? []).includes(requiredAvds.phone)) {
    errors.push(`Missing PointApp phone AVD: ${requiredAvds.phone}.`);
  }
  if (!(environment.androidAvds ?? []).includes(requiredAvds.tablet)) {
    errors.push(`Missing PointApp tablet AVD: ${requiredAvds.tablet}.`);
  }
  return { ok: errors.length === 0, errors };
}

export function redactNativeEnvironment(environment) {
  return JSON.parse(
    JSON.stringify(environment).replaceAll(/\/Users\/[^/"\\]+/g, "$USER_HOME"),
  );
}

export async function inspectNativeEnvironment() {
  const userHome = homedir();
  const systemJavaHome = (await run("/usr/libexec/java_home", ["-v", "17"]))
    .split(/\r?\n/)
    .find((line) => line.startsWith("/"));
  const java = await firstExecutable([
    ...(systemJavaHome ? [path.join(systemJavaHome, "bin", "java")] : []),
    "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home/bin/java",
    "/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home/bin/java",
    ...executableCandidates("java"),
  ]);
  const javaHome = java ? path.dirname(path.dirname(java)) : "";
  const nativeToolEnvironment = {
    ...process.env,
    ...(javaHome ? { JAVA_HOME: javaHome, PATH: `${path.dirname(java)}:${process.env.PATH ?? ""}` } : {}),
  };
  const androidSdkRoot =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    path.join(userHome, "Library", "Android", "sdk");
  const androidCli = await firstExecutable([
    path.join(androidSdkRoot, "cmdline-tools", "latest", "bin", "android"),
    "/opt/homebrew/share/android-commandlinetools/cmdline-tools/latest/bin/android",
    "/usr/local/share/android-commandlinetools/cmdline-tools/latest/bin/android",
    ...executableCandidates("android"),
  ]);
  const adb = await firstExecutable([
    path.join(androidSdkRoot, "platform-tools", "adb"),
    ...executableCandidates("adb"),
  ]);
  const emulator = await firstExecutable([
    path.join(androidSdkRoot, "emulator", "emulator"),
    ...executableCandidates("emulator"),
  ]);
  const avdmanager = await firstExecutable([
    path.join(androidSdkRoot, "cmdline-tools", "latest", "bin", "avdmanager"),
    "/opt/homebrew/share/android-commandlinetools/cmdline-tools/latest/bin/avdmanager",
    "/usr/local/share/android-commandlinetools/cmdline-tools/latest/bin/avdmanager",
    ...executableCandidates("avdmanager"),
  ]);
  const watchman = await firstExecutable(executableCandidates("watchman"));
  const runtimeOutput = await run("xcrun", ["simctl", "list", "runtimes", "available"]);
  const deviceOutput = await run("xcrun", ["simctl", "list", "devices", "available"]);

  return {
    nodeVersion: process.version,
    xcodeVersion: await run("xcodebuild", ["-version"]),
    iosRuntimes: parseRuntimeNames(runtimeOutput),
    iosDevices: parseSimulatorNames(deviceOutput),
    javaVersion: await run(java, ["-version"], { env: nativeToolEnvironment }),
    watchmanVersion: await run(watchman, ["--version"]),
    androidSdkRoot: androidCli && adb && emulator ? androidSdkRoot : "",
    androidPackages: parseInstalledAndroidPackages(
      await run(androidCli, ["--sdk", androidSdkRoot, "--no-metrics", "sdk", "list"], {
        env: nativeToolEnvironment,
      }),
    ),
    androidAvds: (await run(avdmanager, ["list", "avd", "-c"], {
      env: { ...nativeToolEnvironment, ANDROID_HOME: androidSdkRoot },
    }))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  };
}

async function main() {
  const environment = await inspectNativeEnvironment();
  const result = evaluateNativeEnvironment(environment);
  const report = { ...redactNativeEnvironment(environment), ...result };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else if (result.ok) {
    console.log("PointApp native environment PASS");
    console.log(JSON.stringify(redactNativeEnvironment(environment), null, 2));
  } else {
    console.error("PointApp native environment FAIL");
    for (const error of result.errors) console.error(`- ${error}`);
  }
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
