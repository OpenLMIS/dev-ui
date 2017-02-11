module.exports = function(grunt){
    var path = require('path'),
        glob = require('glob'),
        fs = require('fs-extra'),
        extend = require('extend'),
        eachAppDir = require('../ordered-application-directory.js'),
        execSync = require('child_process').execSync;

    grunt.registerTask('messages', function(){
        if(grunt.option('syncTransifex')){
            grunt.task.run(['messages:merge', 'messages:transifex', 'messages:make']);
        } else {
            grunt.task.run(['messages:merge', 'messages:make']);
        }
    });

    var tmpDir = path.join(process.cwd(), '.tmp', 'messages');
    var jsDir = path.join(process.cwd(), grunt.option('app.tmp'), 'js');

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
    
    grunt.registerTask('messages:transifex', function(){
        execSync('./sync_transifex.sh', {
            stdio: 'inherit'
        });
    });
    
    grunt.registerTask('messages:make', function(){
        var messages = {};
        var languages = {};

        glob.sync('messages*', {
            cwd: tmpDir
        }).forEach(function(filename){
            var filepath = path.join(tmpDir, filename);
            var messageObj = grunt.file.readJSON(filepath);
            var fileLanguage = filename.substr(filename.lastIndexOf('.')-2, 2);
            messages[fileLanguage] = messageObj;

            if(messageObj && messageObj['locale.label']){
                languages[fileLanguage] = messageObj['locale.label'];
            } else {
                languages[fileLanguage] = fileLanguage;
            }
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_LANGUAGES", ' +  JSON.stringify(languages) + ');' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_MESSAGES", ' + JSON.stringify(messages) + ');' + '\n';
        fileContents += '})();';

        grunt.file.write(path.join(jsDir, 'messages_en.js'), fileContents, {
            encoding: 'utf8'
        });

    });
    
};
