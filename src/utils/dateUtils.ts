import { format, formatDistance, formatRelative, isValid, parseISO, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, differenceInDays, differenceInWeeks, differenceInMonths, differenceInHours, differenceInMinutes, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isAfter, isBefore, isEqual } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期时间
 */
export const formatDate = (date: Date | string | number, formatStr: string = 'yyyy-MM-dd'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date:', date);
    return '';
  }
  
  return format(dateObj, formatStr);
};

/**
 * 格式化为相对时间（例如：3小时前、昨天等）
 */
export const formatRelativeTime = (date: Date | string | number, baseDate: Date = new Date()): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date:', date);
    return '';
  }
  
  return formatRelative(dateObj, baseDate, { locale: zhCN });
};

/**
 * 格式化为距离时间（例如：3小时、5天等）
 */
export const formatDistanceTime = (date: Date | string | number, baseDate: Date = new Date(), addSuffix = true): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date:', date);
    return '';
  }
  
  return formatDistance(dateObj, baseDate, { addSuffix, locale: zhCN });
};

/**
 * 计算时间间隔（天）
 */
export const getDaysBetween = (startDate: Date | string | number, endDate: Date | string | number): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
  
  if (!isValid(start) || !isValid(end)) {
    console.error('Invalid date in getDaysBetween:', { startDate, endDate });
    return 0;
  }
  
  return differenceInDays(end, start);
};

/**
 * 计算时间间隔（小时）
 */
export const getHoursBetween = (startDate: Date | string | number, endDate: Date | string | number): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
  
  if (!isValid(start) || !isValid(end)) {
    console.error('Invalid date in getHoursBetween:', { startDate, endDate });
    return 0;
  }
  
  return differenceInHours(end, start);
};

/**
 * 计算时间间隔（分钟）
 */
export const getMinutesBetween = (startDate: Date | string | number, endDate: Date | string | number): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
  
  if (!isValid(start) || !isValid(end)) {
    console.error('Invalid date in getMinutesBetween:', { startDate, endDate });
    return 0;
  }
  
  return differenceInMinutes(end, start);
};

/**
 * 获取指定日期的开始时间（00:00:00）
 */
export const getStartOfDay = (date: Date | string | number = new Date()): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date in getStartOfDay:', date);
    return new Date();
  }
  
  return startOfDay(dateObj);
};

/**
 * 获取指定日期的结束时间（23:59:59.999）
 */
export const getEndOfDay = (date: Date | string | number = new Date()): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date in getEndOfDay:', date);
    return new Date();
  }
  
  return endOfDay(dateObj);
};

/**
 * 获取指定周的开始和结束日期
 * 默认周日为一周的第一天
 */
export const getWeekRange = (date: Date | string | number = new Date()): { start: Date; end: Date } => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date in getWeekRange:', date);
    return { start: new Date(), end: new Date() };
  }
  
  return {
    start: startOfWeek(dateObj, { weekStartsOn: 1 }), // 周一作为一周的开始
    end: endOfWeek(dateObj, { weekStartsOn: 1 }),
  };
};

/**
 * 获取指定月的开始和结束日期
 */
export const getMonthRange = (date: Date | string | number = new Date()): { start: Date; end: Date } => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date in getMonthRange:', date);
    return { start: new Date(), end: new Date() };
  }
  
  return {
    start: startOfMonth(dateObj),
    end: endOfMonth(dateObj),
  };
};

/**
 * 获取今天的日期范围
 */
export const getTodayRange = (): { start: Date; end: Date } => {
  const now = new Date();
  return {
    start: getStartOfDay(now),
    end: getEndOfDay(now),
  };
};

/**
 * 获取昨天的日期范围
 */
export const getYesterdayRange = (): { start: Date; end: Date } => {
  const yesterday = subDays(new Date(), 1);
  return {
    start: getStartOfDay(yesterday),
    end: getEndOfDay(yesterday),
  };
};

/**
 * 获取本周的日期范围
 */
export const getThisWeekRange = (): { start: Date; end: Date } => {
  return getWeekRange(new Date());
};

/**
 * 获取上周的日期范围
 */
export const getLastWeekRange = (): { start: Date; end: Date } => {
  const lastWeek = subWeeks(new Date(), 1);
  return getWeekRange(lastWeek);
};

/**
 * 获取本月的日期范围
 */
export const getThisMonthRange = (): { start: Date; end: Date } => {
  return getMonthRange(new Date());
};

/**
 * 获取上个月的日期范围
 */
export const getLastMonthRange = (): { start: Date; end: Date } => {
  const lastMonth = subMonths(new Date(), 1);
  return getMonthRange(lastMonth);
};

/**
 * 获取自定义天数前的日期范围
 */
export const getDaysAgoRange = (days: number): { start: Date; end: Date } => {
  const daysAgo = subDays(new Date(), days);
  return {
    start: getStartOfDay(daysAgo),
    end: getEndOfDay(new Date()),
  };
};

/**
 * 日期比较 - 是否之后
 */
export const isDateAfter = (date: Date | string | number, compareDate: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const compareDateObj = typeof compareDate === 'string' ? parseISO(compareDate) : new Date(compareDate);
  
  if (!isValid(dateObj) || !isValid(compareDateObj)) {
    console.error('Invalid date in isDateAfter:', { date, compareDate });
    return false;
  }
  
  return isAfter(dateObj, compareDateObj);
};

/**
 * 日期比较 - 是否之前
 */
export const isDateBefore = (date: Date | string | number, compareDate: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const compareDateObj = typeof compareDate === 'string' ? parseISO(compareDate) : new Date(compareDate);
  
  if (!isValid(dateObj) || !isValid(compareDateObj)) {
    console.error('Invalid date in isDateBefore:', { date, compareDate });
    return false;
  }
  
  return isBefore(dateObj, compareDateObj);
};

/**
 * 日期比较 - 是否相同
 */
export const isDateEqual = (date: Date | string | number, compareDate: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const compareDateObj = typeof compareDate === 'string' ? parseISO(compareDate) : new Date(compareDate);
  
  if (!isValid(dateObj) || !isValid(compareDateObj)) {
    console.error('Invalid date in isDateEqual:', { date, compareDate });
    return false;
  }
  
  return isEqual(dateObj, compareDateObj);
};

/**
 * 时区转换（将日期从一个时区转换到另一个时区）
 */
export const convertTimezone = (date: Date | string | number, fromOffset: number, toOffset: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date in convertTimezone:', date);
    return new Date();
  }
  
  // 计算时区差值（小时）
  const offsetDiff = toOffset - fromOffset;
  
  // 转换时间
  return new Date(dateObj.getTime() + offsetDiff * 60 * 60 * 1000);
};

/**
 * 获取当前本地时区偏移量（小时）
 */
export const getLocalTimezoneOffset = (): number => {
  return -new Date().getTimezoneOffset() / 60;
};

/**
 * 格式化日期时间为中文友好格式
 */
export const formatChineseDateTime = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date in formatChineseDateTime:', date);
    return '';
  }
  
  return format(dateObj, 'yyyy年MM月dd日 HH:mm:ss');
};

/**
 * 对日期按照指定的值进行舍入（如舍入到最接近的小时、15分钟等）
 */
export const roundToNearest = (date: Date | string | number, nearestMinutes: number = 15): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isValid(dateObj)) {
    console.error('Invalid date in roundToNearest:', date);
    return new Date();
  }
  
  const minutes = dateObj.getMinutes();
  const remainder = minutes % nearestMinutes;
  
  if (remainder < nearestMinutes / 2) {
    // 向下舍入
    dateObj.setMinutes(minutes - remainder);
  } else {
    // 向上舍入
    dateObj.setMinutes(minutes + (nearestMinutes - remainder));
  }
  
  dateObj.setSeconds(0);
  dateObj.setMilliseconds(0);
  
  return dateObj;
};
