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

/*
 * Lets karma run specs for the React components.
 *
 * The karma task feeds the browser plain script tags - `.tmp/javascript/src/**\/*.js` plus the
 * copied `*.spec.js` files - so the `.jsx` sources never reach it: they are ES modules containing
 * JSX and only ever get transpiled on the way into the webpack app bundle, which karma explicitly
 * excludes. That is why static analysis reports no coverage at all on `.jsx` files.
 *
 * This bundles the `*.spec.jsx` files of every application directory (and everything they import,
 * React included) into a single plain script that karma can load like any other file, and
 * instruments the sources it pulls in on the way through.
 */
module.exports = function(grunt) {
    var path = require('path'),
        glob = require('glob'),
        webpack = require('webpack'),
        inEachAppDir = require('../ordered-application-directory');

    var devUiDir = path.join(__dirname, '..'),
        bundleName = 'react-tests.js',
        specPattern = '**/*.spec.jsx';

    grunt.registerTask('test:react', function() {
        var done = this.async(),
            sourceDirs = applicationSourceDirectories(),
            specs = findSpecs(sourceDirs);

        if (!specs.length) {
            grunt.log.writeln('No React specs found, skipping.');
            done();
            return;
        }

        grunt.log.writeln('Bundling ' + specs.length + ' React spec file(s) for karma.');

        addBundleToKarmaFiles();

        webpack(webpackConfig(specs, sourceDirs), function(error, stats) {
            if (error) {
                grunt.fail.warn(error);
                done(false);
                return;
            }

            grunt.log.writeln(stats.toString({
                colors: true,
                modules: false,
                chunks: false,
                children: false
            }));

            done(!stats.hasErrors());
        });
    });

    /*
     * karma:unit reads its file list when it runs, so handing it the bundle from here - rather than
     * along with the rest of the karma configuration - keeps it from warning about a pattern that
     * matches nothing in the applications that have no React specs.
     */
    function addBundleToKarmaFiles() {
        var files = grunt.config('karma.options.files') || [],
            bundle = path.join(grunt.option('app.tmp'), 'javascript', bundleName);

        if (files.indexOf(bundle) === -1) {
            grunt.config('karma.options.files', files.concat(bundle));
        }
    }

    /* The React sources sit next to the Angular ones, in the src directory of each app dir. */
    function applicationSourceDirectories() {
        var dirs = [];

        inEachAppDir(function(dir, dirConfig) {
            var src = grunt.option('app.src');
            if (dirConfig && dirConfig.app && dirConfig.app.src) {
                src = dirConfig.app.src;
            }

            dirs.push(path.join(dir, src));
        });

        return dirs;
    }

    function findSpecs(sourceDirs) {
        return sourceDirs.reduce(function(specs, dir) {
            return specs.concat(glob.sync(specPattern, {
                cwd: dir
            })
                .map(function(spec) {
                    return path.join(dir, spec);
                }));
        }, []);
    }

    function webpackConfig(specs, sourceDirs) {
        var cwd = process.cwd(),
            tmp = grunt.option('app.tmp');

        return {
            mode: 'development',
            devtool: false,
            context: cwd,
            entry: specs,
            output: {
                path: path.join(cwd, tmp, 'javascript'),
                filename: bundleName
            },
            resolve: {
                extensions: ['.js', '.jsx'],
                /*
                 * The React packages come from the yarn install the `yarn` task drops in
                 * `.tmp/node_modules`; babel's runtime helpers come from whichever npm tree has
                 * them - the application's own, or the one this image ships.
                 */
                modules: [
                    path.join(cwd, tmp, 'node_modules'),
                    path.join(cwd, 'node_modules'),
                    path.join(devUiDir, 'node_modules'),
                    'node_modules'
                ]
            },
            module: {
                rules: [{
                    /*
                     * UMD libraries check for an AMD loader first, and webpack answers that check
                     * truthfully, which sends them down a branch that publishes them on the window
                     * - lodash lands on `_` and takes the global underscore the Angular sources
                     * expect with it. The application bundle never notices because index.js locks
                     * `_` down, and karma excludes index.js. Turning AMD off leaves those
                     * libraries on their CommonJS branch, where they touch nothing global.
                     */
                    parser: {
                        amd: false
                    }
                }, {
                    include: sourceDirs,
                    oneOf: [
                        {
                            /* The specs themselves are not part of the coverage figure. */
                            test: /\.spec\.jsx$/,
                            use: [babelLoader()]
                        },
                        {
                            test: /\.jsx?$/,
                            use: [
                                path.join(devUiDir, 'istanbul-loader.js'),
                                babelLoader()
                            ]
                        }
                    ]
                }]
            },
            /* Karma already has angular and jQuery on the page. */
            externals: {
                angular: 'angular',
                jquery: 'jQuery'
            },
            performance: {
                hints: false
            },
            stats: 'errors-warnings'
        };
    }

    function babelLoader() {
        return {
            loader: require.resolve('babel-loader'),
            options: {
                babelrc: false,
                configFile: false,
                /*
                 * Keeps every statement on the line it came from, which is what makes the coverage
                 * the istanbul loader records line up with the original .jsx.
                 */
                retainLines: true,
                presets: [
                    [require.resolve('@babel/preset-env'), {
                        /*
                         * ES5 out, so istanbul 0.4's esprima can parse what it has to instrument.
                         * babel-loader tells preset-env that webpack understands ES modules, which
                         * would otherwise leave the import/export statements in place.
                         */
                        modules: 'commonjs',
                        targets: {
                            ie: '11'
                        }
                    }],
                    require.resolve('@babel/preset-react')
                ],
                /*
                 * Pulls babel's helpers in from @babel/runtime rather than inlining them. Inlined,
                 * they are attributed to the import lines of the file being instrumented and their
                 * internals - typeof Symbol guards and the like - swamp its branch count with
                 * conditions no test can ever reach.
                 */
                plugins: [
                    [require.resolve('@babel/plugin-transform-runtime'), {
                        helpers: true,
                        regenerator: false
                    }]
                ]
            }
        };
    }
};
