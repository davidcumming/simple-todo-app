
/**
 * Formats a Date object into an ISO string (YYYY-MM-DD).
 */
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Formats a Date object for display, e.g., "Tuesday, July 23".
 */
export const formatDateDisplay = (date: Date): string => {
  const isToday = formatDateISO(date) === formatDateISO(new Date());
  if (isToday) return `Today · ${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`;

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Adds a specified number of days to a date.
 * @param date The starting date.
 * @param days The number of days to add (can be negative).
 * @returns A new Date object.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
