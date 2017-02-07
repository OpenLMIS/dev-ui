module.exports = function(grunt){
    var fs = require('fs-extra'),
    path = require('path'),
    glob = require('glob'),
    fileReplace = require('./replace.js')(grunt);

    var inEachAppDir = require('../ordered-application-directory');
    var tmpDir = 'index-html'

    grunt.registerTask('index.html', ['index.html:copy', 'index.html:replace', 'index.html:build']);

    grunt.registerTask('index.html:copy', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);

        inEachAppDir(function(dir){
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('index.html', {
                cwd: path.join(dir, src)
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(tmp, file));
            });
        });
    });

    grunt.registerTask('index.html:replace', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);
        fileReplace('index.html', tmp);
    });

    grunt.registerTask('index.html:build', function(){
        fs.copySync(path.join(grunt.option('app.tmp'), tmpDir, 'index.html'),
            path.join(grunt.option('app.dest'), 'index.html'));
    });


}