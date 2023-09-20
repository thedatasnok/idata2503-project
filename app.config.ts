import type { ExpoConfig } from '@expo/config';

export default {
  expo: {
    name: 'whiteboardapp',
    slug: 'whiteboardapp',
    scheme: 'whiteboardapp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-router'],
  } satisfies ExpoConfig,
};
