#!/usr/bin/env bash
cd static-site
hugo --source="../static-site" --baseURL $HUGO_BASE_URL
npm run gulp

cd ../app

npm run start