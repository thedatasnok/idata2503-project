import i18n from '@/i18n';
import config from '@/theme';
import { GluestackUIProvider, View } from '@gluestack-ui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  associateUserId,
  requestNotificationPermissions,
} from '@/services/onesignal';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/store/global';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useEffect, useState } from 'react';

dayjs.extend(advancedFormat);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [ready, setReady] = useState(false);
  const { login, logout } = useAuth();

  useEffect(() => {
    const prepare = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        requestNotificationPermissions().then((res) => {
          if (res && data.session) associateUserId(data.session.user.id);
        });

        if (data.session) login(data.session);
      } catch (error) {
        console.warn(error);
      } finally {
        setReady(true);
      }
    };

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        login(session);
        associateUserId(session.user.id);
      } else {
        logout();
      }
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
        <SafeAreaProvider>
          <GluestackUIProvider config={config}>
            <View flex={1} onLayout={onAppReady}>
              <Slot />
            </View>

            <StatusBar />
          </GluestackUIProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default RootLayout;
