
module.exports = function(grunt){
    var fs = require('fs-extra'),
    replace = require('replace'),
    path = require('path'),
    Concat = require('concat-with-sourcemaps'),
    convertSourceMap = require('convert-source-map'),
    wiredep = require('wiredep'),
    glob = require('glob'),
    sass = require('node-sass');

    grunt.registerTask('build:openlmis.css', function(){
        var concat = new Concat(true, 'openlmis.css', '\n');

        var bowerCss = wiredep().css || [];
        var bowerScss = wiredep().scss || [];

        // Include paths are the directories imported sass files live in
        // so that import statements in the files will work correctly
        var includePaths = require('node-bourbon').includePaths; // because this is an array, we start here
        bowerScss.forEach(function(filePath){
            var fileDirectory = filePath.substring(0, filePath.lastIndexOf("/"));
            includePaths.push(fileDirectory);
        });

        
        // Set general file patterns we want to ignore
        var ignorePatterns = [];
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

        addFiles('**/*variables.scss');

        bowerCss.concat(bowerScss).forEach(function(file){
            var contentBuffer = fs.readFileSync(file);
            concat.add(file, contentBuffer);
        });

        addFiles('**/mixins.scss');
        addFiles('**/*.scss');
        addFiles('**/*.css');

        // TODO: Write/add sourcemaps

        fs.writeFileSync('build/openlmis.scss', concat.content);

        var sassResult = sass.renderSync({
            data: concat.content.toString(),
            includePaths: includePaths
        });

        fs.writeFileSync('build/openlmis.css', sassResult.css);

        // remove non-relative strings
        replace({
            regex: '../',
            replacement: '',
            paths:['build/openlmis.css']
        });
    });
}
