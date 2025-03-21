import { DateTime } from 'luxon';

export const DATE_FORMAT = 'ccc, MMM d yyyy';
export const DATE_TIME_FORMAT = 'ccc, MMM d yyyy, h:mm a';
export const DEFAULT_TIMEZONE = 'Asia/Manila';

export const getDateTimeNow = () => {
  return DateTime.now().setZone(DEFAULT_TIMEZONE);
};

export const getDateTimeNowString = () => {
  return DateTime.now().setZone(DEFAULT_TIMEZONE).toFormat(DATE_TIME_FORMAT);
};

export const toDateTime = (date: Date) => {
  return DateTime.fromJSDate(date).setZone(DEFAULT_TIMEZONE);
};

export const toDateTimeString = (date: Date) => {
  return DateTime.fromJSDate(date)
    .setZone(DEFAULT_TIMEZONE)
    .toFormat(DATE_TIME_FORMAT);
};

export function isoToDateString(iso: string) {
  return DateTime.fromISO(iso).setZone(DEFAULT_TIMEZONE).toFormat(DATE_FORMAT);
}

export function isoToDateTimeString(iso: string) {
  return DateTime.fromISO(iso)
    .setZone(DEFAULT_TIMEZONE)
    .toFormat(DATE_TIME_FORMAT);
}

export const toDateTimeStringfromDT = (dateTime: DateTime) => {
  return dateTime.toFormat(DATE_TIME_FORMAT);
};
