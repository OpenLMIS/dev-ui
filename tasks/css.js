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
    var fs = require('fs-extra'),
    replace = require('replace-in-file'),
    path = require('path'),
    wiredep = require('wiredep'),
    glob = require('glob'),
    sass = require('node-sass'),
    inEachAppDir = require('../ordered-application-directory'),
    fileReplace = require('./replace.js')(grunt);

    var tmpDir = 'css';
    var cssFileName = 'openlmis.css';
    var srcMapFileName = 'openlmis.css.map';

    grunt.registerTask('css', ['css:copy', 'css:replace', 'css:build']);

    grunt.registerTask('css:copy', function(){
        var dest = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');

        inEachAppDir(function(dir){
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) {
                src = config.app.src;
            }

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
        var generateSrcMap = !grunt.option('production');

        buildScss('openlmis.scss', tmp);

        var sassResult = sass.renderSync({
            file: path.join(tmp, 'openlmis.scss'),
            sourceMap: generateSrcMap,
            sourceMapContents: generateSrcMap,
            outFile: cssFileName,
            outputStyle: 'compressed',
            includePaths: getIncludePaths()
        });

        if (generateSrcMap) {
            var sourceMap = cleanTmpSourceMapPaths(sassResult.map, tmp);
            fs.writeFileSync(path.join(dest, srcMapFileName), sourceMap);
        }

        fs.writeFileSync(path.join(dest, cssFileName), sassResult.css);

        // remove non-relative strings because our file structure is flat
        replace.sync({
            files: [path.join(dest, cssFileName), path.join(dest, srcMapFileName)],
            from: /\.\.\//g,
            to: ''
        });

        // replace cache busting which breaks appcache, needed until this is fixed:
        // https://github.com/FortAwesome/Font-Awesome/issues/3286
        replace.sync({
            files: [path.join(dest, cssFileName), path.join(dest, srcMapFileName)],
            from: /(fontawesome-webfont(\.[a-zA-Z0-9]{3,5})?)\?(\#iefix\&)?v=[0-9\.]{5}(\#fontawesomeregular)?/g,
            to: '$1'
        });

    });

    function buildScss(fileName, dest){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');

        var imports = '';
        // Set general file patterns we want to ignore
        var ignorePatterns = [];
        // Helper function to keep ordered file adding clear
        // We are creating an SCSS file that imports all the others
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

                // regular css files have to be imported without the extension (to be embedded)
                var fileToInclude = filePath;
                if (fileToInclude.endsWith('.css')) {
                    fileToInclude = fileToInclude.substring(0, fileToInclude.length - 4);
                }

                imports += '@import "' + fileToInclude + '";\n';
            });
        }

        addFiles('**/*variables.scss', ['bower_components/**/*']);

        addFiles('bower_components/**/*.scss');
        addFiles('bower_components/**/*.css');

        addFiles('**/mixins.scss');
        addFiles('**/*.mixins.scss');
        addFiles('**/*.scss');
        addFiles('**/*.css');

        fs.writeFileSync(path.join(dest, fileName), imports);
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
