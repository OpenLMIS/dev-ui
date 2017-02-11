module.exports = function(grunt){
	const exec = require('child_process').execSync;
	var eachAppDir = require('../ordered-application-directory.js'),
	extend = require('extend'),
	path = require('path');

	grunt.registerTask('bower', function(){
		var bowerObj;
		eachAppDir(function(dir){
			var obj = grunt.file.readJSON(path.join(dir, 'bower.json'));
			if(obj && !bowerObj){
				bowerObj = obj;
			} else {
				extend(true, bowerObj, obj);
			}
		});

		var cwd = process.cwd();
		process.chdir(grunt.option('app.tmp'));

		grunt.file.write('bower.json', JSON.stringify(bowerObj, null, 2));

		exec('rm -rf bower_components');
		exec('bower install --allow-root', {
			stdio: 'inherit' // Shows output as its generated
		});

		process.chdir(cwd);
	});

}