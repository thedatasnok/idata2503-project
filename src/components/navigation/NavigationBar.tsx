import { IconType } from '@/icon';
import { Box, Icon, Pressable, Text, styled } from '@gluestack-ui/themed';
import {
  BookMarkedIcon,
  CalendarDaysIcon,
  HomeIcon,
  MessageSquareIcon,
  SettingsIcon,
} from 'lucide-react-native';

const NavigationBar = () => {
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
      <Tab icon={HomeIcon} label='Home' />
      <Tab active icon={BookMarkedIcon} label='Courses' />
      <Tab icon={CalendarDaysIcon} label='Schedule' />
      <Tab icon={MessageSquareIcon} label='Messages' />
      <Tab icon={SettingsIcon} label='Settings' />
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
