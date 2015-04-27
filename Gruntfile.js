'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowerRequirejs: {
      target: {
        rjsConfig: 'app/scripts/main.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-bower-requirejs');

  grunt.registerTask('default', ['bowerRequirejs']);

};
