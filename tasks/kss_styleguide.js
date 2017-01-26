



  // grunt.registerTask('kssSetup', function(){
  //   var done = this.async();
  //   var fse = require('fs-extra');

  //   fse.removeSync('build/styleguide');
  //   fse.removeSync('.tmp/styleguide');
  //   fse.mkdirsSync('.tmp/styleguide');
  //   fse.copySync('node_modules/kss/builder/handlebars', '.tmp/styleguide');
  //   fse.copySync('styleguide/index.hbs', '.tmp/styleguide/index.hbs', {
  //     clobber: true
  //   });
  //   fse.mkdirsSync('build/styleguide');

  //   done();
  // });

  //   kss: {
  //     options: {
  //       title: 'OpenLMIS-UI Styleguide',
  //       homepage: '../../../styleguide/homepage.md',
  //       builder: '.tmp/styleguide/'
  //     },
  //     dist: {
  //       src: [config.styleguide.src],
  //       dest: config.styleguide.dest
  //     }
  //   }
  // });

    //   kssCopyAppAssets: {
    //     expand: true,
    //     cwd: path.join(config.app.dest, 'webapp'),
    //     src: [
    //       'openlmis.js',
    //       'openlmis.js.map',
    //       'favicon.ico',
    //       '*.css',
    //       '**/*.png',
    //       '**/*.gif',
    //       '**/*.json',
    //       'fonts/**/*',
    //       'images/**/*',
    //       'messages/**/*'
    //     ],
    //     dest: config.styleguide.dest
    //   }
    // },