import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Icon,
  Pressable,
  Text,
} from '@gluestack-ui/themed';
import { MessageSquare } from 'lucide-react-native';

export interface LecturerProps {
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
        {onPress && <Icon as={MessageSquare} size='xl' />}
      </Box>
    </Pressable>
  );
};

export default Lecturer;
