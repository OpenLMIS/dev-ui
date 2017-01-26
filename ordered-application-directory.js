
// A function that will call the provided function in each directory
// that is defined in orderedBuildDirectories in config.js
module.exports = function(fn){
    var config = require(process.cwd() + '/config.json');

    if(!config || !config.orderedBuildDirectories || !Array.isArray(config.orderedBuildDirectories)){
    	console.log('Error: No orderedBuildDirectories');
    	return false;
    }
    var applicationDirectories = config.orderedBuildDirectories;

    var originalCwd = process.cwd();
    applicationDirectories.forEach(function(dir){
        process.chdir(dir);
        fn(dir);
    });
    process.chdir(originalCwd);
    return true;
}