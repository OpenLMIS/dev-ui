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
        eachAppDir = require('../ordered-application-directory.js');

    grunt.registerTask('reducers', function(){
        grunt.task.run([
            'reducers:make'
        ]);
    });

    var targetDir = path.join(process.cwd(), grunt.option('app.tmp'), 'javascript', 'src', 'openlmis-config');

    /**
     * Get reducers from all directories and save paths to those files in angular constants.
     */
    grunt.registerTask('reducers:make', function(){
        var reducers = [];

        eachAppDir(function(dir){
            glob.sync('**/*.reducer.jsx', {
                cwd: dir
            }).forEach(function(filename) {
                var filepath = filename;

                if (filepath.startsWith('src/')) {
                    filepath = filepath.replace('src/', '');
                }


                var name = filepath.match(/^.*\/(.*?)\.reducer\.jsx$/i)[1];
                reducers.push({ filepath: filepath, name: name })
            });
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_REDUCERS", ' +  JSON.stringify(reducers, null, 2) + ');' + '\n';
        fileContents += '})();';

        fs.ensureDirSync(path.join(targetDir));
        grunt.file.write(path.join(targetDir, 'reducers.js'), fileContents, {
            encoding: 'utf8'
        });
    });
};
