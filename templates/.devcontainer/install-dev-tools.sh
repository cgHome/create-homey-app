#!/usr/bin/env bash

# Define homey package.json 
npm init --quiet -y 1>/dev/null
npm config set init-module ./.npm-init.js
npm init --quiet -y 1>/dev/null

# ESLint config for Athom B.V. JavaScript projects.
npm install --save-dev \
   prettier \
   eslint \
   eslint-config-athom

if [ ! -f ".eslintrc.json" ]; then
cat <<EOF > .eslintrc.json
{
  "extends": "athom"
}
EOF
fi

# Committing the changes 
git add .
## Command failed: /bin/sh ... > need to be fixed
# git commit --amend --no-edit