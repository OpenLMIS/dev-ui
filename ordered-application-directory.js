(function(){

    var path = require('path'),
    fs = require('fs');

    var applicationDirectories = [];

    var config = require(path.join(process.cwd(), 'config.json'));
    if(config && config.orderedBuildDirectories && Array.isArray(config.orderedBuildDirectories)){
        applicationDirectories = config.orderedBuildDirectories;
    }

    // Make sure the dev-ui is there
    if(applicationDirectories.indexOf('/dev-ui') == -1){
        applicationDirectories.unshift('/dev-ui');
    }

    // Make sure the current dir is there
    if(applicationDirectories.indexOf(process.cwd()) == -1){
        applicationDirectories.push(process.cwd())
    }

    // A function that will call the provided function in each directory
    // that is defined in orderedBuildDirectories in config.js
    module.exports = function(fn){
        var cwd = process.cwd();

        applicationDirectories.forEach(function(dir){
            if(fs.existsSync(dir)){
                fn(dir);
            }
        });
        process.chdir(cwd);
    }

})();