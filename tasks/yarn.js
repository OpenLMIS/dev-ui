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
    const exec = require('child_process').execSync;
    var eachAppDir = require('../ordered-application-directory.js'),
        extend = require('extend'),
        path = require('path');

    grunt.registerTask('yarn', function(){
        var yarnObj;
        eachAppDir(function(dir){
            var obj = grunt.file.readJSON(path.join(dir, 'package-yarn.json'));
            if (obj && !yarnObj) {
                yarnObj = obj;
            } else {
                extend(true, yarnObj, obj);
            }
        });

        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        grunt.file.write('package.json', JSON.stringify(yarnObj, null, 2));

        exec('rm -rf node_modules');
        exec('yarn', {
            stdio: 'inherit' // Shows output as its generated
        });

        // handle 'overrides' from package-yarn.json manually by replacing values in bower.json of each dependency
        if (yarnObj.hasOwnProperty('overrides')) {
            var overrides = yarnObj['overrides'];
            for (var dependency in overrides) {
                var bowerPath = path.join(process.cwd(), 'node_modules', dependency, 'bower.json');
                if (grunt.file.exists(bowerPath)) {
                    var bowerJson = grunt.file.readJSON(bowerPath);
                    for (var key in overrides[dependency]) {
                        bowerJson[key] = overrides[dependency][key];
                    }
                    grunt.file.write(bowerPath, JSON.stringify(bowerJson, null, 2));
                }
            }
        }

        process.chdir(cwd);
    });

};
