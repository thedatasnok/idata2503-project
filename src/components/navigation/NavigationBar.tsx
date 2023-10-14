import { IconType } from '@/icon';
import { Box, Icon, Pressable, Text, styled } from '@gluestack-ui/themed';
import {
  BookMarkedIcon,
  CalendarDaysIcon,
  HomeIcon,
  MessageSquareIcon,
  SettingsIcon,
} from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';

const NavigationBar = () => {
  const path = usePathname();
  const router = useRouter();

  return (
    <Box
      display='flex'
      bg='$gray100'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      px='$3'
      borderTopWidth={1}
      borderTopColor='$gray300'
    >
      <Tab
        active={path === '/'}
        icon={HomeIcon}
        label='Home'
        onPress={() => router.push('/')}
      />

      <Tab
        active={path.startsWith('/courses')}
        icon={BookMarkedIcon}
        label='Courses'
        onPress={() => router.push('/courses/')}
      />

      <Tab
        active={path.startsWith('/schedule')}
        icon={CalendarDaysIcon}
        label='Schedule'
        onPress={() => router.push('/schedule/')}
      />

      <Tab
        active={path.startsWith('/messages')}
        icon={MessageSquareIcon}
        label='Messages'
        onPress={() => router.push('/messages/')}
      />

      <Tab
        active={path.startsWith('/settings')}
        icon={SettingsIcon}
        label='Settings'
        onPress={() => router.push('/settings')}
      />
    </Box>
  );
};

interface TabProps {
  active?: boolean;
  icon: IconType;
  label: string;
  onPress?: () => void;
}

const TabContainer = styled(Pressable, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingHorizontal: '$1',
  paddingTop: '$2',
  paddingBottom: '$1.5',
  marginTop: -1,
  gap: '$2',
  ':active': {
    borderTopWidth: 1,
    borderTopColor: '$primary700',
  },
});

// @ts-ignore
const TabIcon = styled(Icon, {
  color: '$gray800',
  ':active': {
    color: '$primary700',
  },
});

const TabText = styled(Text, {
  color: '$gray800',
  fontSize: '$xs',
  fontWeight: '$semibold',
  ':active': {
    color: '$primary700',
  },
});

const Tab: React.FC<TabProps> = ({ active, icon, onPress, label }) => {
  return (
    <TabContainer states={{ active }} onPress={onPress}>
      {/* @ts-ignore */}
      <TabIcon as={icon} size={24} states={{ active }} />
      <TabText states={{ active }}>{label}</TabText>
    </TabContainer>
  );
};

export default NavigationBar;
