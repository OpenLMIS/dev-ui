module.exports = function(grunt){
    var path = require('path')
    glob = require('glob'),
    inEachAppDir = require('../ordered-application-directory');

    grunt.loadNpmTasks('grunt-karma');

    var testFiles = [];
    inEachAppDir(function(dir){
        var src = grunt.option('app.src');
        var config = grunt.file.readJSON(path.join(dir, 'config.json'));
        if(config && config.app && config.app.src) src = config.app.src;
        glob.sync('**/*.spec.js',{
            cwd: path.join(dir, src)
        }).forEach(function(file){
            testFiles.push(path.join(dir, src, file));
        });
    });

    var files = [{
        src: [
            path.join(grunt.option('app.dest'), 'openlmis.js'),
            path.join(grunt.option('app.tmp'), 'bower_components/angular-mocks/angular-mocks.js')
        ].concat(testFiles)
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
