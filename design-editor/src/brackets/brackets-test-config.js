// mock for tests
const brackets = {
    /**
     * App object
     */
    app: {
        /**
         * Return support directory
         */
        getApplicationSupportDirectory: function () {

        }
    },
    /**
     * Return module
     * @param {string} name
     * @returns {*}
     */
    getModule: function (name) {
        if (name === 'preferences/PreferencesManager') {
            return {
                addScope: function () {

                },
                getExtensionPrefs: function () {
                    return {
                        definePreference: function () {

                        }};
                }
            };
        } else if (name === 'preferences/PreferencesBase') {
            return {
                Scope: function () {

                },
                FileStorage: function () {

                }
            };
        }
        return {};
    }
};

window.brackets = brackets;

export default brackets;
