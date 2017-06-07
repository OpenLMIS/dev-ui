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
    grunt.loadNpmTasks('grunt-force-task');
    
    grunt.registerTask('build', function(){
        var buildTasks = [
            'build:app'
        ];

        // If the serve command was passed,
        // don't let the task end, because
        // the serve will end...
        if(grunt.option('serve')){
            buildTasks.push('build:keepAlive');
        }

        grunt.task.run(buildTasks);
    });

    grunt.registerTask('build:app', function(){
        var buildTasks = [
            'messages',
            'html',
            'javascript',
            'css',
            'assets',
            'index.html',
            'appcache'
        ];

        if(!grunt.option('noTest')){
            buildTasks.push('test');
        }

        if(!grunt.option('noStyleguide')){
            buildTasks.push('styleguide');
        }

        if(!grunt.option('noDocs')){
            buildTasks.push('docs');
        }

        grunt.task.run(buildTasks);

    });

    grunt.registerTask('build:keepAlive', function(){
        this.async();
    });

}