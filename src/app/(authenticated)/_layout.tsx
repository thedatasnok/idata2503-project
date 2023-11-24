import DirectMessageToastContainer from '@/components/feedback/DirectMessageToastContainer';
import CoursesDrawerLayout from '@/components/navigation/CoursesDrawerLayout';
import NavigationBar from '@/components/navigation/NavigationBar';
import { useAuth } from '@/store/global';
import { Redirect, Tabs } from 'expo-router';

const SCREEN_OPTIONS = {
  header: () => <></>,
} as const;

const CONTAINER_STYLES = {
  backgroundColor: '#ffffff',
};

const AuthenticatedLayout = () => {
  const { authenticated } = useAuth();

  if (!authenticated) return <Redirect href='/sign-in' />;

  return (
    <CoursesDrawerLayout>
      <Tabs
        tabBar={() => <NavigationBar />}
        sceneContainerStyle={CONTAINER_STYLES}
        screenOptions={SCREEN_OPTIONS}
      />

      <DirectMessageToastContainer />
    </CoursesDrawerLayout>
  );
};

export default AuthenticatedLayout;
