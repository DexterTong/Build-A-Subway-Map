module.exports = function (grunt) {
  const client = 'public/scripts/*.js';
  const app = 'app.js';
  const server = 'bin/www';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jscs: {
      src: [client, app, server],
      options: {
        config: '.jscsrc',
      },
    },
  });

  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('default', ['jscs']);

};
