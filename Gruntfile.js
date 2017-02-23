const path = require('path');

module.exports = function Grunt(grunt) {
  const clientDir = 'public';
  const serverDir = 'server';
  const serverTestFiles = [path.join('test', 'server')];
  const clientTestFiles = [path.join('test', 'client')];

  const nodeFiles = [
    path.join(serverDir, 'app.js'),
    path.join(serverDir, 'routes'),
    path.join(serverDir, 'bin'),
  ];
  const jsFiles = [clientDir, nodeFiles, clientTestFiles, serverTestFiles, 'Gruntfile.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    env: {
      dev: {
        NODE_ENV: 'development',
      },
      test: {
        NODE_ENV: 'test',
      },
      build: {
        NODE_ENV: 'production',
      },
    },

    eslint: {
      options: {
        config: '.eslintrc.json',
      },
      all: jsFiles,
    },

    mocha_istanbul: {
      tests: {
        src: serverTestFiles,
        options: {
          coverageFolder: path.join('coverage', 'node'),
          reportFormats: ['json'],
          istanbulOptions: ['--print', 'none'],
        },
      },
    },

    karma: {
      tests: {
        configFile: 'karma.conf.js',
      },
    },

    makeReport: {
      src: 'coverage/*/*.json',
      options: {
        type: 'html',
        dir: 'coverage/report',
        print: 'both',
      },
    },
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-istanbul');

  grunt.registerTask('default', ['eslint', 'env:test', 'mocha_istanbul', 'karma', 'makeReport']);
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['env:test', 'mocha_istanbul', 'karma', 'makeReport']);
};
