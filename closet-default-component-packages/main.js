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
        var register = closetProvider.getRegister(pkg.name);
        register.registerComponents(pkg.components)
            .then(function () {
                register.registerTypeElements(pkg.typeElements)
                    .then(function (result) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(result);
                        }
                    });
            });
    }
};
