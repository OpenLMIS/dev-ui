module.exports = function(grunt){
	
	grunt.initConfig({
		// ... nothing here ...
	});

	grunt.option('applicationDirectories', [
		'/openlmis/dev-ui'
		]);

	grunt.loadTasks('./tasks');
}