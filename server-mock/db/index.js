const orders = require('./orders');
const getCurrentUser = require('./getCurrentUser');
const indicators = require('./indicators');
const orderStatuses = require('./orderStatuses');

module.exports = {
  ...orders,
  ...getCurrentUser,
  ...indicators,
  ...orderStatuses,
};
