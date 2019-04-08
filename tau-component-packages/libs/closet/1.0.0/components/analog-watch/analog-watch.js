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
(function () {

        /*
         ###Usage:
         <closet-analog-watch [bg-image={file path}]
                              [hour-hand={file path}]
                              [minute-hand={file path}]
                              [second-hand={file path}]
                              [center-cap={file path}]
                              [smooth={true | false}]>
        </closet-analog-watch>

         ###Event:
         * clock.hour : Fired every one hour
         * clock.minute : Fired every single minute
         * clock.second : Fired every single second

         ###Example:
         <closet-analog-watch bg-image="./bg.png" hour-hand="./hour.png" minute-hand="./min.png" second-hand="./sec.png"
         center-cap="./cetner.png" smooth="true"> </closet-analog-watch>
        */
        dress.AnalogWatch = dress.factory('analog-watch', {
            defaults : {
                'smooth' : false,
                'bgImage' : './resources/images/clock_bg3.png',
                'hourHand' : './resources/images/hour2.png',
                'minuteHand' : './resources/images/minute1.png',
                'secondHand' : './resources/images/second1.png',
                'centerCap' : './resources/images/center_cap1.png'
            },

            // Base LifeCycle
            onCreated : function () {
                this._initialize();
            },
            onAttached : function () {
                this._runHands();
            },
            onDetached : function () {
                this._stopHands();
            },
            onChanged : function (optionName, newValue/* , oldValue*/) {
                this._setClockOption(optionName, newValue);
            },
            onDestroy : function () {
                this._stopHands();
            },

            // Additional Method
            _initialize : function () {
                this._defaultElements = ['bg-image', 'hour-hand', 'minute-hand', 'second-hand', 'center-cap'];
                this._classPrefix = 'closet-analog-watch-';

                this._$elements = {};
                this._timer = null;
                this._everyMinuteChecker = 0;
                this._smooth = this.options.smooth;

                this.applyDefaultOptions();
            },

            applyDefaultOptions : function () {
                var keys, key, keyLength, i;

                keys = Object.keys(this.options);
                keyLength = keys.length;

                for (i = 0; i < keyLength; i += 1) {
                    key = keys[i];
                    this._setClockOption(key, this.options[key]);
                }

                return this;
            },

            _setClockOption : function (type, value) {
                var urlRegex = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:jpg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;
                type = dress.convertToAttributeName(type);

                if (type === 'smooth') {
                    this._smooth = value;
                } else if (typeof value === 'string' && value.match(urlRegex)) {
                    this._setImage(type, value);
                }
            },

            _setImage : function (type, value) {
                var $elements = this._$elements,
                    selector = this._classPrefix + type,
                    existedItem = null;

                if (!$elements[type]) {
                    existedItem = this.$el.find('.' + selector);
                    if (existedItem.length > 0) {
                        $elements[type] = existedItem;
                    } else {
                        $elements[type] = $(document.createElement('div')).addClass(selector).appendTo(this);
                    }
                }

                if (this._isDefaultElement(type)) {
                    $elements[type].addClass(this._classPrefix + 'element');
                }

                this._changeImage(type, value);

                if (!value) {
                    $elements[type].remove();
                }

                return this;
            },

            _changeImage : function (target, url) {
                return this._$elements[target].css('background-image', 'url(' + url + ')');
            },
            _isDefaultElement : function (attrType) {
                return (this._defaultElements.indexOf(attrType) >= 0);
            },

            _setHandsAngle : function () {
                var currentDate = new Date(),
                    hours = currentDate.getHours() % 12,
                    minutes = currentDate.getMinutes(),
                    seconds = currentDate.getSeconds(),
                    milliseconds = currentDate.getMilliseconds(),
                    $elements = this._$elements;

                if ($elements['hour-hand']) {
                    $elements['hour-hand'].css('-webkit-transform', 'rotateZ(' + this._getHourHandAngle(hours, minutes) + 'deg)');
                }

                if ($elements['minute-hand']) {
                    $elements['minute-hand'].css('-webkit-transform', 'rotateZ(' + this._getMinuteHandAngle(minutes, seconds) + 'deg)');
                }

                if ($elements['second-hand']) {
                    $elements['second-hand'].css('-webkit-transform', 'rotateZ(' + this._getSecondHandAngle(seconds, milliseconds) + 'deg)');
                }

                return this;
            },

            _getHourHandAngle : function (h, m) {
                return 0.5 * ((60 * h) + (m + (m / 60)));
            },
            _getMinuteHandAngle : function (m, s) {
                return 6 * (m + (s / 60));
            },
            _getSecondHandAngle : function (s, ms) {
                if (this._smooth === false) {
                    ms = 0;
                }

                return 6 * (s + (ms / 1000));
            },

            _runHands : function () {
                this._setHandsAngle();
                this._startClockAnimation();
            },

            _stopHands : function () {
                this._stopClockAnimation();
            },

            _startClockAnimation : function () {
                var initTime = window.performance.now();
                this._everyMinuteChecker = initTime;
                this._timer = window.requestAnimationFrame(
                    function tick(startTime) {
                        var currentTime = window.performance.now(),
                            gap;

                        gap = currentTime - this._everyMinuteChecker;
                        if (gap >= 60000) {
                            this.trigger('clock.minute');
                            this._everyMinuteChecker = currentTime;
                        }

                        gap = currentTime - startTime;
                        if (gap >= 1000) {
                            this.trigger('clock.second');
                        }

                        if (this._smooth === false && gap < 1000) {
                            window.requestAnimationFrame(tick.bind(this, startTime));
                        } else {
                            this._setHandsAngle();
                            window.requestAnimationFrame(tick.bind(this, currentTime));
                        }
                    }.bind(this, initTime)
                );
            },

            _stopClockAnimation : function () {
                if (this._timer) {
                    window.cancelAnimationFrame(this._timer);
                }
            }
        });

}());

}));
