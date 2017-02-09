module.exports = function(grunt){
    var path = require('path'),
        glob = require('glob');

    grunt.registerTask('languages', ['languages:make']);

    grunt.registerTask('languages:make', function(){
        var jsDir = path.join(process.cwd(), '.tmp', 'js');
        var messagesDir = path.join(process.cwd(), 'src/main/resources/');

        var languages = {};
        glob.sync('messages*', {
            cwd: messagesDir
        }).forEach(function(filename){
            var fileLanguage = filename.substr(filename.lastIndexOf('.')-2, 2);
            var localeLabel = fileLanguage;

            var languageObj = grunt.file.readJSON(path.join(messagesDir, filename));
            if(languageObj && languageObj['locale.label']){
                localeLabel = languageObj['locale.label'];
            }
            
            languages[fileLanguage] = localeLabel;
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_LANGUAGES", ' +  JSON.stringify(languages) + ');' + '\n';
        fileContents += '})();';

        grunt.file.write(path.join(jsDir, 'languages.js'), fileContents, {
            encoding: 'utf8'
        });

    });
}
