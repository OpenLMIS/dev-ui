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

    grunt.registerTask('reports', ['reports:javascript']);

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

    grunt.registerTask('reports:javascript', makeJavascriptReport);
    function makeJavascriptReport() {
        var report = {};

        report['vendor'] = getFileReportFor('/app/.tmp/javascript/src/bower_components');

        report['messages'] = {
            count: 1,
            size: getFilesizeInBytes('/app/.tmp/javascript/src/openlmis-config/messages.js')
        };

        report['html'] = getFileReportFor('/app/.tmp/javascript/src/openlmis-templates');

        report['source'] = getFileReportFor('/app/.tmp/javascript/src/', [
            'bower_components/*',
            'openlmis-config/messages.js',
            'openlmis-templates/*'
            ]);

        var headers = Object.keys(report).sort();
        
        var filesize = {};
        headers.forEach(function(key){
            console.log(key + ": " + report[key].size);
            filesize[key] = report[key].size;
        });

        var csv = json2csv({ data: [filesize], fields: headers });
        console.log(csv);
 
        fs.writeFileSync('/app/build/reports/javascript-report.csv', csv);
    }

    function getFileReportFor(dir, ignorePaths) {
        if(!ignorePaths) ignorePaths = [];

        var report = {
            count: 0,
            size: 0
        }

        glob.sync('**/*', {
            cwd: dir,
            ignore: ignorePaths
        }).forEach(function(file){
            report.count += 1;
            report.size += getFilesizeInBytes(path.join(dir, file));
        });

        return report;
    }

    function getFilesizeInBytes(filename) {
        var stats = fs.statSync(filename)
        return stats.size
    }
};