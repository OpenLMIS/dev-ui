/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

module.exports = function(grunt){
    var extend = require('extend'),
        path = require('path'),
        changeCase = require('change-case'),
        inEachDir = require('../ordered-application-directory');

    var config = {};
    inEachDir(function(dir){
        var json = grunt.file.readJSON(path.join(dir, 'config.json'));
        if(json){
            config = extend(true, config, json);
        }
    });

    config.openlmisBuildDate = new Date().toISOString();

    setGruntOptions(config);

    function setGruntOptions(config, prefix){
        var configKey = '',
            constKey = '';
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
                    constKey = changeCase.constantCase(configKey);
                    // If an environment variable matches a config.json value,
                    // the environment variable overwrites the config.json property
                    if(process.env[constKey]) {
                        grunt.option(configKey, process.env[constKey]);
                    } else {
                        grunt.option(configKey, config[key]);
                    }
                }
            }

        }
    }
};
