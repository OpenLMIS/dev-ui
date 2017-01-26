module.exports = function(grunt){

    grunt.registerTask('build', [
        'clean',
        'build:html',
        'build:openlmis.js',
        'build:openlmis.css',
        'index.html',
        'appcache'
    ]);
}