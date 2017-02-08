module.exports = function(grunt){
    var path = require('path'),
    glob = require('glob'),
    fs = require('fs-extra'),
    extend = require('extend'),
    eachAppDir = require('../ordered-application-directory.js');

    grunt.registerTask('messages', ['messages:make']);

    grunt.registerTask('messages:make', function(){
        var tmpDir = path.join(process.cwd(), '.tmp', 'js');
        fs.emptyDir(tmpDir);

        var messages = {};
        eachAppDir(function(dir) {
            dir += '/src/main/webapp/';

            glob.sync('**/messages*', {
                cwd: dir
            }).forEach(function (filename) {
                var filepath = path.join(dir, filename);
                var messageObj = grunt.file.readJSON(filepath);
                var fileLanguage = filename.substr(filename.lastIndexOf('.') - 2, 2);
                messages[fileLanguage] = extend(true, messages[fileLanguage], messageObj);
            });
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_MESSAGES", ' + JSON.stringify(messages) + ');' + '\n';
        fileContents += '})();';

        grunt.file.write(path.join(tmpDir, 'messages.js'), fileContents, {
            encoding: 'utf8'
        });

    });
};
