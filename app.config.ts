import type { ConfigContext, ExpoConfig } from "expo/config";

const channels = {
  development: {
    name: "PointApp Dev",
    applicationId: "org.pointcommunity.pointapp.dev",
    storageNamespace: "pointapp-development",
  },
  beta: {
    name: "PointApp Beta",
    applicationId: "org.pointcommunity.pointapp.beta",
    storageNamespace: "pointapp-beta",
  },
  production: {
    name: "PointApp",
    applicationId: "org.pointcommunity.pointapp",
    storageNamespace: "pointapp-production",
  },
} as const;

type Channel = keyof typeof channels;

function selectedChannel(): Channel {
  const requested = process.env.POINTAPP_CHANNEL ?? "development";
  if (!(requested in channels)) {
    throw new Error(`Unsupported PointApp channel: ${requested}`);
  }
  return requested as Channel;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const channel = selectedChannel();
  const selected = channels[channel];

  return {
    ...config,
    name: selected.name,
    slug: "pointapp",
    version: "0.1.0",
    orientation: "default",
    userInterfaceStyle: "dark",
    ios: {
      bundleIdentifier: selected.applicationId,
      supportsTablet: true,
    },
    android: {
      package: selected.applicationId,
      permissions: [],
    },
    plugins: ["expo-dev-client"],
    extra: {
      organizationId: "point-community",
      configurationSource: "bundled",
      releaseChannel: channel,
      storageNamespace: selected.storageNamespace,
    },
  };
};
