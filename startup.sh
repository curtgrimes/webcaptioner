#!/usr/bin/env bash
cd static-site
hugo --source="../static-site" --baseURL $HUGO_BASE_URL
gulp

cd ../app

npm run start