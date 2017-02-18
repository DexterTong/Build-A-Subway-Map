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
  const serverTestFile = path.join(testDir, 'serverTest.js');
  const clientTestFile = path.join(testDir, 'clientTest.js');

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
      serverTest: {
        src: [serverTestFile],
      },
      clientTests: {
        src: [clientTestFile],
      },
    },
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['env:test', 'jscs', 'eslint', 'mochaTest']);
};
