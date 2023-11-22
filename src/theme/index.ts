import { config as defaultConfig } from '@gluestack-ui/config';
import { createComponents, createConfig } from '@gluestack-ui/themed';
import * as customComponents from './components';

export const components = createComponents(customComponents);

const { aliases, globalStyle, plugins } = defaultConfig;

export const config = createConfig({
  aliases,
  globalStyle,
  plugins,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      gray50: '#fafafa',
      gray100: '#f4f4f5',
      gray200: '#e4e4e7',
      gray300: '#d4d4d8',
      gray400: '#a1a1aa',
      gray500: '#71717a',
      gray600: '#52525b',
      gray700: '#3f3f46',
      gray800: '#27272a',
      gray900: '#18181b',
      gray950: '#030712',
      primary50: '#f0f9ff',
      primary100: '#e0f2ff',
      primary200: '#bae6fd',
      primary300: '#7dd3fc',
      primary400: '#388df8',
      primary500: '#0ea5e9',
      primary600: '#0284c7',
      primary700: '#0369a1',
      primary800: '#075985',
      primary900: '#0c4a6e',
      primary950: '#082f49',
      success50: '#ecfdf5',
      success100: '#d1fae5',
      success200: '#a7f3d0',
      success300: '#6ee7b7',
      success400: '#34d399',
      success500: '#10b981',
      success600: '#059669',
      success700: '#047857',
      success800: '#065f46',
      success900: '#064e3b',
      success950: '#033a29',
      error50: '#fef2f2',
      error100: '#fee2e2',
      error200: '#fecaca',
      error300: '#fca5a5',
      error400: '#f87171',
      error500: '#ef4444',
      error600: '#dc2626',
      error700: '#b91c1c',
      error800: '#991b1b',
      error900: '#7f1d1d',
      error950: '#450a0a',
    },
  },
});

export type Config = typeof config;
export type Components = typeof components;

declare module '@gluestack-ui/themed' {
  interface UIConfig extends Config {}
  interface UIComponents extends Components {
    BaseIcon: typeof components.BaseIcon;
  }
}

export const getToken = <TokenType extends keyof Config['tokens']>(
  type: TokenType,
  value: keyof Config['tokens'][TokenType]
) => {
  return config.tokens[type][value];
};

export default {
  ...config,
  components,
};
