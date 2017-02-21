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
    var path = require('path');

    grunt.loadNpmTasks('grunt-ngdocs');

    var dest = grunt.option('docs.dest');
    var title = grunt.option('docs.title');
    var src = path.join(grunt.option('app.tmp'), 'js');

    grunt.config('ngdocs', {
        options:{
            dest: dest,
            title: title
        },
        api: {
            src: [
                path.join(src, "**/*.js"),
                "!" + path.join(src, "bower_components/**/*")
            ],
            title: "API"
        }
    });

    grunt.registerTask('docs', function(){
        if(!grunt.option('appOnly') && !grunt.option('noDocs')){
            grunt.task.run('ngdocs');
        }
    });
}
