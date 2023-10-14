import NavigationBar from '@/components/navigation/NavigationBar';
import { View } from '@gluestack-ui/themed';
import { Slot } from 'expo-router';

const AuthenticatedLayout = () => {
  return (
    <>
      <View flex={1}>
        <Slot />
      </View>

      <NavigationBar />
    </>
  );
};

export default AuthenticatedLayout;
