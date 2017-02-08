module.exports = function(grunt){
    var path = require('path'),
        glob = require('glob');

    grunt.registerTask('languages', ['languages:make']);

    grunt.registerTask('languages:make', function(){
        var tmpDir = path.join(process.cwd(), '.tmp', 'js');

        var languages = [];
        glob.sync('messages*', {
            cwd: 'src/main/resources/'
        }).forEach(function(filename){
            var fileLanguage = filename.substr(filename.lastIndexOf('.')-2, 2);
            languages.push(fileLanguage);
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_LANGUAGES", ' + languages + ');' + '\n';
        fileContents += '})();';

        grunt.file.write(path.join(tmpDir, 'languages.js'), fileContents, {
            encoding: 'utf8'
        });

    });
}
