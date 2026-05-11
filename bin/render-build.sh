#!/usr/bin/env bash
set -o errexit

bundle install
npm ci

npm run build
npm run build:css

SECRET_KEY_BASE_DUMMY=1 bundle exec rails assets:precompile
bundle exec rails db:prepare
