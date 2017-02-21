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
    path = require('path'),
    glob = require('glob'),
    fileReplace = require('./replace.js')(grunt);

    var inEachAppDir = require('../ordered-application-directory');
    var tmpDir = 'index-html'

    grunt.registerTask('index.html', ['index.html:copy', 'index.html:replace', 'index.html:build']);

    grunt.registerTask('index.html:copy', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);

        inEachAppDir(function(dir){
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('index.html', {
                cwd: path.join(dir, src)
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(tmp, file));
            });
        });
    });

    grunt.registerTask('index.html:replace', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);
        fileReplace('index.html', tmp);
    });

    grunt.registerTask('index.html:build', function(){
        fs.copySync(path.join(grunt.option('app.tmp'), tmpDir, 'index.html'),
            path.join(grunt.option('app.dest'), 'index.html'));
    });


}