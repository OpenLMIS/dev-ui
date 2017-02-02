module.exports = function(grunt){

    var keepAlive = false;

    grunt.registerTask('build', function(){
        // If the serve command was passed
        if(grunt.option('serve')){
            keepAlive = true;
        }

        grunt.task.run('build:app');
    });

    var firstRun = true;
    grunt.registerTask('build:app', function(){
        var buildTasks = [
            'messages',
            'html',
            'openlmis.js',
            'openlmis.css',
            'assets',
            'index.html',
            'replace',
            'appcache'
        ];

        if(firstRun){
            buildTasks.unshift('clean');
            firstRun = false;
        }

        if(!grunt.option('noTest')){
            buildTasks.push('karma:unit');
        }

        if(!grunt.option('noStyleguide')){
            buildTasks.push('styleguide');
        }

        if(!grunt.option('noDocs')){
            buildTasks.push('docs');
        }

        if(keepAlive){
            buildTasks.push('build:keepAlive');
        }

        grunt.task.run(buildTasks);

    });

    grunt.registerTask('build:keepAlive', function(){
        this.async();
    });

}