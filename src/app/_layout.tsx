import i18n from '@/i18n';
import config from '@/theme';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config}>
          <Slot />

          <StatusBar />
        </GluestackUIProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default RootLayout;
