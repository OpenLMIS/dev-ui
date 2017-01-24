
module.exports = function(grunt){

	// Loop through each config folder

	// Load app files in order - per config folder (pulling in wiredep things)

	// Concat app files -- all openlmis.js


	       //    var appFiles = [
        //     // Module registration
        //     config.app.src + '/webapp/**/module/*.js',
        //     config.app.src + '/webapp/**/*.module.js',
        //     // Legacy files
        //     config.app.src + '/webapp/js/shared/util.js',
        //     config.app.src + '/webapp/js/shared/*.js',
        //     config.app.src + '/webapp/js/shared/services/services.js',
        //     config.app.src + '/webapp/js/shared/**/*.js',
        //     // Special file types....
        //     config.app.src + '/webapp/**/*.config.js',
        //     config.app.src + '/webapp/**/*.routes.js',
        //     '!' + config.app.src + '/webapp/app.routes.js',
        //     // Everything else
        //     config.app.src + '/webapp/**/*.js',
        //     '!' + config.app.src + '/**/*.spec.js',
        //     '!' + config.app.src + '/webapp/app.js',
        //     '!' + config.app.src + '/webapp/app.routes.js',
        //     // Run time
        //     // NEED file to declare openlmis-app
        //     config.app.src + '/webapp/app.js',
        //     config.app.src + '/webapp/app.routes.js'
        //   ];
        //   // hack to make jquery load first
        //   return [
        //       'bower_components/jquery/dist/jquery.js',
        //       'bower_components/jquery-ui/jquery-ui.js'
        //     ].concat(
        //       wiredep().js,
        //       [
        //         'vendor/ng-grid-2.0.7.min.js',
        //         'vendor/base2.js'
        //       ],
        //       appFiles
        //     );
        // }(),
        // dest: config.app.dest + '/webapp/openlmis.js'
}
