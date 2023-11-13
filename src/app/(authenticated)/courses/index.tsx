import Header from '@/components/navigation/Header';
import { IconType } from '@/icon';
import { useCourses } from '@/services/courses';
import { formatDuration } from '@/util/date';
import {
  Box,
  Divider,
  Icon,
  Pressable,
  Spinner,
  Text,
  styled,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import { ChevronRightIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList } from 'react-native';

const CoursesScreen = () => {
  const [personalTab, setPersonalTab] = useState(true);
  const { data: courses, isLoading } = useCourses({ enrolled: personalTab });
  const router = useRouter();

  return (
    <>
      <Header title={t('FEATURES.COURSES.COURSES_TITLE')} />

      <Box flex={1}>
        <Box flexDirection='row' p='$2'>
          <Tab
            label={t('FEATURES.COURSES.YOUR_COURSES')}
            active={personalTab}
            onPress={() => setPersonalTab(true)}
          />
          <Tab
            label={t('FEATURES.COURSES.ALL_COURSES')}
            active={!personalTab}
            onPress={() => setPersonalTab(false)}
          />
        </Box>

        <Box p='$2'>
          <FlatList
            data={courses}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item: course }) => (
              <CourseCard
                key={course.course_id}
                courseCode={course.course_code}
                name={course.name}
                date={formatDuration(course.starts_at, course.ends_at)}
                icon={ChevronRightIcon}
                onPress={() => router.push(`/courses/${course.course_id}/`)}
              />
            )}
          />
        </Box>

        {isLoading && <Spinner pt='$8' size='large' />}
      </Box>
    </>
  );
};

interface TabProps {
  active?: boolean;
  label: string;
  onPress?: () => void;
}

const TabContainer = styled(Pressable, {
  flex: 1,
  alignItems: 'center',
  padding: '$4',
  borderBottomWidth: 1,
  borderBottomColor: '$gray400',
  ':active': {
    borderBottomWidth: 1,
    borderBottomColor: '$primary700',
  },
});

const TabText = styled(Text, {
  color: '$gray600',
  fontSize: '$md',
  fontWeight: '$semibold',
  ':active': {
    color: '$primary700',
  },
});

const Tab: React.FC<TabProps> = ({ active, onPress, label }) => {
  return (
    <TabContainer states={{ active }} onPress={onPress}>
      <TabText states={{ active }}>{label}</TabText>
    </TabContainer>
  );
};

interface CourseCardProps {
  courseCode: string;
  name: string;
  date: string;
  icon: IconType;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseCode,
  name,
  date,
  icon,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        p='$2'
      >
        <Box display='flex' flexDirection='column'>
          <Text fontSize='$lg' fontWeight='$semibold' color='$primary600'>
            {courseCode}
          </Text>
          <Text color='$gray700'>{name}</Text>
          <Text color='$gray700'>{date}</Text>
        </Box>
        <Icon as={icon} color='$gray950' />
      </Box>
    </Pressable>
  );
};

export default CoursesScreen;
