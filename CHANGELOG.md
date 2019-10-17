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
