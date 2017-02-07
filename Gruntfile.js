module.exports = function(grunt){
    var configSetup = require('./tasks/config.js');
    configSetup(grunt);

    grunt.loadTasks('./tasks');
}