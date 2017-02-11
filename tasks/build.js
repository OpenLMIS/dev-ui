module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-force-task');
    
    grunt.registerTask('build', function(){
        var buildTasks = [
            'build:app',
        ];

        if(!grunt.option('noClean')){
            buildTasks.unshift('build:clean');
        }

        // If the serve command was passed,
        // don't let the task end, because
        // the serve will end...
        if(grunt.option('serve')){
            buildTasks.push('build:keepAlive');
        }

        grunt.task.run(buildTasks);
    });

    grunt.registerTask('build:clean', [
        'clean',
        'bower'
        ]);

    grunt.registerTask('build:app', function(){
        var buildTasks = [
            'messages',
            'html',
            'javascript',
            'css',
            'assets',
            'index.html',
            'appcache'
        ];

        if(!grunt.option('noTest')){
            buildTasks.push('karma:unit');
        }

        if(!grunt.option('noStyleguide')){
            buildTasks.push('styleguide');
        }

        if(!grunt.option('noDocs')){
            buildTasks.push('docs');
        }

        grunt.task.run(buildTasks);

    });

    grunt.registerTask('build:keepAlive', function(){
        this.async();
    });

}