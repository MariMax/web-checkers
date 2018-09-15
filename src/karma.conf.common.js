process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 99,
        branches: 99,
        functions: 99,
        lines: 99,
      }
    },
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
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true
  }