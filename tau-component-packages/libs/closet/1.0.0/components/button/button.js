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
 * # dress.Button
 * Object contains main framework methods.
 * @class dress.Button
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function () {

        dress.Text = dress.factory('button', {
            defaults: {
                bgColor: 'rgb(125, 125, 125)',
                bgImage: '',
                buttonText: '',
                textSize: 16,
                textColor: 'rgb(0, 0, 0)',
                opacity: 1,
                radius: 0,
                zIndex: 100
            },

            onCreated: function () {
                this._initialize();
                this._createChildElements();
                this._setInitializeAttributes();
            },

            onAttached: function () {
                var textContents;

                if (this.$el.contents()[1].nodeType === 3) {
                    textContents = this.$el.contents()[1].data;
                    this.$closetButtonText[0].textContent = textContents;
                    this.$el.attr('button-text', textContents);
                    this.$el.html(this.$el.children());
                }
            },

            _initialize: function () {
                var self = this;

                self.$closetButtonBackground = $(self).find('.closet-button-bg');
                self.$closetButtonText = $(self).find('.closet-button-text');
            },

            _createChildElements: function () {
                var self = this,
                    closetButtonBackground,
                    closetButtonText;

                if (!self.$closetButtonBackground.length) {
                    self.$closetButtonBackground = closetButtonBackground = $("<div class='closet-button-bg'></div>");
                    self.$el.prepend(closetButtonBackground);
                }

                if (!self.$closetButtonText.length) {
                    self.$closetButtonText = closetButtonText = $("<span class='closet-button-text'></span>");
                    self.$el.append(closetButtonText);
                }
            },

            _setInitializeAttributes: function () {
                Object.keys(this.options).forEach((key) => {
                    this._callSetter(key, this.options[key]);
                });
            },

            setBgColor: function (bgColor) {
                this.options.backgroundColor = bgColor;
                this.$closetButtonBackground.css('background-color', bgColor);
            },

            setBgImage: function (imageSrc) {
                this.options.backgroundImage = imageSrc;
                this.$closetButtonBackground.css('background-image', 'url(' + imageSrc + ')');
            },

            setButtonText: function (textValue) {
                this.options.text = textValue;
                this.$closetButtonText.text(textValue);
            },

            setTextSize: function (size) {
                this.options.fontSize = size;
                this.$el.css('font-size', size + 'px');
                this.$closetButtonText.css('font-size', size + 'px');
                this.$closetButtonText.css('line-height', size + 4 + 'px');
            },

            setTextColor: function (fontColor) {
                this.options.fontColor = fontColor;
                this.$el.css('color', fontColor);
                this.$closetButtonBackground.css('color', fontColor);
            },

            setOpacity: function (value) {
                this.options.opacity = value;
                this.$closetButtonBackground.css('opacity', value);
                this.$closetButtonText.css('opacity', value);
            },

            setRadius: function (value) {
                this.options.radius = value;
                this.$el.css('border-radius', value + '%');
                this.$closetButtonBackground.css('border-radius', value + '%');
            },

            setZIndex: function (value) {
                this.options.zIndex = value;
                this.$el.css('z-index', value);
            }

        });

}());

}));
