module.exports = function(grunt){

    grunt.loadNpmTasks('grunt-concurrent');

    var buildTasks = [
        'clean',
        'messages',
        'html',
        'openlmis.js',
        'openlmis.css',
        'assets',
        'index.html',
        'replace',
        'appcache',
        'docs',
        'styleguide'
    ];

    grunt.registerTask('build', function(){
        if(grunt.option('serve')){
            buildTasks.unshift('serve:proxy');
            buildTasks.push('serve');
        }

        grunt.task.run(buildTasks);
    });
}