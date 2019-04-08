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
/**
 * # dress.Text
 * Object contains main framework methods.
 * @class dress.Text
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {

        dress.Text = dress.factory('text', {
            defaults : {},

            onCreated : function () {
                this._initialize();
            },
            onAttached : function () {
                this._setContentsElement();
            },
            onDetached : function () {
            },
            onAttributeChanged : function (/* attrName, oldValue, newValue*/) {
            },
            onDestroy : function () {
            },

            _initialize : function () {
                this._$contentsElement = null;
                this._contentsClass = 'closet-text-contents';
            },

            _setContentsElement : function () {
                this._$contentsElement = this.$el.find('.' + this._contentsClass);
                if (this._$contentsElement.length === 0) {
                    this._$contentsElement = $(document.createElement('div')).addClass(this._contentsClass).text('New Text');
                    this.$el.css('position', 'absolute');
                    this.$el.append(this._$contentsElement);
                }
            }

        });

}());

}));
