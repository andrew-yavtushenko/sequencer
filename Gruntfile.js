
module.exports = function(grunt) {
  var LIVERELOAD_PORT = 35729,
      lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: LIVERELOAD_PORT
      },
      livereload: {
        options: {
          src: "http://localhost:35729/livereload.js?snipver=1"
        }
      }
    },
    watch: {
      livereload: {
        files: ['scripts/*.js',
                'scripts/worker/*.js',
                'style.css',
                'index.html']
      }
    }
  });

  grunt.registerTask('start', [
    'connect',
    'watch'
  ]);
};