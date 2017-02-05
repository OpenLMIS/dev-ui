
module.exports = function(grunt){
    var fs = require('fs-extra'),
    readline = require('readline'),
    stream = require('stream'),
    path = require('path'),
    replace = require('replace-in-file'),
    changeCase = require('change-case'),
    Concat = require('concat-with-sourcemaps'),
    convertSourceMap = require('convert-source-map'),
    wiredep = require('wiredep'),
    glob = require('glob'),
    inEachAppDir = require('../ordered-application-directory');
    
    var tmpDir = 'js';
    var fileName = 'openlmis.js';

    grunt.registerTask('openlmis.js', ['openlmis.js:copy', 'openlmis.js:build']);

    grunt.registerTask('openlmis.js:copy', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);

        inEachAppDir(function(dir){
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('**/*.js', {
                cwd: path.join(dir, src),
                ignore: ['**/*.spec.js']
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(tmp, file));
            });

            if(!fs.existsSync(path.join(dir, 'bower_components'))){
                return ;
            }
        });

        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        var bowerFiles = wiredep().js || [];
        bowerFiles.forEach(function(file){
            // copy each file into a directory called bower_components
            var bowerPath = file.substring(file.indexOf("bower_components"));
            fs.copySync(file, path.join(tmp, bowerPath));
        });

        process.chdir(cwd);

    });

    grunt.registerTask('openlmis.js:build', function(){

        var concat = new Concat(true, fileName, '\n');

        // Set general file patterns we want to ignore
        var ignorePatterns = [
            'app.js' // must be last
        ];
        // Helper function to keep ordered file adding clear
        function addFiles(pattern){
            glob.sync(pattern, {
                cwd: path.join(process.cwd(), grunt.option('app.tmp'), tmpDir),
                ignore: ignorePatterns
            }).forEach(function(file){
                var filePath = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, file);

                // Don't let previously added patterns be added again
                ignorePatterns.push(pattern);
                
                var contentBuffer = fs.readFileSync(filePath);
                concat.add(file, contentBuffer);
            });
        }

        // Since we copied all bower components over across bower files,
        // we don't have wiredep's dependency order — so we are just
        // guessing the order
        addFiles('bower_components/**/jquery.js');
        addFiles('bower_components/**/angular.js');
        addFiles('bower_components/**/*.js');

        addFiles('**/*.module.js');
        addFiles('**/*.config.js');
        addFiles('**/*.routes.js');
        addFiles('**/*.js');

        ignorePatterns = [];
        addFiles('app.js');

        var inlineSourceMap = convertSourceMap.fromJSON(concat.sourceMap).toComment();
        concat.add(null, inlineSourceMap);
        
        fs.writeFileSync(path.join(grunt.option('app.dest'), fileName), concat.content);
    });

}
