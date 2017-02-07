(function(){
    "use strict";
    var path = require('path'),
    changeCase = require('change-case'),
    glob = require('glob'),
    fs = require('fs-extra'),
    Applause = require('applause');

    module.exports = function(grunt){
        return replaceFiles;

        function replaceFiles(pattern, cwd){
            var applause = Applause.create({
                patterns: getPatterns()
            });

            glob.sync(pattern,{
                cwd: cwd
            }).forEach(function(file){
                var filePath = path.join(cwd, file);

                var contents = grunt.file.read(filePath, "utf8");

                var result = applause.replace(contents);
                if(result && result.count > 0){
                    grunt.file.write(filePath, result.content);
                    console.log('- ' + file + ': ' + result.count + ' replacements');
                }
            });
        }

        function getPatterns(){
            var patterns = [];
            grunt.option.flags().forEach(function(flag){
                var key = flag.substring(2, flag.indexOf('='));
                var value = flag.substring(flag.indexOf('=')+1);

                if(key != ''){
                    patterns.push({
                        match: changeCase.constantCase(key),
                        replace: value
                    });
                }

            });
            return patterns;
        }

    };

})();