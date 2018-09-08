#!/usr/bin/env bash
set -ex
npm run build --prefix /usr/src/app
npm run start --prefix /usr/src/app