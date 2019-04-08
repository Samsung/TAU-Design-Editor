/**
 * This module contains set of functions simulating Brackets API behaviour,
 * which is non existent while Design Editor is used
 * as Visual Studio Code extension.
 *
 * @todo implement DocumentManager module methods
 * (http://suprem.sec.samsung.net/jira/browse/TIZENWF-2016)
 */
module.exports = class NodeDomain {
	/**
	 * Applies the named command from the domain to a list of parameters, which
	 * are passed as extra arguments to this method. If the connection is open
	 * and the domain is loaded, the function is applied immediately. Otherwise
	 * the function is applied as soon as the connection has been opened and the
	 * domain has finished loading.
	 *
	 * @param {string} name The name of the domain command to execute
	 * @return {jQuery.Promise} Resolves with the result of the command
	 */
	static exec(name) {
		return new Promise((resolve, reject) => {
			resolve(null);
		});
	}
};
