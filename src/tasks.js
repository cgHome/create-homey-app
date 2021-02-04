"use strict";
const fs = require("fs-extra");
const path = require("path");
const which = require("which");
const execa = require("execa");
const chalk = require("chalk");

const appPath = process.cwd();

function log(data) {
	console.log(chalk.grey("— ", data));
}
function logSuccess(data) {
	console.log(chalk.green("✓ ", data));
}
function logWarning(data) {
	console.log(chalk.yellow("⚠ ", data));
}
function logError(data) {
	console.error(chalk.red("✖ ", data));
}

function initHomeyApp(homeyPath) {
	try {
		logSuccess("Initialize app...");
		if (!fs.existsSync(homeyPath)) {
			fs.mkdirSync(homeyPath);
		}
		// Set current work directory
		process.chdir(homeyPath);
		logSuccess("App initialized");
	} catch (err) {
		logError(err);
		throw err;
	}
}

function createHomeyApp(homeyPath) {
	try {
		logSuccess("Create homey-app...");
		if (fs.existsSync("./app.json")) {
			logSuccess("App already exist");
		} else {
			const opt = { shell: true, stdio: "inherit" };
			if (which.sync("homey", { nothrow: true })) {
				log("Use installed homey-cli > fast-mode");
				execa.sync("homey", ["app", "create", "-p", homeyPath], opt);
			} else {
				log("Use npx homey > slow-mode");
				execa.sync("npx", ["-q", "-p homey", "homey", "app", "create", "-p", homeyPath], opt);
			}
			// move app up to homey-app base directory
			const appDir = fs
				.readdirSync(homeyPath)
				.filter(
					(f) =>
						fs.statSync(path.join(homeyPath, f)).isDirectory() &&
						fs.existsSync(path.join(homeyPath, f, "./app.json"))
				)[0];
			//fs.moveSync(path.join(homeyPath, appDir), homeyPath, { overwrite: true });
			fs.copySync(path.join(homeyPath, appDir), homeyPath);
			fs.removeSync(path.join(homeyPath, appDir));
			logSuccess("Homey-app created");
		}
	} catch (err) {
		logError(err);
		throw err;
	}
}

function copyAppTemplates() {
	try {
		logSuccess("Copy templates...");
		// Copy file
		_copyFiles("root/.gitignore", "./.gitignore", false);
		_copyFiles("root/.npm-init.js", "./.npm-init.js");
		// Copy directory
		_copyFiles(".vscode", ".vscode", false);
		_copyFiles(".devcontainer", ".devcontainer");
		logSuccess("Templates copied");
	} catch (err) {
		logError(err);
		throw err;
	}
}

function _copyFiles(iSrc, iDest, overwrite = true) {
	const src = path.join(appPath, "templates", iSrc);
	const dest = path.join(process.cwd(), iDest);
	log(`${iSrc} > ${dest}${overwrite ? " (overwrite)" : ""}`);
	// if src > directory
	if (!fs.statSync(src).isFile()) fs.emptyDirSync(dest);
	fs.copySync(src, dest, { overwrite });
}

function handleGitRepo() {
	try {
		logSuccess("Handle git-repo...");
		let commitMsg = "Update app using Create Homey App";
		if (!fs.existsSync("./.git")) {
			commitMsg = "Initialize app using Create Homey App";
			_initGit();
		}
		_pushGit(commitMsg);
		logSuccess("Git-Repo handled");
	} catch (err) {
		throw err;
	}
}

function _initGit() {
	try {
		const user = _execGit(["config", "user.name"], { shell: true });
		const repoName = path.basename(process.cwd());
		_execGit(["init", "--quiet"]);
		_execGit(["branch", "-M", "main"]);
		_execGit(["remote", "add", "origin", `https://github.com/${user}/${repoName}.git`]);
		if (_remoteRepoExist()) {
			_execGit(["pull", "origin", "main"]);
		} else {
			log("Create remote repository");
			log("> vscode > F1 > Publish to GitHub");
			log(`> GitHub "https://www.github.com/new" > ${user} / ${repoName}`);
		}
	} catch (err) {
		logError(err);
		throw err;
	}
}

function _pushGit(commitMsg) {
	try {
		_execGit(["add", "."]);
		_execGit(["commit", "-m", `${commitMsg}`]);
		if (_remoteRepoExist()) {
			_execGit(["push", "-u", "origin", "main"]);
		}
	} catch (err) {
		logError(err);
		throw err;
	}
}

function _remoteRepoExist() {
	try {
		_execGit(["ls-remote"], { shell: true });
		return true;
	} catch (err) {
		return false;
	}
}

function _execGit(cmd, opt = { stdio: "ignore" }) {
	try {
		const { stdout, stderr } = execa.sync("git", cmd, opt);
		return stdout;
	} catch (err) {
		throw err;
	}
}

module.exports = {
	log,
	logSuccess,
	logWarning,
	logError,
	initHomeyApp,
	createHomeyApp,
	copyAppTemplates,
	handleGitRepo,
};
