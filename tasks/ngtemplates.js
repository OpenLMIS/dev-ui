module.exports = function(grunt){
    var fs = require('fs-extra'),
    path = require('path'),
    glob = require('glob')
    inEachAppDir = require('../ordered-application-directory');
    
    var tmpDir = 'html',
    tmpJsDir = 'js';

    grunt.registerTask('html', ['html:copy', 'ngtemplates']);

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.config('ngtemplates', {
        app: {
            cwd:      path.join(process.cwd(), grunt.option('app.tmp'), tmpDir),
            src:      ['**/**.html', '!index.html'],
            dest:     path.join(process.cwd(), grunt.option('app.tmp'), tmpJsDir,'templates.module.js'),
            options: {
              module:   'openlmis-templates',
              standalone: true
            }
        }
    });

    grunt.registerTask('html:copy', function(){
        var tmp = path.join(process.cwd(), '.tmp', tmpDir);
        inEachAppDir(function(dir){
            var src = 'src';
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('**/*.html', {
                cwd: path.join(dir, src),
                ignore: ['index.html'] // Don't copy the index.html file - its special
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(tmp, file));
            });
        });
    });
}