/**
 * # dress.Button
 * Object contains main framework methods.
 * @class dress.Button
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
/* global define */
    define([
        'jQuery',
        '../dress.closet'
    ], function ($, dress) {
    

// >>excludeEnd("buildExclude");

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

// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.Text;
    });
// >>excludeEnd("buildExclude");
}());
