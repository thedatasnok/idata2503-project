import Header from '@/components/navigation/Header';
import { useCourse } from '@/services/courses';
import { CourseMember, useCourseMembers } from '@/services/membership';
import { useAuth } from '@/store/global';
import { getToken } from '@/theme';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Divider,
  Pressable,
  Text,
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DimensionValue, ListRenderItem, SectionList } from 'react-native';

const SECTIONLIST_STYLE = {
  paddingHorizontal: getToken('space', '4') as DimensionValue,
  paddingBottom: getToken('space', '3') as DimensionValue,
} as const;

const CourseMembersScreen = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: course } = useCourse(courseId);
  const { data: members } = useCourseMembers(courseId);
  const { t } = useTranslation();

  return (
    <>
      <Header back context={course?.course_code} title={t('GENERAL.MEMBERS')} />

      <SectionList
        sections={members ?? []}
        style={SECTIONLIST_STYLE}
        renderSectionHeader={({ section }) => (
          <Text fontWeight='$semibold' mt='$3' mb='$2'>
            {t(`COURSE_MEMBER_ROLES.${section.title}S`)} — {section.data.length}
          </Text>
        )}
        renderItem={CourseMemberListItem}
        ItemSeparatorComponent={() => <Divider my='$2' />}
      />
    </>
  );
};

const CourseMemberListItem: ListRenderItem<CourseMember> = ({
  item: member,
}) => {
  const router = useRouter();
  const { session } = useAuth();

  const onMemberPressed = () => {
    if (session?.user.id === member.user_id) return;
    router.push(`/messages/${member.user_id}`);
  };

  return (
    <Pressable
      onPress={onMemberPressed}
      flexDirection='row'
      alignItems='center'
      gap='$2'
    >
      <Avatar>
        <AvatarFallbackText>{member.full_name}</AvatarFallbackText>
        <AvatarImage source={{ uri: member.avatar_url }} />
      </Avatar>

      <Text numberOfLines={1}>{member.full_name}</Text>
    </Pressable>
  );
};

export default CourseMembersScreen;
