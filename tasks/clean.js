module.exports = function(grunt){
	var fs = require('fs-extra');

	grunt.registerTask('clean', function(){
		fs.emptyDirSync('build');
		fs.emptyDirSync('.tmp');
	});
}