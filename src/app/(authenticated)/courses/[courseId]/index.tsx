import BoardSheet from '@/components/boards/BoardSheet';
import CourseAnnouncementCard from '@/components/course/CourseAnnouncementCard';
import CourseAssignmentCard from '@/components/course/CourseAssignmentCard';
import CourseSheet from '@/components/course/CourseSheet';
import LeaveCourseConfirmationDialog from '@/components/course/LeaveCourseConfirmationDialog';
import Lecturer from '@/components/course/Lecturer';
import Header from '@/components/navigation/Header';
import ConfiguredKeyboardAvoidingView from '@/components/utils/ConfiguredKeyboardAvoidingView';
import EmptyState from '@/components/utils/EmptyState';
import { useAnnouncements } from '@/services/announcements';
import { useCourseAssignments } from '@/services/assignments';
import {
  CourseBoard,
  CourseRole,
  useCourse,
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
  Box,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Spinner,
  Text,
} from '@gluestack-ui/themed';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { t } from 'i18next';
import {
  ArrowRight,
  ClipboardListIcon,
  GraduationCap,
  Hash,
  Megaphone,
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

  return (
    <>
      <Header
        back='/courses/'
        title={course?.course_code ?? 'Course'}
        rightIcon={MoreVerticalIcon}
        onRightIconPress={() => setShowCourseSheet(true)}
      />

      {isLoading ? (
        <Box flex={1} alignItems='center' justifyContent='center'>
          <Spinner size="large" />
        </Box>
      ) : (
        <ScrollView nestedScrollEnabled px='$4'>
          <ComponentHeader
            title={t('GENERAL.ANNOUNCEMENTS')}
            showAll={announcements && announcements.length > 0}
            route={`/courses/${courseId}/announcements/`}
          />
          {announcements && announcements.length > 0 ? (
            <FlatList
              horizontal={true}
              data={announcements}
              keyExtractor={(item) => item.announcement_id}
              renderItem={({ item }) => (
                <CourseAnnouncementCard
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
            <EmptyState
              description={t('FEATURES.COURSES.NO_ANNOUNCEMENTS_YET')}
              icon={Megaphone}
            />
          )}
          <ComponentHeader
            title={t('GENERAL.ASSIGNMENTS')}
            showAll={assignments && assignments.length > 0}
            route={`/courses/${courseId}/assignments/`}
          />
          {assignments && assignments.length > 0 ? (
            <Box gap='$2'>
              {assignments.map((assignment) => (
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
            <EmptyState
              description={t('FEATURES.COURSES.NO_ASSIGNMENTS_YET')}
              icon={ClipboardListIcon}
            />
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
            <EmptyState
              description={t('FEATURES.COURSES.NO_TEXT_CHANNEL_CREATED')}
              icon={Hash}
            />
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
            <EmptyState
              description={t('FEATURES.COURSES.NO_LECTURERS_ASSIGNED')}
              icon={GraduationCap}
            />
          )}
        </ScrollView>
      )}

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

export default CourseScreen;
