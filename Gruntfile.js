const path = require('path');

module.exports = function Grunt(grunt) {
  const clientDir = 'public';
  const serverDir = 'server';
  const testDir = 'test';

  const nodeFiles = [
    path.join(serverDir, 'app.js'),
    path.join(serverDir, 'routes'),
    path.join(serverDir, 'bin'),
  ];
  const jsFiles = [clientDir, nodeFiles, testDir, 'Gruntfile.js'];

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
      coverage: {
        src: testDir,
      },
    },
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('default', ['env:test', 'eslint', 'mocha_istanbul']);
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['env:test', 'mocha_istanbul']);
};
