/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

module.exports = function(grunt){
    var path = require('path'),
        glob = require('glob'),
        fs = require('fs-extra'),
        extend = require('extend'),
        eachAppDir = require('../ordered-application-directory.js'),
        execSync = require('child_process').execSync;

    grunt.registerTask('messages', function(){
        grunt.task.run([
            'messages:clean',
            'messages:merge',
            'messages:transifex',
            'messages:copy',
            'messages:make'
        ]);
    });

    var tmpDir = path.join(process.cwd(), '.tmp', 'messages'),
        buildDir = path.join(process.cwd(), grunt.option('build'), 'messages'),
        targetDir = path.join(process.cwd(), grunt.option('app.tmp'), 'javascript', 'src', 'openlmis-config');

    /**
     * Task cleans messages .tmp directory used to write and message JSON that
     * is included in the OpenLMIS-UI.
     */
    grunt.registerTask('messages:clean', function(){
        fs.emptyDirSync(tmpDir);
        fs.emptyDirSync(buildDir);
    });

    /**
     * Merges all messages_en.json files together to create a single temporary
     * messages_en.json file.
     */
    grunt.registerTask('messages:merge', function(){
        var messages = {},
            dir = process.cwd();

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
                path.join(tmpDir, 'messages_en.json'),
                JSON.stringify(messages, null, 2),
                {
                    encoding: 'utf8'
                }
            );
        }
    });
    
    /**
     * Updates current app's merged message file to transifex.
     */
    grunt.registerTask('messages:transifex', function(){
        var transifexProject = process.env.TRANSIFEX_PROJECT;

        if(!transifexProject){
            console.log('- no transifex project, skipping');
            return ;
        }

        console.log('# transifex: ' + transifexProject);

        var transifexUser = process.env.TRANSIFEX_USER;
        var transifexPassword = process.env.TRANSIFEX_PASSWORD;

        if(!transifexUser || !transifexPassword){
            console.log('- no transifex user or password, skipping');
            return ;
        }

        var filePattern = 'messages_<lang>.json';
        var sourceFile = 'messages_en.json';

        if(!fs.existsSync(path.join(tmpDir, sourceFile))) {
            console.log('- source message file does not exist, skipping');
            return;
        }

        execCommands([
            "rm -rf .tx",
            "tx init --host=https://www.transifex.com --user=" + transifexUser + " --pass=" + transifexPassword,
            "tx set --auto-local -r " + transifexProject + ".messages '" + filePattern
            + "' --source-lang en --type KEYVALUEJSON --source-file " + sourceFile + " --execute",
            "tx push -s",
            "tx pull -a -f"
        ], tmpDir);
    });

    function execCommands(commands, workingDir){
        commands.forEach(function(command){
            execSync(command, {
                stdio: 'inherit',
                cwd: workingDir
            });
        });
    }

    grunt.registerTask('messages:copy', function(){
        fs.emptyDirSync(buildDir);

        glob.sync('messages*', {
            cwd: tmpDir
        }).forEach(function(filename) {
            fs.copySync(path.join(tmpDir, filename), path.join(buildDir, filename));
        });
    });
    
    /**
     * Gets message objects from all apps in each application directory,
     * merges them and adds them to be built into the javascript application.
     */
    grunt.registerTask('messages:make', function(){
        var messages = {},
            languages = {};


        eachAppDir(function(dir){
            var messagesDir = path.join(dir, 'messages');

            if(!fs.existsSync(messagesDir)) {
                messagesDir = path.join(dir, 'build/messages');
            }

            if(!fs.existsSync(messagesDir)) {
                return;
            }

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


        fs.ensureDirSync(path.join(targetDir));
        grunt.file.write(path.join(targetDir, 'messages.js'), fileContents, {
            encoding: 'utf8'
        });

    });

};
