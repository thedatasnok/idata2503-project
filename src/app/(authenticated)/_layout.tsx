import CoursesDrawerLayout from '@/components/navigation/CoursesDrawerLayout';
import NavigationBar from '@/components/navigation/NavigationBar';
import { getToken } from '@/theme';
import { View } from '@gluestack-ui/themed';
import { Slot } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';

const AuthenticatedLayout = () => {
  return (
    <>
      <CoursesDrawerLayout>
        {/* Top safe area */}
        <SafeAreaView style={styles.top} />

        {/* "bottom safe area" */}
        <SafeAreaView style={styles.bottom}>
          <View flex={1}>
            <Slot />
          </View>

          <NavigationBar />
        </SafeAreaView>
      </CoursesDrawerLayout>
    </>
  );
};

const styles = StyleSheet.create({
  top: {
    flex: 0,
    backgroundColor: getToken('colors', 'primary600'),
  },
  bottom: {
    flex: 1,
    backgroundColor: getToken('colors', 'gray100'),
  },
});

export default AuthenticatedLayout;
