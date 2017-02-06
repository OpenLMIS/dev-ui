
module.exports = function(grunt){
    var fs = require('fs-extra'),
    readline = require('readline'),
    stream = require('stream'),
    path = require('path'),
    replace = require('replace-in-file'),
    changeCase = require('change-case'),
    UglifyJS = require("uglify-js"),
    convertSourceMap = require('convert-source-map'),
    wiredep = require('wiredep'),
    glob = require('glob'),
    inEachAppDir = require('../ordered-application-directory');
    
    var tmpDir = 'js';
    var fileName = 'openlmis.js';

    grunt.registerTask('openlmis.js', ['openlmis.js:copy', 'openlmis.js:build']);

    grunt.registerTask('openlmis.js:copy', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir);

        inEachAppDir(function(dir){
            var src = grunt.option('app.src');
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('**/*.js', {
                cwd: path.join(dir, src),
                ignore: ['**/*.spec.js']
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(tmp, file));
            });

            if(!fs.existsSync(path.join(dir, 'bower_components'))){
                return ;
            }
        });

        var cwd = process.cwd();
        process.chdir(grunt.option('app.tmp'));

        var bowerFiles = wiredep().js || [];
        bowerFiles.forEach(function(file){
            // copy each file into a directory called bower_components
            var bowerPath = file.substring(file.indexOf("bower_components"));
            fs.copySync(file, path.join(tmp, bowerPath));
        });

        process.chdir(cwd);

    });

    grunt.registerTask('openlmis.js:build', function(){
        var tmp = path.join(process.cwd(), grunt.option('app.tmp'), tmpDir),
        toplevel = null, // container for UglifyJS
        source_map = UglifyJS.SourceMap(),
        ignorePatterns = [ // storing patterns to ignore
            'app.js' // must be last
        ];

        // Since we copied all bower components over across bower files,
        // we don't have wiredep's dependency order — so we are just
        // guessing the order
        addFiles('bower_components/**/jquery.js');
        addFiles('bower_components/**/angular.js');
        addFiles('bower_components/**/*.js');

        addFiles('**/*.module.js');
        addFiles('**/*.config.js');
        addFiles('**/*.routes.js');
        addFiles('**/*.js');

        ignorePatterns = [];
        addFiles('app.js');

        toplevel.figure_out_scope();
        var compressed_ast = toplevel.transform(UglifyJS.Compressor());
        var stream = UglifyJS.OutputStream({
            source_map: source_map
        });
        compressed_ast.print(stream);

        var compressedJS = stream.toString() // compressed version of openlmis.js

        if(!grunt.option('production')){
            compressedJS += "\n" + convertSourceMap.fromJSON(source_map.toString()).toComment();
        }
        
        fs.writeFileSync(path.join(grunt.option('app.dest'), fileName), compressedJS);

        // Helper function to keep ordered file adding clear
        function addFiles(pattern){
            glob.sync(pattern, {
                cwd: tmp,
                ignore: ignorePatterns
            }).forEach(function(file){
                var code = fs.readFileSync(path.join(tmp, file), "utf8");
                toplevel = UglifyJS.parse(code, {
                    filename: file,
                    toplevel:toplevel
                });
                source_map.get().setSourceContent(file, code);
            });
            // Don't let previously added patterns be added again
            ignorePatterns.push(pattern);
        }
    });

}
