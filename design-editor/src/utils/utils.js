'use babel';

const path = require('path');
const url = require('url');

export default {
	/**
	* Gets global variable name depends if it is in window or window.top
 	* @param  {string} variableName global variable name
	* @returns {Object} global variable value
 	*/
	checkGlobalContext(variableName) {
		return window[variableName] || window.top[variableName];
	},

	/**
	 * path.join equivalent for URLs
	 * @TODO: refactor this method and move it to path-utils
	 * @param {...string} arguments any number of URL parts
	 * @returns {string} URL created out of given parts
	 */
	urlJoin() {
		const baseURL = url.parse(arguments[0]);
		const host = baseURL.host;

		const paths = [
			baseURL.path,
			...Array.prototype.slice.call(arguments, 1)
		];

		return `${baseURL.protocol}//${host}${path.join(...paths)}`;
	},

	/**
	 * Generates absolute bath for the server
	 * from relative one passed as an input
	 * @TODO refactor this method and move it to path-utils
	 * @param {string} relativePath
	 * @returns {string} absolutePath
	 */
	generateAbsolutePath(relativePath) {
		const projectPath = this.checkGlobalContext('globalData').projectPath;
		return path.join(projectPath, '..', relativePath);
	},

	/**
	 * Resolves promise passed in parameter if it's resolved within
	 * timeoutThreshold time or rejects otherwise.
	 *
	 * @param {Promise} promise
	 * @param {number} timeoutThreshold
	 */
	timeoutPromise(promise, timeoutThreshold) {
		timeoutThreshold = timeoutThreshold || 2500;

		const timeoutTriggerPromise = new Promise((_, reject) => {
			const timeoutId = setTimeout(() => {
				clearTimeout(timeoutId);
				reject(new Error(`Timed out in ${timeoutThreshold} ms.`));
			}, timeoutThreshold);
		});

		return Promise.race([timeoutTriggerPromise, promise]);
	}
}
