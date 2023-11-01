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

// TODO: Replace these with data loaded from backend (from course props?)
// const announcements = [
//   {
//     id: 'temp',
//     annoucedBy: 'Jesus',
//     header: 'Im sick today gais',
//     body: 'Im very sick i tell you, very very sick, i must stay home. I promise im not lying',
//     createdAt: dayjs('2023-10-16 08:15').toDate(),
//   },
//   {
//     id: 'temp2',
//     annoucedBy: 'Him',
//     header: 'Idk',
//     body: 'Very long text in the body because i need to fill this space, otherwise they will fire me as a teacher',
//     createdAt: dayjs('2023-10-15 08:15').toDate(),
//   },
//   {
//     id: 'temp3',
//     annoucedBy: 'Teacher3',
//     header: 'Im not an NPC i swear',
//     body: 'I have personal experiences and emotions just like you do. Lets chat about something outside of class! dawjhidbahdbjawdjavjdva jdvjavdjv jasgvdj gvasjgdv jasgvd',
//     createdAt: dayjs('2023-10-10 08:15').toDate(),
//   },
// ] as const;

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
        renderItem={({ item: announcement, index: i }) => (
          <>
            <Announcement
              key={announcement.announcement_id}
              announcedBy={announcement.created_by}
              content={announcement.content}
              title={announcement.title}
              createdAt={announcement.created_at}
              onPress={() =>
                router.push(
                  `courses/${courseId}/announcements/${announcement.announcement_id}` as any
                )
              }
            />
            {announcements?.[i + 1] && (
              <Box h='$px' w='$full' bgColor='$gray200' mt='$2' />
            )}
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
      alignItems='center'
      px='$1'
      gap='$1'
      my='$1'
      onPress={onPress}
    >
      <Box flex={1} gap={-4}>
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
