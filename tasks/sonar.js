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

    var path = require('path'),
        fs = require('fs-extra'),
        glob = require('glob'),
        replace = require('replace-in-file'),
        properties = require('properties-parser'),
        projectProperties = properties.read('project.properties');

    grunt.loadNpmTasks('grunt-sonar-runner');
    grunt.loadNpmTasks('grunt-properties-reader');
    grunt.registerTask('sonar', ['sonar:lcov', 'sonarRunner:analysis']);

    grunt.registerTask('sonar:lcov', function() {
        var lcovPath;

        glob.sync(path.join(process.cwd(), grunt.option('build'), 'test/coverage', '**/lcov.info'))
        .forEach(function(file) {
            lcovPath = file;
        });

        if(lcovPath) {
            fs.copySync(lcovPath, path.join(grunt.option('app.tmp'), 'sonar', 'lcov.info'));
            replace({
                files: path.join(grunt.option('app.tmp'), 'sonar', 'lcov.info'),
                from: /\/app\/\.tmp\/javascript\/src\//g,
                to: 'src/'
            });
        }

    });

    var sonarConfig = {
        analysis: {
            options: {
                sonar: {
                    host: {
                        url: 'http://sonar.openlmis.org'
                    },
                    login: grunt.option('sonarLogin'),
                    password: grunt.option('sonarPassword'),
                    projectKey: 'org.sonarqube:' + projectProperties.projectKey,
                    projectName: projectProperties.projectName,
                    projectVersion: projectProperties.version,
                    sources: ['src'].join(','),
                    language: 'js',
                    sourceEncoding: 'UTF-8',
                    javascript: {
                        lcov: {
                            reportPaths: path.join(process.cwd(), grunt.option('app.tmp'), 'sonar/lcov.info')
                        }
                    },
                    exclusions: '**.spec.js'
                }
            }
        }
    };

    var branch = grunt.option('sonarBranch');
    if (branch) {
        sonarConfig.analysis.options.sonar.branch = branch;
    }

    grunt.config('sonarRunner', sonarConfig);
}
