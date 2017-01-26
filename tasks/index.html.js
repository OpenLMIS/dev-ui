module.exports = function(grunt){
    var fs = require('fs-extra'),
    path = require('path'),
    glob = require('glob');

    var inEachAppDir = require('../ordered-application-directory');
    var tmpDir = path.join(process.cwd(), '.tmp', 'index-html');

    grunt.registerTask('index.html', ['index.html:copy', 'index.html:build']);

    grunt.registerTask('index.html:copy', function(){
        inEachAppDir(function(dir){
            var src = 'src';
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('index.html', {
                cwd: path.join(dir, src)
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(tmpDir, file));
            });
        });
    });

    grunt.registerTask('index.html:build', function(){
        fs.copySync(path.join(tmpDir, 'index.html'), path.join(process.cwd(), 'build', 'index.html'));
    });


}