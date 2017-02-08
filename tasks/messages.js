module.exports = function(grunt){
    var path = require('path'),
    glob = require('glob'),
    fs = require('fs-extra');

    grunt.registerTask('messages', ['messages:make']);

    grunt.registerTask('messages:make', function(){
        var tmpDir = path.join(process.cwd(), '.tmp', 'js');
        fs.emptyDir(tmpDir);

        var messages = {};
        glob.sync('messages*', {
            cwd: 'src/main/resources/'
        }).forEach(function(filename){
            var filepath = path.join(process.cwd(), 'src/main/resources', filename);
            var messageObj = grunt.file.readJSON(filepath);
            var fileLanguage = filename.substr(filename.lastIndexOf('.')-2, 2);
            messages[fileLanguage] = messageObj;
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_MESSAGES", ' + JSON.stringify(messages) + ');' + '\n';
        fileContents += '})();'

        grunt.file.write(path.join(tmpDir, 'messages.js'), fileContents, {
            encoding: 'utf8'
        });

    });
}
