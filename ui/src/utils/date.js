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

export function getMonthStringPreviousMonth(dateStr, numberOfPreviousMonths) {
  return moment(dateStr, DATE_FORMAT)
    .subtract(numberOfPreviousMonths, 'month')
    .format('MMMM');
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

export function formattedCurrentDate(datetime) {
  return moment().format(datetime ? DATE_FORMAT_EXTENDED : DATE_FORMAT);
}

export function getCurrentMonthName() {
  return getMonthString(formattedCurrentDate());
}

export function currentDateTimeWithAdd(time = 10, timeName = 'minutes') {
  return moment()
    .add(time, timeName)
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

export function isAfter(expectedAfter, expectedBefore, format = DATE_FORMAT_EXTENDED) {
  const a = moment(expectedAfter, format);
  const b = moment(expectedBefore, format);

  return a.isAfter(b);
}

export function formatDateToUTC(value) {
  return moment(value, DATE_FORMAT).valueOf();
}

export function formatUTCtoStrDate(value, format = DATE_FORMAT) {
  return moment(value).format(format);
}

export function getFirstDay(month, year) {
  return moment()
    .month(month)
    .year(2000 + parseInt(year))
    .startOf('month')
    .format(DATE_FORMAT);
}

export const shortMonthsFr = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Jui',
  'Juil',
  'Aoû',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];
export const shortMonthsEn = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
