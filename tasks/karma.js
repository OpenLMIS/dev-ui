module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-appcache');

    grunt.config('karma', {
      options: {
        configFile: 'karma.config.js'
      },
      unit: {
        // default
      },
      tdd: {
        singleRun: false
      }
    });
}