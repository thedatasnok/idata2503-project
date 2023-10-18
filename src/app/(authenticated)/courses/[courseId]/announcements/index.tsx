import Header from '@/components/navigation/Header';
import { Box, Pressable, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';

// TODO: Replace these with data loaded from backend (from course props?)
const announcements = [
  {
    id: 'temp',
    annoucedBy: 'Jesus',
    header: 'Im sick today gais',
    body: 'Im very sick i tell you, very very sick, i must stay home. I promise im not lying',
    createdAt: dayjs('2023-10-16 08:15').toDate(),
  },
  {
    id: 'temp2',
    annoucedBy: 'Him',
    header: 'Idk',
    body: 'Very long text in the body because i need to fill this space, otherwise they will fire me as a teacher',
    createdAt: dayjs('2023-10-15 08:15').toDate(),
  },
  {
    id: 'temp3',
    annoucedBy: 'Teacher3',
    header: 'Im not an NPC i swear',
    body: 'I have personal experiences and emotions just like you do. Lets chat about something outside of class!',
    createdAt: dayjs('2023-10-10 08:15').toDate(),
  },
] as const;

const AnnouncementsScreen = () => {
  const router = useRouter();

  return (
    <>
      <Header title='Announcements' />
      <Text>Announcements</Text>

      <FlatList
        data={announcements}
        keyExtractor={(i) => i.id}
        style={{
          paddingHorizontal: 12,
        }}
        renderItem={({ item: announcement, index: i }) => (
          <Announcement
            key={announcement.id}
            announcedBy={announcement.annoucedBy}
            body={announcement.body}
            header={announcement.header}
            createdAt={announcement.createdAt}
            // onPress={() => router.push(`/announcements/${announcement.id}`)}
          />
        )}
      />
    </>
  );
};

interface AnnouncementProps {
  createdAt?: Date;
  announcedBy: string;
  header: string;
  body: string;
  onPress?: () => void;
}

const Announcement: React.FC<AnnouncementProps> = ({
  createdAt,
  announcedBy,
  header,
  body,
  onPress,
}) => {
  return (
    <>
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
          <Text color='$primary600' fontWeight='$semibold' fontSize='$md'>
            {header}
          </Text>
          <Text fontSize='$xs'>{body}</Text>
          <Box display='flex' flexDirection='row'>
            <Text fontSize='$xs'>{dayjs(createdAt).format('LT')}</Text>
            <Text fontSize='$xs'>{announcedBy}</Text>
          </Box>
        </Box>
      </Pressable>
    </>
  );
};

export default AnnouncementsScreen;
