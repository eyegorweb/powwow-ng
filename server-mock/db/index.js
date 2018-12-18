const orders = require('./orders');
const getCurrentUser = require('./getCurrentUser');

module.exports = {
  ...orders,
  ...getCurrentUser,
};
