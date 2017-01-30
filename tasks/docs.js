module.exports = function(grunt){
    var path = require('path');

    grunt.loadNpmTasks('grunt-ngdocs');

    var dest = grunt.option('docs.dest');
    var title = grunt.option('docs.title');
    var src = path.join(grunt.option('app.tmp'), 'js');

    grunt.config('ngdocs', {
        options:{
            dest: dest,
            title: title
        },
        api: {
            src: [
                path.join(src, "**/*.js"),
                "!" + path.join(src, "bower_components/**/*")
            ],
            title: "API"
        }
    });

    grunt.registerTask('docs', function(){
        if(!grunt.option('appOnly') && !grunt.option('noDocs')){
            grunt.task.run('ngdocs');
        }
    });
}
