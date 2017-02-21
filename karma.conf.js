const path = require('path');

module.exports = (config) => {
  const conf = {
    plugins: [
      'karma-coverage',
      'karma-spec-reporter',
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher',
      /* 'karma-firefox-launcher', */
    ],

    reporters: ['coverage', 'spec'],

    basePath: __dirname,

    frameworks: ['mocha', 'chai'],

    files: [
      path.join('public', 'scripts', 'utils.js'),
      path.join('test', 'client', 'spec', '*.js'),
    ],

    exclude: [],

    preprocessors: { /* Dynamically set at bottom */ },

    port: 9876,

    colors: true,

    // LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    logLevel: config.LOG_ERROR,

    autoWatch: false,

    browsers: ['Chrome'/* , 'Firefox' */],

    singleRun: true,

    concurrency: Infinity,

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'json', subdir: 'client' },
      ],
    },
  };

  conf.preprocessors[path.join('public', 'scripts', 'utils.js')] = ['coverage'];

  config.set(conf);
};
