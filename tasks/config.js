module.exports = function(grunt){
    var extend = require('extend'),
    path = require('path'),
    inEachDir = require('../ordered-application-directory');

    var config = {};
    inEachDir(function(dir){
        var json = grunt.file.readJSON(path.join(dir, 'config.json'));
        if(json){
            config = extend(true, config, json);
        }
    });

    setGruntOptions(config);

    function setGruntOptions(config, prefix){
        var configKey = '';
        for(var key in config){
            if (prefix) {
                configKey = [prefix, key].join('.');
            } else {
                configKey = key;
            }

            if(config[key] !== null && typeof config[key] === 'object' && !Array.isArray(config[key])){
                setGruntOptions(config[key], configKey);
            } else {
                // Don't set values that are already set,
                // they might be from the command line
                if(!grunt.option(configKey)){ 
                    grunt.option(configKey, config[key]);
                }    
            }
            
        }
    }
}