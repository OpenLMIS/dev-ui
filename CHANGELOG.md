9.0.8 / 2025-11-27
==================

Big Fixes:
* [OE-138](https://openlmis.atlassian.net/browse/OE-138): Locked global _ to Underscore to prevent Lodash override

9.0.7 / 2024-10-31
==================

New functionality added in a backwards-compatible manner:
* [CQI-19](https://openlmis.atlassian.net/browse/CQI-19): Added watcher option to the grunt build task.
* [CQI-19](https://openlmis.atlassian.net/browse/CQI-19): Added ES6 support for the front-end modules

9.0.6 / 2023-11-07
==================

9.0.5 / 2023-04-05
==================

9.0.4 / 2022-10-07
==================

9.0.3 / 2021-10-28
==================

Breaking changes:
* [OLMIS-7314](https://openlmis.atlassian.net/browse/OLMIS-7314): Add Webpack and migrate Grunt build to Webpack.
* [OLMIS-7315](https://openlmis.atlassian.net/browse/OLMIS-7315): Add manifest and service worker configuration for PWA.

Improvements:
* [OLMIS-7379](https://openlmis.atlassian.net/browse/OLMIS-7379): Add support for viewport.

9.0.2 / 2021-05-27
==================

Bug fixes:
* [OLMIS-7208](https://openlmis.atlassian.net/browse/OLMIS-7208): Fixed failing unit tests because of incorrect version of jquery and bootstrap-sass.
* Fixed failing unit tests because of micromatch version change.

9.0.1 / 2019-10-17
==================

Bug fixes:
* Fixed failing unit tests because of disconnected headless Chrome.

9.0.0 / 2019-05-27
==================

Breaking changes:
* [OLMIS-5837](https://openlmis.atlassian.net/browse/OLMIS-5837): Replaced PhantomJS launcher with headless Chrome.

8.1.0 / 2018-12-12
==================

Improvements:
* [OLMIS-4388](https://openlmis.atlassian.net/browse/OLMIS-4833): Set up custom ESLint rule set to match our SonarQube configuration.
* [OLMIS-5389](https://openlmis.atlassian.net/browse/OLMIS-5389): Set up custom jasmine rules for ESLint.
* [OLMIS-3696](https://openlmis.atlassian.net/browse/OLMIS-3696): Added dependency and development dependency locking.

8.0.1 / 2018-10-01

Improvements:
* [OLMIS-5235](https://openlmis.atlassian.net/browse/OLMIS-5235): Updated order for loading pouchdb.js and pouchdb.find.js files.

8.0.0 / 2018-08-16
==================

Breaking changes:
* [OLMIS-4795](https://openlmis.atlassian.net/browse/OLMIS-4795): Replace *syncTransifex* grunt option with *pullTransifex* and *pushTransifex*

New functionality added in a backwards-compatible manner:
* Added eslint task (disabled by default, set noLint option to false to launch it with the build and default tasks or use the "grunt eslint" task directly).

Improvements:
* [OLMIS-4750](https://openlmis.atlassian.net/browse/OLMIS-4750): Added Jenkinsfile
* [OLMIS-4805](https://openlmis.atlassian.net/browse/OLMIS-4805): Enabled branch analysis in Sonar

7.0.0 / 2018-04-24
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-3108](https://openlmis.atlassian.net/browse/OLMIS-3108): Refactored transifex sync process.
* [OLMIS-3195](https://openlmis.atlassian.net/browse/OLMIS-3195): Added sonar task.
* [OLMIS-3166](https://openlmis.atlassian.net/browse/OLMIS-3166): Added build date as grunt option.
