module.exports = (config) => {
    var fs = require('fs-extra'),
    tmp = path.join(process.cwd(), grunt.option('app.tmp'), 'javascript', 'tests'),
    testFilePattern = '**/*.spec.js';
    config.set({
        files: [
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/jquery/dist/jquery.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'javascript/bower_components/angular/angular.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/angular-mocks/angular-mocks.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/moment/moment.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/moment-timezone/moment-timezone.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/pouchdb/dist/pouchdb.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/underscore/underscore.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/js-shortid/lib/js-shortid.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/popper.js/dist/popper.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'javascript/bower_components/**/*.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'javascript/src/**/*.module.js'),
            { pattern: path.join(grunt.option('app.tmp'), 'javascript/src/openlmis-config/*.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/popper.js/dist/popper.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/bootstrap/dist/js/bootstrap.bundle.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'javascript/src/**/*.constant.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'javascript/src/**/*.config.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'javascript/src/**/*.routes.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'javascript/src/**/*.js'), watched: false },
            { pattern: path.join(tmp, '**/*builder.spec.js'), watched: false },
            { pattern: path.join(tmp, testFilePattern), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/bootstrap/dist/js/bootstrap.bundle.js'), watched: false },
            { pattern: path.join(grunt.option('app.tmp'), 'node_modules/bootstrap-tour/build/js/bootstrap-tour-standalone.js'), watched: false },
        ],
      webpack: {
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules|bower_components/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"]
                }
              }
            }
          ]
        }
      },
   
      webpackMiddleware: {
        stats: 'errors-only',
      },
    });
    configuration.options.preprocessors[path.join(grunt.option('app.tmp'), 'javascript/src/**/*.js')] = ['webpack', 'coverage'];
  };