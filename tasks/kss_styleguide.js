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
    fs = require('fs-extra'),
    glob = require('glob'),
    inEachAppDir = require('../ordered-application-directory');

    grunt.loadNpmTasks('grunt-kss');

    var dest = path.join(process.cwd(), grunt.option('styleguide.dest'));
    var tmpDir = path.join(process.cwd(), grunt.option('app.tmp'), 'styleguide');
    var title = grunt.option('styleguide.title');
    var src = path.join(grunt.option('app.tmp'), 'css', 'src');

    grunt.config('kss', {
        options: {
            title: 'OpenLMIS-UI Styleguide',
            homepage: '/dev-ui/styleguide/homepage.md',
            builder: '.tmp/styleguide/'
        },
        dist: {
            src: [src],
            dest: dest
        }
    });

    grunt.registerTask('styleguide', function(){
        if(!grunt.option('appOnly') && !grunt.option('noStyleguide')){
            grunt.task.run(['styleguide:copy', 'kss']);
        }
    });

    grunt.registerTask('styleguide:copy', function(){
        fs.mkdirsSync(tmpDir);
        fs.mkdirsSync(dest);

        fs.copySync(path.join(process.cwd(), 'node_modules/kss/builder/handlebars'), tmpDir);
        inEachAppDir(function(dir){
            indexHbs = path.join(dir, 'styleguide/index.hbs');
            if(fs.existsSync(indexHbs)){
                fs.copySync(indexHbs, path.join(tmpDir, 'index.hbs'), {
                   clobber: true
                });
            }
        });

        glob.sync('**/*', {
            ignore: [
                'index.html',
                'manifest.appcache'
            ],
            nodir: true,
            cwd: path.join(process.cwd(), grunt.option('app.dest'))
        }).forEach(function(filePath){
            fs.copySync(path.join(process.cwd(), grunt.option('app.dest'), filePath), path.join(dest, filePath));
        });

    });
}