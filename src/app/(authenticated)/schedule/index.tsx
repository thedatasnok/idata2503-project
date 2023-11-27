import Header from '@/components/navigation/Header';
import EmptyState from '@/components/utils/EmptyState';
import { IconType } from '@/icon';
import { EventType, useEvents, type ScheduleEvent } from '@/services/schedule';
import { Box, Icon, Pressable, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  FlaskConicalIcon,
  PalmtreeIcon,
  PenSquareIcon,
  PresentationIcon,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

const ScheduleScreen = () => {
  const [period, setPeriod] = useState(new Date());
  const { data: events, isLoading } = useEvents({ month: period });
  const listRef = useRef<FlatList>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const gotoEvent = (event: ScheduleEvent) => {
    if (event.event_type === EventType.ASSIGNMENT) {
      router.push(`/courses/${event.course_id}/assignments/${event.event_id}`);
    } else {
      router.push(`/schedule/${event.event_id}`);
    }
  };

  return (
    <>
      <Header title={t('NAVIGATION.SCHEDULE')} />

      <PeriodSelector
        date={period}
        onPrevious={() =>
          setPeriod((prev) => dayjs(prev).subtract(1, 'month').toDate())
        }
        onNext={() => setPeriod((prev) => dayjs(prev).add(1, 'month').toDate())}
      />

      <FlatList<ScheduleEvent>
        ref={listRef}
        data={events}
        ListEmptyComponent={() => (
          <EmptyState
            pt='$8'
            isLoading={isLoading}
            icon={PalmtreeIcon}
            description={t('FEATURES.EVENTS.NO_EVENTS_THIS_PERIOD')}
          />
        )}
        keyExtractor={(i) => i.event_id}
        style={{
          paddingHorizontal: 12,
        }}
        renderItem={({ item: event, index: i }) => (
          <ScheduleEventEntry
            previousEventDate={events?.[i - 1]?.starts_at}
            courseCode={event.course_code}
            startsAt={event.starts_at}
            endsAt={event.ends_at}
            eventName={event.event_name}
            eventType={event.event_type}
            locationCode={event.room_number}
            onPress={() => gotoEvent(event)}
          />
        )}
      />
    </>
  );
};

interface PeriodSelectorProps {
  date: Date;
  onPrevious: () => void;
  onNext: () => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  date,
  onPrevious,
  onNext,
}) => {
  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
      gap='$4'
    >
      <Pressable onPress={onPrevious} p='$2'>
        <Icon as={ChevronLeftIcon} size='xl' color='$gray950' />
      </Pressable>

      <Text
        color='$gray950'
        fontWeight='$semibold'
        fontSize='$md'
        w='$32'
        textAlign='center'
      >
        {dayjs(date).format('MMMM YYYY')}
      </Text>

      <Pressable onPress={onNext} p='$2'>
        <Icon as={ChevronRightIcon} size='xl' color='$gray950' />
      </Pressable>
    </Box>
  );
};

interface ScheduleEventEntryProps {
  previousEventDate?: string;
  nextEventDate?: string;
  eventName?: string;
  courseCode: string;
  startsAt: string;
  endsAt: string;
  eventType: EventType;
  locationCode?: string;
  onPress?: () => void;
}

const formatDuration = (startsAt: string, endsAt: string) => {
  if (dayjs(startsAt).isSame(endsAt)) {
    return dayjs(startsAt).format('L LT');
  }

  return `${dayjs(startsAt).format('L LT')} - ${dayjs(endsAt).format('LT')}`;
};

const ScheduleEventEntry: React.FC<ScheduleEventEntryProps> = ({
  previousEventDate,
  courseCode,
  startsAt,
  endsAt,
  eventType,
  eventName,
  locationCode,
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {(previousEventDate === undefined ||
        !dayjs(previousEventDate).isSame(startsAt, 'day')) && (
        <Text textAlign='center' fontWeight='$medium' mt='$2'>
          {dayjs(startsAt).format('dddd Do')}
        </Text>
      )}

      <Pressable
        display='flex'
        flexDirection='row'
        alignItems='center'
        px='$1'
        gap='$2'
        my='$1'
        onPress={onPress}
      >
        <Icon as={getEventTypeIcon(eventType)} color='$gray800' size='xl' />

        <Box flex={1} gap={-4}>
          <Box flexDirection='column' gap='-$1.5'>
            <Text color='$primary600' fontWeight='$semibold' fontSize='$md'>
              {courseCode}
            </Text>

            <Text fontSize='$sm' fontWeight='$medium'>
              {eventName}
            </Text>
          </Box>
          <Text fontSize='$xs'>
            {t(`FEATURES.EVENTS.EVENT_TYPE.${eventType}`)} |{' '}
            {formatDuration(startsAt, endsAt)}
          </Text>
        </Box>

        <Text>{locationCode}</Text>
      </Pressable>
    </>
  );
};

const getEventTypeIcon = (type: EventType): IconType => {
  switch (type) {
    case EventType.LAB:
      return FlaskConicalIcon;
    case EventType.LECTURE:
      return PresentationIcon;
    case EventType.EXAM:
      return PenSquareIcon;
    case EventType.ASSIGNMENT:
      return ClipboardListIcon;
  }
};

export default ScheduleScreen;
