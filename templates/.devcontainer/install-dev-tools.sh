#!/usr/bin/env bash

# Define homey package.json 
npm init --quiet -y 1>/dev/null
npm config set init-module ./.npm-init.js
npm init --quiet -y 1>/dev/null

# ESLint config for Athom B.V. JavaScript projects.
npm install --save-dev \
  eslint \
  eslint-config-athom \
  eslint-config-prettier \
  eslint-plugin-prettier \
  prettier

npx install-peerdeps --dev \
  eslint-config-airbnb-base

# Commiting the changes 
git add .
# > cannot write to ./git directory, to be fixed
# git commit -am "Dev-Tools installed"
