module.exports = function(grunt){
    var path = require('path'),
        glob = require('glob'),
        fs = require('fs-extra'),
        extend = require('extend'),
        eachAppDir = require('../ordered-application-directory.js');

    grunt.registerTask('messages', ['messages:merge', 'messages:make']);

    var tmpDir = path.join(process.cwd(), '.tmp', 'messages');

    grunt.registerTask('messages:merge', function(){
        fs.emptyDir(tmpDir);

        var messages = {};
        eachAppDir(function(dir) {
            glob.sync('messages_en.json', {
                cwd: dir,
                matchBase: true,
                ignore: [path.join(tmpDir, '*')]
            }).forEach(function (filename) {
                var filepath = path.join(dir, filename);
                var messageObj = grunt.file.readJSON(filepath);
                messages = extend(true, messages, messageObj);
            });
        });

        grunt.file.write(path.join(tmpDir, 'messages_en.json'), JSON.stringify(messages), {
            encoding: 'utf8'
        });

    });

    grunt.registerTask('messages:make', function(){
        var jsDir = path.join(process.cwd(), '.tmp', 'js');
        fs.emptyDir(jsDir);

        var messages = {};
        glob.sync('messages*', {
            cwd: tmpDir
        }).forEach(function(filename){
            var filepath = path.join(tmpDir, filename);
            var messageObj = grunt.file.readJSON(filepath);
            var fileLanguage = filename.substr(filename.lastIndexOf('.')-2, 2);
            messages[fileLanguage] = messageObj;
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_MESSAGES", ' + JSON.stringify(messages) + ');' + '\n';
        fileContents += '})();';

        grunt.file.write(path.join(jsDir, 'messages.js'), fileContents, {
            encoding: 'utf8'
        });

    });
};
