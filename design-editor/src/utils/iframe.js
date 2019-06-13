'use babel';

const path = require('path');
const utils = require('./utils');

function removeMediaQueryConstraints(documentElement, basePath) {
	const linkElementArray = documentElement
		.querySelectorAll('link[media="all and (-tizen-geometric-shape: circle)"]');

	linkElementArray.forEach(linkElement => {
		linkElement.removeAttribute('media');
		linkElement.setAttribute(
			'href',
			path.join(basePath, linkElement.getAttribute('href'))
		);
	});
}

function correctBase(documentElement) {
	documentElement.querySelector('base')
		.setAttribute('href', utils.checkGlobalContext('globalData').basePath);
}

module.exports = {
	correctBase,
	removeMediaQueryConstraints
};
