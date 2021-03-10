#!/usr/bin/env node

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
	.epilog("copyright 2021").argv;

const homeyPath = path.join(process.cwd(), argv._[0] || "./");

if (argv.yes) {
	runTasks();
} else {
	(async () => {
		const response = await prompts({
			type: "confirm",
			name: "value",
			message: `${fs.existsSync(homeyPath) ? "Update" : "Create"} homey-app to ${homeyPath}?`,
			initial: true,
		});
		if (response.value) {
			runTasks();
		}
	})();
}

function runTasks() {
	Promise.resolve(true)
		.then(tasks.initHomeyApp(homeyPath))
		.then(tasks.createHomeyApp())
		.then(tasks.copyAppTemplates())
		.then(tasks.handleGitRepo())
		.then(tasks.logSuccess(`create-homey-app on: ${homeyPath} finished`))
		.catch((err) => tasks.logError(err.message));
}