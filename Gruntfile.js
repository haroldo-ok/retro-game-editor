'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowerRequirejs: {
      target: {
        rjsConfig: 'app/scripts/main.js'
      }
    },
    bump: {
      options: {
        push: false        
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-requirejs');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['bowerRequirejs']);

};
