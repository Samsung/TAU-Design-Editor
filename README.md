TAU Design Editor
=================
[![Build Status](https://travis-ci.org/Samsung/TAU-Design-Editor.svg?branch=master)](https://travis-ci.org/Samsung/TAU-Design-Editor)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Samsung/TAU-Design-Editor/issues)

This repository consists of Design Editor which offers WYSIWYG editing feature for TAU.
This repo is used by WATT open source.

## Getting Started

You can't use this repository standalone.
It doesn't offer any UI which could be tested. It can be used as a part of WATT or VSCode extension.

### Prerequisites

To build a TAU Design Editor ensure that you have Node.js (10.15.X) installed.

Example install using `nvm`:

```
nvm install 10.15.3
nvm use 10.15.3
```

Install depending modules using npm:
`npm install`

### Building for WATT
```
npm run build-watt
```
### Building for VSCode extension
```
npm run build-vsc
```
### Coding style tests

Project has defined eslint rules (.eslintrc.js)

Contribution can be verified using command:

`grunt eslint`

## License

This project is licensed under MIT
