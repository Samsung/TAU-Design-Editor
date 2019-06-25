'use babel';

const path = require('path');
const utils = require('./utils');

function removeMediaQueryConstraints(htmlText) {
	return htmlText
		.replace(/media="all and \(-tizen-geometric-shape: circle\)"/g, '');
}

function correctBase(documentElement) {
	documentElement.querySelector('base')
		.setAttribute('href', utils.checkGlobalContext('globalData').basePath);
}

module.exports = {
	correctBase,
	removeMediaQueryConstraints
};
