import { useCourses } from '@/services/courses';
import { useDrawer } from '@/store/global';
import { getToken } from '@/theme';
import {
  Box,
  Divider,
  Icon,
  Pressable,
  Text,
  VStack,
  styled,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import { ChevronRightIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native';
import { Drawer as NavigationDrawer } from 'react-native-drawer-layout';

export interface CoursesDrawerLayoutProps {
  children: React.ReactNode;
}

/**
 * Drawer component that can be dragged in from the side of the screen to display
 * a list of courses that the user is enrolled in.
 */
const CoursesDrawerLayout: React.FC<CoursesDrawerLayoutProps> = ({
  children,
}) => {
  const { show, open, close } = useDrawer();

  return (
    <NavigationDrawer
      open={show}
      onOpen={open}
      onClose={close}
      renderDrawerContent={() => <DrawerContent onNavigate={close} />}
    >
      {children}
    </NavigationDrawer>
  );
};

interface DrawerContentProps {
  onNavigate?: () => void;
}

/**
 * Drawer content that is displayed when the drawer is open.
 */
const DrawerContent: React.FC<DrawerContentProps> = ({ onNavigate }) => {
  const { data: activeCourses } = useCourses({ active: true });
  const { data: otherCourses } = useCourses({ active: false, limit: 10 });
  const router = useRouter();

  const gotoCourse = (courseId: string) => {
    // @ts-ignore should not be an error
    router.push(`/courses/${courseId}`);
    onNavigate?.();
  };

  return (
    <SafeAreaView>
      <Box pt='$2'>
        {activeCourses && activeCourses?.length > 0 && (
          <>
            <Text fontWeight='$semibold' fontSize='$md' px='$2'>
            {t('FEATURES.COURSES.ACTIVE_COURSES')}
            </Text>

            <Divider px='$2' />
          </>
        )}

        <VStack my='$1'>
          {activeCourses?.map((course) => (
            <CourseDrawerItem
              key={course.course_id}
              active
              courseCode={course.course_code}
              name={course.name}
              onPress={() => gotoCourse(course.course_id)}
            />
          ))}
        </VStack>

        {otherCourses && otherCourses?.length > 0 && (
          <>
            <Text fontWeight='$semibold' fontSize='$md' mt='$2' px='$2'>
              {t("FEATURES.COURSES.COMPLETED_COURSES")}
            </Text>

            <Divider px='$2' />
          </>
        )}

        <VStack my='$1'>
          {otherCourses?.map((course) => (
            <CourseDrawerItem
              key={course.course_id}
              courseCode={course.course_code}
              name={course.name}
              onPress={() => gotoCourse(course.course_id)}
            />
          ))}
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

interface CourseDrawerItemProps {
  courseCode: string;
  name: string;
  active?: boolean;
  onPress?: () => void;
}

const CourseCodeText = styled(Text, {
  fontWeight: '$semibold',
  fontSize: '$sm',
  variants: {
    active: {
      true: {
        color: '$primary500',
      },
      false: {
        color: '$gray900',
      },
    },
  },
});

const CourseDrawerItem: React.FC<CourseDrawerItemProps> = ({
  courseCode,
  name,
  active,
  onPress,
}) => {
  return (
    <Pressable
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
      android_ripple={{ color: getToken('colors', 'gray300') }}
      py='$0.5'
      px='$2'
      onPress={onPress}
    >
      <Box gap={-8}>
        <CourseCodeText active={active}>{courseCode}</CourseCodeText>
        <Text fontSize='$sm' numberOfLines={1} color='$gray700'>
          {name}
        </Text>
      </Box>
      <Icon as={ChevronRightIcon} color='$gray400' />
    </Pressable>
  );
};

export default CoursesDrawerLayout;
