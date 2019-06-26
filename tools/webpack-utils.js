const path = require('path');

const CONTEXT = path.resolve(__dirname, '..');

const common = [
	['remote', 'design-editor/libs/remote.js'],
	['closet-default-component-packages', 'closet-default-component-packages'],
	['closet-component-packages', 'closet-component-packages'],
	['tau-component-packages', 'tau-component-packages'],
	['content-manager', 'content-manager'],
	['dress', 'contents/dist/1.0.0/dress.js'],
	['mustache', 'design-editor/node_modules/mustache/mustache.js'],
	['path', 'design-editor/node_modules/path-browserify/index.js'],
	['js-beautify', 'design-editor/node_modules/js-beautify/js/index.js'],
	['jquery', 'design-editor/node_modules/jquery/dist/jquery.js'],
	['jquery-ui', 'design-editor/node_modules/jquery-ui/jquery-ui.js'],
	['@', 'design-editor/src']
];

const relativeWATTAliases = [
	...common,
	['fs', 'brackets-extension/design-editor/libs/fs-mock.js'],
	['labels', 'brackets-extension/design-editor/labels.js'],
	['fs-extra', 'brackets-extension/design-editor/libs/fs-extra.js'],
	['fs-remote', 'brackets-extension/design-editor/libs/fs-remote.js'],
	['atom', 'brackets-extension/design-editor/libs/atom.js'],
	['assistant-view', 'brackets-extension/design-editor/libs/assistant-view/assistant-view-manager.js'],
	['html-assistant-editor', 'brackets-extension/design-editor/libs/html-assistant-editor.js'],
];

const relativeVSCAliases = [
	...common,
	['fs', 'vsc-extension/design-editor/libs/fs.js'],
	['labels', 'vsc-extension/design-editor/labels.js'],
	['fs-extra', 'vsc-extension/design-editor/libs/fs-extra.js'],
	['atom', 'vsc-extension/design-editor/libs/atom.js'],
	['brackets', 'vsc-extension/design-editor/libs/brackets.js'],
	['assistant-view', 'vsc-extension/design-editor/libs/assistant-view-manager.js'],
	['html-assistant-editor', 'vsc-extension/design-editor/libs/html-assistant-editor.js']
];

/**
 * Returns alias object expected by webpack
 * from array containing arrays of names and
 * paths of packages.
 * @param {string[][]} aliases - array of arrays
 * each containing two values name and relative path
 * to package (respectively)
 * @return {object} object containing aliases
 * (formatted the way acceptable by webpack)
 */
const createAliasObject = (isVSC) => {
	const aliases = isVSC ? relativeVSCAliases : relativeWATTAliases;

	return aliases.reduce((acc, alias) => {
		const [name, relativePath] = alias;
		acc[name] = path.resolve(CONTEXT, relativePath);
		return acc;
	}, {});
};

module.exports = {
	createVSCAliasObject: createAliasObject(true),
	createWATTAliasObject: createAliasObject(false),
	CONTEXT
};
