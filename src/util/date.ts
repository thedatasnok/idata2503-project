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
 * Formats a date string to a human readable format.
 * current day will be formatted as "Today HH:mm"
 * yesterday will be formatted as "Yesterday HH:mm"
 * tomorrow will be formatted as "Tomorrow HH:mm"
 * other dates will be formatted as "DD/MM/YYYY HH:mm"
 *
 * @param dateString string to be formatted
 * @returns formatted date string
 */
export const formatDate = (dateString: string) => {
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');
  const tomorrow = today.add(1, 'day');
  const date = dayjs(dateString);

  if (date.isSame(today, 'day')) {
    return `Today ${date.format('HH:mm')}`;
  } else if (date.isSame(yesterday, 'day')) {
    return `Yesterday ${date.format('HH:mm')}`;
  } else if (date.isSame(tomorrow, 'day')) {
    return `Tomorrow ${date.format('HH:mm')}`;
  } else {
    return date.format('DD/MM/YYYY HH:mm');
  }
};

/**
 * Gets hours/weeks left until a date.
 * If the date is in the past, returns "Due is up".
 * If the date is in the future, returns "X seconds left", "X minutes left",
 * "X hours left", "X days left" or "X weeks left".
 * @param dateString string to be formatted
 * @returns time left until date
 */
export const getTimeLeft = (dateString: string) => {
  const now = dayjs();
  const targetDate = dayjs(dateString);

  // Date is in the past
  if (targetDate.isBefore(now)) {
    return 'Due is up';
  }

  const secondsDifference = targetDate.diff(now, 'second');
  const minutesDifference = targetDate.diff(now, 'minute');
  const hoursDifference = targetDate.diff(now, 'hour');
  const daysDifference = targetDate.diff(now, 'day');
  const weeksDifference = targetDate.diff(now, 'week');

  if (secondsDifference < 60) {
    return `${secondsDifference} seconds left`;
  } else if (minutesDifference < 60) {
    return `${minutesDifference} minutes left`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference} hours left`;
  } else if (daysDifference < 7) {
    return `${daysDifference} days left`;
  } else {
    return `${weeksDifference} weeks left`;
  }
};
