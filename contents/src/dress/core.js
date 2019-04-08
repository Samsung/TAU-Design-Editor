/**
 * # dress
 * Object contains main framework methods.
 * @class dress
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
// >>excludeStart("buildExclude", pragmas.buildExclude);
/* global define */
define([], function () {


// >>excludeEnd("buildExclude");

    var dress = {
        version: '@VERSION',
        name: 'dress'
    };

    dress.convertToOptionName = function (str) {
        return str.replace(/(-[a-z])/g, function ($1) {
            return $1.toUpperCase().replace('-', '');
        });
    };

    dress.convertToAttributeName = function (str) {
        return str.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
        });
    };
// >>excludeStart("buildExclude", pragmas.buildExclude);
    return dress;
});
// >>excludeEnd("buildExclude");
