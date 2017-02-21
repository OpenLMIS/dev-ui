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
    "use strict";
    var path = require('path'),
    changeCase = require('change-case'),
    glob = require('glob'),
    fs = require('fs-extra'),
    Applause = require('applause');

    module.exports = function(grunt){
        return replaceFiles;

        function replaceFiles(pattern, cwd){
            var applause = Applause.create({
                patterns: getPatterns()
            });

            glob.sync(pattern,{
                cwd: cwd
            }).forEach(function(file){
                var filePath = path.join(cwd, file);

                var contents = grunt.file.read(filePath, "utf8");

                var result = applause.replace(contents);
                if(result && result.count > 0){
                    grunt.file.write(filePath, result.content);
                    console.log('- ' + file + ': ' + result.count + ' replacements');
                }
            });
        }

        function getPatterns(){
            var patterns = [];
            grunt.option.flags().forEach(function(flag){
                var key = flag.substring(2, flag.indexOf('='));
                var value = flag.substring(flag.indexOf('=')+1);

                if(key != ''){
                    patterns.push({
                        match: changeCase.constantCase(key),
                        replace: value
                    });
                }

            });
            return patterns;
        }

    };

})();