(function(factory) {

  var root = window !== "undefined" ? window : this;

  if (typeof define === 'function' && define.amd) {

    define(['jquery', 'dress'], function($, dress) {
      factory($, dress);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if ( typeof module === "object" && typeof module.exports === "object" ) {
      factory(require('jquery'), require('dress'));

  // Finally, as a browser global.
  } else {
    factory((root.jQuery || root.Zepto || root.ender || root.$), root.dress);
  }

}(function($, dress) {
'use strict';

    if (!$ || !dress) {
        return;
    }
/* global $ */
/**
 * # dress.Section
 * Object contains main framework methods.
 * @class dress.Section
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {

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

}());

}));
