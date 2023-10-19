import Header from '@/components/navigation/Header';
import React, { useEffect, useState } from 'react';

import { IconType } from '@/icon';
import { supabase } from '@/services/supabase';
import {
  Box,
  Divider,
  Icon,
  Pressable,
  Spinner,
  Text,
  styled,
  ScrollView,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { ChevronRightIcon } from 'lucide-react-native';

const yourCoursesData = [
  {
    id: '1',
    course_code: 'IDATA2503',
    name: 'Mobile applications',
    date: 'Aug 2023 - Dec 2023',
  },
];

interface course {
  course_id: string;
  course_code: string;
  name: string;
  starts_at: string;
  ends_at: string;
}

const App = () => {
  const [selectedTab, setSelectedTab] = useState('YourCourses');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<course[]>([]);

  async function getCourses() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('course')
        .select(`course_id, course_code, name, starts_at, ends_at`);

      if (error) {
        throw error;
      }

      if (data) {
        setCourses(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Unexpected error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      <Header title='Courses' />

      <Box flex={1}>
        <Box flexDirection='row' p='$2'>
          <Tab
            label='Your Courses'
            active={selectedTab === 'YourCourses'}
            onPress={() => setSelectedTab('YourCourses')}
          />
          <Tab
            label='All Courses'
            active={selectedTab === 'AllCourses'}
            onPress={() => setSelectedTab('AllCourses')}
          />
        </Box>
        {selectedTab === 'YourCourses' && <YourCoursesScreen />}
        {selectedTab === 'AllCourses' && (
          <AllCoursesScreen loading={loading} courses={courses} />
        )}
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
  course_code: string;
  name: string;
  date: string;

  icon: IconType;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course_code,
  name,
  date,
  icon,
  onPress,
}) => {
  return (
    <>
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
              {course_code}
            </Text>
            <Text color='$gray700'>{name}</Text>
            <Text color='$gray700'>{date}</Text>
          </Box>
          <Icon as={icon} color='$gray950' />
        </Box>
      </Pressable>
      <Divider />
    </>
  );
};

interface AllCoursesScreenProps {
  courses: course[];
  loading: boolean;
}

//TODO Change to FlatList for performance
const AllCoursesScreen: React.FC<AllCoursesScreenProps> = ({
  courses,
  loading,
}) => (
  <ScrollView>
    <Box p='$2'>
      {courses.map((course) => (
        <CourseCard
          key={course.course_id}
          course_code={course.course_code}
          name={course.name}
          date={`${dayjs(course.starts_at).format('MMM YYYY')} - ${dayjs(
            course.ends_at
          ).format('MMM YYYY')}`}
          icon={ChevronRightIcon}
          onPress={() => console.log(`pressed ${course.name} card`)}
        />
      ))}
    </Box>
    {loading && <Spinner pt='$8' size='large' />}
  </ScrollView>
);

const YourCoursesScreen = () => (
  <ScrollView>
    <Box p='$2'>
      {yourCoursesData.map((course) => (
        <CourseCard
          key={course.id}
          course_code={course.course_code}
          name={course.name}
          date={course.date}
          icon={ChevronRightIcon}
          onPress={() => console.log(`pressed ${course.name} card`)}
        />
      ))}
    </Box>
  </ScrollView>
);

export default App;
