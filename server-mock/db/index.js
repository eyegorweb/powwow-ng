const availableFilters = require('./availableFilters');
const orders = require('./orders');
const getCurrentUser = require('./getCurrentUser');
const indicators = require('./indicators');

module.exports = {
  ...availableFilters,
  ...orders,
  ...getCurrentUser,
  ...indicators,
};
