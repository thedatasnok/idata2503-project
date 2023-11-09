import Header from '@/components/navigation/Header';
import {
  useAnnouncements,
  useCourse,
  useCourseBoards,
  useCourseDescription,
} from '@/services/courses';
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
import { t } from 'i18next';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  GraduationCap,
  Hash,
  InfoIcon,
  Megaphone,
  MessageSquare,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

const CourseScreen = () => {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const { data: course, isLoading: isCourseLoading } = useCourse(
    courseId as string
  );
  const { data: announcements, isLoading: isAnnouncementLoading } =
    useAnnouncements(courseId as string);
  const { data: courseDescription, isLoading: isCourseDescriptionLoading } =
    useCourseDescription(courseId as string);
  const { data: courseBoards, isLoading: isCourseBoardLoading } =
    useCourseBoards(courseId as string);

  const assignments = [
    {
      title: 'Assignment 1',
      dueDate: '2023-11-07 23:18:50',
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

  const isLoading =
    isCourseLoading ||
    isAnnouncementLoading ||
    isCourseDescriptionLoading ||
    isCourseBoardLoading;

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
        back
        title={course?.course_code ?? 'Course'}
        rightIcon={InfoIcon}
        onRightIconPress={() => router.push(`/courses/${courseId}/description`)}
      />

      <ScrollView nestedScrollEnabled px='$4'>
        <ComponentHeader
          title={t('GENERAL.ANNOUNCEMENTS')}
          courseId={courseId as string}
          showAll={announcements && announcements.length > 0}
        />

        {announcements && announcements.length > 0 ? (
          <FlatList
            horizontal={true}
            data={announcements.slice(0, 3)}
            keyExtractor={(item) => item.announcement_id}
            renderItem={({ item }) => (
              <AnnouncementCard
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
          <Box alignItems='center' justifyContent='center'>
            {/*@ts-ignore*/}
            <Icon as={Megaphone} size={48} />
            <Text color='$gray950'>{t("FEATURES.COURSES.NO_ANNOUNCEMENTS_YET")}</Text>
          </Box>
        )}

        <ComponentHeader title={t("GENERAL.ASSIGNMENTS")} showAll={true} />
        {assignments.slice(0, 2).map((assignment, index) => (
          <AssignmentCard
            key={index}
            title={assignment.title}
            dueDate={assignment.dueDate}
            onPress={() =>
              //TODO: Replace this with navigation to specific assignment
              router.push(`/courses/${courseId}/announcements` as any)
            }
          />
        ))}

        <ComponentHeader title={t("GENERAL.TEXT_CHANNEL")} />

        {courseBoards && courseBoards.length > 0 ? (
          <Box
            backgroundColor='$gray50'
            rounded='$md'
            px='$2'
            borderWidth='$1'
            borderColor='$gray200'
          >
            {courseBoards.map((board) => (
              <BoardCard
                key={board.course_board_id}
                title={board.name}
                onPress={() => {
                  router.push(
                    `/courses/${courseId}/boards/${board.course_board_id}`
                  );
                }}
              />
            ))}
          </Box>
        ) : (
          <Box alignItems='center' justifyContent='center'>
            {/*@ts-ignore*/}
            <Icon as={Hash} size={32} />
            <Text color='$gray950'>{t("FEATURES.COURSES.NO_TEXT_CHANNEL_CREATED")}</Text>
          </Box>
        )}

        <ComponentHeader title={t("GENERAL.LECTURERS")} />

        {courseDescription?.staff && courseDescription?.staff.length > 0 ? (
          courseDescription?.staff.map((lecturer) => (
            <Lecturer
              key={lecturer.user_id}
              name={lecturer.name}
              email={lecturer.email}
              onPress={() => {
                router.push(`/messages/${lecturer.user_id}`);
              }}
            />
          ))
        ) : (
          <Box alignItems='center' justifyContent='center' pb='$2'>
            {/*@ts-ignore*/}
            <Icon as={GraduationCap} size={48} />
            <Text color='$gray950'>{t("FEATURES.COURSES.NO_LECTURERS_ASSIGNED")}</Text>
          </Box>
        )}
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
          <Heading fontSize='$md'> {t("GENERAL.SHOW_ALL")}</Heading>
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

  const isUnderTwoDays = dayjs(dueDate).diff(dayjs(), 'day') < 2;

  const color = isUnderTwoDays
    ? getToken('colors', 'error500')
    : getToken('colors', 'gray950');

  //Create an interval to update the time left every 10 seconds
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
      {/*@ts-ignore*/}
      <Icon as={Clock} color={color} mr='$3' size={24} />
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
        {/*@ts-ignore*/}
        <Icon as={MessageSquare} size={24} />
      </Box>
    </Pressable>
  );
};

export default CourseScreen;
