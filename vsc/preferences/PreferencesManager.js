module.exports = {
	/**
	 * Method returning the stage of the project.
	 * Possible values: production, demo
	 * In VSC version of DE - for now - we're always in procuction stage.
	 */
	getViewState: () => ({
		projectType: 'production'
	})
};
