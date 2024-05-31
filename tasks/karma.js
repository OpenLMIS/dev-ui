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
    var fs = require('fs-extra'),
        path = require('path'),
        glob = require('glob'),
        inEachAppDir = require('../ordered-application-directory'),
        tmp = path.join(process.cwd(), grunt.option('app.tmp'), 'javascript', 'tests'),
        testFilePattern = '**/*.spec.js';

    process.env.CHROME_BIN = require('puppeteer').executablePath();

    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['test:copy', 'karma:unit']);

    grunt.registerTask('test:copy', function() {
        inEachAppDir(function(dir) {
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if (config && config.app && config.app.src) {
                src = config.app.src;
            }

            glob.sync(testFilePattern, {
                cwd: path.join(dir, src)
            }).forEach(function(file) {
                fs.copySync(path.join(dir, src, file), path.join(tmp, file));
            });
        });
    });

    var configuration = {
        options: {
            basePath: './',
            frameworks: ['jasmine'],
            plugins: [
                'karma-jasmine',
                'karma-coverage',
                'karma-chrome-launcher',
                'karma-junit-reporter'
            ],
            exclude: [
                'app.js',
                path.join(grunt.option('app.tmp'), 'javascript/src/index.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/src-sw.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/bundle.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/*vendors.js')
            ],
            /* REPORTERS */
            reporters: ['progress', 'coverage', 'junit'],
            junitReporter: {
                outputDir: path.join(grunt.option('build'), 'test/test-results')
            },
            coverageReporter: {
                type: 'lcov',
                dir: path.join(grunt.option('build'), 'test/coverage/')
            },
            /* KARMA PROCESS */
            port: 9876,
            colors: true,
            captureTimeout: 30000,
            logLevel: 'INFO',
            browserDisconnectTolerance: 3,
            browserNoActivityTimeout: 20000,

            browsers: ['ChromeHeadlessNoSandbox'],
            customLaunchers: {
                ChromeHeadlessNoSandbox: {
                    base: 'ChromeHeadless',
                    flags: ['--no-sandbox', '--headless', '--js-flags="--max_old_space_size=4096"']
                }
            },

            files: [
                path.join(grunt.option('app.tmp'), 'node_modules/jquery/dist/jquery.js'),
                path.join(grunt.option('app.tmp'), 'javascript/bower_components/angular/angular.js'),
                path.join(grunt.option('app.tmp'), 'node_modules/angular-mocks/angular-mocks.js'),
                path.join(grunt.option('app.tmp'), 'node_modules/moment/moment.js'),
                path.join(grunt.option('app.tmp'), 'node_modules/moment-timezone/moment-timezone.js'),
                path.join(grunt.option('app.tmp'), 'node_modules/pouchdb/dist/pouchdb.js'),
                path.join(grunt.option('app.tmp'), 'node_modules/underscore/underscore.js'),

                path.join(grunt.option('app.tmp'), 'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'),
                path.join(grunt.option('app.tmp'), 'node_modules/js-shortid/lib/js-shortid.js'),
                path.join(grunt.option('app.tmp'), 'node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js'),

                path.join(grunt.option('app.tmp'), 'javascript/bower_components/**/*.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/**/*.module.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/openlmis-config/*.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/**/*.constant.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/**/*.config.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/**/*.routes.js'),
                path.join(grunt.option('app.tmp'), 'javascript/src/**/*.js'),
                path.join(tmp, '**/*builder.spec.js'),
                path.join(tmp, testFilePattern)
            ]
        },
        unit: {
            singleRun: true,
            autoWatch: false
        },
        tdd: {
            singleRun: false,
            autoWatch: true,
            background: true
        }
    };

    configuration.options.preprocessors = {};
    configuration.options.preprocessors[path.join(grunt.option('app.tmp'), 'javascript/src/**/*.js')] = ['coverage', 'babel'];

    grunt.config('karma', configuration);
};
