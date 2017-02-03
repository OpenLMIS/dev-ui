module.exports = function(grunt){
    var path = require('path'),
    fs = require('fs-extra'),
    glob = require('glob'),
    inEachAppDir = require('../ordered-application-directory');

    grunt.loadNpmTasks('grunt-kss');

    var dest = path.join(process.cwd(), grunt.option('styleguide.dest'));
    var tmpDir = path.join(process.cwd(), grunt.option('app.tmp'), 'styleguide');
    var title = grunt.option('styleguide.title');
    var src = path.join(grunt.option('app.tmp'), 'css', 'src');

    grunt.config('kss', {
        options: {
            title: 'OpenLMIS-UI Styleguide',
            homepage: '../../../styleguide/homepage.md',
            builder: '.tmp/styleguide/'
        },
        dist: {
            src: [src],
            dest: dest
        }
    });

    grunt.registerTask('styleguide', function(){
        if(!grunt.option('appOnly') && !grunt.option('noStyleguide')){
            grunt.task.run(['styleguide:copy', 'kss']);
        }
    });

    grunt.registerTask('styleguide:copy', function(){
        fs.mkdirsSync(tmpDir);
        fs.mkdirsSync(dest);

        fs.copySync(path.join(process.cwd(), 'node_modules/kss/builder/handlebars'), tmpDir);
        inEachAppDir(function(dir){
            indexHbs = path.join(dir, 'styleguide/index.hbs');
            if(fs.existsSync(indexHbs)){
                fs.copySync(indexHbs, path.join(tmpDir, 'index.hbs'), {
                   clobber: true
                });
            }
        });

        glob.sync('**/*', {
            ignore: [
                'index.html',
                'manifest.appcache'
            ],
            nodir: true,
            cwd: path.join(process.cwd(), grunt.option('app.dest'))
        }).forEach(function(filePath){
            fs.copySync(path.join(process.cwd(), grunt.option('app.dest'), filePath), path.join(dest, filePath));
        });

    });
}