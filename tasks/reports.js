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
    var fs = require('fs-extra'),
        json2csv = require('json2csv'),
        path = require('path'),
        glob = require('glob');

    grunt.registerTask('reports', ['reports:setup', 'reports:files', 'reports:javascript', 'reports:sonar']);

    grunt.registerTask('reports:setup', setupReports);
    function setupReports() {
        fs.mkdirSync('/app/build/reports/');
    }

    grunt.registerTask('reports:sonar', makeSonarReports);
    function makeSonarReports() {
        var done = this.async();
        const SonarWebReporters = require('sonar-web-frontend-reporters').Reporters;

        let sonarWebReporters = new SonarWebReporters('OpenLMIS-UI Reporters', {
            "csslint": {
                "src": "/app/.tmp/css/src/**/*.css",
                "report": "/app/build/reports/sonar/csslint.json",
                "rulesFile": "/dev-ui/.csslintrc"
            },
            "sasslint": {
                "src": "/app/.tmp/css/src/**/*.scss",
                "report": "/app/build/reports/sonar/scsslint.json",
                "rulesFile": "/dev-ui/.sass-lint.yml"
            },
            "htmlhint": {
                "src": "/app/.tmp/html/src/**/*.html",
                "report": "/app/build/reports/sonar/htmlhint.json",
                "rulesFile": "/dev-ui/.htmlhintrc"
            },
            "eslint": {
                "src": "/app/.tmp/javascript/src/**/*.js",
                "report": "/app/build/reports/sonar/eslint.json",
                "rulesFile": "/dev-ui/.eslintrc"
            },
            "eslintangular": {
                "src": "/app/.tmp/javascript/src/**/*.js",
                "report": "/app/build/reports/sonar/eslint-angular.json",
                "rulesFile": "/dev-ui/.eslintrc"
            }
        });

        sonarWebReporters.launchReporters(() => {
          console.log('All reporters have been processed');
          done(true);
        });
    }

    grunt.registerTask('reports:files', makeFilesReport);
    function makeFilesReport() {
        var report = {};

        report['openlmis.js'] = getSizeFor('/app/build/webapp/', 'openlmis.js');
        report['openlmis.css'] = getSizeFor('/app/build/webapp/', 'openlmis.css');
        report['images'] = getSizeFor('/app/build/webapp/', '**/*.svg');
        report['images'] += getSizeFor('/app/build/webapp/', '**/*.png');
        report['fonts'] = getSizeFor('/app/build/webapp/', '**/*.woff');

        var headers = Object.keys(report).sort();
        var csv = json2csv({ data: [report], fields: headers });
        fs.writeFileSync('/app/build/reports/files-report.csv', csv);
    }



    grunt.registerTask('reports:javascript', makeJavascriptReport);
    function makeJavascriptReport() {
        var report = {};

        report['vendor'] = getSizeFor('/app/.tmp/javascript/src/', 'bower_components/**/*');
        report['messages'] = getSizeFor('/app/.tmp/javascript/src/', 'openlmis-config/messages.js');
        report['html'] = getSizeFor('/app/.tmp/javascript/src/', 'openlmis-templates/*');
        report['source'] = getSizeFor('/app/.tmp/javascript/src/', '**/*');

        var headers = Object.keys(report).sort();
        var csv = json2csv({ data: [report], fields: headers });
        fs.writeFileSync('/app/build/reports/javascript-report.csv', csv);
    }

    var alreadyUsed = [],
        lastDir;
    function getSizeFor(dir, pattern) {
        if(dir != lastDir) {
            lastDir = dir;
            alreadyUsed = [];
        }
        var size = 0;

        glob.sync(pattern, {
            cwd: dir,
            ignore: alreadyUsed
        }).forEach(function(file){
            size += getFilesizeInBytes(path.join(dir, file));
            alreadyUsed.push(file);
        });

        return size;
    }

    function getFilesizeInBytes(filename) {
        var stats = fs.statSync(filename)
        return stats.size
    }
};