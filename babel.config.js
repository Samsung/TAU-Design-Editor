const { createVSCAliasObject } = require('./tools/webpack-utils');


module.exports = api => {
	api.cache(false);
	return {
		presets: ['@babel/preset-env'],
		plugins: [
			[
				require.resolve('babel-plugin-module-resolver'),
				{
					alias: createVSCAliasObject
				}
			]
		]
	};
};
