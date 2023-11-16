import BoardForm from '@/components/boards/BoardForm';
import CourseSheet from '@/components/course/CourseSheet';
import LeaveCourseConfirmationDialog from '@/components/course/LeaveCourseConfirmationDialog';
import Header from '@/components/navigation/Header';
import {
  CourseBoard,
  CourseRole,
  useAnnouncements,
  useCourse,
  useCourseBoards,
  useCourseDescription,
  useCourseMembership,
  useDeleteCourseBoard,
} from '@/services/courses';
import { getToken } from '@/theme';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  Box,
  Divider,
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
  Megaphone,
  MessageSquare,
  MoreVerticalIcon,
  Trash,
  X,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

const CourseScreen = () => {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [showCourseSheet, setShowCourseSheet] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [showBoardSheet, setShowBoardSheet] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<CourseBoard>();
  const { leave, data: membership } = useCourseMembership(courseId);
  const { data: course, isLoading: isCourseLoading } = useCourse(courseId);
  const { data: announcements, isLoading: isAnnouncementLoading } =
    useAnnouncements(courseId);
  const { data: courseDescription, isLoading: isCourseDescriptionLoading } =
    useCourseDescription(courseId);
  const { data: courseBoards, isLoading: isCourseBoardLoading } =
    useCourseBoards(courseId);

  const deleteBoard = useDeleteCourseBoard(courseId);

  const onDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard.mutateAsync(boardId);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

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

  const handleLeave = async () => {
    try {
      await leave();
      setShowLeaveConfirmation(false);
      router.push('/courses/');
    } catch (error) {
      console.error('Failed to leave course', error);
    }
  };

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
        rightIcon={MoreVerticalIcon}
        onRightIconPress={() => setShowCourseSheet(true)}
      />

      <ScrollView nestedScrollEnabled px='$4'>
        <ComponentHeader
          title={t('GENERAL.ANNOUNCEMENTS')}
          courseId={courseId}
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
            <Icon as={Megaphone} size='3xl' />
            <Text color='$gray950'>
              {t('FEATURES.COURSES.NO_ANNOUNCEMENTS_YET')}
            </Text>
          </Box>
        )}

        <ComponentHeader title={t('GENERAL.ASSIGNMENTS')} showAll={true} />
        {assignments.slice(0, 2).map((assignment, index) => (
          <AssignmentCard
            key={index}
            title={assignment.title}
            dueDate={assignment.dueDate}
            onPress={() => router.push(`/courses/${courseId}/announcements/`)}
          />
        ))}

        <ComponentHeader title={t('GENERAL.TEXT_CHANNEL')} />

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
                onLongPress={() => {
                  setShowBoardSheet(true);
                  setSelectedBoard(board);
                }}
                role={membership?.role as CourseRole}
              />
            ))}
          </Box>
        ) : (
          <Box alignItems='center' justifyContent='center'>
            <Icon as={Hash} size='2xl' />
            <Text color='$gray950'>
              {t('FEATURES.COURSES.NO_TEXT_CHANNEL_CREATED')}
            </Text>
          </Box>
        )}

        <ComponentHeader title={t('GENERAL.LECTURERS')} />

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
            <Icon as={GraduationCap} size='3xl' />
            <Text color='$gray950'>
              {t('FEATURES.COURSES.NO_LECTURERS_ASSIGNED')}
            </Text>
          </Box>
        )}
      </ScrollView>

      <Actionsheet
        isOpen={showCourseSheet}
        onClose={() => setShowCourseSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <CourseSheet
            courseId={courseId}
            onClose={() => setShowCourseSheet(false)}
            onLeavePressed={() => setShowLeaveConfirmation(true)}
            onNewAnnouncementPressed={() =>
              router.push(
                `/courses/${courseId}/announcements/create-announcement`
              )
            }
            onNewTextChannelPressed={() => {
              setShowBoardSheet(true);
              setSelectedBoard(undefined);
            }}
          />
        </ActionsheetContent>
      </Actionsheet>

      <Actionsheet
        isOpen={showBoardSheet}
        onClose={() => setShowBoardSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem>
            <BoardForm
              key={selectedBoard?.course_board_id}
              courseId={courseId}
              boardId={selectedBoard?.course_board_id}
              boardName={selectedBoard?.name}
              boardDescription={selectedBoard?.description}
              onSuccess={() => {
                setShowBoardSheet(false);
                setSelectedBoard(undefined);
              }}
            />
          </ActionsheetItem>
          {selectedBoard && (
            <>
              <ActionsheetItem
                onPress={() => {
                  onDeleteBoard(selectedBoard?.course_board_id);
                  setShowBoardSheet(false);
                }}
              >
                <ActionsheetIcon as={Trash} color='$error600' />
                <ActionsheetItemText color='$error600'>
                  {t('FEATURES.COURSE_BOARDS.DELETE_BOARD')}
                </ActionsheetItemText>
              </ActionsheetItem>
              <Divider />
            </>
          )}

          <ActionsheetItem
            onPress={() => {
              setShowBoardSheet(false);
              setShowCourseSheet(true);
            }}
          >
            <ActionsheetIcon as={X} color='$gray800' />
            <ActionsheetItemText color='$gray800'>
              {t('GENERAL.CANCEL')}
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>

      <LeaveCourseConfirmationDialog
        courseCode={course?.course_code}
        show={showLeaveConfirmation}
        onClose={() => setShowLeaveConfirmation(false)}
        onLeave={handleLeave}
      />
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
          <Heading fontSize='$md'> {t('GENERAL.SHOW_ALL')}</Heading>
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
      <Icon as={Clock} color={color} mr='$3' size='xl' />
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
  onLongPress?: () => void;
  role: CourseRole;
}

const BoardCard: React.FC<BoardProps> = ({
  title,
  onPress,
  onLongPress,
  role,
}) => {
  return (
    <Pressable
      flexDirection='row'
      alignItems='flex-end'
      gap='$2'
      py='$2'
      onPress={onPress}
      // TODO: changed for testing purposes, remember to change with {role === 'LECTURER' ? onLongPress : undefined}
      onLongPress={role === 'LECTURER' ? onLongPress : onLongPress}
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
        <Icon as={MessageSquare} size='xl' />
      </Box>
    </Pressable>
  );
};

export default CourseScreen;
