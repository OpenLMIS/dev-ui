module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-appcache');

    grunt.config('appcache', {
        options: {
            basePath: './build/webapp'
        },
        all: {
            dest: "./build/webapp/manifest.appcache",
            cache: {
                patterns: [
                    './build/webapp/openlmis.js',
                    './build/webapp/common/**/*',
                    './build/webapp/dashboard/**/*',
                    './build/webapp/fonts/**/*',
                    './build/webapp/*.css',
                    './build/webapp/images/**/*',
                    './build/webapp/messages/**/*'
                ],
            literals: '/'
        },
            network: '*'
        }
    });
}