
// A function that will call the provided function in each directory
// that is defined in orderedBuildDirectories in config.js
module.exports = function(fn){
    var cwd = process.cwd();

    var applicationDirectories = [];

    var config = require(cwd + '/config.json');
    if(config && config.orderedBuildDirectories && Array.isArray(config.orderedBuildDirectories)){
        applicationDirectories = config.orderedBuildDirectories;
    }

    // Make sure the dev-ui is there
    if(applicationDirectories.indexOf('/dev-ui') == -1){
        applicationDirectories.unshift('/dev-ui');
    }

    // Make sure the current dir is there
    if(applicationDirectories.indexOf(cwd) === -1){
        applicationDirectories.push(cwd)
    }

    applicationDirectories.forEach(function(dir){
        process.chdir(dir);
        fn(dir);
    });
    process.chdir(cwd);
    return true;
}