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

    grunt.loadNpmTasks('grunt-webpack');

    var webpackConfig = require('../webpack.config');
    var dest = path.join(process.cwd(), grunt.option('app.dest'));
    var src = path.join(process.cwd(), grunt.option('app.tmp'));
    var assets = path.join(src, 'assets');
    var entry = path.join(src, 'javascript', 'src', 'index.js');

    var MiniCssExtractPlugin = require('mini-css-extract-plugin');
    var { CleanWebpackPlugin } = require('clean-webpack-plugin');
    var CopyPlugin = require("copy-webpack-plugin");
    var TerserPlugin = require('terser-webpack-plugin');
    var WorkboxWebpackPlugin = require("workbox-webpack-plugin");

    grunt.initConfig({
        webpack: {
            conf: Object.assign(webpackConfig, {
                mode: grunt.option('production') ? 'production' : 'development',
                entry: entry,
                output: {
                    path: dest,
                    filename: 'openlmis.js',
                },
                plugins: [
                    new CleanWebpackPlugin(),
                    new MiniCssExtractPlugin({
                        filename: 'openlmis.css',
                    }),
                    new CopyPlugin({
                        patterns: [
                            {
                                from: path.join(assets, 'favicon.ico'),
                                to: dest
                            },
                            {
                                from: path.join(assets, 'favicon-32.png'),
                                to: dest
                            },
                            {
                                from: path.join(assets, 'favicon-156.png'),
                                to: dest
                            },
                            {
                                from: path.join(assets, 'icon-192.png'),
                                to: dest
                            },
                            {
                                from: path.join(assets, 'icon-512.png'),
                                to: dest
                            },
                            {
                                from: path.join(assets, 'manifest.json'),
                                to: dest
                            },
                        ],
                    }),
                    new WorkboxWebpackPlugin.InjectManifest({
                        swSrc: path.join(src, 'javascript', 'src', 'src-sw.js'),
                        swDest: path.join(dest, 'sw.js')
                    }),
                ],
                resolve: {
                    extensions: ['.js', '.jsx'],
                    alias: {
                        react: path.join(src, 'node_modules', 'react')
                    },
                },
            }, grunt.option('production') ?
              {
                  optimization: {
                      minimizer: [
                          new TerserPlugin({
                              terserOptions: {
                                  mangle: false,
                              },
                          }),
                      ],
                  },
              } : { devtool: 'cheap-source-map' })
        },
    });

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
                if(grunt.option(configKey) === undefined || grunt.option(configKey) === null) {
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
