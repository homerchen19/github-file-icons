# 4.3.2

- bump xml2js

# 4.2.2

- another fix for cleanOnExit

# 4.2.1

- better cleanOnExit, thanks to @Gusted

# 4.2.0

- Drop a lot of dependencies, thanks to @fregante

# 4.1.0

- remove jetpack dependency (thanks to @rpl)
- update deps, thanks to @fregante

# 4.0.0

- `archiver` Major update (security fix)

# 3.0.0

Drop support for node 6 and 8. Now tested against 10, 12 and 14.

# 2.0.0

- WebExtensions with package.json should not be classified as JetPack addon, thanks to @photonios

# 1.3.1

- fix regExp for parsing `user_pref`, thanks to @hbenl

# 1.3.0

- update deps

# 1.2.0

- update deps
- drop support for node 4 (travis tests)

# 1.1.0

- update deps (big jump)
- test with nodejs 8

# 1.0.3

- more TS typing fixes

# 1.0.2

- fix TS typings and example in README

# 1.0.1

- Update async from 2.3.0 to 2.4.1 (thanks @EsrefDurna)

# 1.0.0

- BREAKING CHANGE: handle errors in `encoded(cb)` callback function

# 0.5.0

- Make sure to load user settings if existing profile (thanks @lutostag)
- Drop support for node 0.12

# 0.4.9

- better tmp folder cleanup (thanks @Foxhind)

# 0.4.8

- fix `archiver.bulk()` deprecation warning (thanks @zdglagola)

# 0.4.7

- remove `os.tmpDir` deprecation warning (thanks @pdehaan)

# 0.4.6

- (better) fix ctl-c exit

# 0.4.5 - DO NOT USE - BROKEN

- fix ctl-c exit

# 0.4.4

- package update: node-uuid --> uuid

# 0.4.3

- add webexension support (thanks @hbenl)
- add Typescript (thanks @hbenl)
- updated dependencies versions

# 0.4.2

- add `encode` method to make it compatible with `selenium-webdriver`

# 0.4.1

- fix CLI empty profile creation

# 0.4.0

- remove [`wrench`](https://github.com/ryanmcgrath/wrench-js) dependency (no longer maintained), replaced by [`fs-extra`](https://github.com/jprichardson/node-fs-extra)
- updated package versions

# 0.3.13

- updated package versions

# 0.3.12

- bugfix with unziped extensions
- CI now against node 0.12 and 4.4
- updated package versions

# 0.3.11

- added a cli to create or copy profile

# 0.3.10

- added .npmignore

# 0.3.9

- updated package versions

# 0.3.8

- user preferences parsing fix (thanks @cadorn)
- updated package versions

# 0.3.7

- updated package versions

# 0.3.6

- updated package versions

# 0.3.5

- updated package versions

# 0.3.4

- updated package versions
- fixes SIGINT and exit process (thanks @XrXr)

# 0.3.3

- minor fixes, added tests for ProfileFinder

# 0.3.2

- modify some callbacks to follow the standard `(err, resp)`

# 0.3.1

- ability to specify a destination directory

# 0.2.13

- normalize extension path (thanks @halo2376)

# 0.2.12

- catching profileDir delete errors on exit

# 0.2.10

- made most of the fs calls asynchronous

# 0.2.9

- support for jetpack extensions (jpm now in beta) (thanks @jsantell)

# 0.2.8

- updated package versions.
- dropping support for nodejs 0.8.

# 0.2.7

- updated package versions + fixed coverage report

# 0.2.6

- deps version update

# 0.2.5

- fixed packed extension (thanks @jsantell)
- allowed support for the new jetpack extensions that use package.json instead of install.rdf (thanks @jsantell)

# 0.2.4

- updatePreferences() call is no longer required, it is automatically called by encoded() if needed

# 0.2.3

- update package versions (archiver)

# 0.2.2

- fixed other Windows path issues (contribution from [testingBot](https://github.com/testingbot))

# 0.2.1

- setAcceptUntrustedCerts and setAssumeUntrustedCertIssuer now expects real boolean (contribution from [testingBot](https://github.com/testingbot))

# 0.2.0

- Fixed Windows support

# 0.1.1

- fixed potential EMFILE when installing multiple extensions (contribution from https://github.com/circusbred)

# 0.1.0

- more unit tests, added integration tests, saucelabs

# 0.0.4

- added addExtensions(array, callback) method
- EMFILE bug fix
- added basic tests for encoded()

# 0.0.3

- encoded is now asynchronous (adm-zip to node-archiver constraints to zip profile)
