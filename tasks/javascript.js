
module.exports = function(grunt){
    var fs = require('fs-extra'),
    readline = require('readline'),
    stream = require('stream'),
    path = require('path'),
    replace = require('replace'),
    changeCase = require('change-case'),
    Concat = require('concat-with-sourcemaps'),
    convertSourceMap = require('convert-source-map'),
    wiredep = require('wiredep'),
    glob = require('glob'),
    inEachAppDir = require('../ordered-application-directory');
    
    var tmpDir = 'js';
    var fileName = 'openlmis.js';

    grunt.registerTask('openlmis.js', ['openlmis.js:copy', 'openlmis.js:build', 'openlmis.js:replace', 'openlmis.js:uglify']);

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

            var bowerFiles = wiredep().js || [];
            bowerFiles.forEach(function(file){
                // copy each file into a directory called bower_components
                var bowerPath = file.substring(file.indexOf("bower_components"));
                fs.copySync(file, path.join(tmp, bowerPath));
            });
        });
    });

    grunt.registerTask('openlmis.js:build', function(){

        var concat = new Concat(true, fileName, '\n');

        // Set general file patterns we want to ignore
        var ignorePatterns = [
            'app.js', // must be last
            'app.routes.js' // must be last
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

        var inlineSourceMap = convertSourceMap.fromJSON(concat.sourceMap).toComment();
        concat.add(null, inlineSourceMap);
        
        fs.writeFileSync(path.join(grunt.option('app.dest'), fileName), concat.content);
    });

    grunt.registerTask('openlmis.js:replace', function(){
        var done = this.async();

        var re = new RegExp(/@@[\w.]+/g);
        var matches = [];

        var instream = fs.createReadStream(path.join(grunt.option('app.dest'), fileName));
        var outstream = new stream;
        var rl = readline.createInterface(instream, outstream);

        rl.on('line', function(line) {
            var results;
            while((results = re.exec(line)) !== null){
                var match = results[0];
                if(matches.indexOf(match) == -1) matches.push(match);

                line = line.substring(re.lastIndex);
            }
        });

        rl.on('close', function() {
            matches.forEach(function(match){
                var optionName = changeCase.camelCase(match.substring(2));
                var option = grunt.option(optionName);
                if(option){
                    replace({
                        regex: match,
                        repalce: option,
                        paths: [path.join(grunt.option('app.dest'), fileName)],
                        silent: true
                    });
                } else {
                    grunt.log.error("Missing config option: " + optionName);
                }
            });

            // Tell grunt this task is done
            done();
        });
    });

    grunt.registerTask('openlmis.js:uglify', function(){

    });

}
