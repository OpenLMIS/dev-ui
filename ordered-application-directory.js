
// A function that will call the provided function in each directory
// that is defined in orderedApplicationDirectories in config.js
module.exports = function(fn){
    var config = require(process.cwd() + '/config.json');

    if(!config || !config.orderedApplicationDirectories || !Array.isArray(config.orderedApplicationDirectories)){
    	console.log('Error: No orderedApplicationDirectories');
    	return false;
    }
    var applicationDirectories = config.orderedApplicationDirectories;

    var originalCwd = process.cwd();
    applicationDirectories.forEach(function(dir){
        process.chdir(dir);
        fn(dir);
    });
    process.chdir(originalCwd);
    return true;
}