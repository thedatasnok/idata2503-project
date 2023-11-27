import {
  CourseRole,
  useCourseDescriptionQuery,
} from '@/services/courses';
import { useCourseMembership } from '@/services/membership';
import { getToken } from '@/theme';
import { formatDuration } from '@/util/date';
import {
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  Box,
  Divider,
  Heading,
  Text,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import {
  DoorOpenIcon,
  InfoIcon,
  MegaphoneIcon,
  PlusIcon,
  UsersIcon,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CourseSheetProps {
  /**
   * The id of the course to display the sheet for.
   */
  courseId: string;
  /**
   * Called prior to any of the actions being executed.
   * Will also be called by self-contained actions that do not require external handling.
   */
  onClose: () => void;
  /**
   * Called when the user presses the "New announcement" button.
   */
  onNewAnnouncementPressed: () => void;
  /**
   * Called when the user presses the "New text channel" button.
   */
  onNewTextChannelPressed: () => void;
  /**
   * Called when the user presses the "Leave course" button.
   */
  onLeavePressed: () => void;
}

/**
 * Actionsheet content for a course.
 * Contains short details and actions for the course.
 * Only renders the contents of the sheet, not the sheet itself.
 */
const CourseSheet: React.FC<CourseSheetProps> = ({
  courseId,
  onClose,
  onNewAnnouncementPressed,
  onNewTextChannelPressed,
  onLeavePressed,
}) => {
  const { data: description } = useCourseDescriptionQuery(courseId);
  const { t } = useTranslation();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { data: membership } = useCourseMembership(courseId);

  const isStaff =
    membership &&
    [CourseRole.LECTURER, CourseRole.ASSISTANT].includes(membership.role);

  if (!description) {
    return <ActivityIndicator color={getToken('colors', 'primary600')} />;
  }

  const closeWith = (cb?: () => void) => {
    onClose();
    cb?.();
  };

  return (
    <Box pb={bottom} w='$full'>
      <Box px='$2' mb='$2'>
        <Heading>{description.course_code}</Heading>
        <Text fontWeight='$medium' color='$gray800'>
          {description.name}
        </Text>
        <Text fontSize='$sm'>
          {formatDuration(description.starts_at, description.ends_at)}
        </Text>
      </Box>

      <ActionsheetItem
        onPress={() =>
          closeWith(() => router.push(`/courses/${courseId}/description`))
        }
      >
        <ActionsheetIcon as={InfoIcon} color='$gray800' />
        <ActionsheetItemText color='$gray800'>
          {t('FEATURES.COURSES.VIEW_COURSE_DESCRIPTION')}
        </ActionsheetItemText>
      </ActionsheetItem>

      <Divider />

      <ActionsheetItem
        onPress={() =>
          closeWith(() => router.push(`/courses/${courseId}/members`))
        }
      >
        <ActionsheetIcon as={UsersIcon} color='$gray800' />
        <ActionsheetItemText color='$gray800'>
          {t('FEATURES.COURSES.VIEW_COURSE_MEMBERS')}
        </ActionsheetItemText>
      </ActionsheetItem>

      <Divider />

      {isStaff && (
        <>
          <ActionsheetItem onPress={() => closeWith(onNewAnnouncementPressed)}>
            <ActionsheetIcon as={MegaphoneIcon} color='$gray800' />
            <ActionsheetItemText color='$gray800'>
              {t('FEATURES.COURSES.NEW_ANNOUNCEMENT')}
            </ActionsheetItemText>
          </ActionsheetItem>

          <Divider />

          <ActionsheetItem onPress={() => closeWith(onNewTextChannelPressed)}>
            <ActionsheetIcon as={PlusIcon} color='$gray800' />
            <ActionsheetItemText color='$gray800'>
              {t('FEATURES.COURSES.NEW_TEXT_CHANNEL')}
            </ActionsheetItemText>
          </ActionsheetItem>

          <Divider />
        </>
      )}

      <ActionsheetItem onPress={() => closeWith(onLeavePressed)}>
        <ActionsheetIcon as={DoorOpenIcon} color='$error600' />
        <ActionsheetItemText color='$error600'>
          {t('FEATURES.COURSES.LEAVE_COURSE')}
        </ActionsheetItemText>
      </ActionsheetItem>
    </Box>
  );
};

export default CourseSheet;
