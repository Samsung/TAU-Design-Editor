/**
 * # dress.Text
 * Object contains main framework methods.
 * @class dress.Text
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
/* global define */
    define([
        'jQuery',
        '../dress.closet'
    ], function ($, dress) {
    

// >>excludeEnd("buildExclude");

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

// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.Text;
    });
// >>excludeEnd("buildExclude");
}());
