import CoursesDrawerLayout from '@/components/navigation/CoursesDrawerLayout';
import NavigationBar from '@/components/navigation/NavigationBar';
import { useAuth } from '@/store/global';
import { View } from '@gluestack-ui/themed';
import { Redirect, Slot, useRootNavigationState } from 'expo-router';

const AuthenticatedLayout = () => {
  const { authenticated } = useAuth();
  const { key } = useRootNavigationState();

  // we gotta wait for the root navigator to be ready before we can
  // redirect to the sign in page
  if (key === undefined) return null;
  if (!authenticated) return <Redirect href='/sign-in' />;

  return (
    <>
      <CoursesDrawerLayout>
        <View flex={1}>
          <Slot />
        </View>

        <NavigationBar />
      </CoursesDrawerLayout>
    </>
  );
};

export default AuthenticatedLayout;
