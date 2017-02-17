module.exports = function Grunt(grunt) {
  const browserFiles = 'public/scripts/*.js';
  const nodeFiles = 'app.js';
  const gruntFile = 'Gruntfile.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
  });

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('default', ['jscs', 'eslint']);
};
