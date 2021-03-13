"use strict";
const fs = require("fs-extra");
const path = require("path");
const which = require("which");
const execa = require("execa");
const chalk = require("chalk");

const appPath = path.join(__dirname, '..');

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

function createHomeyApp() {
	try {
		logSuccess("Create homey-app...");
		if (fs.existsSync("./app.json")) {
			logSuccess("App already exist");
		} else {
			const basePath = process.cwd();
			const opt = { shell: true, stdio: "inherit" };
			if (which.sync("homey", { nothrow: true })) {
				log("Use installed homey-cli...");
				execa.sync("homey", ["app", "create", "-p", basePath], opt);
			} else {
				log("Use npx homey...");
				execa.sync("npx", ["-q", "-p homey", "homey", "app", "create", "-p", basePath], opt);
			}
			// move app up to homey-app base directory
			const appDir = fs
				.readdirSync(basePath)
				.filter(
					(f) =>
						fs.statSync(path.join(basePath, f)).isDirectory() &&
						fs.existsSync(path.join(basePath, f, "./app.json"))
				)[0];
			//fs.moveSync(path.join(basePath, appDir), basePath, { overwrite: true });
			fs.copySync(path.join(basePath, appDir), basePath);
			fs.removeSync(path.join(basePath, appDir));
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
		_copyFiles("files/gitignore", "./.gitignore", false);
		_copyFiles("files/eslintrc.json", "./.eslintrc.json", false);
		_copyFiles("files/npm-init.js", "./.npm-init.js");
		// Copy directory
		_copyFiles("vscode", ".vscode", false);
		//_copyFiles("github", ".github", false);
		_copyFiles("devcontainer", ".devcontainer");
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
		let commitMsg = "Update project using Create Homey App";
		if (!fs.existsSync("./.git")) {
			commitMsg = "Initialize project using Create Homey App";
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
			_execGit(["pull", "origin", _execGit(["branch"], { shell: true }).replace("* ", "")]);
		} else {
			log("Create remote repository: vscode > dev-container > npm run createRemoteRepo");
		}
	} catch (err) {
		logError(err);
		throw err;
	}
}

function _pushGit(commitMsg) {
	try {
		_execGit(["add", "."]);
		_execGit(["commit", "-am", `${commitMsg}`]);
		if (_remoteRepoExist()) {
			_execGit(["push", "-u", "origin", _execGit(["branch"], { shell: true }).replace("* ", "")]);
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