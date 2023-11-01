import Header from '@/components/navigation/Header';
import { useCourse } from '@/services/courses';
import { formatDate, getTimeLeft } from '@/util/date';
import {
  Box,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text
} from '@gluestack-ui/themed';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Hash,
  InfoIcon,
  Mail
} from 'lucide-react-native';
import { useEffect, useState } from 'react';

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
      created_at: '2023-10-28 13:21:50',
      author: 'Albert Einstein',
    },
    {
      title: 'I tried something new today',
      content:
        'No one has ever done that in the history of Dota! 4Head (copilot hello?)',
      created_at: '2023-10-26 09:24:50',
      author: 'Albert Einstein',
    },
    {
      title: 'No lecture tomorrow 05.10.2023',
      content:
        'Unfortunately, due to unforeseen circumstances there will be no lecture tomorrow.',
      created_at: '2023-10-26 09:24:50',
      author: 'Albert Einstein',
    },
    {
      title: 'I tried something new today',
      content:
        'No one has ever done that in the history of Dota! 4Head (copilot hello?)',
      created_at: '2023-10-26 09:24:50',
      author: 'Albert Einstein',
    },
    {
      title: 'No lecture tomorrow 05.10.2023',
      content:
        'Unfortunately, due to unforeseen circumstances there will be no lecture tomorrow.',
      created_at: '2023-10-26 09:24:50',
      author: 'Albert Einstein',
    },
    {
      title: 'I tried something new today',
      content:
        'No one has ever done that in the history of Dota! 4Head (copilot hello?)',
      created_at: '2023-10-26 09:24:50',
      author: 'Albert Einstein',
    },
  ];

  const assignments = [
    {
      title: 'Assignment 1',
      dueDate: '2023-10-30 14:18:50',
    },
    {
      title: 'Assignment 2',
      dueDate: '2023-11-24 14:20:50',
    },
    {
      title: 'Assignment 3',
      dueDate: '2023-11-26 09:24:50',
    },
    {
      title: 'Assignment 4',
      dueDate: '2023-11-26 09:24:50',
    },
    {
      title: 'Assignment 5',
      dueDate: '2023-11-26 09:24:50',
    },
    {
      title: 'Assignment 6',
      dueDate: '2023-11-26 09:24:50',
    },
  ];

  const boards = [
    {
      title: 'general',
    },
    {
      title: 'resources',
    },
    {
      title: 'assignment-help',
    },
    {
      title: 'group-1-chat',
    },
    {
      title: 'general',
    },
    {
      title: 'resources',
    },
    {
      title: 'assignment-help',
    },
    {
      title: 'group-1-chat',
    },
  ];

  const lecturer = [
    {
      name: 'Albert Einstein',
      email: 'albert.stein@yahoo.com',
    },
    {
      name: 'Issac Newton',
      email: 'issac.newton@live.no',
    },
  ];

  return (
    <>
      <Header
        title={course?.course_code ?? 'Loading...'}
        rightIcon={InfoIcon}
        onRightIconPress={() => router.push(`/courses/${courseId}/description`)}
      />

      <ScrollView nestedScrollEnabled px='$4'>
        <ComponentHeader
          title='Announcements'
          courseId={courseId as string}
          showAll={true}
        />
        <ScrollView
          nestedScrollEnabled={true}
          horizontal
          showsHorizontalScrollIndicator={false}
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

        <ComponentHeader title='Assignments' showAll={true} />
        {assignments.slice(0, 2).map((assignment, index) => (
          <AssignmentCard
            key={index}
            title={assignment.title}
            dueDate={assignment.dueDate}
            onPress={() =>
              //TODO: Replace this with navigation to specific announcement
              router.push(`/courses/${courseId}/announcements` as any)
            }
          />
        ))}

        <ComponentHeader title='Boards' />

        <Box
          backgroundColor='$gray50'
          rounded='$md'
          px='$2'
          borderWidth='$1'
          borderColor='$gray200'
        >
          {boards.map((boards, index) => (
            <BoardCard
              key={index}
              title={boards.title}
              onPress={() =>
                //TODO: Replace this with navigation to specific board
                router.push(`/courses/${courseId}/announcements` as any)
              }
            />
          ))}
        </Box>

        <ComponentHeader title='Lecturers' />
        {lecturer.map((lecturer, index) => (
          <Lecturer key={index} name={lecturer.name} email={lecturer.email} />
        ))}
      </ScrollView>
    </>
  );
};

interface ComponentHeaderProps {
  title: string;
  courseId?: string;
  showAll?: boolean;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  title,
  courseId,
  showAll,
}) => {
  return (
    <Box flexDirection='row' justifyContent='space-between' pt='$2'>
      <Heading fontSize='$md'>{title}</Heading>
      {showAll && (
        <Pressable
          flexDirection='row'
          alignItems='center'
          gap='$1'
          onPress={() =>
            router.push(`/courses/${courseId}/announcements` as any)
          }
        >
          <Heading fontSize='$md'> Show all</Heading>
          <Icon as={ArrowRight} />
        </Pressable>
      )}
    </Box>
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
  const formattedDate = formatDate(created_at);

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
        <Text numberOfLines={2}>{content}</Text>
        <Text color='$gray500' numberOfLines={1}>
          {formattedDate} | {author}
        </Text>
      </Box>
    </Pressable>
  );
};

interface AssignmentsProps {
  title: string;
  dueDate: string;
  onPress: () => void;
}

const AssignmentCard: React.FC<AssignmentsProps> = ({
  title,
  dueDate,
  onPress,
}) => {
  const formattedDate = formatDate(dueDate);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(dueDate));
  const color =
    formattedDate.startsWith('Today') || formattedDate.startsWith('Tomorrow')
      ? 'red'
      : '$gray950';

  //Create an interval to update the time left every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(dueDate));
    }, 1000);

    //Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [dueDate]);

  return (
    <Pressable
      rounded='$md'
      onPress={onPress}
      p='$2'
      mb='$1'
      flexDirection='row'
      backgroundColor='$gray50'
      borderColor='$gray200'
      borderWidth='$1'
      alignItems='center'
      justifyContent='space-between'
    >
      <Icon as={Clock} color={color} mr='$4' />
      <Box flex={1}>
        <Text fontSize='$lg' fontWeight='$bold' numberOfLines={1} color={color}>
          {title}
        </Text>
        <Box flexDirection='row'>
          <Text fontSize='$sm' color={color} numberOfLines={1}>
            {formattedDate} - {timeLeft}
          </Text>
        </Box>
      </Box>
      <Icon as={ChevronRight} color={color} />
    </Pressable>
  );
};

interface BoardProps {
  title: string;
  onPress?: () => void;
}

const BoardCard: React.FC<BoardProps> = ({ title, onPress }) => {
  return (
    <Pressable
      flexDirection='row'
      alignItems='flex-end'
      gap='$2'
      py='$2'
      onPress={onPress}
    >
      <Icon as={Hash} />
      <Text color='$gray950' numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
};

interface LecturerProps {
  name: string;
  email: string;
  onPress?: () => void;
}

const Lecturer: React.FC<LecturerProps> = ({ name, email, onPress }) => {
  return (
    <Pressable rounded='$md' onPress={onPress} pb='$1'>
      <Box
        p='$2'
        flexDirection='row'
        backgroundColor='$gray50'
        borderColor='$gray200'
        borderWidth='$1'
        rounded='$md'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box flex={1}>
          <Text fontSize='$lg' fontWeight='$bold' numberOfLines={1}>
            {name}
          </Text>
          <Box flexDirection='row'>
            <Text fontSize='$sm' numberOfLines={1}>
              {email}
            </Text>
          </Box>
        </Box>
        <Icon as={Mail} />
      </Box>
    </Pressable>
  );
};

export default CourseScreen;
