/**
 * Format : xxx xxx xx
 * @param {Number} value
 */
export function formatLargeNumber(value) {
  if (!value) return value;

  const parts = [...(value + '')];
  if (parts.length <= 3) return value;

  let accumulator = [];

  for (let i = parts.length, j = 1; i > 0; i--, j++) {
    accumulator.push(parts[i - 1]);
    if (j % 3 === 0) accumulator.push(' ');
  }

  return accumulator
    .reverse()
    .join('')
    .trim();
}

export function formatCurrency(value) {
  if(!value) return value;

  const parts = ('' + value).split('.')

  return `${formatLargeNumber(parseInt(parts[0]))},${parts[1]}`
}
