module.exports = function(grunt){
    var path = require('path'),
    changeCase = require('change-case'),
    glob = require('glob'),
    fs = require('fs-extra'),
    Applause = require('applause');

    var dest = grunt.option('app.dest');

    grunt.registerTask('replace', function(){
        var applause = Applause.create({
            patterns: getPatterns()
        })
        var dir = grunt.option('app.dest');

        glob.sync('{*.js, *.css, *.html}',{
            cwd: dir
        }).forEach(function(file){
            var filePath = path.join(dir, file);

            var contents = grunt.file.read(filePath);
            result = applause.replace(contents);
            grunt.file.write(filePath, result.content);
        });
    });

    function getPatterns(){
        var patterns = [];
        grunt.option.flags().forEach(function(flag){
            var key = flag.substring(2, flag.indexOf('='));
            var value = flag.substring(flag.indexOf('=')+1);

            patterns.push({
                match: changeCase.constantCase(key),
                replace: value
            });

        });
        return patterns;
    }
}