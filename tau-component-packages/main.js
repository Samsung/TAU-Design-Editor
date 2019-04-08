var pkg = require('./package');

module.exports = {
  /**
   *
   * @param closetProvider
   * @param onSuccess
   */
    consumeCloset: function (closetProvider, onSuccess) {
        var register = closetProvider.getRegister(pkg.name);
        register.registerComponents(pkg.components)
      .then(function () {
          register.registerAppTemplates(pkg.appTemplate)
          .then(function () {
              register.registerPageTemplates(pkg.pageTemplate)
              .then(function (result) {
                  if (typeof onSuccess === 'function') {
                      onSuccess(result);
                  }
              });
          });
      });
    }
};
