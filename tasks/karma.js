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
        path = require('path'),
        glob = require('glob'),
        inEachAppDir = require('../ordered-application-directory')
        tmp = path.join(process.cwd(), grunt.option('app.tmp'), 'javascript', 'tests')
        testFilePattern = '**/*.spec.js';

    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['test:copy', 'karma:unit']);

    grunt.registerTask('test:copy', function(){
        inEachAppDir(function(dir){
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) {
                src = config.app.src;
            }

            glob.sync(testFilePattern,{
                cwd: path.join(dir, src)
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(tmp, file));
            });
        });
    });

    var files = [{
        src: [
            path.join(grunt.option('app.dest'), 'openlmis.js'),
            path.join(grunt.option('app.tmp'), 'bower_components/angular-mocks/angular-mocks.js'),
            path.join(tmp, testFilePattern)
        ]
    }];

    grunt.config('karma', {
        options: {
            basePath: './',
            frameworks: ['jasmine'],
            plugins: [
                'karma-jasmine',
                'karma-coverage',
                'karma-phantomjs-launcher',
                'karma-junit-reporter'
            ],
            exclude: [],
            /* REPORTERS */
            reporters: ['progress', 'coverage', 'junit'],
            junitReporter: {
                outputDir: path.join(grunt.option('build'),'test/test-results')
            },
            coverageReporter: {
                type: 'html',
                dir: path.join(grunt.option('build'), 'test/coverage/')
            },
            /* KARMA PROCESS */
            port: 9876,
            colors: true,
            captureTimeout: 30000,
            logLevel: 'INFO',

            browsers: ['PhantomJS']
        },
        unit: {
            files: files,
            singleRun: true,
            autoWatch: false
        },
        tdd: {
            files: files,
            singleRun: false,
            autoWatch: true,
            background: true
        }
    });
}
