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
var path = require('path');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    var watchOptions = {
        spawn: false
    };

    var jsTasks = ['javascript', 'webpack'];
    if (!grunt.option('noTest')) {
        jsTasks.push('test');
    }
    if (!grunt.option('noDocs')) {
        jsTasks.push('docs');
    }
    if (!grunt.option('noStyleguide')) {
        jsTasks.push('styleguide');
    }
    addNotify(jsTasks);

    var cssTasks = ['css'];
    if (!grunt.option('noDocs')) {
        cssTasks.push('docs');
    }
    if (!grunt.option('noStyleguide')) {
        cssTasks.push('styleguide');
    }
    addNotify(cssTasks);

    var messageTasks = ['messages'];
    messageTasks = messageTasks.concat(jsTasks);

    var htmlTasks = ['html'];
    htmlTasks = htmlTasks.concat(jsTasks);

    grunt.config('watch', {
        javascript: {
            files: srcFilesWithExtensions(['.js']),
            tasks: jsTasks,
            options: watchOptions
        },
        css: {
            files: srcFilesWithExtensions(['.scss', '.css']),
            tasks: cssTasks,
            options: watchOptions

        },
        messages: {
            files: srcFilesWithExtensions(['.json']),
            tasks: messageTasks,
            options: watchOptions

        },
        html: {
            files: srcFilesWithExtensions(['.html']),
            tasks: htmlTasks,
            options: watchOptions

        }
    });

    grunt.config('notify', {
        watch: {
            options: {
                message: 'Build complete',
                duration: 2
            }
        }
    });

    function srcFilesWithExtensions(extensions) {
        var i, files = [];
        for (i = 0; i < extensions.length; i++) {
            var ext = extensions[i];
            files = files.concat([
                path.join(grunt.option('app.src'), '/**/*' + ext),
                path.join(grunt.option('app.src'), '/*' + ext)
            ]);
        }
        return files;
    }

    function addNotify(tasks) {
        tasks.push('notify:watch');
    }
};