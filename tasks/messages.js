module.exports = function(grunt){
    var path = require('path'),
        glob = require('glob'),
        fs = require('fs-extra'),
        extend = require('extend'),
        eachAppDir = require('../ordered-application-directory.js'),
        execSync = require('child_process').execSync;

    grunt.registerTask('messages', function(){
        var tasks = [
            'messages:clean',
            'messages:merge',
            'messages:make'
        ];

        if(grunt.option('syncTransifex')){
            tasks.splice(2, 0, 'messages:transifex');
        }

        grunt.task.run(tasks);
    });

    var tmpDir = path.join(process.cwd(), '.tmp', 'messages');
    var jsDir = path.join(process.cwd(), grunt.option('app.tmp'), 'js');

    grunt.registerTask('messages:clean', function(){
        fs.emptyDirSync(tmpDir);
    });

    grunt.registerTask('messages:merge', function(){
        eachAppDir(function(dir) {
            var messages = {};
            glob.sync('messages_en.json', {
                cwd: dir,
                matchBase: true,
                ignore: [path.join(tmpDir, '*')]
            }).forEach(function (filename) {
                var filepath = path.join(dir, filename);
                var messageObj = grunt.file.readJSON(filepath);
                messages = extend(messages, messageObj);
            });

            if(Object.keys(messages).length > 0){
                grunt.file.write(
                    path.join(tmpDir, getTransifexProjectName(dir), 'messages_en.json'),
                    JSON.stringify(messages, null, 2),
                    {
                        encoding: 'utf8'
                    }
                );
            }
        });
    });
    
    grunt.registerTask('messages:transifex', function(){
        var cwd = process.cwd();
        fs.readdirSync(tmpDir).forEach(function(name){
            process.chdir(path.join(tmpDir, name));

            console.log('# transifex: ' + name);
            var transifexProjectName = name; // We set the directory name to the transifex project name
            var filePattern = 'messages_<lang>.json';
            var sourceFile = 'messages_en.json';

            var transifexUser = grunt.option('transifexUser');
            var transifexPassword = grunt.option('transifexPassword');

            execCommands([
                "rm -rf .tx",
                "tx init --host=https://www.transifex.com --user=" + transifexUser + " --pass=" + transifexPassword,
                "tx set --auto-local -r " + transifexProjectName + ".messages '" + filePattern + "' --source-lang en --type KEYVALUEJSON --source-file " + sourceFile + " --execute",
                "tx push -s",
                "tx pull -a -f"
                ]);
        });

        process.chdir(cwd);


        // execSync('./sync_transifex.sh', {
        //     stdio: 'inherit'
        // });
    });

    function execCommands(commands){
        commands.forEach(function(command){
            execSync(command, {
                stdio: 'inherit'
            });
        });
    }
    
    grunt.registerTask('messages:make', function(){
        var messages = {};
        var languages = {};

        eachAppDir(function(dir){
            var messagesDir = path.join(tmpDir, getTransifexProjectName(dir));

            glob.sync('messages*', {
                cwd: messagesDir
            }).forEach(function(filename){
                var filepath = path.join(messagesDir, filename);
                var messageObj = grunt.file.readJSON(filepath);
                var fileLanguage = filename.substr(filename.lastIndexOf('.')-2, 2);
                messages[fileLanguage] = extend(messages[fileLanguage], messageObj);

                if(messageObj && messageObj['locale.label']){
                    languages[fileLanguage] = messageObj['locale.label'];
                } else if(!languages[fileLanguage]) {
                    languages[fileLanguage] = fileLanguage;
                }
            });
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_LANGUAGES", ' +  JSON.stringify(languages, null, 2) + ');' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_MESSAGES", ' + JSON.stringify(messages, null, 2) + ');' + '\n';
        fileContents += '})();';

        grunt.file.write(path.join(jsDir, 'messages.js'), fileContents, {
            encoding: 'utf8'
        });

    });

    function getTransifexProjectName(dir){
        var name = dir.substr(dir.lastIndexOf('/'));
        var dirConfig = grunt.file.readJSON('config.json');
        if(dirConfig && dirConfig['transifexProjectName']){
            name = dirConfig['transifexProjectName'];
        }
        return name;
    }

};
