module.exports = function(grunt){
	grunt.registerTask('default', [
		'bower',
		'build',
		'karma:unit'
	]);
}