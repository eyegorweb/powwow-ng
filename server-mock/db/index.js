const orders = require('./orders');
const getCurrentUser = require('./getCurrentUser');
const indicators = require('./indicators');
const partners = require('./partners');

module.exports = {
  ...orders,
  ...getCurrentUser,
  ...indicators,
  ...partners,
};
