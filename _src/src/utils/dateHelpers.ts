import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

export function formatRussianDate(date: Date): string {
  return format(date, 'd MMMM yyyy', { locale: ru });
}

export function formatRussianDayOfWeek(date: Date): string {
  return format(date, 'EEEE', { locale: ru }).toUpperCase();
}

export function getRelativeDateLabel(date: Date): string | null {
  if (isToday(date)) return 'СЕГОДНЯ';
  if (isYesterday(date)) return 'ВЧЕРА';
  if (isTomorrow(date)) return 'ЗАВТРА';
  return null;
}

export function getMonthGradient(date: Date): string {
  const month = date.getMonth(); // 0-11
  if (month === 0 || month === 1) return 'var(--gradient-header-jan)'; // Jan-Feb
  if (month >= 2 && month <= 4) return 'var(--gradient-header-apr)'; // Mar-May
  if (month >= 5 && month <= 7) return 'var(--gradient-header-jul)'; // Jun-Aug
  if (month >= 8 && month <= 10) return 'var(--gradient-header-oct)'; // Sep-Nov
  return 'var(--gradient-header-dec)'; // Dec
}
