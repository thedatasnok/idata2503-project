import CoursesDrawerLayout from '@/components/navigation/CoursesDrawerLayout';
import NavigationBar from '@/components/navigation/NavigationBar';
import { useAuth } from '@/store/global';
import { Redirect, Tabs } from 'expo-router';

const SCREEN_OPTIONS = {
  header: () => <></>,
} as const;

const AuthenticatedLayout = () => {
  const { authenticated } = useAuth();

  if (!authenticated) return <Redirect href='/sign-in' />;

  return (
    <CoursesDrawerLayout>
      <Tabs tabBar={() => <NavigationBar />} screenOptions={SCREEN_OPTIONS} />
    </CoursesDrawerLayout>
  );
};

export default AuthenticatedLayout;
