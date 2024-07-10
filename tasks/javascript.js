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

    var tmpDir = path.join('javascript', 'src');

    grunt.registerTask('javascript', [
        'javascript:copyright',
        'javascript:copy',
        'javascript:app.js',
        'javascript:replace',
        'javascript:build'
    ]);

    grunt.registerTask('javascript:clean', function() {
        fs.emptyDirSync(path.join(process.cwd(), grunt.option('app.tmp'), 'javascript'));
    });

    grunt.registerTask('javascript:copy', function() {
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);

        inEachAppDir(function(dir, dirConfig) {
            var src = grunt.option('app.src');
            if (dirConfig && dirConfig.app && dirConfig.app.src) {
                src = dirConfig.app.src;
            }

            glob.sync('**/*.{js,jsx}', {
                cwd: path.join(dir, src),
                ignore: ['**/*.spec.js']
            }).forEach(function(file) {
                fs.copySync(path.join(dir, src, file), path.join(tmp, file));
            });
        });

        var cwd = process.cwd();
        tmp = path.join(cwd, grunt.option('app.tmp'), 'javascript');

        process.chdir(grunt.option('app.tmp'));

        var bowerFiles = wiredep().js || [];
        bowerFiles.forEach(function(file) {
            // copy each file into a directory called bower_components
            var bowerPath = file.substring(file.indexOf('bower_components'));
            fs.copySync(file, path.join(tmp, bowerPath));
        });

        process.chdir(cwd);

    });

    grunt.registerTask('javascript:replace', function() {
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);
        fileReplace('**/*.{js,jsx}', tmp);
    });

    grunt.registerTask('javascript:build', function() {
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), 'javascript'),
            ignorePatterns = [
                // storing patterns to ignore
                // must be last
                'app.js'
            ];

        var imports = '';

        addFiles(tmp, 'src/*-vendors.js');
        // Since we copied all bower components over across bower files,
        // we don't have wiredep's dependency order — so we are just
        // guessing the order
        addFiles(tmp, 'bower_components/**/angular.js');
        addFiles(tmp, 'bower_components/**/*.js');

        fs.writeFileSync(path.join(tmp, 'src', 'vendors.js'), imports);
        imports = '';

        addFiles(tmp, 'src/**/*.module.js');
        addFiles(tmp, 'src/**/*.config.js');
        addFiles(tmp, 'src/**/*.routes.js');
        addFiles(tmp, 'src/*/**/*.js');
        addFiles(tmp, 'src/*/**/*.wrapper.jsx');

        fs.writeFileSync(path.join(tmp, 'src', 'bundle.js'), imports);

        // Helper function to keep ordered file adding clear
        function addFiles(dir, pattern) {
            glob.sync(pattern, {
                cwd: dir,
                ignore: ignorePatterns
            }).forEach(function(file) {
                var fileToInclude = path.join(dir, file);

                if (fileToInclude.endsWith('.js')) {
                    fileToInclude = fileToInclude.substring(0, fileToInclude.length - 3);
                }

                imports += 'require("' + fileToInclude + '");\n';
            });
            // Don't let previously added patterns be added again
            ignorePatterns.push(pattern);
        }
    });

    grunt.registerTask('javascript:copyright', function() {
        if (grunt.option('ignore-copyright')) {
            grunt.log.writeln('--ignore-copyright passed, skipping copyright check.');
            return;
        }

        var copyrightFile = grunt.option('license-header');
        if (!copyrightFile) {
            copyrightFile = 'LICENSE-HEADER';
        }

        if (!fs.existsSync(copyrightFile)) {
            copyrightFile = 'node_modules/dev-ui/LICENSE-HEADER';
        }

        if (!fs.existsSync(copyrightFile)) {
            grunt.fail.warn('No copyright header found.');
            return;
        }

        grunt.log.writeln('Checking copyright headers against ' + copyrightFile);

        var copyright = fs.readFileSync(copyrightFile, 'utf8');

        inEachAppDir(function(dir, dirConfig) {
            var src = grunt.option('app.src');
            if (dirConfig && dirConfig.app && dirConfig.app.src) {
                src = dirConfig.app.src;
            }
            var cwd = path.join(dir, src);
            var failed = false;

            glob.sync('**/*.js', {
                cwd: cwd
            }).forEach(function(file) {
                var filePath = path.join(cwd, file);
                var fileContents = fs.readFileSync(filePath, 'utf8');

                if (!fileContents.startsWith(copyright)) {
                    failed = true;
                    grunt.log.error(filePath + ' does not start with the copyright header.');
                }
            });

            if (failed) {
                grunt.fail.warn('Javascript files did not pass copyright check. '
                    + 'Files must start with: ' + copyrightFile + '.');
            }
        });
    });

    grunt.registerTask('javascript:app.js', function() {
        var tmpSrc = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);

        var appModules = [];
        fs.readdirSync(tmpSrc).forEach(function(filePath) {
            var fullFilePath = path.join(tmpSrc, filePath);
            if (fs.statSync(fullFilePath).isDirectory() && filePath != 'bower_components' && filePath != 'node_modules') {
                appModules.push(filePath);
            }
        });

        var fileContents = '(function() {' + '\n';
        fileContents += 'angular.module("openlmis", ' +  JSON.stringify(appModules, null, 2) + ');' + '\n';
        fileContents += '})();';

        grunt.file.write(path.join(tmpSrc, 'app.js'), fileContents, {
            encoding: 'utf8'
        });
    });
};
