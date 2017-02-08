
module.exports = function(grunt){
    var fs = require('fs-extra'),
    replace = require('replace-in-file'),
    path = require('path'),
    wiredep = require('wiredep'),
    glob = require('glob'),
    sass = require('node-sass'),
    inEachAppDir = require('../ordered-application-directory');

    var tmpDir = 'css';

    grunt.registerTask('openlmis.css', ['openlmis.css:copy', 'openlmis.css:build']);

    grunt.registerTask('openlmis.css:copy', function(){
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

    grunt.registerTask('openlmis.css:build', function(){
        var dest = grunt.option('app.dest');
        var tmp = path.join(grunt.option('app.tmp'), tmpDir);
        var generateSrcMap = !grunt.option('production');

        buildScss('openlmis.scss', tmp);

        var sassResult = sass.renderSync({
            file: path.join(tmp, 'openlmis.scss'),
	        sourceMap: generateSrcMap,
            sourceMapContents: generateSrcMap,
            outFile: 'openlmis.css',
            outputStyle: 'compressed',
            includePaths: getIncludePaths()
        });

        var sourceMap = cleanTmpSourceMapPaths(sassResult.map, tmp);

        fs.writeFileSync(path.join(dest, 'openlmis.css'), sassResult.css);
        fs.writeFileSync(path.join(dest, 'openlmis.css.map'), sourceMap);

        // remove non-relative strings because our file structure is flatter
        replace.sync({
           files: [path.join(dest, 'openlmis.css'), path.join(dest, 'openlmis.css.map')],
           replace: /\.\.\//g,
           with: ''
        });

    });

    function buildScss(fileName, dest){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');

        var imports = '';
        // Set general file patterns we want to ignore
        var ignorePatterns = [];
        // Helper function to keep ordered file adding clear
        function addFiles(pattern, extraIgnore){
            if (!extraIgnore) {
                extraIgnore = [];
            }

            glob.sync(pattern, {
                cwd: tmp,
                ignore: ignorePatterns.concat(extraIgnore)
            }).forEach(function(file){
                var filePath = path.join(tmp, file);

                // Don't let previously added patterns be added again
                ignorePatterns.push(pattern);
                
                imports += '@import "' + filePath + '";\n';
            });
        }

        addFiles('**/*variables.scss', ['bower_components/**/*']);

        addFiles('bower_components/**/*.scss');
        addFiles('bower_components/**/*.css');

        addFiles('**/mixins.scss');
        addFiles('**/*.scss');
        addFiles('**/*.css');

        fs.writeFileSync(path.join(dest, fileName), imports);
    }

    function getIncludePaths(){
        // Include paths are the directories imported sass files live in
        // so that import statements in the files will work correctly
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

    function cleanTmpSourceMapPaths(sassMap, tmp) {
        var map = JSON.parse(sassMap);

        for (var i = 0; i < map.sources.length; i++) {
            var source = map.sources[i];
            // Remove .tmp/, .tmp/css and .tmp/css/src
            source = source.replace(path.join(tmp, "src/"), "");
            source = source.replace(path.join(tmp, "/"), "");
            source = source.replace(path.join(grunt.option('app.tmp'), "/"), "");
            map.sources[i] = source;
        }

        return JSON.stringify(map);
    }
}

