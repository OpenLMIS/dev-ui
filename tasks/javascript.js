
module.exports = function(grunt){
    var fs = require('fs-extra'),
    path = require('path'),
    Concat = require('concat-with-sourcemaps'),
    convertSourceMap = require('convert-source-map'),
    wiredep = require('wiredep'),
    glob = require('glob');

    grunt.registerTask('build:openlmis.js', function(){
        
        var concat = new Concat(true, 'openlmis.js', '\n');

        // Set general file patterns we want to ignore
        var ignorePatterns = [
            '**/*.spec.js', // don't include tests
            'app.js', // should be generated
            'app.routes.js' // should be generated
        ];
        // Helper function to keep ordered file adding clear
        function addFiles(pattern){
            glob.sync(pattern, {
                cwd: path.join(process.cwd(), 'src/main/webapp'),
                ignore: ignorePatterns
            }).forEach(function(file){
                var filePath = path.join(process.cwd(), 'src/main/webapp', file);

                // Don't let previously added patterns be added again
                ignorePatterns.push(pattern);
                
                var contentBuffer = fs.readFileSync(filePath);
                concat.add(file, contentBuffer);
            });
        }

        wiredep().js.forEach(function(file){
            var contentBuffer = fs.readFileSync(file);
            concat.add(file, contentBuffer);
        });

        addFiles('**/*.module.js');
        addFiles('**/*.config.js');
        addFiles('**/*.routes.js');
        addFiles('**/*.js');

        var inlineSourceMap = convertSourceMap.fromJSON(concat.sourceMap).toComment();
        concat.add(null, inlineSourceMap);
        
        fs.mkdirSync('build');
        fs.writeFileSync('build/openlmis.js', concat.content);
    });
}
