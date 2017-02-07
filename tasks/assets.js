module.exports = function(grunt){
    var fs = require('fs-extra'),
    glob = require('glob'),
    wiredep = require('wiredep'),
    path = require('path');

    var inEachAppDir = require('../ordered-application-directory');

    grunt.registerTask('assets', function(){
        var dest = path.join(process.cwd(), grunt.option('app.dest'));

        var imageExtentions = ['png', 'jpg', 'gif', 'svg', 'ico'],
        fontExtentions = ['eot', 'woff', 'woff2', 'ttf', 'otf'],
        assetExtentions = imageExtentions.concat(fontExtentions);

        var assetPatterns = [];
        assetExtentions.forEach(function(extention){
            assetPatterns.push('**/*.' + extention);
        });

        // Get images from each place
        inEachAppDir(function(dir){
            var src = path.join(dir, 'src/main/webapp');
            glob.sync('{' + assetPatterns.join(',') + '}', {
                cwd: src
            }).forEach(function(file){
                fs.copySync(path.join(src, file), path.join(dest, file));
            });
        });

        // Get bower fonts
        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        mainFilesFromBower(fontExtentions).forEach(function(file){
            var fileName = file.substring(file.lastIndexOf("/"))
            fs.copySync(file, path.join(dest, 'fonts', fileName));
        });

        process.chdir(cwd);
    });

    // Get non-standard files from wiredep
    // adapted from: https://github.com/taptapship/wiredep/issues/200
    function mainFilesFromBower(extentions){
        var deps = wiredep().packages;
        var files = []
        for(var i in deps) {
            for(var k in deps[i].main) {
                var filePath = deps[i].main[k];
                var fileExtention = filePath.split('.').pop();
                if(extentions.indexOf(fileExtention) >= 0) {
                    files.push(filePath);
                }
            }
        }
        return files;
    }

}
