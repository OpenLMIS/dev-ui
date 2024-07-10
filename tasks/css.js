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

module.exports = function(grunt) {
    var fs = require('fs-extra'),
        path = require('path'),
        wiredep = require('wiredep-away'),
        glob = require('glob'),
        inEachAppDir = require('../ordered-application-directory'),
        fileReplace = require('./replace.js')(grunt);

    var tmpDir = 'css';

    grunt.registerTask('css', ['css:copy', 'css:replace', 'css:build']);

    grunt.registerTask('css:copy', function() {
        var dest = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');

        inEachAppDir(function(dir) {
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if (config && config.app && config.app.src) {
                src = config.app.src;
            }

            glob.sync('**/*.scss', {
                cwd: path.join(dir, src)
            }).forEach(function(file) {
                fs.copySync(path.join(dir, src, file), path.join(dest, file));
            });
        });

        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        var bowerCss = wiredep().css || [];
        var bowerScss = wiredep().scss || [];
        bowerCss.concat(bowerScss).forEach(function(file) {
            var bowerPath = file.substring(file.indexOf('bower_components'));
            fs.copySync(file, path.join(dest, bowerPath));
        });

        process.chdir(cwd);
    });

    grunt.registerTask('css:replace', function() {
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');
        fileReplace('**/*.{scss,css}', tmp);
    });

    grunt.registerTask('css:build', function() {
        var tmp = path.join(grunt.option('app.tmp'), tmpDir);

        buildScss('openlmis.scss', tmp);

    });

    function buildScss(fileName, dest) {
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir, 'src');

        var imports = '';
        // Set general file patterns we want to ignore
        var ignorePatterns = [];
        // Helper function to keep ordered file adding clear
        // We are creating an SCSS file that imports all the others
        function addFiles(pattern, extraIgnore) {
            if (!extraIgnore) {
                extraIgnore = [];
            }

            glob.sync(pattern, {
                cwd: tmp,
                ignore: ignorePatterns.concat(extraIgnore)
            }).forEach(function(file) {
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

        addFiles('**/*variables.scss', ['bower_components/**/*', 'node_modules/**/*']);

        addFiles('bower_components/**/*.scss');
        addFiles('bower_components/**/*.css');

        addFiles('**/mixins.scss');
        addFiles('**/*.mixins.scss');
        addFiles('**/*.scss');
        addFiles('**/*.css');

        fs.writeFileSync(path.join(dest, fileName), imports);
    }
};
