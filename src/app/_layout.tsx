import i18n from '@/i18n';
import config from '@/theme';
import { GluestackUIProvider, View } from '@gluestack-ui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';

import { supabase } from '@/services/supabase';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useEffect, useState } from 'react';

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session) router.replace('/sign-in');
      } catch (error) {
        console.warn(error);
      } finally {
        setReady(true);
      }
    };

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/sign-in');
    });

    prepare();
  }, []);

  const onAppReady = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config}>
          <View flex={1} onLayout={onAppReady}>
            <Slot />
          </View>

          <StatusBar />
        </GluestackUIProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default RootLayout;
