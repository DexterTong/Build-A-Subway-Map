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
      dir: 'coverage/',
      reporters: [
        { type: 'json', subdir: 'report-json' },
      ],
    },
  });
};
