import CoursesDrawerLayout from '@/components/navigation/CoursesDrawerLayout';
import NavigationBar from '@/components/navigation/NavigationBar';
import { useAuth } from '@/store/global';
import { View } from '@gluestack-ui/themed';
import { Slot } from 'expo-router';

const AuthenticatedLayout = () => {
  const { authenticated } = useAuth();

  if (!authenticated) return null;

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
