module.exports = function(grunt){

    var buildTasks = [
        'clean',
        'html',
        'openlmis.js',
        'openlmis.css',
        'assets',
        'index.html',
        'appcache',
        'docs',
        'styleguide'
    ];

    if(grunt.option('serve')){
        buildTasks.unshift('serve:proxy');
        buildTasks.push('serve');
    }

    grunt.registerTask('build', buildTasks);
}