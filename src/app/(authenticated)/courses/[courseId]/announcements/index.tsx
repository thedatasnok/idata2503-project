import Header from '@/components/navigation/Header';
import {
  useAnnouncements,
  useCourse,
  useMembershipRole,
} from '@/services/courses';
import {
  Box,
  Pressable,
  Text,
  Icon,
  Button,
  styled,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import { Dot, PlusCircle } from 'lucide-react-native';

const AnnouncementsScreen = () => {
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);
  const { data: announcements } = useAnnouncements(courseId as string);
  const { data: memberShip } = useMembershipRole(courseId as string);
  const router = useRouter();

  return (
    <>
      <Header context={course?.course_code} title='Announcements' back />

      <FlatList
        data={announcements}
        keyExtractor={(i) => i.announcement_id}
        style={{
          paddingHorizontal: 12,
          paddingTop: 12,
        }}
        contentContainerStyle={{}}
        ItemSeparatorComponent={() => <Box h='$px' bg='$gray200' mt='$2' />}
        // TODO: get rid of index
        renderItem={({ item: announcement, index: i }) => (
          <>
            <Announcement
              key={announcement.announcement_id}
              announcedBy={announcement.created_by_full_name}
              content={announcement.content}
              title={announcement.title}
              createdAt={announcement.created_at}
              onPress={() =>
                router.push(
                  `courses/${courseId}/announcements/${announcement.announcement_id}` as any
                )
              }
            />
          </>
        )}
      />
      {/* TODO: CHECK ROLES LECTURER AND ASSISTANT, IT IS CHANGED FOR TESTING PURPOSES */}
      {(memberShip?.role === 'LECTURER' || memberShip?.role === 'STUDENT') && (
        <Pressable
          display='flex'
          flexDirection='row-reverse'
          p='$4'
          onPress={() =>
            router.push(
              `/courses/${courseId}/announcements/create-announcement` as any
            )
          }
        >
          {/* TODO: maybe style own svg, if we want it to be like figma */}
          {/* @ts-ignore */}
          <Icon size={40} color='$primary600' as={PlusCircle} />
        </Pressable>
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
      onPress={onPress}
    >
      <Box gap={-4}>
        <Text color='$gray900' fontWeight='$semibold' fontSize='$md'>
          {title}
        </Text>
        <Text fontSize='$xs' numberOfLines={2} color='$gray800'>
          {content}
        </Text>
        <Box display='flex' flexDirection='row' alignItems='center' pt='$1'>
          <Text fontSize='$xs' color='$gray600'>
            {dayjs(createdAt).fromNow()}
          </Text>
          <Icon as={Dot} />
          <Text fontSize='$xs' color='$gray600'>
            {announcedBy}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
};

export default AnnouncementsScreen;
