module.exports = function(grunt){
	var fs = require('fs-extra');

	grunt.registerTask('clean', function(){
		fs.emptyDirSync(grunt.option('app.dest'));
		fs.emptyDirSync(grunt.option('app.tmp'));
		fs.emptyDirSync(grunt.option('styleguide.dest'));
		fs.emptyDirSync(grunt.option('docs.dest'));
	});
}