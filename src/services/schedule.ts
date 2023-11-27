import { DateFormats } from '@/util/date';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { supabase } from './supabase';
import { CacheKey } from './cache';

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
  ASSIGNMENT = 'ASSIGNMENT',
}

export interface ScheduleEvent {
  event_id: string;
  course_id: string;
  course_code: string;
  course_name: string;
  event_name: string;
  mandatory: boolean;
  event_type: EventType;
  starts_at: string;
  ends_at: string;
  room_number?: string;
  map_url?: string;
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
    queryKey: [CacheKey.EVENTS, month],
    queryFn: async () => {
      const result = await supabase
        .from('user_schedule_view')
        .select('*')
        .eq('month', dayjs(month).startOf('month').format(DateFormats.DATE))
        .order('starts_at', { ascending: true })
        .throwOnError();

      return result.data as ScheduleEvent[];
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
    queryKey: [CacheKey.INDIVIDUAL_EVENT, eventId],
    queryFn: async () => {
      const result = await supabase
        .from('user_schedule_view')
        .select('*')
        .eq('event_id', eventId)
        .throwOnError()
        .single();

      return result.data as ScheduleEvent;
    },
  });
};
