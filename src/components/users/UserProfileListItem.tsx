import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Pressable,
  Text,
} from '@gluestack-ui/themed';

export interface UserProfileListItemProps {
  fullName: string;
  avatarUrl?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

const UserProfileListItem: React.FC<UserProfileListItemProps> = ({
  fullName,
  avatarUrl,
  children,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      flexDirection='row'
      alignItems='center'
      gap='$2'
      p='$1'
    >
      <Avatar>
        <AvatarFallbackText>{fullName}</AvatarFallbackText>
        {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
      </Avatar>

      <Text fontWeight='$medium' numberOfLines={1}>
        {fullName}
      </Text>

      {children}
    </Pressable>
  );
};

export default UserProfileListItem;
