import dayjs from 'dayjs';

/**
 * Enumerator containing date formats compatible with
 * PostgreSQL and Supabase.
 */
export const enum DateFormats {
  DATE = 'YYYY-MM-DD',
  TIMESTAMP = 'YYYY-MM-DD HH:mm:sszz',
}

/**
 * Formats a start and an end date into a duration string.
 *
 * @param start the start date
 * @param end the end date
 * @param format the format to use, defauts to 'MMM YYYY'
 *
 * @returns the formatted string
 */
export const formatDuration = (
  start: string,
  end: string,
  format: string = 'MMM YYYY'
) => {
  return `${dayjs(start).format(format)} - ${dayjs(end).format(format)}`;
};
