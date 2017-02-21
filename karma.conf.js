// Karma configuration
// Generated on Tue Feb 21 2017 01:14:34 GMT-0500 (EST)

module.exports = function Karma(config) {
  config.set({
    plugins: [
      'karma-coverage',
      'karma-spec-reporter',
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
    ],

    reporters: ['coverage', 'spec'],

    basePath: __dirname,

    frameworks: ['mocha', 'chai'],

    files: [
      'public/scripts/utils.js',
      'test/client/spec/utils.js',
    ],

    exclude: [],

    preprocessors: {
      'public/scripts/utils.js': ['coverage'],
    },

    port: 9876,

    colors: true,

    // LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    logLevel: config.LOG_ERROR,

    autoWatch: false,

    browsers: ['Chrome', 'Firefox'],

    singleRun: true,

    concurrency: Infinity,

    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },
  });
};
