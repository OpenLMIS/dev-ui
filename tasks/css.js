
module.exports = function(grunt){
	grunt.registerTask('css', function(){
		// Loop through config and build list of paths
		// Paths are loaded in order
		// Include main libraries at top
		// Compile with sass
		// export to build

		 //     'sass': function(){
   // var includePaths = require('node-bourbon').includePaths.concat([
   //      config.app.src,
   //      'bower_components/font-awesome/scss',
   //      'bower_components/bootstrap-sass/assets/stylesheets',
   //      'bower_components/select2/src/scss'
   //  ]);

   //  var bowerCss = wiredep().css;
   //  var bowerSass = wiredep().scss;

   //  var files = [].concat(
   //    [
   //      path.join(config.app.src, "**/*variables.scss"),
   //      path.join(config.app.src, "**/*.variables.scss")
   //    ],
   //    bowerSass,
   //    bowerCss,
   //    [
   //      path.join(config.app.src, "/**/*mixins.scss"),
   //      path.join(config.app.src, "/**/*.mixins.scss"),
   //      path.join(config.app.src, '**/*.css'),
   //      path.join(config.app.src, '**/*.scss'),
   //      "!" + path.join(config.app.src, "webapp/scss/*")
   //    ]);

   //  var outputStyle = "expanded";
   //  if(grunt.option('production')) outputStyle = "compressed";

   //  return gulp.src(files)
   // .pipe(sourcemaps.init())
   //  .pipe(concat({
   //    path:'openlmis.scss'
   //  }))
   //  .pipe(sass({
   //    includePaths: includePaths,
   //    outputStyle: outputStyle,
   //  }))
   //  .pipe(sourcemaps.write())
   //  .pipe(concat('openlmis.css'))
   //  .pipe(sass().on('error', sass.logError))
   //  .pipe(replace('../','')) // remove non-relative strings
   //  //Replace UI-Grid font paths
   //  .pipe(replace('ui-grid.eot','fonts/ui-grid.eot'))
   //  .pipe(replace('ui-grid.ttf','fonts/ui-grid.ttf'))
   //  .pipe(replace('ui-grid.woff','fonts/ui-grid.woff'))
   //  .pipe(replace('ui-grid.svg','fonts/ui-grid.svg'))
   //  //Replace Select2 image locations
   //  .pipe(replace('select2.png','images/select2.png'))
   //  .pipe(replace('select2-spinner.gif','images/select2-spinner.gif'))
   //  .pipe(replace('select2x2.png','images/select2x2.png'))
   //  .pipe(gulp.dest(
   //    path.join(config.app.dest, "webapp")
   //  ));
	});
}
