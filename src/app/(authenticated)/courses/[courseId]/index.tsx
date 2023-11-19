import BoardSheet from '@/components/boards/BoardSheet';
import CourseAssignmentCard from '@/components/course/CourseAssignmentCard';
import CourseSheet from '@/components/course/CourseSheet';
import LeaveCourseConfirmationDialog from '@/components/course/LeaveCourseConfirmationDialog';
import Header from '@/components/navigation/Header';
import ConfiguredKeyboardAvoidingView from '@/components/utils/ConfiguredKeyboardAvoidingView';
import {
  CourseBoard,
  CourseRole,
  useAnnouncements,
  useCourse,
  useCourseAssignments,
  useCourseBoards,
  useCourseDescription,
  useCourseMembership,
  useDeleteCourseBoard,
} from '@/services/courses';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
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
  ClipboardIcon,
  GraduationCap,
  Hash,
  Megaphone,
  MessageSquare,
  MoreVerticalIcon,
} from 'lucide-react-native';
import { useState } from 'react';
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
  const { data: assignments } = useCourseAssignments(courseId, false);

  const deleteBoard = useDeleteCourseBoard(courseId);

  const onDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard.mutateAsync(boardId);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

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
          showAll={announcements && announcements.length > 0}
          route={`/courses/${courseId}/announcements/`}
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
        <ComponentHeader
          title={t('GENERAL.ASSIGNMENTS')}
          showAll={assignments && assignments.length > 0}
          route={`/courses/${courseId}/assignments/`}
        />
        {assignments && assignments.length > 0 ? (
          <Box gap='$2'>
            {assignments
              ?.slice(0, 2)
              .reverse()
              .map((assignment) => (
                <CourseAssignmentCard
                  key={assignment.assignment_id}
                  title={assignment.name}
                  evaluation={assignment.evaluation}
                  submittedAt={assignment.submitted_at}
                  dueDate={assignment.due_at}
                  onPress={() =>
                    router.push(
                      `/courses/${courseId}/assignments/${assignment.assignment_id}`
                    )
                  }
                />
              ))}
          </Box>
        ) : (
          <Box alignItems='center' justifyContent='center'>
            <Icon as={ClipboardIcon} size='3xl' />
            <Text color='$gray950'>
              {t('FEATURES.COURSES.NO_ASSIGNMENTS_YET')}
            </Text>
          </Box>
        )}

        <ComponentHeader title={t('GENERAL.TEXT_CHANNEL')} />
        {courseBoards && courseBoards.length > 0 ? (
          <Box rounded='$md' px='$1' gap='$3'>
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
              avatarUrl={lecturer.avatar_url}
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
        <ConfiguredKeyboardAvoidingView>
          <ActionsheetContent zIndex={999}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>

            <BoardSheet
              courseId={courseId}
              selectedBoard={selectedBoard}
              onClose={() => setShowBoardSheet(false)}
              onCancel={() => {
                setShowBoardSheet(false);
                setShowCourseSheet(true);
              }}
              onDeleteBoard={onDeleteBoard}
              onDeselect={() => setSelectedBoard(undefined)}
            />
          </ActionsheetContent>
        </ConfiguredKeyboardAvoidingView>
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
  showAll?: boolean;
  route?: string;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  title,
  showAll,
  route,
}) => {
  return (
    <Box flexDirection='row' justifyContent='space-between' pt='$2' pb='$1'>
      <Heading fontSize='$md'>{title}</Heading>
      {showAll && (
        <Pressable
          flexDirection='row'
          alignItems='center'
          gap='$1'
          onPress={() => {
            if (route) {
              router.push(route as any);
            }
          }}
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
      borderWidth='$1'
      borderColor='$gray200'
      backgroundColor='$gray50'
      mr='$2'
      p='$2'
      width='$72'
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
      alignItems='center'
      gap='$2'
      onPress={onPress}
      onLongPress={role === CourseRole.LECTURER ? onLongPress : undefined}
    >
      <Icon as={Hash} size='lg' />
      <Text color='$gray950' numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
};

interface LecturerProps {
  name: string;
  avatarUrl?: string;
  email: string;
  onPress?: () => void;
}

const Lecturer: React.FC<LecturerProps> = ({
  name,
  avatarUrl,
  email,
  onPress,
}) => {
  return (
    <Pressable rounded='$md' onPress={onPress}>
      <Box
        flexDirection='row'
        rounded='$md'
        alignItems='center'
        justifyContent='space-between'
        gap='$2'
      >
        <Avatar size='md'>
          <AvatarFallbackText>{name}</AvatarFallbackText>
          {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
        </Avatar>

        <Box flex={1}>
          <Text fontSize='$lg' fontWeight='$bold' numberOfLines={1}>
            {name}
          </Text>
          <Text fontSize='$sm' numberOfLines={1}>
            {email}
          </Text>
        </Box>
        <Icon as={MessageSquare} size='xl' />
      </Box>
    </Pressable>
  );
};

export default CourseScreen;
