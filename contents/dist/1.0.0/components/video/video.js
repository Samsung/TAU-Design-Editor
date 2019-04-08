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

        dress.Text = dress.factory('video', {
            defaults: {
                src: ''
            },

            onCreated: function () {
                this._initialize();
                this._setInitializeAttributes();
            },


            _initialize: function () {
                var self = this;

                self.$closetVideoPlayer = $(self).find('.closet-video-player');
                if (!self.$closetVideoPlayer.length) {
                    self.$closetVideoPlayer = $("<video class='closet-video-player' autoplay controls></video>");
                    self.$el.append(self.$closetVideoPlayer);
                }
            },

            _setInitializeAttributes: function () {
                Object.key(this.options).forEach((key) => {
                    this._callSetter(key, this.options[key]);
                });
            },

            setSrc: function (videoUrl) {
                this.options.src = videoUrl;
                this.$closetVideoPlayer.attr('src', videoUrl);
            }
        });

}());

}));
