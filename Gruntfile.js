// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json')
});

// Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-bower-requirejs');
