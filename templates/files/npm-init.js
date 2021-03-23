const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

let appJson;
if (fs.existsSync(dirname + "/.homeycompose/app.json")) {
  appJson = require(dirname + "/.homeycompose/app.json");
} else {
  appJson = require(dirname + "/app.json");
}

const name =
  package.name !== appJson.id
    ? package.name
    : path.basename(process.cwd()).toLowerCase();

const description = appJson.description
  ? appJson.description.en || appJson.description
  : package.description || "";

const keywords = [
  ...new Set(
    [].concat(package.keywords || [], [
      "Smarthome",
      "homey",
      appJson.name.en || appJson.name,
      appJson.id,
    ])
  ),
];

const author = appJson.author
  ? `${appJson.author.name} <${appJson.author.email}>`
  : package.author || "John Doe <john@doe.com>";

const homepage =
  package.homepage && package.homepage !== "https://github.com/"
    ? package.homepage
    : appJson.id
    ? "https://homey.app/a/" + appJson.id
    : "https://github.com/";

// prettier-ignore
const scripts = Object.assign({}, package.scripts || {}, {
  test: "homey app run",
  start: "npm install && homey app install",
  build: "homey app build",
  publish: "homey app publish",
  postpublish: "npm run init && git commit --amend --no-edit ./package.json && git push -f origin main",
  validate: "homey app validate -l publish",
  validateTest: "homey app validate",
  init: "npm init --quiet -y 1>/dev/null",
  eslint: "eslint .",
  prettier: "prettier",
  createRemoteRepo: 'hub create -d "$npm_package_description" -h $npm_package_homepage ${PWD##*/} && git commit --amend --no-edit && git push -u origin main && npm run init',
});
// Remove npm-script if remote-repo already exists
try {
  execSync("git ls-remote", { stdio: ['pipe', 'ignore', 'pipe'] });
  delete scripts["createRemoteRepo"];
} catch (err) {}

// set "homey" package.json
module.exports = {
  name,
  description,
  keywords,
  author,
  homepage,
  scripts,
  version: appJson.version || "0.0.0",
  main: package.main || "app.js",
  engines: package.engines || { node: ">=12.16.1" }, //** Used for eslint-config-athom **
  license: package.license || "GPL-3.0", //** License-id not exist (use default) **
  bugs: appJson.bugs || package.bugs || { url: "https://github.com/" },
};
