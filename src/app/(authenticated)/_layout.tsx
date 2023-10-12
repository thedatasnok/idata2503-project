import Header from '@/components/navigation/Header';
import NavigationBar from '@/components/navigation/NavigationBar';
import { View } from '@gluestack-ui/themed';
import { Slot } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';

const AuthenticatedLayout = () => {
  return (
    <>
      <Header
        leftIcon={ArrowLeftIcon}
        context='IDATA2503'
        title='Course content'
      />

      <View flex={1}>
        <Slot />
      </View>

      <NavigationBar />
    </>
  );
};

export default AuthenticatedLayout;
