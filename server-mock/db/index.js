const orders = require('./orders');
const getCurrentUser = require('./getCurrentUser');
const indicators = require('./indicators');
const partys = require('./partys');

module.exports = {
  ...orders,
  ...getCurrentUser,
  ...indicators,
  ...partys,
};
