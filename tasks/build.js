module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-force-task');
    
    grunt.registerTask('build', function(){
        var buildTasks = [
            'build:app',
        ];

        if(!grunt.option('noClean')){
            buildTasks.unshift('build:clean');
        }

        // If the serve command was passed
        if(grunt.option('serve')){
            this.async();
        }

        grunt.task.run(buildTasks);
    });

    grunt.registerTask('build:clean', [
        'clean',
        'bower',
        'force:messages',
        'languages'
        ]);

    grunt.registerTask('build:app', function(){
        var buildTasks = [
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

}