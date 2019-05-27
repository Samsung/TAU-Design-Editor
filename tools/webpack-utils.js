const path = require('path');

module.exports = (CONTEXT) => {
	return {

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
		createAliasObject: (aliases) => aliases.reduce((acc, alias) => {
			const [name, relativePath] = alias;
			acc[name] = path.resolve(CONTEXT, relativePath);
			return acc;
		}, {})
	};
};
