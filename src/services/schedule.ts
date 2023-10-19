import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import dayjs from 'dayjs';
import { DateFormats } from '@/util/date';

export interface UseEventsParams {
  /**
   * A day in the month which the event occurs.
   */
  month: Date;
}

export const enum EventType {
  EXAM = 'EXAM',
  LAB = 'LAB',
  LECTURE = 'LECTURE',
}

export interface ScheduleEvent {
  course_id: string;
  course_code: string;
  course_name: string;
  course_event_id: string;
  event_name: string;
  mandatory: boolean;
  event_type: EventType;
  starts_at: string;
  ends_at: string;
  room_number: string;
  map_url: string;
  month: string;
}

/**
 * Hook to fetch scheduled events from Supabase.
 *
 * @param params query parameters to filter events
 *
 * @returns
 */
export const useEvents = (params: UseEventsParams) => {
  const { month } = params;

  return useQuery({
    queryKey: ['whiteboardapp/events', month],
    queryFn: async () => {
      let query = supabase
        .from('user_schedule_view')
        .select('*')
        .eq('month', dayjs(month).startOf('month').format(DateFormats.DATE));

      return query.throwOnError().then((res) => res.data as ScheduleEvent[]);
    },
  });
};

/**
 * Hook to fetch a single event from Supabase.
 *
 * @param eventId the event id
 *
 * @returns
 */
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['whiteboardapp/event', eventId],
    queryFn: async () => {
      let query = supabase
        .from('user_schedule_view')
        .select('*')
        .eq('course_event_id', eventId);

      return query
        .throwOnError()
        .single()
        .then((res) => res.data as ScheduleEvent);
    },
  });
};
