## [0.0.7] - 2019-04-26

### Changed
- Updated Dixie from 2.x to 3.x
- Improved DB schema. Added migration
- Improved store (rewritten)

### Fixed
- Unknown for title instead of file name when processing
- small UI cosmetic fixes

## [0.0.6] - 2019-04-25

### Fixed
- Unicode files still not playing
- When library scan is finished route doesn't change
- Fixed a way processing is working

### Changed
- Other UI fixes

## [0.0.5] - 2019-04-25

### Fixed
- Page crashes while scanning library #20
- Requesting files by name in Dropbox with utf-8 cause error #17

### Changed
- Added id requests to Dropbox instead of file names


## [0.0.4] - 2019-04-25

### Changed
- New UI
- Dropped element UI, photon

### Added
- Lottie
- Handle Service Worker Update
- Ability to install Application issue #1

### Fixed
- fixed #10
- fixed #19
- Process now adding to collection all files
- Show progress only if it's available

## [0.0.3] - 2019-04-21

Site deployed first time to https://boxaudio.app

### Added
- caching to service worker issue #2
- SSL certs for local development
- SSL generating script
- gzip compression
- Apache 2 HTTP 2 deployment instructions 

### Changed
- bundle size reduced. Routes split into chunks
- improved loader component issue #12


## [0.0.2] - 2019-04-18

### Fixed
- aurora.js issue with HTTP
- music-metadata-browser package. Released new @industral/music-metadata-browser with fix

### Changed
- moved app to separate folder
- App icons
- App name
- reference to aurora.js
- README

### Cleanup
- removed console.log


## [0.0.1] - 2019-04-17

### Added
- Initial version of player. It just PoC. Lots of bugs and issues
