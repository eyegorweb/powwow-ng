const availableFilters = require('./availableFilters');
const orders = require('./orders');
const getCurrentUser = require('./getCurrentUser');

module.exports = {
  ...availableFilters,
  ...orders,
  ...getCurrentUser,
};
