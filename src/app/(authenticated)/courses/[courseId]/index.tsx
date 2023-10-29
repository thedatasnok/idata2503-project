import Header from '@/components/navigation/Header';
import { useCourse } from '@/services/courses';
import {
  Box,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Dot, InfoIcon } from 'lucide-react-native';

const CourseScreen = () => {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);

  //TODO: Replace this with data loaded from backend
  const announcements = [
    {
      title: 'No lecture tomorrow 05.10.2023',
      content:
        'Unfortunately, due to unforeseen circumstances there will be no lecture tomorrow.',
      created_at: '4m ago',
      author: 'Albert Einstein',
    },
    {
      title: 'I tried something new today',
      content:
        'No one has ever done that in the history of Dota! 4Head (copilot hello?)',
      created_at: '4m ago',
      author: 'Albert Einstein',
    },
    {
      title: 'No lecture tomorrow 05.10.2023',
      content:
        'Unfortunately, due to unforeseen circumstances there will be no lecture tomorrow.',
      created_at: '4m ago',
      author: 'Albert Einstein',
    },
    {
      title: 'I tried something new today',
      content:
        'No one has ever done that in the history of Dota! 4Head (copilot hello?)',
      created_at: '4m ago',
      author: 'Albert Einstein',
    },
    {
      title: 'No lecture tomorrow 05.10.2023',
      content:
        'Unfortunately, due to unforeseen circumstances there will be no lecture tomorrow.',
      created_at: '4m ago',
      author: 'Albert Einstein',
    },
    {
      title: 'I tried something new today',
      content:
        'No one has ever done that in the history of Dota! 4Head (copilot hello?)',
      created_at: '4m ago',
      author: 'Albert Einstein',
    },
  ];

  return (
    <>
      <Header
        title={course?.course_code ?? 'Loading...'}
        rightIcon={InfoIcon}
        onRightIconPress={() => router.push(`/courses/${courseId}/description`)}
      />

      <Box px='$4' py='$2'>
        <Box flexDirection='row' justifyContent='space-between' mb='$1'>
          <Heading>Announcements</Heading>
          <Pressable
            flexDirection='row'
            alignItems='center'
            gap='$1'
            onPress={() =>
              router.push(`/courses/${courseId}/announcements` as any)
            }
          >
            <Heading> Show All</Heading>
            <Icon as={ArrowRight} />
          </Pressable>
        </Box>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          maxHeight='$40'
        >
          {announcements.slice(0, 3).map((announcement, index) => (
            <AnnouncementCard
              key={index}
              title={announcement.title}
              content={announcement.content}
              created_at={announcement.created_at}
              author={announcement.author}
              onPress={() =>
                //TODO: Replace this with navigation to specific announcement
                router.push(`/courses/${courseId}/announcements` as any)
              }
            />
          ))}
        </ScrollView>
      </Box>
    </>
  );
};

interface AnnouncementCardProps {
  title: string;
  content: string;
  created_at: string;
  author: string;
  onPress: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  content,
  created_at,
  author,
  onPress,
}) => {
  return (
    <Pressable
      backgroundColor='$gray50'
      borderWidth='$1'
      borderColor='$gray200'
      mr='$2'
      p='$2'
      width='$72'
      height='$32'
      rounded='$md'
      onPress={onPress}
    >
      <Heading numberOfLines={1}>{title}</Heading>
      <Box flex={1} justifyContent='space-between'>
        <Text numberOfLines={2} width='100%'>
          {content}
        </Text>
        <Box flexDirection='row' gap='$1' alignItems='center'>
          <Text color='$gray500'>{created_at}</Text>
          <Icon as={Dot} color='$gray500' />
          <Text color='$gray500'>{author}</Text>
        </Box>
      </Box>
    </Pressable>
  );
};

export default CourseScreen;
