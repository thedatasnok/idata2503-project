import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { useTranslation, I18nextProvider } from 'react-i18next';
import i18next from '../config/i18next';

const STACK_SCREEN_OPTIONS: ComponentProps<typeof Stack>['screenOptions'] = {};

const RootLayout = () => {
  const { t } = useTranslation();

  return (
    <I18nextProvider i18n={i18next}>
      <View>
        <Stack screenOptions={STACK_SCREEN_OPTIONS} />
        <Text>{t('welcome', { name: 'Albert' })}</Text>
        <StatusBar />
      </View>
    </I18nextProvider>
  );
};

export default RootLayout;
