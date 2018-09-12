// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const commonConfig = require('./karma.conf.common');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
  config.set({
    ...commonConfig,
    autoWatch: false,
    customLaunchers: {
      ChromeHeadless:  {
        base:   'Chrome',
        flags:  [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222'
        ],
      }
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    logLevel: config.LOG_INFO
  });
};