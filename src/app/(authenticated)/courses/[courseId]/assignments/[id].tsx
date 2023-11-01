import Header from '@/components/navigation/Header';
import { Text } from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';

const AssignmentScreen = () => {
  const { courseId, id: _assignmentId } = useLocalSearchParams();
  const router = useRouter();

  const onBack = () => {
    // @ts-ignore
    router.push(`/courses/${courseId as string}/assignments`);
  };

  return (
    <>
      <Header
        context='COURSE'
        title='Assignment'
        leftIcon={ArrowLeftIcon}
        onLeftIconPress={onBack}
      />
      <Text>Yo</Text>
    </>
  );
};

export default AssignmentScreen;
