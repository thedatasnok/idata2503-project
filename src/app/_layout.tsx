import i18n from '@/i18n';
import config from '@/theme';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';

import { supabase } from '@/services/supabase';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect } from 'react';

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const queryClient = new QueryClient();

const RootLayout = () => {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(authenticated)');
      } else {
        console.log('no user');
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/(authenticated)');
      } else {
        console.log('no user');
        router.replace('/(public)/sign-in');
      }
    });
  }, []);

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
