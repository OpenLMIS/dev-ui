module.exports = function(grunt){
    var path = require('path');

    grunt.loadNpmTasks('grunt-appcache');

    var dest = grunt.option('app.dest');

    grunt.config('appcache', {
        options: {
            basePath: dest
        },
        all: {
            dest: path.join(dest, "manifest.appcache"),
            cache: {
                patterns: [
                    path.join(dest, '*'),
                    path.join(dest, '**/*')
                ],
            literals: '/'
        },
            network: '*'
        }
    });
}