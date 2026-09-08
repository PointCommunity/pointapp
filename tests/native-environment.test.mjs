import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateNativeEnvironment,
  parseInstalledAndroidPackages,
  redactNativeEnvironment,
} from "../scripts/native-preflight.mjs";

const readyEnvironment = {
  nodeVersion: "v22.23.2",
  xcodeVersion: "Xcode 26.6",
  iosRuntimes: ["iOS 26.5"],
  iosDevices: ["PointApp iPhone", "PointApp iPad"],
  javaVersion: 'openjdk version "17.0.20"',
  watchmanVersion: "2026.07.27.00",
  cocoaPodsVersion: "1.16.2",
  androidSdkRoot: "/Users/example/Library/Android/sdk",
  androidPackages: [
    "platform-tools",
    "emulator",
    "platforms/android-35",
    "platforms/android-36",
    "build-tools/36.0.0",
    "system-images/android-36/google_apis/arm64-v8a",
  ],
  androidAvds: ["pointapp_phone_api_36", "pointapp_tablet_api_36"],
};

test("accepts the complete PointApp phone and tablet toolchain", () => {
  const result = evaluateNativeEnvironment(readyEnvironment);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("reports every missing platform requirement in one run", () => {
  const result = evaluateNativeEnvironment({
    ...readyEnvironment,
    cocoaPodsVersion: "",
    iosDevices: ["PointApp iPhone"],
    androidPackages: ["platform-tools"],
    androidAvds: ["pointapp_phone_api_36"],
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /iPad simulator/i);
  assert.match(result.errors.join("\n"), /Android package: emulator/i);
  assert.match(result.errors.join("\n"), /PointApp tablet AVD/i);
  assert.match(result.errors.join("\n"), /CocoaPods/i);
});

test("redacts user-specific paths from diagnostics", () => {
  const result = redactNativeEnvironment(readyEnvironment);

  assert.equal(result.androidSdkRoot, "$USER_HOME/Library/Android/sdk");
  assert.doesNotMatch(JSON.stringify(result), /Users\/example/);
});

test("does not confuse available Android packages with installed packages", () => {
  const output = `Installed packages:
  platform-tools  37.0.1  Android SDK Platform-Tools
Available packages:
  emulator        36.4.10 Android Emulator`;

  assert.deepEqual(parseInstalledAndroidPackages(output), ["platform-tools"]);
});
