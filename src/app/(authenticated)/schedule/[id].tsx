import { Box, Icon, Pressable, Text } from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { XIcon } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

const ScheduleEventScreen = () => {
  const { id: _id } = useLocalSearchParams();
  const router = useRouter();

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

      <WebView
        source={{
          // TODO: Read this from the found event
          uri: 'https://google.com/',
        }}
      />
    </>
  );
};

export default ScheduleEventScreen;
