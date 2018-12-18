const orders = require('./orders');
const getCurrentUser = require('./getCurrentUser');
const indicators = require('./indicators');

module.exports = {
  ...orders,
  ...getCurrentUser,
  ...indicators,
};
