#!/usr/bin/env bash

# build aurora.js
cd node_modules/av
npm i && make browser

cd ../aac
npm i && make browser

cd ../alac
npm i && make browser

cd ../flac.js
npm i && make browser

cd ../mp3
npm i && make browser
