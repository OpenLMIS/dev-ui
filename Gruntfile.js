module.exports = function(grunt){
	grunt.loadTasks('./tasks');

	grunt.option('buildDirectories', {
		tmp: '.tmp',
		build: 'build',
		src: 'src'
	})
}