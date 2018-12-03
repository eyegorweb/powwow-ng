const availableFilters = require('./availableFilters');
const orders = require('./orders');

module.exports = {
  ...availableFilters,
  ...orders,
};
