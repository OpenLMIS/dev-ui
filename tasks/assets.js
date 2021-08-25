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
    glob = require('glob'),
    wiredep = require('wiredep-away'),
    path = require('path');

    var inEachAppDir = require('../ordered-application-directory');

    grunt.registerTask('assets', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), 'assets');

        var imageExtentions = ['png', 'jpg', 'gif', 'svg', 'ico'],
        fontExtentions = ['eot', 'woff', 'woff2', 'ttf', 'otf'],
        assetExtentions = imageExtentions.concat(fontExtentions);

        var assetPatterns = [];
        assetExtentions.forEach(function(extention){
            assetPatterns.push('**/*.' + extention);
        });

        // Get images from each place
        inEachAppDir(function(dir, dirConfig){
            var srcDir = grunt.option('app.src');
            if(dirConfig && dirConfig.app && dirConfig.app.src){
                srcDir = dirConfig.app.src;
            }
            var src = path.join(dir, srcDir);
            glob.sync('{' + assetPatterns.join(',') + '}', {
                cwd: src
            }).forEach(function(file){
                fs.copySync(path.join(src, file), path.join(tmp, file));
            });
        });

        // Get bower fonts
        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        mainFilesFromBower(fontExtentions).forEach(function(file){
            var fileName = file.substring(file.lastIndexOf("/"));
            fs.copySync(file, path.join(tmp, 'fonts', fileName));
        });

        process.chdir(cwd);
    });

    // Get non-standard files from wiredep
    // adapted from: https://github.com/taptapship/wiredep/issues/200
    function mainFilesFromBower(extentions){
        var deps = wiredep().packages;
        var files = [];
        for(var i in deps) {
            for(var k in deps[i].main) {
                var filePath = deps[i].main[k];
                var fileExtention = filePath.split('.').pop();
                if(extentions.indexOf(fileExtention) >= 0) {
                    files.push(filePath);
                }
            }
        }
        return files;
    }

};
