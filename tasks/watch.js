module.exports = function(grunt){
    var path = require('path');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    grunt.config('watch', {
        files: [
            path.join(grunt.option('app.src'), '/**/*'),
            path.join(grunt.option('app.src'), '/*')
            ],
        tasks: ['build:app', 'notify:watch'],
        options: {
            spawn: false
        }
    });

    grunt.config('notify', {
        watch: {
            options: {
                message: 'Build complete',
                duration: 2
            }
        }
    });

};