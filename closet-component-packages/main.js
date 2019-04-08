var pkg = require('./package'),
    componentDataHandlers = {
        getPageIdList: function (/* closet, element*/) {
        }
    };

module.exports = {
  /**
   * Bind objects
   * @param {Object} closetProvider
   * @param {Function} onSuccess
   */
    consumeCloset: function (closetProvider, onSuccess) {
        closetProvider.getRegister(pkg.name)
            .registerComponents(pkg.components, componentDataHandlers)
            .then(function (result) {
                if (typeof onSuccess === 'function') {
                    onSuccess(result);
                }
            });
    }
};
