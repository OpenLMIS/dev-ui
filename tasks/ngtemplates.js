module.exports = function(grunt){
    var fs = require('fs-extra'),
    path = require('path'),
    glob = require('glob');

    var inEachAppDir = require('../ordered-application-directory');
    var tmpDir = path.join(process.cwd(), '.tmp', 'html');

    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.config('ngtemplates', {
        app: {
            cwd:      tmpDir,
            src:      ['**/**.html', '!index.html'],
            dest:     path.join(process.cwd(),'.tmp/js','templates.module.js'),
            options: {
              module:   'openlmis-templates',
              standalone: true,
              concat:   'js',
            }
        }
    });

    grunt.registerTask('copy:html', function(){
        inEachAppDir(function(dir){
            var src = 'src';
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('**/*.html', {
                cwd: path.join(dir, src),
                ignore: ['index.html'] // Don't copy the index.html file - its special
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(tmpDir, file));
            });
        });
    });

    grunt.registerTask('build:html', function(){
        grunt.task.run('copy:html', 'ngtemplates');
    });
}