const orders = require('./orders');
const getCurrentUser = require('./getCurrentUser');
const indicators = require('./indicators');
const partys = require('./partys');
const countries = require('./countries');

module.exports = {
  ...orders,
  ...getCurrentUser,
  ...indicators,
  ...partys,
  ...countries,
};
