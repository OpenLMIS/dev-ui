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

module.exports = function(grunt) {

    var path = path = require('path');

    grunt.loadNpmTasks('grunt-sonar-runner');
    grunt.registerTask('sonar', ['sonarRunner:analysis']);

    var login = grunt.option('sonarLogin'),
        password = grunt.option('sonarPassword'),
        projectKey = grunt.option('projectKey'),
        projectName = grunt.option('projectName'),
        projectVersion = grunt.option('projectVersion');

    grunt.config('sonarRunner', {
        analysis: {
            options: {
                sonar: {
                    host: {
                        url: 'http://sonar.openlmis.org'
                    },
                    login: login,
                    password: password,
                    projectKey: 'org.sonarqube:' + projectKey,
                    projectName: projectName,
                    projectVersion: projectVersion,
                    sources: ['src'].join(','),
                    language: 'js',
                    sourceEncoding: 'UTF-8',
                    javascript: {
                        lcov: {
                            reportPaths: path.join(grunt.option('build'), 'test/coverage/**/lcov.info')
                        },
                        exclusions: '**.spec.js'
                    }
                }
            }
        }
    });
}
