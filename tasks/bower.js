module.exports = function(grunt){
	const exec = require('child_process').execSync;
	var eachAppDir = require('../ordered-application-directory.js');

	grunt.registerTask('bower', function(){
		eachAppDir(function(dir){
			exec('rm -rf bower_components');
			exec('bower install --allow-root');
		});
	});

}