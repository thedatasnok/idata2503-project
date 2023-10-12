import i18n from '@/i18n';
import config from '@/theme';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';

const RootLayout = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <GluestackUIProvider config={config}>
        <Slot />

        <StatusBar />
      </GluestackUIProvider>
    </I18nextProvider>
  );
};

export default RootLayout;
