module.exports = function(grunt){
	const exec = require('child_process').execSync;
	var eachAppDir = require('/openlmis/dev-ui/ordered-application-directory.js');

	grunt.registerTask('build:bower', function(){
		eachAppDir(function(dir){
			exec('bower install --allow-root');
		});
	});

}