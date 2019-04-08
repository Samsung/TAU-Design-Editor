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
 * # dress.Image
 * Object contains main framework methods.
 * @class dress.Image
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function () {
        dress.Image = dress.factory('image', {
            defaults: {
                src: 'data:image/png;base64,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',
                filterPreset: 'normal',
                brightness: 1,
                contrast: 1,
                saturate: 1,
                sepia: 0,
                grayscale: 0,
                hueRotate: 0,
                radius: 0,
                opacity: 1,
                zIndex: 100
            },

            filterPresetInfo: {
                'normal': {
                    'background': 'initial',
                    'blend': 'initial',
                    'opacity': 1
                },
                'aden': {
                    'background': '-webkit-linear-gradient(left, rgba(66, 10, 14, 0.2), transparent)',
                    'blend': 'darken'
                },
                'brooklyn': {
                    'background': '-webkit-radial-gradient(circle, rgba(168, 223, 193, 0.4) 70%, #c4b7c8)',
                    'blend': 'overlay'
                },
                'earlybird': {
                    'background': '-webkit-radial-gradient(circle, #d0ba8e 20%, #360309 85%, #1d0210 100%)',
                    'blend': 'overlay'
                },
                'gingham': {
                    'background': '-webkit-linear-gradient(left, rgba(66, 10, 14, 0.2), transparent)',
                    'blend': 'darken'
                },
                'hudson': {
                    'background': '-webkit-radial-gradient(circle, #a6b1ff 50%, #342134)',
                    'blend': 'multiply',
                    'opacity': '0.5'
                },
                'inkwell': {
                    'webkitfilter': 'sepia(.3) contrast(1.1) brightness(1.1) grayscale(1)'
                },
                'lofi': {
                    'background': '-webkit-radial-gradient(circle, transparent 70%, #222 150%)',
                    'blend': 'multiply'
                },
                'mayfair': {
                    'background': '-webkit-radial-gradient(40% 40%, circle, rgba(255, 255, 255, 0.8), rgba(255, 200, 200, 0.6), #111 60%)',
                    'blend': 'overlay',
                    'opacity': '0.4'
                }
            },

            onCreated: function () {
                this._initialize();
                this._createChildElements();
                this._setInitializeAttributes();
            },

            onChanged: function (attrName, newValue) {
                this.$el.attr(attrName, newValue);
            },

            _initialize: function () {
                var self = this;

                self.$closetImage = $(self).find('.closet-img');
                self.$closetFilterPreset = $(self).find('.closet-filter-preset');

                self.webkitFilterAttributes = {
                    brightness: self.defaults.brightness,
                    contrast: self.defaults.contrast,
                    saturate: self.defaults.saturate,
                    sepia: self.defaults.sepia,
                    grayscale: self.defaults.grayscale,
                    hueRotate: self.defaults.hueRotate
                };
                self._originWebkitFilterValue = null;
            },

            _createChildElements: function () {
                var self = this,
                    closetImage,
                    closetFilterPreset;

                if (!self.$closetImage.length) {
                    self.$closetImage = closetImage = $("<img class='closet-img' alt='<IMG/>'>");
                    self.$el.prepend(closetImage);
                }
                if (!self.$closetFilterPreset.length) {
                    self.$closetFilterPreset = closetFilterPreset = $("<div class='closet-filter-preset'></div>");
                    self.$el.append(closetFilterPreset);
                }
            },

            _setInitializeAttributes: function () {
                Object(this.options).forEach((key) => {
                    this._callSetter(key, this.options[key]);
                });
            },

            setSrc: function (srcUrl) {
                var self = this;

                self.options.src = srcUrl;
                self.$el.css('background-color', 'initial');
                self.$closetImage.attr('src', srcUrl);
            },

            setFilterPreset: function (filterName) {
                var self = this,
                    filterInfo,
                    filterEffect,
                    imageFiltersForInkwell;

                self.options.filterPreset = filterName;
                filterEffect = filterName;
                filterInfo = this.filterPresetInfo[filterEffect];
                imageFiltersForInkwell = filterInfo.webkitfilter || self._originWebkitFilterValue;

                self.$closetImage.css('-webkit-filter', imageFiltersForInkwell);
                self.$closetFilterPreset.css({
                    'background': filterInfo.background,
                    'mix-blend-mode': filterInfo.blend,
                    'opacity': filterInfo.opacity
                });
            },

            setBrightness: function (value) {
                this.options.brightness = value;
                this._setWebkitFilter();
            },

            setContrast: function (value) {
                this.options.contrast = value;
                this._setWebkitFilter();
            },

            setSaturate: function (value) {
                this.options.saturate = value;
                this._setWebkitFilter();
            },

            setSepia: function (value) {
                this.options.sepia = value;
                this._setWebkitFilter();
            },

            setGrayscale: function (value) {
                this.options.grayscale = value;
                this._setWebkitFilter();
            },

            setHueRotate: function (value) {
                this.options.hueRotate = value;
                this._setWebkitFilter();
            },

            setRadius: function (value) {
                this.options.radius = value;
                this.$el.css('border-radius', value + '%');
                this.$closetImage.css('border-radius', value + '%');
                this.$closetFilterPreset.css('border-radius', value + '%');
            },

            setOpacity: function (value) {
                this.options.opacity = value;
                this.$closetImage.css('opacity', value);
            },

            setZIndex: function (value) {
                this.options.zIndex = value;
                this.$el.css('z-index', value);
                this.$closetFilterPreset.css('z-index', value + 1);
            },

            _setWebkitFilter: function () {
                var self = this,
                    degString,
                    filterString = '';

                Object.keys(self.webkitFilterAttributes).forEach((prop) => {
                    degString = prop === 'hueRotate' ? 'deg' : '';
                    filterString += dress.convertToAttributeName(prop) + '(' + self.options[prop] + degString + ') ';
                });

                self.$closetImage.css('-webkit-filter', filterString);
            // for inkwell Filter Preset. 'inkwell' changes webkit-filter value of image (not preset-filter div)
            // so, in this case. Image has to store original webkit-filter value (before applying filter).
                self._originWebkitFilterValue = self.$closetImage.css('-webkit-filter');
            }
        });
}());

}));
