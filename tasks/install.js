module.exports = function(grunt){
	const execSync = require('child_process').execSync;

	grunt.registerTask('install', function(){
		var applicationDirectories = grunt.option('applicationDirectories');

		var originalDirectory = process.cwd();
		applicationDirectories.forEach(function(dir){
			process.chdir(dir);
			console.log('# ' + dir);
			
			var resultBuffer = execSync('bower install --allow-root');
			console.log(resultBuffer.toString());
		});
		process.chdir(originalDirectory);
	});
}