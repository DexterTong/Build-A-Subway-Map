const path = require('path');

module.exports = function Grunt(grunt) {
  const clientDir = 'public';
  const serverDir = 'server';
  const testDir = 'test';

  const browserFiles = path.join(clientDir, 'scripts', '*.js');
  const nodeFiles = [
    path.join(serverDir, 'app.js'),
    path.join(serverDir, 'routes', '*.js'),
    path.join(serverDir, 'bin', 'www'),
  ];
  const gruntFile = 'Gruntfile.js';
  const testFiles = [
    path.join(testDir, 'serverTest.js'),
  ];

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

    jscs: {
      src: [browserFiles, nodeFiles, gruntFile],
      options: {
        config: '.jscsrc',
      },
    },

    eslint: {
      browser: {
        src: [browserFiles, gruntFile],
        options: {
          config: '.eslintrc.json',
        },
      },
      node: {
        src: [nodeFiles],
        options: {
          config: 'eslintrc.json',
        },
      },
    },

    mochaTest: {
      all: {
        src: [testFiles],
      },
    },
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['env:test', 'jscs', 'eslint', 'mochaTest']);
};
