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
    grunt.registerTask('reports', makeSonarReports);

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
};