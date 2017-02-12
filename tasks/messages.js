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
                    path.join(getMessageDir(dir), 'messages_en.json'),
                    JSON.stringify(messages, null, 2),
                    {
                        encoding: 'utf8'
                    }
                );
            }
        });
    });
    
    grunt.registerTask('messages:transifex', function(){
        eachAppDir(function(dir){
            var transifexProjectName = getTransifexProjectName(dir);

            if(!transifexProjectName){
                console.log('- no transifex project for: ' + dir);
                return ;
            }

            process.chdir(getMessageDir(dir));

            console.log('# transifex: ' + transifexProjectName);
            var filePattern = 'messages_<lang>.json';
            var sourceFile = 'messages_en.json';

            var transifexUser = process.env.TRANSIFEX_USER || grunt.option('transifexUser');
            var transifexPassword = process.env.TRANSIFEX_PASSWORD || grunt.option('transifexPassword');

            if(!transifexUser || !transifexPassword){
                console.log('no user or password, skipping');
                return ;
            }

            execCommands([
                "rm -rf .tx",
                "tx init --host=https://www.transifex.com --user=" + transifexUser + " --pass=" + transifexPassword,
                "tx set --auto-local -r " + transifexProjectName + ".messages '" + filePattern + "' --source-lang en --type KEYVALUEJSON --source-file " + sourceFile + " --execute",
                "tx push -s",
                "tx pull -a -f"
                ]);
        });
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
            var messagesDir = getMessageDir(dir);

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
        var dirConfig = grunt.file.readJSON(path.join(dir, 'config.json'));
        if(dirConfig && dirConfig['transifexProjectName']){
            return dirConfig['transifexProjectName'];
        } else {
            return false;
        }
    }

    function getMessageDir(dir){
        var transifexProjectName = getTransifexProjectName(dir);
        if(transifexProjectName){
            return path.join(tmpDir, transifexProjectName);
        } else {
            return path.join(tmpDir, dir.substr(dir.lastIndexOf('/')));
        }
    }

};
