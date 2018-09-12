const commonConfig = require('./karma.conf.common');
module.exports = function (config) {
  config.set({
    ...commonConfig,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};