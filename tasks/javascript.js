
module.exports = function(grunt){
    var fs = require('fs-extra'),
    path = require('path'),
    Concat = require('concat-with-sourcemaps'),
    convertSourceMap = require('convert-source-map'),
    wiredep = require('wiredep'),
    glob = require('glob');

    var inEachAppDir = require('../ordered-application-directory');
    var tmpDir = path.join(process.cwd(), '.tmp', 'js');

    grunt.registerTask('build:openlmis.js', function(){

        copyFiles(tmpDir);
        buildJs('openlmis.js', path.join(process.cwd(), 'build'));

        // replaceSettings
        // Uglify


    // replace: {
    //   serverurl: {
    //     src: [config.app.dest + '/webapp/**/*.js'],
    //     overwrite: true,
    //     replacements: [{
    //       from: '@@OPENLMIS_SERVER_URL',
    //       to: makeURL('openlmisServerURL')
    //     },{
    //       from: '@@AUTH_SERVICE_URL',
    //       to: makeURL('authServiceURL')
    //     },{
    //       from: '@@REQUISITION_SERVICE_URL',
    //       to: makeURL('requisitionServiceURL')
    //     },{
    //       from: '@@FULFILLMENT_SERVICE_URL',
    //       to: makeURL('fulfillmentServiceURL')
    //     },{
    //       from: '@@PAGE_SIZE',
    //       to: config['pageSize']
    //     }]
    //   }

        
    });

    function copyFiles(dest){
        inEachAppDir(function(dir){
            var src = 'src';
            var config = grunt.file.readJSON(path.join(dir, 'config.json'));
            if(config && config.app && config.app.src) src = config.app.src;

            glob.sync('**/*.js', {
                cwd: path.join(dir, src),
                ignore: ['**/*.spec.js']
            }).forEach(function(file){
                fs.copySync(path.join(dir, src, file), path.join(dest, file));
            });

            var bowerFiles = wiredep().js || [];
            bowerFiles.forEach(function(file){
                // copy each file into a directory called bower_components
                var bowerPath = file.substring(file.indexOf("bower_components"));
                fs.copySync(file, path.join(dest, bowerPath));
            });
        });
    }

    function buildJs(fileName, dir){
        var concat = new Concat(true, fileName, '\n');

        // Set general file patterns we want to ignore
        var ignorePatterns = [
            'app.js', // must be last
            'app.routes.js' // must be last
        ];
        // Helper function to keep ordered file adding clear
        function addFiles(pattern){
            glob.sync(pattern, {
                cwd: tmpDir,
                ignore: ignorePatterns
            }).forEach(function(file){
                var filePath = path.join(tmpDir, file);

                // Don't let previously added patterns be added again
                ignorePatterns.push(pattern);
                
                var contentBuffer = fs.readFileSync(filePath);
                concat.add(file, contentBuffer);
            });
        }

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

        var inlineSourceMap = convertSourceMap.fromJSON(concat.sourceMap).toComment();
        concat.add(null, inlineSourceMap);
        
        fs.writeFileSync(path.join(dir, fileName), concat.content);
    }
}
