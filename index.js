#!/usr/bin/env node

// see: https://medium.com/northcoders/creating-a-project-generator-with-node-29e13b3cd309
// see: https://www.twilio.com/blog/how-to-build-a-cli-with-node-js
// see: https://github.com/sindresorhus/np

"use strict";
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const prompts = require("prompts");

const tasks = require("./src/tasks");

const argv = yargs(process.argv.slice(2))
	.usage("Usage: $0 <homey-app> [options]")
	.option("y", {
		alias: "yes",
		describe: "Skip the questionnaire",
	})
	.alias("v", "version")
	.alias("h", "help")
	.epilog("copyright 2020").argv;

const homeyPath = path.join(__dirname, argv._[0] || "./");

if (argv.yes) {
	runTasks(homeyPath);
} else {
	(async () => {
		const response = await prompts({
			type: "confirm",
			name: "value",
			message: `${fs.existsSync(homeyPath) ? "Update" : "Create"} homey-app to ${homeyPath}?`,
			initial: true,
		});
		if (response.value) {
			runTasks(homeyPath);
		}
	})();
}

function runTasks(homeyPath) {
	Promise.resolve(true)
		.then(tasks.initHomeyApp(homeyPath))
		.then(tasks.createHomeyApp(homeyPath))
		.then(tasks.copyAppTemplates(homeyPath))
		.then(tasks.handleGitRepo())
		.then(tasks.logSuccess("create-homey-app finished"))
		.catch((err) => tasks.logError(err.message));
}
