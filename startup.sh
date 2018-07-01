#!/usr/bin/env bash
export SENTRY_SECURITY_TOKEN=$SENTRY_SECURITY_TOKEN

cd static-site
hugo --source="../static-site" --baseURL $HUGO_BASE_URL
npm run gulp

cd ../app

npm run start