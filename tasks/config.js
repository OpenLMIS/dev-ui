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
    console.log(config);
    for(var key in config){
        // Don't set values that are already set,
        // they might be from the command line
        if(!grunt.option[key]){ 
            grunt.option(key, config[key]);
        }
    } 
}