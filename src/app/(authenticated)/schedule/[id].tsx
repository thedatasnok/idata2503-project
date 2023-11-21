import { useEvent } from '@/services/schedule';
import { Box, Icon, Pressable, Text } from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { XIcon } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

const ScheduleEventScreen = () => {
  const { id: eventId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useEvent(eventId);

  const onCancel = () => {
    router.back();
  };

  return (
    <>
      <Box
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        px='$2'
        py='$1'
        bg='white'
      >
        <Text fontWeight='$bold' fontSize='$lg'>
          Event location
        </Text>

        <Pressable rounded='$md' onPress={onCancel}>
          <Icon as={XIcon} color='$gray950' />
        </Pressable>
      </Box>

      {data?.map_url && <WebView source={{ uri: data.map_url }} />}
    </>
  );
};

export default ScheduleEventScreen;
