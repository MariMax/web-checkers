// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const commonConfig = require('./karma.conf.common');

module.exports = function (config) {
  config.set({
    ...commonConfig,
    autoWatch: false,
    singleRun: true,
    logLevel: config.LOG_INFO
  });
};