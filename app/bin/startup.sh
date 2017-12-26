#!/usr/bin/env bash
npm run gulp
ls /usr/src/static-site
hugo --source="../static-site" --baseURL $HUGO_BASE_URL
npm start