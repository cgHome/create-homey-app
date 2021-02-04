# Create Homey App

`This app is still under development`

Create Homey-App without build configuration. In a single command, this tool bootstraps an app with associated version management and a dockerized remote development environments.

"Old" apps can also be upgraded, if the command is called in the existing app-root directory.

- Creating an App
- Homey Apps SDK

Create Homey App works on macOS, Windows, and Linux.\
If something doesn’t work, please file an issue.\
If you have questions or need help, please ask in Homey Community Forum.

----

## Requirements

- [Visual Studio Code](https://code.visualstudio.com/)
  - [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)

----

## Quick Overview

```sh
npx create-homey-app [my-app]
cd my-app
code .
```

If you've previously installed [Homey Command-line interface](https://www.npmjs.com/package/homey) globally via `npm i -g homey`, we recommend you uninstall the package using `npm uninstall -g homey` or `yarn global remove homey` to ensure that npx always uses the latest version.

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

----

## Creating or update an Homey-App

### npx

```sh
# Invoking from the npm registery
npx create-homey-app [my-app]

# Invoking from the github repository
npx github:cghome/homey.devApp -c 'create-homey-app' [my-app]
```

### npm

```sh
npm init create-homey-app [my-app]
```

_`npm init <initializer>` is available in npm 6+_

### Yarn

```sh
yarn create homey-app [my-app]
```

It will create a directory called `my-app` inside the current folder.

Inside that directory, it will generate the initial project structure and install the transitive dependencies:

----

## Tutorials

- [Developing inside a Container](https://code.visualstudio.com/docs/remote/containers)
- [Dockerisieren Sie Ihre Entwicklungsumgebung in VS Code](https://ichi.pro/de/post/234589651404201)

## Development Container Tips & Tricks

- [VS Code - Remote Development](https://github.com/microsoft/vscode-dev-containers/tree/master)
- [VS Code - Contributing](https://github.com/microsoft/vscode-dev-containers/blob/master/CONTRIBUTING.md)
- [VS Code - Scripts:](https://github.com/microsoft/vscode-dev-containers/tree/master/script-library)

----

## Changelog

v1.0.0

- Initial commit

----

## ToDo

----

## Copyright

Copyright 2021, 2021 [Chris Gross] cFlat-inc.org
