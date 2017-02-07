
module.exports = function(grunt){
    var fs = require('fs-extra'),
    replace = require('replace-in-file'),
    path = require('path'),
    Concat = require('concat-with-sourcemaps'),
    convertSourceMap = require('convert-source-map'),
    wiredep = require('wiredep'),
    glob = require('glob'),
    sass = require('node-sass')
    inEachAppDir = require('../ordered-application-directory'),
    fileReplace = require('./replace.js')(grunt);

    var tmpDir = 'css';
    var fileName = 'openlmis.css';

    grunt.registerTask('css', ['css:copy', 'css:replace', 'css:build']);

    grunt.registerTask('css:copy', function(){
        var dest = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');

        inEachAppDir(function(dir){
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('**/*.scss', {
                cwd: path.join(dir, src)
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(dest, file));
            });

            if(!fs.existsSync(path.join(dir, 'bower_components'))){
                return ;
            }
        });

        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        var bowerCss = wiredep().css || [];
        var bowerScss = wiredep().scss || [];
        bowerCss.concat(bowerScss).forEach(function(file){
            var bowerPath = file.substring(file.indexOf("bower_components"));
            fs.copySync(file, path.join(dest, bowerPath));
        });

        process.chdir(cwd);
    });

    grunt.registerTask('css:replace', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');
        fileReplace('**/*.{scss,css}', tmp);
    });

    grunt.registerTask('css:build', function(){
        var dest = grunt.option('app.dest');
        var tmp = path.join(grunt.option('app.tmp'), tmpDir);

        buildScss('openlmis.scss', tmp);

        var sassResult = sass.renderSync({
            file: path.join(tmp, 'openlmis.scss'),
            includePaths: getIncludePaths()
        });

        fs.writeFileSync(path.join(dest, fileName), sassResult.css);

        // remove non-relative strings because our file structure is flat
        replace.sync({
            files: path.join(dest, fileName),
            replace: /\.\.\//g,
            with: ''
        });
    });

    function buildScss(fileName, dest){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');

        var concat = new Concat(true, fileName, '\n');
        // Set general file patterns we want to ignore
        var ignorePatterns = [];
        // Helper function to keep ordered file adding clear
        function addFiles(pattern, extraIgnore){
            if (!extraIgnore) extraIgnore = [];

            glob.sync(pattern, {
                cwd: tmp,
                ignore: ignorePatterns.concat(extraIgnore)
            }).forEach(function(file){
                var filePath = path.join(tmp, file);

                // Don't let previously added patterns be added again
                ignorePatterns.push(pattern);
                
                var contentBuffer = fs.readFileSync(filePath);
                concat.add(file, contentBuffer);
            });
        }

        addFiles('**/*variables.scss', ['bower_components/**/*']);

        addFiles('bower_components/**/*.scss');
        addFiles('bower_components/**/*.css');

        addFiles('**/mixins.scss');
        addFiles('**/*.scss');
        addFiles('**/*.css');

        // TODO: Write/add sourcemaps

        fs.writeFileSync(path.join(dest, fileName), concat.content);
    }

    // Include paths are the directories imported sass files live in
    // so that import statements in the files will work correctly
    function getIncludePaths(){
        var includePaths = [];
        
        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        var bowerScss = wiredep().scss || [];
        bowerScss.forEach(function(filePath){
            var fileDirectory = filePath.substring(0, filePath.lastIndexOf("/"));
            includePaths.push(fileDirectory);
        });

        process.chdir(cwd);
        return includePaths;
    }
}
