import moment from 'moment';

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_FORMAT_EXTENDED = 'DD/MM/YYYY HH:mm:ss';

export function currentDateMinusMounts(numberOfMonths) {
  return moment()
    .subtract(numberOfMonths, 'month')
    .format(DATE_FORMAT);
}

export function getMonthString(dateStr) {
  return moment(dateStr, DATE_FORMAT).format('MMMM');
}

export function getMonthAndYear(dateStr) {
  const month = moment(dateStr, DATE_FORMAT).format('MMMM');
  const year = moment(dateStr, DATE_FORMAT).format('YYYY');

  return `${month} ${year}`;
}

export function currentDateMinusDays(value) {
  return moment()
    .subtract(value, 'days')
    .format(DATE_FORMAT);
}

export function formattedCurrentDate() {
  return moment().format(DATE_FORMAT);
}

export function getCurrentMonthName() {
  return getMonthString(formattedCurrentDate());
}

export function currentDateTimeWithAdd(time, timeName) {
  return moment()
    .add(10, 'minutes')
    .format(DATE_FORMAT_EXTENDED);
}

export function formattedCurrentDateExtended() {
  return moment().format(DATE_FORMAT_EXTENDED);
}

export function isBefore(expectedBefore, expectedAfter, format = DATE_FORMAT_EXTENDED) {
  const a = moment(expectedBefore, format);
  const b = moment(expectedAfter, format);

  return a.isBefore(b);
}

export function formatDateToUTC(value) {
  return moment(value, DATE_FORMAT).valueOf();
}
