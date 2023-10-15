import Header from '@/components/navigation/Header';
import { IconType } from '@/icon';
import { Box, Icon, Pressable, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FlaskConicalIcon,
  PenSquareIcon,
  PresentationIcon,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';

const enum EventType {
  LAB = 'LAB',
  LECTURE = 'LECTURE',
  EXAM = 'EXAM',
}

// TODO: Replace these with data loaded from backend
const events = [
  {
    id: 'temp',
    courseCode: 'IDATA2503',
    eventType: EventType.LAB,
    startsAt: dayjs('2023-10-16 08:15').toDate(),
    endsAt: dayjs('2023-10-16 10:00').toDate(),
    locationCode: 'L167',
  },
  {
    id: 'temp2',
    courseCode: 'IDATA2505',
    eventType: EventType.LAB,
    startsAt: dayjs('2023-10-16 10:15').toDate(),
    endsAt: dayjs('2023-10-16 12:00').toDate(),
    locationCode: 'L167',
  },
  {
    id: 'temp3',
    courseCode: 'IDATA2502',
    eventType: EventType.LECTURE,
    startsAt: dayjs('2023-10-17 08:15').toDate(),
    endsAt: dayjs('2023-10-17 14:00').toDate(),
    locationCode: 'L167',
  },
] as const;

const ScheduleScreen = () => {
  const [period, setPeriod] = useState(new Date());
  const listRef = useRef<FlatList>(null);
  const router = useRouter();

  useEffect(() => {
    const index = events.findIndex((e) =>
      dayjs(e.startsAt).isSame(new Date(), 'day')
    );

    if (index !== -1) {
      listRef.current?.scrollToIndex({ index, animated: false });
    }
  }, []);

  return (
    <>
      <Header title='Schedule' />

      <PeriodSelector
        date={period}
        onPrevious={() =>
          setPeriod((prev) => dayjs(prev).subtract(1, 'month').toDate())
        }
        onNext={() => setPeriod((prev) => dayjs(prev).add(1, 'month').toDate())}
      />

      <FlatList
        ref={listRef}
        data={events}
        keyExtractor={(i) => i.id}
        style={{
          paddingHorizontal: 12,
        }}
        renderItem={({ item: event, index: i }) => (
          <ScheduleEvent
            key={event.id}
            previousEventDate={events[i - 1]?.startsAt}
            nextEventDate={events[i + 1]?.endsAt}
            courseCode={event.courseCode}
            startsAt={event.startsAt}
            endsAt={event.endsAt}
            eventType={event.eventType}
            locationCode={event.locationCode}
            onPress={() => router.push(`/schedule/${event.id}`)}
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
      mt='$2'
    >
      <Pressable onPress={onPrevious}>
        <Icon as={ChevronLeftIcon} color='$gray950' />
      </Pressable>

      <Text color='$gray950' fontWeight='$semibold' fontSize='$md'>
        {dayjs(date).format('MMMM YYYY')}
      </Text>

      <Pressable onPress={onNext}>
        <Icon as={ChevronRightIcon} color='$gray950' />
      </Pressable>
    </Box>
  );
};

interface ScheduleEventProps {
  previousEventDate?: Date;
  nextEventDate?: Date;
  courseCode: string;
  startsAt: Date;
  endsAt: Date;
  eventType: EventType;
  locationCode: string;
  onPress?: () => void;
}

const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  previousEventDate,
  nextEventDate,
  courseCode,
  startsAt,
  endsAt,
  eventType,
  locationCode,
  onPress,
}) => {
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
        gap='$1'
        my='$1'
        onPress={onPress}
      >
        <Icon as={getEventTypeIcon(eventType)} color='$gray800' />

        <Box flex={1} gap={-4}>
          <Text color='$primary600' fontWeight='$semibold' fontSize='$md'>
            {courseCode}
          </Text>
          <Text fontSize='$xs'>
            {eventType} | {dayjs(startsAt).format('L LT')} -{' '}
            {dayjs(endsAt).format('LT')}
          </Text>
        </Box>

        <Text>{locationCode}</Text>
      </Pressable>

      {nextEventDate && !dayjs(nextEventDate).isSame(startsAt, 'day') && (
        <Box h='$px' w='$full' bgColor='$gray200' mt='$2' />
      )}
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
  }
};

export default ScheduleScreen;