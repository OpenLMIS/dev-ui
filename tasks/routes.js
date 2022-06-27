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

    grunt.registerTask('routes', function(){
        grunt.task.run([
            'routes:make'
        ]);
    });

    var targetDir = path.join(process.cwd(), grunt.option('app.tmp'), 'javascript', 'src', 'openlmis-config');

    /**
     * Gets routes objects from all apps in each application directory,
     * merges them and adds them to be built into the javascript application.
     */
    grunt.registerTask('routes:make', function(){
        var routes = [];

        eachAppDir(function(dir){
            glob.sync('routes.json', {
                cwd: dir,
                matchBase: true
            }).forEach(function(filename) {
                var filepath = path.join(dir, filename);
                var routesArray = grunt.file.readJSON(filepath);
                routes = routes.concat(routesArray);
            });
        });

        var fileContents = '(function(){' + '\n';
        fileContents += 'angular.module("openlmis-config").constant("OPENLMIS_ROUTES", ' + JSON.stringify(routes, null, 2) + ');' + '\n';
        fileContents += '})();';

        fs.ensureDirSync(path.join(targetDir));
        grunt.file.write(path.join(targetDir, 'olmis-routes.js'), fileContents, {
            encoding: 'utf8'
        });
    });
};
