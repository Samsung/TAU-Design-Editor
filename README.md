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

### How to use for WATT
```
1. Launch the WATT with Chrome -> New Project -> Web Application -> Sample -> Mobile -> General -> TAU BASE
2. Input the Project Name and select the Finish
3. Open the Project and select the .html file
4. Select Monitor icon at the top right
```

### Features
- Drag&Drop the widget (Wearable)
![](docs/Dragwidget.gif)
- Preview (Wearable)
![](docs/Preview.gif)
- Structure Element (Wearable)
![](docs/Structure.gif)
- Newpage (Wearable)
![](docs/Newpage.gif)
- Javascript Assistant (mobile)
![](docs/JavascriptAssistant.gif)
- How to set the image (mobile)
![](docs/Image.gif)
- How to set the Dropdown items (mobile)
![](docs/Dropdown.gif)
- How to make application (mobile)
![](docs/IoTApp.gif)

### Coding style tests

Project has defined eslint rules (.eslintrc.js)

Contribution can be verified using command:

`grunt eslint`

## License

This project is licensed under MIT
