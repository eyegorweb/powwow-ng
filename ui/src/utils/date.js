import moment from 'moment';

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_FORMAT_EXTENDED = 'DD/MM/YYYY HH:mm:ss';

export function currentDateMinusMounts(numberOfMonths) {
  return moment()
    .subtract(numberOfMonths, 'month')
    .format(DATE_FORMAT);
}

export function currentDateMinusDays(value) {
  return moment()
    .subtract(value, 'days')
    .format(DATE_FORMAT);
}

export function formattedCurrentDate() {
  return moment().format(DATE_FORMAT);
}

export function formattedCurrentDateExtended() {
  return moment().format(DATE_FORMAT_EXTENDED);
}

export function isBefore(expectedBefore, expectedAfter) {
  const a = moment(expectedBefore, DATE_FORMAT_EXTENDED);
  const b = moment(expectedAfter, DATE_FORMAT_EXTENDED);

  return a.isBefore(b);
}
