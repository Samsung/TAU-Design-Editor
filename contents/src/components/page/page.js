/* global $ */
/**
 * # dress.Section
 * Object contains main framework methods.
 * @class dress.Section
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
    /* global define */
    define([
        '../dress.closet'
    ], function (dress) {
        

// >>excludeEnd("buildExclude");

        dress.Page = dress.factory('page', {
            defaults: {
                draggable: false,
                resizable: false
            },

            onCreated: function () {
                $(window).load(this.trigger.bind(this, 'shown'));
            },

            show: function () {
                throw new Error('Unsupported Operation Exception.');
            },

            hide: function () {
                throw new Error('Unsupported Operation Exception.');
            },

            animate: function () {
                throw new Error('Unsupported Operation Exception.');
            },

            goto: function (pageId) {
                $(document).trigger('change.page', [pageId]);
            }
        });

// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.Page;
    });
// >>excludeEnd("buildExclude");
}());
