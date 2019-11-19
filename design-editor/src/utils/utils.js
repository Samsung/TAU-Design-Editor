'use babel';

const path = require('path');
const url = require('url');


/**
* Gets global variable name depends if it is in window or window.top
* @param  {string} variableName global variable name
* @returns {Object} global variable value
*/
export function checkGlobalContext(variableName) {
	return window[variableName] || window.top[variableName];
}

/**
 * path.join equivalent for URLs
 * @TODO: refactor this method and move it to path-utils
 * @param {...string} urlParts any number of URL parts
 * @returns {string} URL created out of given parts
 */
export function urlJoin(...urlParts) {
	const baseURL = url.parse(urlParts[0]);
	const host = baseURL.host;

	const paths = [
		baseURL.path,
		...Array.prototype.slice.call(urlParts, 1)
	];

	return `${baseURL.protocol}//${host}${path.join(...paths)}`;
}

/**
 * Generates absolute bath for the server
 * from relative one passed as an input
 * @TODO refactor this method and move it to path-utils
 * @param {string} relativePath
 * @returns {string} absolutePath
 */
export function generateAbsolutePath(relativePath) {
	const projectPath = this.checkGlobalContext('globalData').projectPath;
	return path.join(projectPath, '..', relativePath);
}

/**
 * Resolves promise passed in parameter if it's resolved within
 * timeoutThreshold time or rejects otherwise.
 *
 * @param {Promise} promise
 * @param {number} timeoutThreshold
 */
export function timeoutPromise(promise, timeoutThreshold) {
	timeoutThreshold = timeoutThreshold || 2500;

	const timeoutTriggerPromise = new Promise((_, reject) => {
		const timeoutId = setTimeout(() => {
			clearTimeout(timeoutId);
			reject(new Error(`Timed out in ${timeoutThreshold} ms.`));
		}, timeoutThreshold);
	});

	return Promise.race([timeoutTriggerPromise, promise]);
}

/**
 * Checks if opened project is in demo mode
 *
 * @returns {string} boolean
 */
export function isDemoVersion() {
	return checkGlobalContext('brackets')
		.getModule('preferences/PreferencesManager')
		.getViewState('projectType') === 'demo';
}

/**
 * Check version
 * @param {string} version
 * @param {string} profile
 * @param {string} shape
 * @returns {boolean}
 */
function correctVersion(version, profile, shape) {
	return (!version || version === 'all' || version === profile || version === `${profile}-${shape}`);
}

/**
 * Returns a function that performs pipe operation of given functions in order
 * @param {function} functions Array of functions to call
 */
export function pipe (functions) {
	return functions.reduce((f1, f2) => (a, b) => f2(f1(a), b));
}

/**
 * Convert RGBA or RGB string to HEX string
 * @param rgba
 * @returns {string}
 */
export function rgba2hex(rgba) {
    rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgba && rgba.length === 4) ? '#' +
    ('0' + parseInt(rgba[1], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgba[2], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgba[3], 10).toString(16)).slice(-2) : '';
}

export default {
	checkGlobalContext,
	urlJoin,
	generateAbsolutePath,
	timeoutPromise,
	isDemoVersion,
	correctVersion,
	pipe,
	rgba2hex
};
