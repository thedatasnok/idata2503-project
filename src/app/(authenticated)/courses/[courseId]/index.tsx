import Header from '@/components/navigation/Header';
import { useAnnouncements, useCourse } from '@/services/courses';
import { getToken } from '@/theme';
import {
  Box,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Spinner,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Hash,
  InfoIcon,
  Mail,
  Megaphone,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

const CourseScreen = () => {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);
  const { data: announcements, isLoading } = useAnnouncements(
    courseId as string
  );

  const assignments = [
    {
      title: 'Assignment 1',
      dueDate: '2023-11-02 23:18:50',
    },
    {
      title: 'Assignment 2',
      dueDate: '2023-11-13 14:20:50',
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

  if (isLoading) {
    return (
      <Box flex={1} alignItems='center' justifyContent='center'>
        <Spinner size={48} />
      </Box>
    );
  }

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
          showAll={announcements && announcements.length > 0}
        />

        {announcements && announcements.length > 0 ? (
          <FlatList
            horizontal={true}
            data={announcements.slice(0, 3)}
            keyExtractor={(item) => item.announcement_id}
            renderItem={({ item, index }) => (
              <AnnouncementCard
                key={index}
                title={item.title}
                content={item.content}
                createdAt={item.created_at}
                author={item.created_by_full_name}
                onPress={() => {
                  router.push(
                    `/courses/${courseId}/announcements/${item.announcement_id}`
                  );
                }}
              />
            )}
          />
        ) : (
          <Box
            alignItems='center'
            justifyContent='center'
            height={60}
            width='100%'
          >
            {/*@ts-ignore*/}
            <Icon as={Megaphone} size={48} />
            <Text color='$gray950'>No Announcements yet</Text>
          </Box>
        )}

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
  createdAt: string;
  author: string;
  onPress: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  content,
  createdAt,
  author,
  onPress,
}) => {
  const formattedDate = dayjs(createdAt).calendar();

  return (
    <Pressable
      backgroundColor='$gray50'
      borderWidth='$1'
      borderColor='$gray200'
      mr='$2'
      p='$2'
      width='$80'
      height='$32'
      rounded='$md'
      onPress={onPress}
    >
      <Heading numberOfLines={1}>{title}</Heading>
      <Box flex={1} justifyContent='space-between'>
        <Text numberOfLines={2} color='$gray950'>
          {content}
        </Text>
        <Text color='$gray950' numberOfLines={1}>
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
  const formattedDate = dayjs(dueDate).calendar();
  const [timeLeft, setTimeLeft] = useState(dayjs(dueDate).fromNow());
  const color = getToken('colors', 'gray950');

  //Create an interval to update the time left every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(dayjs(dueDate).fromNow());
    }, 10000);

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
