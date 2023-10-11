import Header from '@/components/navigation/Header';
import NavigationBar from '@/components/navigation/NavigationBar';
import { Text, View } from '@gluestack-ui/themed';
import { ArrowLeftIcon } from 'lucide-react-native';

const HomeScreen = () => {
  return (
    <>
      <Header
        leftIcon={ArrowLeftIcon}
        context='IDATA2503'
        title='Course content'
      />

      <View flex={1}>
        <Text>Hi</Text>
      </View>

      <NavigationBar />
    </>
  );
};

export default HomeScreen;
