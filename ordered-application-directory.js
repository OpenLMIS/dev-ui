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

(function(){

    var path = require('path'),
    fs = require('fs');

    var applicationDirectories = [];
    var applicationDirectoryConfigurations = [];

    var config = require(path.join(process.cwd(), 'config.json'));
    if(config && config.orderedBuildDirectories && Array.isArray(config.orderedBuildDirectories)){
        applicationDirectories = config.orderedBuildDirectories;
    }

    // Make sure the dev-ui is there
    if(applicationDirectories.indexOf('/dev-ui') == -1){
        applicationDirectories.unshift('/dev-ui');
    }

    // Make sure the current dir is there
    if(applicationDirectories.indexOf(process.cwd()) == -1){
        applicationDirectories.push(process.cwd())
    }

    // Get raw configuration JSON for each directory
    inEachAppDir(function(dir){
        var configPath = path.join(dir, 'config.json');
        if(fs.existsSync(configPath)){
            var dirConfig = require(configPath);
            applicationDirectoryConfigurations[dir] = dirConfig;
        }
    });

    // A function that will call the provided function in each directory
    // that is defined in orderedBuildDirectories in config.js
    module.exports = inEachAppDir;

    function inEachAppDir(fn){
        var cwd = process.cwd();

        applicationDirectories.forEach(function(dir){
            var dirConfig = {};
            if(fs.existsSync(dir)){
                if(applicationDirectoryConfigurations[dir]){
                    dirConfig = applicationDirectoryConfigurations[dir];
                }
                
                process.chdir(dir);

                fn(dir, dirConfig);
            }
        });
        process.chdir(cwd);
    }

})();