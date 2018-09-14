const commonConfig = require('./karma.conf.common');
module.exports = function (config) {
  config.set({
    ...commonConfig,
    autoWatch: true,
    singleRun: false,
    logLevel: config.LOG_INFO
  });
};