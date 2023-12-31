import Header from '@/components/navigation/Header';
import EmptyState from '@/components/utils/EmptyState';
import { useCourseAnnouncementsQuery } from '@/services/announcements';
import { CourseRole, useCourseQuery } from '@/services/courses';
import { useCourseMembership } from '@/services/membership';
import {
  Box,
  Divider,
  Fab,
  FabIcon,
  Icon,
  Pressable,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dot, Megaphone, PlusIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

const CREATE_ANNOUNCEMENT_USER_ROLES = [
  CourseRole.LECTURER,
  CourseRole.ASSISTANT,
];

const FLATLIST_STYLE = {
  paddingHorizontal: 12,
  paddingTop: 6,
};

const AnnouncementsScreen = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: course } = useCourseQuery(courseId);
  const { data: announcements, isLoading } = useCourseAnnouncementsQuery(courseId);
  const { data: membership } = useCourseMembership(courseId);
  const router = useRouter();
  const { t } = useTranslation();

  const canCreate =
    membership?.role &&
    CREATE_ANNOUNCEMENT_USER_ROLES.includes(membership.role);

  return (
    <>
      <Header
        context={course?.course_code}
        title={t('GENERAL.ANNOUNCEMENTS')}
        back={`/courses/${courseId}`}
      />

      <FlatList
        data={announcements}
        keyExtractor={(i) => i.announcement_id}
        style={FLATLIST_STYLE}
        ListEmptyComponent={() => (
          <EmptyState
            isLoading={isLoading}
            description={t('FEATURES.COURSES.NO_ANNOUNCEMENTS_YET')}
            icon={Megaphone}
          />
        )}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item: announcement }) => (
          <Announcement
            announcedBy={announcement.created_by_full_name}
            content={announcement.content}
            title={announcement.title}
            createdAt={announcement.created_at}
            onPress={() =>
              router.push(
                `/courses/${courseId}/announcements/${announcement.announcement_id}`
              )
            }
          />
        )}
      />
      {canCreate && (
        <Fab
          placement='bottom right'
          onPress={() =>
            router.push(
              `/courses/${courseId}/announcements/create-announcement`
            )
          }
        >
          <FabIcon as={PlusIcon} size='xl' m='-$1' />
        </Fab>
      )}
    </>
  );
};

interface AnnouncementProps {
  createdAt: string;
  announcedBy: string;
  title: string;
  content: string;
  onPress?: () => void;
}

const Announcement: React.FC<AnnouncementProps> = ({
  createdAt,
  announcedBy,
  title,
  content,
  onPress,
}) => {
  return (
    <Pressable
      display='flex'
      flexDirection='column'
      px='$1'
      gap='$1'
      my='$1'
      py='$1'
      onPress={onPress}
    >
      <Box gap={-4}>
        <Text color='$gray900' fontWeight='$semibold' fontSize='$lg'>
          {title}
        </Text>
        <Text fontSize='$sm' numberOfLines={2} color='$gray800'>
          {content}
        </Text>
        <Box display='flex' flexDirection='row' alignItems='center' pt='$1'>
          <Text fontSize='$sm' color='$gray600'>
            {dayjs(createdAt).fromNow()}
          </Text>
          <Icon as={Dot} />
          <Text fontSize='$sm' color='$gray600'>
            {announcedBy}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
};

export default AnnouncementsScreen;
