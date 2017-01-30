module.exports = function(grunt){

    grunt.registerTask('build', [
        'clean',
        'html',
        'openlmis.js',
        'openlmis.css',
        'assets',
        'index.html',
        'appcache',
        'docs',
        'styleguide'
    ]);
}