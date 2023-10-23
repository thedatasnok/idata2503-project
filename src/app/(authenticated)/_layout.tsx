import CoursesDrawerLayout from '@/components/navigation/CoursesDrawerLayout';
import NavigationBar from '@/components/navigation/NavigationBar';
import { View } from '@gluestack-ui/themed';
import { Slot } from 'expo-router';

const AuthenticatedLayout = () => {
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
