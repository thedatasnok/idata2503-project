import { useCourses } from '@/services/courses';
import {
  Box,
  Divider,
  Icon,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';
import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavigationDrawer
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      renderDrawerContent={() => (
        <DrawerContent onNavigate={() => setIsOpen(false)} />
      )}
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
    <Box pt='$2' px='$2'>
      {activeCourses.length > 0 && (
        <>
          <Text fontWeight='$semibold' fontSize='$md'>
            Active courses
          </Text>

          <Divider />
        </>
      )}

      <VStack gap='$1' my='$1'>
        {activeCourses.map((course) => (
          <CourseDrawerItem
            key={course.id}
            courseCode={course.courseCode}
            name={course.name}
            onPress={() => gotoCourse(course.id)}
          />
        ))}
      </VStack>

      {otherCourses.length > 0 && (
        <>
          <Text fontWeight='$semibold' fontSize='$md' mt='$2'>
            Previous courses
          </Text>

          <Divider />
        </>
      )}

      {otherCourses.map((course) => (
        <CourseDrawerItem
          key={course.id}
          courseCode={course.courseCode}
          name={course.name}
          onPress={() => gotoCourse(course.id)}
        />
      ))}
    </Box>
  );
};

interface CourseDrawerItemProps {
  courseCode: string;
  name: string;
  onPress?: () => void;
}

const CourseDrawerItem: React.FC<CourseDrawerItemProps> = ({
  courseCode,
  name,
  onPress,
}) => {
  return (
    <Pressable
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
      onPress={onPress}
    >
      <Box gap={-8}>
        <Text fontWeight='$semibold' color='$primary500' fontSize='$sm'>
          {courseCode}
        </Text>
        <Text fontWeight='$medium' fontSize='$sm' numberOfLines={1}>
          {name}
        </Text>
      </Box>
      <Icon as={ChevronRightIcon} color='$gray400' />
    </Pressable>
  );
};

export default CoursesDrawerLayout;
