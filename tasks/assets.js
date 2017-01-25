module.exports = function(grunt){
    var fs = require('fs-extra'),
    glob = require('glob'),
    wiredep = require('wiredep')(),
    path = require('path');

    grunt.registerTask('build:assets', function(){
        var src = path.join(process.cwd(), 'src/main/webapp'),
        dest = path.join(process.cwd(), 'build');

        var imageExtentions = ['png', 'jpg', 'gif', 'svg', 'ico'],
        fontExtentions = ['eot', 'woff', 'woff2', 'ttf', 'otf'],
        assetExtentions = imageExtentions.concat(fontExtentions);

        // Move over all assets
        var assetPatterns = [];
        assetExtentions.forEach(function(extention){
            assetPatterns.push('**/*.' + extention);
        });
        glob.sync('{' + assetPatterns.join(',') + '}', {
            cwd: src
        }).forEach(function(file){
            fs.copySync(path.join(src, file), path.join(dest, file));
        });

        mainFilesFromBower(fontExtentions).forEach(function(file){
            var fileName = file.substring(file.lastIndexOf("/"))
            fs.copySync(file, path.join(dest, 'fonts', fileName));
        });
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
                    fonts.push(f);
                }
            }
        }
        return files;
    }
}
