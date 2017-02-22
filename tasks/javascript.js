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
    readline = require('readline'),
    stream = require('stream'),
    path = require('path'),
    replace = require('replace-in-file'),
    changeCase = require('change-case'),
    UglifyJS = require("uglify-js"),
    convertSourceMap = require('convert-source-map'),
    wiredep = require('wiredep'),
    glob = require('glob'),
    inEachAppDir = require('../ordered-application-directory'),
    fileReplace = require('./replace.js')(grunt);

    var tmpDir = 'js';
    var fileName = 'openlmis.js';

    grunt.registerTask('javascript', ['javascript:copyright', 'javascript:copy',
                                      'javascript:replace', 'javascript:build']);

    grunt.registerTask('javascript:copy', function(){
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

    grunt.registerTask('javascript:replace', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);
        fileReplace('**/*.js', tmp);
    });

    grunt.registerTask('javascript:build', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir),
        toplevel = null, // container for UglifyJS
        sourceMap = UglifyJS.SourceMap(),
        sourceMapGenerator = sourceMap.get(),
        ignorePatterns = [ // storing patterns to ignore
            'app.js' // must be last
        ];

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

        toplevel.figure_out_scope();
        if(grunt.option('production')){
            // Compress code
            var compressed_ast = toplevel.transform(UglifyJS.Compressor({
                warnings: false
            }));
            // Mangle code (which just breaks currently)
            // compressed_ast.figure_out_scope();
            // compressed_ast.compute_char_frequency();
            // compressed_ast.mangle_names();

            // Print code as small as possible
            var stream = UglifyJS.OutputStream({}); // not the debug settings
            compressed_ast.print(stream);

            fs.writeFileSync(path.join(grunt.option('app.dest'), fileName), stream.toString());
        } else {
            var stream = UglifyJS.OutputStream({
                source_map: sourceMap,
                beautify: true,
                comments: true
            });
            toplevel.print(stream);

            var javascript = stream.toString();
            javascript += "\n" + "//# sourceMappingURL=" + fileName + '.map';

            fs.writeFileSync(path.join(grunt.option('app.dest'), fileName), javascript);
            fs.writeFileSync(path.join(grunt.option('app.dest'), fileName + '.map'), sourceMap.toString());
        }



        // Helper function to keep ordered file adding clear
        function addFiles(pattern){
            glob.sync(pattern, {
                cwd: tmp,
                ignore: ignorePatterns
            }).forEach(function(file){
                var code = fs.readFileSync(path.join(tmp, file), "utf8");
                toplevel = UglifyJS.parse(code, {
                    filename: file,
                    toplevel:toplevel
                });
                sourceMapGenerator.setSourceContent(file, code);
            });
            // Don't let previously added patterns be added again
            ignorePatterns.push(pattern);
        }
    });

    grunt.registerTask('javascript:copyright', function(){
        if (grunt.option('ignore-copyright')) {
            grunt.log.writeln("--ignore-copyright passed, skipping copyright check.");
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

        var copyright = fs.readFileSync(copyrightFile, "utf8");

        inEachAppDir(function(dir) {
            var src = grunt.option('app.src');
            var cwd = path.join(dir, src);
            var failed = false;

            glob.sync('**/*.js', {
                cwd: cwd
            }).forEach(function(file){
                var filePath = path.join(cwd, file);
                var fileContents = fs.readFileSync(filePath, "utf8");

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
}
