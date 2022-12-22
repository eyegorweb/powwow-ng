import maxBy from 'lodash.maxby';

export function getLatestLineFromAccessPoint(accessPoint) {
  if (accessPoint && accessPoint.lines && accessPoint.lines.length) {
    return maxBy(accessPoint.lines, (l) => l.id);
  }
  return undefined;
}

export function getFromLatestLineFromAccessPoint(accessPoint, attribute) {
  const relatedLine = getLatestLineFromAccessPoint(accessPoint);
  if (relatedLine) {
    return relatedLine[attribute];
  }
  return '';
}

export function getFromLatestLineFromAccessPointWithDefaultValue(
  accessPoint,
  attribute,
  defaultValue = '-'
) {
  let value = getFromLatestLineFromAccessPoint(accessPoint, attribute);
  if (!value) {
    value = defaultValue;
  }
  return value;
}
