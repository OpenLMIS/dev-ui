module.exports = function(grunt){
	grunt.loadTasks('./tasks');

	grunt.registerTask('default', [
		'build:clean',
    'build:bower',
		'build:openlmis.js',
		'build:openlmis.css'
    ]);



  // grunt.registerTask('serve', ['serve:proxy', 'connect:server']);

  // var buildTasks = ['clean', 'ngtemplates', 'copy', 'concat', 'sass', 'replace', 'appcache'];
  // var styleguideTasks = ['kssSetup', 'kss', 'copy:kssCopyAppAssets'];

  // var fullBuildTasks = [].concat(buildTasks);
  // if(grunt.option('production')) fullBuildTasks.push('uglify');
  // if(!grunt.option('noTest') && !grunt.option('appOnly')) fullBuildTasks.push('karma:unit');
  // if(!grunt.option('noStyleguide') && !grunt.option('appOnly')) fullBuildTasks = fullBuildTasks.concat(styleguideTasks);
  // if(!grunt.option('noDocs') && !grunt.option('appOnly')) fullBuildTasks.push('ngdocs');

  // grunt.registerTask('build', fullBuildTasks);

  // grunt.registerTask('check', ['clean', 'jshint', 'sasslint']);

  // grunt.registerTask('docs', ['build'].concat('ngdocs'));
  // grunt.registerTask('styleguide', buildTasks.concat(styleguideTasks));

}