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

    grunt.registerTask('npm', function(){
        var npmObj;
        eachAppDir(function(dir){
            // skip dev-ui for now
            if (dir !== '/dev-ui') {
                var obj = grunt.file.readJSON(path.join(dir, 'package.json'));
                if (obj && !npmObj) {
                    npmObj = obj;
                } else {
                    extend(true, npmObj, obj);
                }
            }
        });

        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        grunt.file.write('package.json', JSON.stringify(npmObj, null, 2));

        exec('rm -rf node_modules');
        exec('npm install --production', {
            stdio: 'inherit' // Shows output as its generated
        });
        process.chdir(cwd);
    });

}