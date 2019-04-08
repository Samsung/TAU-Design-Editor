(function(factory) {

  var root = window !== "undefined" ? window : this;

  if (typeof define === 'function' && define.amd) {

    define(['jquery', 'exports'], function($, exports) {
      exports = factory(root, $);
      return exports;
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if ( typeof module === "object" && typeof module.exports === "object" ) {

    var $ = require('jquery');
    module.exports = global.document ?
      factory(root, $) :
      function(w, $) {
        if ( !w.document ) {
          throw new Error( "dress requires a window with a document" );
        }
        return factory(w, $);
      };

  // Finally, as a browser global.
  } else {
    root.dress = factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(function(root, $) {
'use strict';
/**
 * # dress
 * Object contains main framework methods.
 * @class dress
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */

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

/**
 * # dress.Base
 * Object contains prototype of base dress element.
 * @class dress.Base
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {

        var __empty = function () { return; },

            EVENT_SPLIT_REG = /^(\S+)\s*(.*)$/,

            _convertFunctionNameFromOptionName = function (prefix, str) {
                return prefix + str.charAt(0).toUpperCase() + str.slice(1);
            };

        dress.Base = {
            componentName: '',

            defaults: {
                focusable: false,
                disable: false
            },

            events: null,

            onCreated: __empty,
            onReady: __empty,
            onAttached: __empty,
            onDetached: __empty,
            onAttributeChanged: __empty,
            onChanged: __empty,
            onDestroy: __empty,

            createdCallback: function () {
                var $el = $(this);

                this.$el = $el;
                this.options = {};

                Object.keys(this.defaults).forEach(function (optionName) {
                    this.options[optionName] = this._attributeTypeCasting(optionName, $el.attr(dress.convertToAttributeName(optionName)) || this.defaults[optionName]);
                }.bind(this));

                if (this.__callFromConstructorArguments) {
                    this.$constructor(...this.__callFromConstructorArguments);
                }

                this.onCreated();
                this.onReady();
            },

            $constructor: function (options) {
                options = options || {};

                Object.keys(options).forEach(function (optionName) {
                    this.options[optionName] = this._attributeTypeCasting(optionName, options[optionName]);
                }.bind(this));
            },

            attachedCallback: function () {
                this._unbindEvents();
                this._bindEvents();
                this.onAttached();
            },

            detachedCallback: function () {
                this._unbindEvents();
                this.onDetached();
            },

            attributeChangedCallback: function (attrName, oldValue, newValue) {
                var optionName = dress.convertToOptionName(attrName);

            // notify attribute is changed
                this.onAttributeChanged(attrName, oldValue, newValue);

                if (this.defaults[optionName]) {
                    this._setOption(optionName, this._attributeTypeCasting(optionName, newValue));
                }
            },

            trigger: function (event) {
                this.$el.trigger(event);
            },

            destroy: function () {
                this.detachedCallback();
                this._unbindEvents();
                this.onDestroy();
                this.$el = null;
                this._isInitialized = false;
            },

            _bindEvents: function () {
                var events = this.events,
                    method,
                    match,
                    eventName,
                    selector,
                    listener;

                if (!events) {
                    return;
                }

                Object.keys(events).forEach((key) => {
                    method = events[key];
                    if (!$.isFunction(method)) {
                        method = this[method];
                    }

                    if ($.isFunction(method)) {
                        match = key.match(EVENT_SPLIT_REG);
                        eventName = match[1];
                        selector = match[2];
                        listener = method.bind(this);

                        this.$el.on(eventName + '.components' + this.id, selector, listener);
                    }
                });
            },

            _unbindEvents: function () {
                this.$el.off('.components' + this.id);
            },

            _attributeTypeCasting: function (optionName, attributeValue) {
                var booltestValue;

                if ($.isNumeric(attributeValue)) {
                    return Number(attributeValue);
                }

                if (typeof attributeValue === 'string') {
                    booltestValue = attributeValue.toLowerCase().trim();
                    if (/true|false/.test(booltestValue)) {
                        return /true/.test(booltestValue);
                    }
                }

                return attributeValue;
            },

            _setOption: function (name, value) {
                var oldValue = this.options[name],
                    newValue = value;

                if (oldValue === value) {
                    return;
                }

                if (!this._callSetter(name, newValue)) {
                    this.options[name] = this._attributeTypeCasting(name, value);
                }

                this.onChanged(name, value, oldValue);
            },

            _callSetter: function (name, value) {
                var method = this[_convertFunctionNameFromOptionName('set', name)];

                if ($.isFunction(method)) {
                    method.call(this, this._attributeTypeCasting(name, value));
                    return true;
                }
                return false;
            },

            _getOption: function (name) {
                var method = this[_convertFunctionNameFromOptionName('get', name)];
                return $.isFunction(method) ? method.call(this) : this.options[name];
            }

        };

}());

/**
 * # dress.Component
 * The factory method witch make the ui component.
 * @class dress.component
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {
        var __window = window,
            __document = __window.document,
            __slice = Array.prototype.slice;

        function _get(optionName) {
            return function () {
                return this._getOption(optionName);
            };
        }

        function _set(optionName) {
            return function (value) {
                return this._setOption(optionName, value);
            };
        }

        dress.factory = function (name, prototype, parent, base) {
            var tagName = name.indexOf('-') > -1 ? name : dress.name + '-' + name,
                Constructor,
                NewComponent,
                newPrototype,
                extend;

            if (!__document.__registeredMap) {
                __document.__registeredMap = {};
            }
            Constructor = __document.__registeredMap[name];

            if (!Constructor) {
                if (!base) {
                    if (parent && typeof parent !== 'function') {
                        base = parent;
                        parent = null;
                    }

                    base = base || dress.Base;
                }

                extend = prototype.extends;
                delete prototype.extends;

                parent = parent || __window.HTMLElement;

                newPrototype = $.extend(true, Object.create(parent.prototype), base, prototype, {
                    componentName: name
                });

            // set option from attribute
                Object.keys(newPrototype.defaults).forEach(function (optionName) {
                    Object.defineProperty(newPrototype, optionName, {
                        get: _get(optionName),
                        set: _set(optionName)
                    });
                });

                NewComponent = __document.registerElement(tagName, {
                    prototype: newPrototype,
                    extends: extend
                });

                Constructor = function () {
                    var _inst;
                    NewComponent.prototype.__callFromConstructorArguments = __slice.call(arguments);
                    _inst = new NewComponent();
                    delete NewComponent.prototype.__callFromConstructorArguments;
                    return _inst;
                };
                Constructor.prototype = NewComponent.prototype;
                Constructor.constructor = Constructor;

                Constructor.createInstance = function (options) {
                    var html;

                    if (!extend) {
                        return new Constructor(options);
                    }
                    html = ['<' + extend + ' is="' + name + '" '];
                    Object.keys(options || {}).forEach(function (key) {
                        html.push(' ' + key + '="' + options[key] + '"');
                    });
                    html.push('></' + extend + '>');
                    return $(html.join(''))[0];
                };

                __document.__registeredMap[name] = Constructor;
            }

            return Constructor;
        };

}());


/**
 * # dress.closet
 * Object contains prototype of base component.
 * @class dress.closet
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {

        var __window = window,
            __document = __window.document,

            Base = dress.Base,
            factory = dress.factory,

            DRESS_CLOSET_NAME = 'closet',
            CLOSET_COMPONENT_CLASS_NAME = 'closet-component',
            FUNCTION_PARAM_SPLIT_REG = /function\s*\(\s*([^)]+?)\s*\)/,

            _getUniqueId = (function () {
                var _uniq = 0,
                    date = new Date();
                return function (name) {
                    return name + '-' + date.getTime() + (_uniq += 1);
                };
            }()),

            ClosetBase;

        function _encodeBehaviors(obj) {
            return encodeURIComponent(JSON.stringify(obj));
        }

        function _decodeBehaviors(encode) {
            return __window.JSON.parse(__window.decodeURIComponent(encode));
        }

    // dress moddule of closet has edit mode for closet editor
        $.extend(dress, {
            isEdit: false
        });

        ClosetBase = $.extend(true, {}, Base, {
            defaults: {
                behaviors: []
            },
            selectable: true,

            createdCallback: function () {
                Base.createdCallback.call(this);

                this.id = this.$el.attr('id') || _getUniqueId(this.componentName);

                this.classList.add(CLOSET_COMPONENT_CLASS_NAME);
                this._initializeBehavior();
            },

            attributeChangedCallback: function (attrName, oldValue, newValue) {
                if (attrName === 'behaviors' && oldValue !== newValue) {
                    this._unbindBehavior();
                    this._initializeBehavior();
                    return;
                }
                Base.attributeChangedCallback.call(this, attrName, oldValue, newValue);

                this.dispatchEvent(new CustomEvent('attributechanged', {
                    bubbles: true,
                    cancelable: false
                }));
            },

            show: function (effect, duration, delay) {
                if (!dress.isEdit) {
                    this.$el.css('visibility', '');
                }
                if (effect) {
                    this.animate(effect, duration, delay, function () {
                        this.style.transform = '';
                        this.style.opacity = '';
                        this.trigger('shown');
                    }.bind(this));
                }
            },

            hide: function (effect, duration, delay) {
                (function (post) {
                    if (effect) {
                        this.animate(effect, duration, delay, function () {
                            this.style.transform = '';
                            this.style.opacity = '';
                            this.style.visibility = '';
                            post();
                            this.trigger('hidden');
                        }.bind(this));
                    } else {
                        post();
                    }
                }.bind(this)(function () {
                    if (!dress.isEdit) {
                        this.$el.css('visibility', 'hidden');
                    }
                }.bind(this)));
            },

            animate: function (effect, duration, delay, callback) {
                this.$el.tween(effect, {
                    duration: __window.parseInt(duration),
                    delay: __window.parseInt(delay),
                    onComplete: callback
                });
            },

            getBehaviors: function () {
                return this.options.behaviors;
            },

            addBehavior: function (event, target, functionName, parameters) {
                var behaviors = this.options.behaviors.slice();

                behaviors.push({
                    event: event,
                    target: '#' + target,
                    functionName: functionName,
                    parameters: parameters
                });

                this._setBehaviors(behaviors);
            },

            removeBehavior: function (index) {
                var behaviors = this.options.behaviors.slice();
                behaviors.splice(index, 1);
                this._setBehaviors(behaviors);
            },

            exec: function (functionName, parameters) {
                var functionBody,
                    args = [];

                if (!this[functionName]) {
                    return;
                }

                parameters = parameters || {};

                functionBody = this[functionName].toString();
                args = FUNCTION_PARAM_SPLIT_REG.exec(functionBody);
                if (args[1]) {
                    args = args[1].split(/\s*,\s*/);
                }

                args = args.map(function (arg) {
                    return parameters[arg];
                });

                this[functionName](...args);
            },

            _initializeBehavior: function () {
                var encode = this.$el.attr('behaviors'),
                    behaviors = encode ? _decodeBehaviors(encode) : [];

                this.options.behaviors = behaviors;
                if (!dress.isEdit) {
                    this._bindBehavior();
                    if (behaviors.find(function (behavior) { return behavior.functionName === 'show'; })) {
                        this.hide();
                    }
                }
            },

            _setBehaviors: function (behaviors) {
                this.$el.attr('behaviors', _encodeBehaviors(behaviors));
            },

            _bindBehavior: function () {
                var behaviors = this.options.behaviors;
                behaviors.forEach(function (behavior) {
                    var eventName = behavior.event + '.behavior' + this.id,
                        selector = behavior.target,
                        listener = this.exec.bind(this, behavior.functionName, behavior.parameters);

                    $(__document).on(eventName, function (e) {
                        var $target = $(e.target),
                            $parents;
                        if (!$target.is('.' + CLOSET_COMPONENT_CLASS_NAME)) {
                            $parents = $target.parents('.' + CLOSET_COMPONENT_CLASS_NAME);
                            $target = $parents.length && $($parents[0]);
                        }

                        if ($target && $target.is(selector)) {
                            listener();
                        }
                    });

                }.bind(this));
            },

            _unbindBehavior: function () {
                $(__document).off('.behavior' + this.id);
            }

        });

        dress.factory = function (name, prototype, parent) {
            return factory(DRESS_CLOSET_NAME + '-' + name, prototype, parent, ClosetBase);
        };

    // notify dress module loaded. closet editor can know that dress library is ready.
        if (__window.parent && __window.parent !== __window) {
            __window.parent.dispatchEvent(new CustomEvent('dressloaded', {
                bubbles: true,
                cancelable: false,
                detail: dress
            }));
        }

}());

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

/**
 * # dress.Section
 * Object contains main framework methods.
 * @class dress.Section
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {

        dress.Section = dress.factory('section', {
        });

}());

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

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define('components/../../libs/bezier-easing.min',[],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.BezierEasing=e()}}(function(){return function e(t,n,r){function i(s,u){if(!n[s]){if(!t[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(o)return o(s,!0);var f=new Error("Cannot find module '"+s+"'");throw f.code="MODULE_NOT_FOUND",f}var p=n[s]={exports:{}};t[s][0].call(p.exports,function(e){var n=t[s][1][e];return i(n?n:e)},p,p.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t){function n(e,t){return 1-3*t+3*e}function r(e,t){return 3*t-6*e}function i(e){return 3*e}function o(e,t,o){return((n(t,o)*e+r(t,o))*e+i(t))*e}function s(e,t,o){return 3*n(t,o)*e*e+2*r(t,o)*e+i(t)}function u(e,t,n,r,i){var s,u,a=0;do u=t+(n-t)/2,s=o(u,r,i)-e,s>0?n=u:t=u;while(Math.abs(s)>h&&++a<l);return u}function a(e,t,n,r){for(var i=0;p>i;++i){var u=s(t,n,r);if(0===u)return t;var a=o(t,n,r)-e;t-=a/u}return t}function f(e,t,n,r){if(4===arguments.length)return new f([e,t,n,r]);if(!(this instanceof f))return new f(e);if(!e||4!==e.length)throw new Error("BezierEasing: points must contains 4 values");for(var i=0;4>i;++i)if("number"!=typeof e[i]||isNaN(e[i])||!isFinite(e[i]))throw new Error("BezierEasing: points should be integers.");if(e[0]<0||e[0]>1||e[2]<0||e[2]>1)throw new Error("BezierEasing x values must be in [0, 1] range.");this._str="BezierEasing("+e+")",this._css="cubic-bezier("+e+")",this._p=e,this._mSampleValues=m?new Float32Array(_):new Array(_),this._precomputed=!1,this.get=this.get.bind(this)}var p=4,c=.001,h=1e-7,l=10,_=11,d=1/(_-1),m="function"==typeof Float32Array;f.prototype={get:function(e){var t=this._p[0],n=this._p[1],r=this._p[2],i=this._p[3];return this._precomputed||this._precompute(),t===n&&r===i?e:0===e?0:1===e?1:o(this._getTForX(e),n,i)},getPoints:function(){return this._p},toString:function(){return this._str},toCSS:function(){return this._css},_precompute:function(){var e=this._p[0],t=this._p[1],n=this._p[2],r=this._p[3];this._precomputed=!0,(e!==t||n!==r)&&this._calcSampleValues()},_calcSampleValues:function(){for(var e=this._p[0],t=this._p[2],n=0;_>n;++n)this._mSampleValues[n]=o(n*d,e,t)},_getTForX:function(e){for(var t=this._p[0],n=this._p[2],r=this._mSampleValues,i=0,o=1,f=_-1;o!==f&&r[o]<=e;++o)i+=d;--o;var p=(e-r[o])/(r[o+1]-r[o]),h=i+p*d,l=s(h,t,n);return l>=c?a(e,h,t,n):0===l?h:u(e,i,i+d,t,n)}},f.css={ease:f.ease=f(.25,.1,.25,1),linear:f.linear=f(0,0,1,1),"ease-in":f.easeIn=f(.42,0,1,1),"ease-out":f.easeOut=f(0,0,.58,1),"ease-in-out":f.easeInOut=f(.42,0,.58,1)},t.exports=f},{}]},{},[1])(1)});
var Component3d;
(function (Component3d) {
    var BaseComponent = (function () {
        function BaseComponent(collectionRenderer, componentRenderer) {
            this._componentIsMounted = false;
            this._componentDirection = 1;
            this._componentInitialScrollingIndex = 1;
            this._componentSize = new Component3d.Size2DModel(undefined, undefined);
            this._componentSizeMeasureTypes = {
                measureWidthType: "px",
                measureHeightType: "px"
            };
            this._componentMargin = new Component3d.Size2DModel(20, 20);
            this._componentBackground = "rgb(0, 0, 0)";
            this._nodeSize = new Component3d.Size2DModel(undefined, undefined);
            this._nodeMargin = new Component3d.Size2DModel(10, 10);
            this._setCollectionRenderer(collectionRenderer);
            this._setComponentRenderer(componentRenderer);
            this._getComponentRenderer()._set3dComponentWrapperDom(this);
        }
        BaseComponent.prototype.attachToParent = function (parentDom) {
            if (!(parentDom instanceof HTMLElement)) {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_INSTANCE_OF_HTML_ELEMENT());
            }
            this._componentParentDom = parentDom;
            this._getComponentRenderer()._setComponentDom(this);
            return this;
        };
        BaseComponent.prototype.detachFromParent = function () {
            this._componentParentDom = undefined;
            this._getComponentRenderer()._detachFromParent(this);
            return this;
        };
        BaseComponent.prototype.update = function () {
            this._getComponentRenderer()._update(this);
            return this;
        };
        BaseComponent.prototype.insert = function (nodes, nodeIndex) {
            var self = this, i;
            if (nodes instanceof Array) {
                i = nodeIndex;
                nodes.map(function (node) {
                    self._insertNode(node, i++);
                });
                return this;
            }
            this._insertNode(nodes, nodeIndex);
            return this;
        };
        BaseComponent.prototype.remove = function (nodeIndex) {
            this._getCollection()._removeNodeFromChangesStorage(nodeIndex);
            return this;
        };
        BaseComponent.prototype.scrollingOn = function () {
            this._getComponentRenderer()._scrollingOn(this);
            return this;
        };
        BaseComponent.prototype.scrollingOff = function () {
            this._getComponentRenderer()._scrollingOff(this);
            return this;
        };
        BaseComponent.prototype.getScrollingIndex = function () {
            return this._componentInitialScrollingIndex;
        };
        BaseComponent.prototype.setScrollingIndex = function (initialScrollingIndex) {
            if (typeof initialScrollingIndex !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentInitialScrollingIndex = initialScrollingIndex;
            return this;
        };
        BaseComponent.prototype.getDirection = function () {
            return this._componentDirection;
        };
        BaseComponent.prototype.setDirection = function (direction) {
            if (typeof direction !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentDirection = direction;
            return this;
        };
        BaseComponent.prototype.getBackground = function () {
            return this._componentBackground;
        };
        BaseComponent.prototype.setBackground = function (background) {
            if (typeof background !== "string") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }
            this._componentBackground = background;
            return this;
        };
        BaseComponent.prototype.getComponentHeight = function () {
            return this._componentSize.height;
        };
        BaseComponent.prototype.getComponentWidth = function () {
            return this._componentSize.width;
        };
        BaseComponent.prototype.setComponentSize = function (width, height) {
            if (typeof width !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            if (typeof height !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentSize.width = width;
            this._componentSize.height = height;
            return this;
        };
        BaseComponent.prototype.getComponentMeasureTypes = function () {
            return this._componentSizeMeasureTypes;
        };
        BaseComponent.prototype.setComponentWidthMeasure = function (measureType) {
            if (typeof measureType !== "string") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }
            if (measureType !== "px" && measureType !== "%") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_PX_OR_PERCENT());
            }
            this._componentSizeMeasureTypes.measureWidthType = measureType;
            return this;
        };
        BaseComponent.prototype.setComponentHeightMeasure = function (measureType) {
            if (typeof measureType !== "string") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }
            if (measureType !== "px" && measureType !== "%") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_PX_OR_PERCENT());
            }
            this._componentSizeMeasureTypes.measureHeightType = measureType;
            return this;
        };
        BaseComponent.prototype.getNumberOfStacks = function () {
            return this._getCollection()._getNumberOfStacks();
        };
        BaseComponent.prototype.setNumberOfStacks = function (numberOfStacks) {
            if (typeof numberOfStacks !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._getCollection()._setNumberOfStacks(numberOfStacks);
            return this;
        };
        BaseComponent.prototype.getNodeMargin = function () {
            return this._nodeMargin;
        };
        BaseComponent.prototype.setNodeMargin = function (x, y) {
            if (typeof x !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            if (typeof y !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._nodeMargin = new Component3d.Size2DModel(x, y);
            return this;
        };
        BaseComponent.prototype.getComponentMargin = function () {
            return this._componentMargin;
        };
        BaseComponent.prototype.setComponentMargin = function (x, y) {
            if (typeof x !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            if (typeof y !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentMargin = new Component3d.Size2DModel(x, y);
            return this;
        };
        BaseComponent.prototype.getCamera = function () {
            return this._componentCamera;
        };
        BaseComponent.prototype.setCamera = function (camera) {
            this._componentCamera = camera;
            return this;
        };
        BaseComponent.prototype.getNodeWidth = function () {
            return this._nodeSize.width;
        };
        BaseComponent.prototype.setNodeWidth = function (nodeWidth) {
            this._nodeSize.width = nodeWidth;
            return this;
        };
        BaseComponent.prototype.getNodeHeight = function () {
            return this._nodeSize.height;
        };
        BaseComponent.prototype.setNodeHeight = function (nodeHeight) {
            this._nodeSize.height = nodeHeight;
            return this;
        };
        BaseComponent.prototype.getCollectionLength = function () {
            return this._getCollection()._getCollectionLength();
        };
        BaseComponent.prototype._getParentDom = function () {
            return this._componentParentDom;
        };
        BaseComponent.prototype._getCollection = function () {
            return this._collection;
        };
        BaseComponent.prototype._setCollection = function () {
            this._collection._setComponent(this);
        };
        BaseComponent.prototype._insertNode = function (node, nodeIndex) {
            var CollectionModelClass = this._getCollection()._getNodeConstructor(), model = new CollectionModelClass(node);
            this._getCollection()._insertNodeIntoChangesStorage(model, nodeIndex);
            return this;
        };
        BaseComponent.prototype._getComponentSizeInPx = function () {
            var componentMeasureTypes = this.getComponentMeasureTypes(), componentHeight = this.getComponentHeight(), componentWidth = this.getComponentWidth(), parentDom = this._getDom(), res = new Component3d.Size2DModel(componentWidth, componentHeight);
            if (!parentDom || !parentDom.parentNode) {
                return res;
            }
            if (componentMeasureTypes.measureWidthType === "%") {
                res.width = res.width * parentDom.parentNode.clientWidth / 100;
            }
            if (componentMeasureTypes.measureHeightType === "%") {
                res.height = res.height * parentDom.parentNode.clientHeight / 100;
            }
            return res;
        };
        BaseComponent.prototype._getNodeDefaultPosition = function () {
            return this._getBorders().min;
        };
        BaseComponent.prototype._getComponentSizePxWithoutMargin = function () {
            var componentSizeInPx = this._getComponentSizeInPx(), componentMarginW = this._componentMargin.width, componentMarginH = this._componentMargin.height;
            return new Component3d.Size2DModel(componentSizeInPx.width - 2 * componentMarginW, componentSizeInPx.height - 2 * componentMarginH);
        };
        BaseComponent.prototype._getIsMounted = function () {
            return this._componentIsMounted;
        };
        BaseComponent.prototype._setIsMounted = function (mounted) {
            this._componentIsMounted = mounted;
        };
        BaseComponent.prototype._getDirectionCoefficient = function () {
            return -this._componentDirection;
        };
        BaseComponent.prototype._getDom = function () {
            return this._componentDom;
        };
        BaseComponent.prototype._setDom = function (componentDom) {
            this._componentDom = componentDom;
        };
        BaseComponent.prototype._getScrollingPosition = function () {
            return this._componentScrollingPosition;
        };
        BaseComponent.prototype._setScrollingPosition = function (position) {
            this._componentScrollingPosition = position;
        };
        BaseComponent.prototype._getScrollingLib = function () {
            return this._componentScrollingLib;
        };
        BaseComponent.prototype._setScrollingLib = function (scrollingLib) {
            this._componentScrollingLib = scrollingLib;
        };
        BaseComponent.prototype._getCollectionRenderer = function () {
            return this._nodeRenderer;
        };
        BaseComponent.prototype._setCollectionRenderer = function (renderer) {
            this._nodeRenderer = renderer;
        };
        BaseComponent.prototype._getComponentRenderer = function () {
            return this._componentRenderer;
        };
        BaseComponent.prototype._setComponentRenderer = function (componentRenderer) {
            this._componentRenderer = componentRenderer;
        };
        BaseComponent.prototype._getNodeCenterX = function () {
            return (this._getComponentSizePxWithoutMargin().width - this.getNodeWidth()) / 2;
        };
        BaseComponent.prototype._getNodeCenterY = function () {
            return (this._getComponentSizePxWithoutMargin().height - this.getNodeHeight()) / 2;
        };
        BaseComponent.prototype._setInitialScrollingPosition = function () {
            var positionFromIndex = this._getPositionFromIndex();
            this._setScrollingPosition(positionFromIndex);
        };
        return BaseComponent;
    })();
    Component3d.BaseComponent = BaseComponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var BaseNode = (function () {
        function BaseNode(data) {
            this._data = undefined;
            this._dom = undefined;
            this._domProps = {};
            this._collection = undefined;
            this._setData(data);
        }
        BaseNode.prototype._getData = function () {
            return this._data;
        };
        BaseNode.prototype._setData = function (data) {
            this._data = data;
        };
        BaseNode.prototype._getCollection = function () {
            return this._collection;
        };
        BaseNode.prototype._setCollection = function (collection) {
            this._collection = collection;
        };
        BaseNode.prototype._getComponent = function () {
            if (!this._collection) {
                throw new Component3d.OutOfRangeExceptionModel();
            }
            return this._collection._getComponent();
        };
        BaseNode.prototype._getNodeWidth = function () {
            var component = this._getComponent();
            if (!component) {
                throw new Component3d.OutOfRangeExceptionModel();
            }
            return component.getNodeWidth();
        };
        BaseNode.prototype._getNodeHeight = function () {
            var component = this._getComponent();
            if (!component) {
                throw new Component3d.OutOfRangeExceptionModel();
            }
            return component.getNodeHeight();
        };
        BaseNode.prototype._getDom = function () {
            return this._dom;
        };
        BaseNode.prototype._setDom = function (dom) {
            this._dom = dom;
        };
        BaseNode.prototype._getDomProps = function () {
            return this._domProps;
        };
        BaseNode.prototype._getNumberOfStack = function () {
            var collection = this._getCollection(), collectionNumberOfStacks = collection._getNumberOfStacks(), nodeIndex = collection._getIndexOfNodeInCollection(this);
            return nodeIndex % collectionNumberOfStacks;
        };
        BaseNode.prototype._getIndexInStack = function () {
            var collection = this._getCollection(), collectionNumberOfStacks = collection._getNumberOfStacks(), nodeIndex = collection._getIndexOfNodeInCollection(this);
            return Math.trunc(nodeIndex / collectionNumberOfStacks);
        };
        return BaseNode;
    })();
    Component3d.BaseNode = BaseNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var BaseCollection = (function () {
        function BaseCollection() {
            this._component = undefined;
            this._numberOfStacks = 3;
            this._nodes = [];
            this._changesStorage = new Component3d.ChangesStorage();
        }
        BaseCollection.prototype._getNumberOfStacks = function () {
            return this._numberOfStacks;
        };
        BaseCollection.prototype._setNumberOfStacks = function (numberOfStacks) {
            this._numberOfStacks = numberOfStacks;
        };
        BaseCollection.prototype._insertNodeIntoChangesStorage = function (node, nodeIndex) {
            this._changesStorage._insert(node, nodeIndex);
        };
        BaseCollection.prototype._removeNodeFromChangesStorage = function (nodeIndex) {
            this._changesStorage._remove(nodeIndex);
        };
        BaseCollection.prototype._getComponent = function () {
            return this._component;
        };
        BaseCollection.prototype._setComponent = function (component) {
            this._component = component;
        };
        BaseCollection.prototype._getNodes = function () {
            return this._nodes;
        };
        BaseCollection.prototype._applyOngoingChanges = function () {
            var self = this;
            this._changesStorage._getOngoingChanges().map(function (ongoingChange) {
                var nodeIndex = ongoingChange.data.index;
                switch (ongoingChange.type) {
                    case Component3d.OngoingChangeEnum.ADD:
                        self._applyInsertOngoingChange(nodeIndex, ongoingChange.data.element);
                        break;
                    case Component3d.OngoingChangeEnum.REMOVE:
                        self._applyRemoveOngoingChange(nodeIndex);
                        break;
                    default:
                        throw new Component3d.OutOfRangeExceptionModel();
                        break;
                }
            });
            this._changesStorage._clearOngoingChanges();
        };
        BaseCollection.prototype._applyInsertOngoingChange = function (nodeIndex, node) {
            var nodeComponent, nodeRenderer, parentDom;
            node._setCollection(this);
            nodeComponent = node._getComponent();
            nodeRenderer = nodeComponent._getCollectionRenderer()._getNodeRenderer();
            parentDom = nodeComponent._getDom();
            nodeRenderer._initNodeDom(node, parentDom);
            this._insertNoteIntoCollection(nodeIndex, node);
        };
        BaseCollection.prototype._applyRemoveOngoingChange = function (nodeIndex) {
            var node, nodeComponent, nodeRenderer;
            node = this._getNodeFromCollectionByIndex(nodeIndex);
            nodeComponent = this._getComponent();
            nodeRenderer = nodeComponent._getCollectionRenderer()._getNodeRenderer();
            nodeRenderer._detachFromParent(node);
            this._removeNoteFromCollection(nodeIndex);
        };
        BaseCollection.prototype._getCollectionLength = function () {
            return this._getNodes().length;
        };
        BaseCollection.prototype._getNodeFromCollectionByIndex = function (index) {
            return this._getNodes()[index];
        };
        BaseCollection.prototype._getIndexOfNodeInCollection = function (node) {
            return this._getNodes().indexOf(node);
        };
        BaseCollection.prototype._insertNoteIntoCollection = function (nodeIndex, node) {
            this._getNodes().splice(nodeIndex, 0, node);
        };
        BaseCollection.prototype._removeNoteFromCollection = function (nodeIndex) {
            this._getNodes().splice(nodeIndex, 1);
        };
        BaseCollection.prototype._getMaxIndexInStacks = function () {
            var collectionLength = this._getCollectionLength(), lastNodeIndex = collectionLength - 1, numberOfStacks = this._getNumberOfStacks();
            return 1 + Math.trunc(lastNodeIndex / numberOfStacks);
        };
        return BaseCollection;
    })();
    Component3d.BaseCollection = BaseCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var INodeRenderer = (function () {
        function INodeRenderer() {
            this.SELECTING_NODE_ANIMATION_TIME = 600;
        }
        INodeRenderer.prototype._update = function (nodeModel) {
            this._setNodeDomStyle(nodeModel);
        };
        INodeRenderer.prototype._detachFromParent = function (nodeModel) {
            var parentDom = nodeModel._getComponent()._getDom();
            this._removeDom(nodeModel, parentDom);
        };
        INodeRenderer.prototype._initNodeDom = function (nodeModel, parentDom) {
            var nodeDom = this._createComponentDom();
            this._setComponentDomStyle(nodeDom);
            this._initNodeDomChild(nodeModel, nodeDom);
            this._appendComponentDomToParent(nodeDom, parentDom);
            nodeModel._setDom(nodeDom);
        };
        INodeRenderer.prototype._createComponentDom = function () {
            return document.createElement("div");
        };
        INodeRenderer.prototype._setComponentDomStyle = function (nodeDom) {
            nodeDom.style.textAlign = "center";
        };
        INodeRenderer.prototype._appendComponentDomToParent = function (nodeDom, parentDom) {
            parentDom.appendChild(nodeDom);
        };
        INodeRenderer.prototype._initNodeDomChild = function (model, nodeDom) {
            var nodeDomChild = model._getData().dom;
            nodeDomChild.style.maxWidth = "100%";
            nodeDomChild.style.maxHeight = "100%";
            nodeDom.appendChild(nodeDomChild);
        };
        INodeRenderer.prototype._removeDom = function (nodeModel, parentDom) {
            var modelDom = nodeModel._getDom();
            parentDom.removeChild(modelDom);
            nodeModel._setDom(undefined);
        };
        INodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            throw new Component3d.NotImplementedExceptionModel();
        };
        INodeRenderer.prototype._setNodeBaseDomStyle = function (nodeModel) {
            var self = this, component = nodeModel._getComponent(), nodeWidth = nodeModel._getNodeWidth(), nodeHeight = nodeModel._getNodeHeight(), nodeDom = nodeModel._getDom(), nodeMaxWidth = component._getNodeMaxWidth(), nodeMaxHeight = component._getNodeMaxHeight(), nodeMaxWidthWithMargin = nodeMaxWidth - component.getNodeMargin().width * 2, nodeMaxHeightWithMargin = nodeMaxHeight - component.getNodeMargin().height * 2;
            nodeDom.className = "component-item-3d";
            nodeDom.style.position = "absolute";
            nodeDom.style.width = nodeWidth + "px";
            nodeDom.style.height = nodeHeight + "px";
            this._setMaxSizeDomStyleProp(nodeDom, "max-width", nodeMaxWidthWithMargin);
            this._setMaxSizeDomStyleProp(nodeDom, "max-height", nodeMaxHeightWithMargin);
            nodeDom.onmousedown = function (e) {
                component._getScrollingLib().preventClickEvent = false;
            };
            nodeDom.onclick = function (e) {
                if (component._getScrollingLib().preventClickEvent === true) {
                    return;
                }
                self._nodeClickHandler(nodeModel);
            };
        };
        INodeRenderer.prototype._setMaxSizeDomStyleProp = function (nodeDom, nodeDomPropName, nodeMaxPropValue) {
            if (nodeMaxPropValue >= 0) {
                nodeDom.style[nodeDomPropName] = nodeMaxPropValue + "px";
                return;
            }
            if (nodeMaxPropValue < 0) {
                throw new Component3d.OutOfRangeExceptionModel();
            }
        };
        INodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            throw new Component3d.NotImplementedExceptionModel();
        };
        return INodeRenderer;
    })();
    Component3d.INodeRenderer = INodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ICollectionRenderer = (function () {
        function ICollectionRenderer(i3dNodeRenderer) {
            this._i3dNodeRenderer = i3dNodeRenderer;
        }
        ICollectionRenderer.prototype._getNodeRenderer = function () {
            return this._i3dNodeRenderer;
        };
        ICollectionRenderer.prototype._mountOrUpdate = function (collectionModel) {
            var self = this;
            collectionModel._getNodes().map(function (node) {
                self._getNodeRenderer()._update(node);
            });
        };
        ICollectionRenderer.prototype._detachFromParent = function (model) {
            var i, nodes = model._getNodes(), nodesLength = nodes.length, node;
            for (i = nodesLength - 1; i >= 0; i--) {
                node = nodes[i];
                this._getNodeRenderer()._detachFromParent(node);
                nodes.splice(i, 1);
            }
        };
        return ICollectionRenderer;
    })();
    Component3d.ICollectionRenderer = ICollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var I3dComponentRenderer = (function () {
        function I3dComponentRenderer(collectionRenderer) {
            this._nodeRenderer = collectionRenderer;
        }
        I3dComponentRenderer.prototype._getCollectionRenderer = function () {
            return this._nodeRenderer;
        };
        I3dComponentRenderer.prototype._setComponentDom = function (componentModel, directionDomProperty) {
            var collection = componentModel._getCollection();
            this._set3dComponentWrapperDomStyle(componentModel);
            componentModel._setInitialScrollingPosition();
            this._getCollectionRenderer()._mountOrUpdate(collection);
            this._initScroller(componentModel, directionDomProperty);
        };
        I3dComponentRenderer.prototype._detachFromParent = function (componentModel) {
            var collection;
            if (componentModel._getIsMounted() === false) {
                return;
            }
            collection = componentModel._getCollection();
            componentModel._setIsMounted(false);
            this._scrollingOff(componentModel);
            this._getCollectionRenderer()._detachFromParent(collection);
            this._removeDom(componentModel);
        };
        I3dComponentRenderer.prototype._update = function (componentModel) {
            var componentParentDom, componentDom, collection;
            if (componentModel._getIsMounted() === false) {
                componentParentDom = componentModel._getParentDom();
                componentDom = componentModel._getDom();
                componentParentDom.appendChild(componentDom);
                componentModel._setIsMounted(true);
            }
            collection = componentModel._getCollection();
            collection._applyOngoingChanges();
            this._set3dComponentWrapperDomStyle(componentModel);
            this._getCollectionRenderer()._mountOrUpdate(collection);
            componentModel._getScrollingLib()._resetPositionIfNoScrolling(componentModel);
        };
        I3dComponentRenderer.prototype._scrollingOn = function (componentModel) {
            componentModel._getScrollingLib().init();
        };
        I3dComponentRenderer.prototype._scrollingOff = function (componentModel) {
            componentModel._getScrollingLib().destroy();
        };
        I3dComponentRenderer.prototype._initScroller = function (componentModel, domDirection) {
            var componentDom = componentModel._getDom(), componentScrollingModule = new ScrollingModule(componentModel, componentDom, domDirection);
            componentModel._setScrollingLib(componentScrollingModule);
        };
        I3dComponentRenderer.prototype._removeDom = function (componentModel) {
            var componentDom = componentModel._getDom();
            componentDom.parentNode.removeChild(componentDom);
        };
        I3dComponentRenderer.prototype._set3dComponentWrapperDom = function (componentModel) {
            var componentDom = document.createElement("div");
            componentModel._setDom(componentDom);
        };
        I3dComponentRenderer.prototype._set3dComponentWrapperDomStyle = function (componentModel) {
            var componentDom = componentModel._getDom(), componentCamera = componentModel.getCamera(), cameraPerspective = componentCamera.perspective, cameraPerspectiveOriginX = componentCamera.perspectiveOriginX, cameraPerspectiveOriginY = componentCamera.perspectiveOriginY, cameraPerspectiveOrigin = cameraPerspectiveOriginX + "% " + cameraPerspectiveOriginY + "%", componentWidthWithMeasure = componentModel.getComponentWidth() + componentModel.getComponentMeasureTypes().measureWidthType, componentHeightWithMeasure = componentModel.getComponentHeight() + componentModel.getComponentMeasureTypes().measureHeightType, componentBackground = componentModel.getBackground();
            componentDom.style.userSelect = "none";
            componentDom.style.webkitUserSelect = "none";
            componentDom.style.webkitUserDrag = "none";
            componentDom.style.webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
            componentDom.style.touchAction = "none";
            componentDom.style.position = "relative";
            componentDom.style.overflow = "hidden";
            componentDom.style.zIndex = "0";
            componentDom.style.perspective = cameraPerspective + "px";
            componentDom.style["-webkit-perspective"] = cameraPerspective + "px";
            componentDom.style.perspectiveOrigin = cameraPerspectiveOrigin;
            componentDom.style["-webkit-perspective-origin"] = cameraPerspectiveOrigin;
            componentDom.style.width = componentWidthWithMeasure;
            componentDom.style.height = componentHeightWithMeasure;
            componentDom.style.margin = "0px auto";
            componentDom.style.background = componentBackground;
        };
        return I3dComponentRenderer;
    })();
    Component3d.I3dComponentRenderer = I3dComponentRenderer;
})(Component3d || (Component3d = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Component3d;
(function (Component3d) {
    var CoverFlowComponent = (function (_super) {
        __extends(CoverFlowComponent, _super);
        function CoverFlowComponent() {
            var componentRenderer = new Component3d.CoverFlowComponentRenderer(), collectionRenderer = new Component3d.CoverFlowCollectionRenderer(), componentCamera = new Component3d.CameraModel(1000, 50, 50), componentSizeW = 800, componentSizeH = 400, nodeSizeW = 250, nodeSizeH = 300;
            _super.call(this, collectionRenderer, componentRenderer);
            _super.prototype.setCamera.call(this, componentCamera);
            _super.prototype.setComponentSize.call(this, componentSizeW, componentSizeH);
            _super.prototype.setNodeWidth.call(this, nodeSizeW);
            _super.prototype.setNodeHeight.call(this, nodeSizeH);
            _super.prototype.setComponentWidthMeasure.call(this, "px");
            _super.prototype.setComponentHeightMeasure.call(this, "px");
            _super.prototype.setDirection.call(this, 1);
            this._setCollection();
        }
        CoverFlowComponent.prototype._setCollection = function () {
            this._collection = new Component3d.CoverFlowCollection();
            _super.prototype._setCollection.call(this);
        };
        CoverFlowComponent.prototype._getNodeMaxWidth = function () {
            return undefined;
        };
        CoverFlowComponent.prototype._getNodeMaxHeight = function () {
            return this._getComponentSizePxWithoutMargin().height / this._getCollection()._getNumberOfStacks();
        };
        CoverFlowComponent.prototype._getPositionFromIndex = function () {
            return _super.prototype._getNodeDefaultPosition.call(this);
        };
        CoverFlowComponent.prototype._getCentralPos = function (nodeModel, direction) {
            var nodeIndexInStack = nodeModel._getIndexInStack(), nodeXPos = this._getNodeXPos(nodeIndexInStack);
            return this._getNodeCenterX() - direction * nodeXPos;
        };
        CoverFlowComponent.prototype._getNodeYCenterShift = function () {
            var nodeMaxHeight = this._getNodeMaxHeight() - 2 * this.getNodeMargin().height, nodeHeight = this.getNodeHeight();
            return Math.max(0, (nodeMaxHeight - nodeHeight) / 2);
        };
        CoverFlowComponent.prototype._getNodeXPos = function (nodeIndex) {
            return nodeIndex * this.getNodeWidth();
        };
        CoverFlowComponent.prototype._getBorders = function () {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(), componentMargin = this._getNodeCenterX(), componentDirection = this.getDirection(), componentBorderShift = this._getNodeCenterX(), min = -componentMargin * componentDirection + componentBorderShift, max = min + this._getNodeXPos(componentMaxIndexInStacks - 1) - 2 * componentBorderShift;
            if (max < min) {
                max = min;
            }
            return new Component3d.RangeModel(min, max);
        };
        return CoverFlowComponent;
    })(Component3d.BaseComponent);
    Component3d.CoverFlowComponent = CoverFlowComponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowNode = (function (_super) {
        __extends(CoverFlowNode, _super);
        function CoverFlowNode(data) {
            _super.call(this, data);
            this._setDefaultProps();
        }
        CoverFlowNode.prototype._setDefaultProps = function () {
            _super.prototype._getDomProps.call(this).style = {};
            _super.prototype._getDomProps.call(this).style.visibility = "visible";
        };
        CoverFlowNode.prototype._getDegree = function (component, xPos) {
            var maxDegree = 45, componentWidth = component._getComponentSizeInPx().width, nodeWidth = this._getNodeWidth(), leftEdge = componentWidth / 2 - nodeWidth - nodeWidth / 2, rightEdge = componentWidth / 2 + nodeWidth + nodeWidth / 2, xPosCenter = xPos + nodeWidth / 2;
            if (xPosCenter < leftEdge) {
                return maxDegree;
            }
            if (xPosCenter > rightEdge) {
                return -maxDegree;
            }
            return (componentWidth / 2 - xPosCenter) / (3 * nodeWidth / 2) * maxDegree;
        };
        CoverFlowNode.prototype._getZIndex = function (xPos) {
            var componentWidth = this._getComponent()._getComponentSizeInPx().width;
            return -Math.abs(Math.round(componentWidth / 2 - xPos));
        };
        CoverFlowNode.prototype._isVisible = function (xPos) {
            var componentWidth = this._getComponent()._getComponentSizeInPx().width, leftBorderXPos = 0, rightBorderXPos = leftBorderXPos + componentWidth, nodeWidth = this._getNodeWidth(), isLeftBorderIsOk = xPos + nodeWidth >= leftBorderXPos, isRightBorderIsOk = xPos <= rightBorderXPos;
            return isLeftBorderIsOk && isRightBorderIsOk;
        };
        return CoverFlowNode;
    })(Component3d.BaseNode);
    Component3d.CoverFlowNode = CoverFlowNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowCollection = (function (_super) {
        __extends(CoverFlowCollection, _super);
        function CoverFlowCollection() {
            _super.call(this);
        }
        CoverFlowCollection.prototype._getNodeConstructor = function () {
            return Component3d.CoverFlowNode;
        };
        return CoverFlowCollection;
    })(Component3d.BaseCollection);
    Component3d.CoverFlowCollection = CoverFlowCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowNodeRenderer = (function (_super) {
        __extends(CoverFlowNodeRenderer, _super);
        function CoverFlowNodeRenderer() {
            _super.call(this);
        }
        CoverFlowNodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(), nodeIndexInStack = nodeModel._getIndexInStack();
            _super.prototype._setNodeBaseDomStyle.call(this, nodeModel);
            this._setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
        };
        CoverFlowNodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            var component = nodeModel._getComponent(), componentDirection = component.getDirection(), componentCentralPos = component._getCentralPos(nodeModel, componentDirection), componentDestination = -componentCentralPos * componentDirection;
            component._getScrollingLib().scroll(component, componentDestination, this.SELECTING_NODE_ANIMATION_TIME);
        };
        CoverFlowNodeRenderer.prototype._setNodeDomStyleTransform = function (nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var component = nodeModel._getComponent(), componentDirection = component.getDirection(), componentMargin = component.getComponentMargin(), nodeDom = nodeModel._getDom(), nodeDomProps = nodeModel._getDomProps(), nodeMaxHeight = component._getNodeMaxHeight(), nodeYCenterShift = component._getNodeYCenterShift(), nodeXPos = component._getNodeXPos(nodeIndexInStack), nodeMarginX = 0, nodeMarginY = component.getNodeMargin().height, nodePosX = componentMargin.width + nodeMarginX + component._getScrollingPosition() + componentDirection * nodeXPos, nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift, nodePosZ = 0, nodeDegree = nodeModel._getDegree(component, nodePosX), nodeZIndex = nodeModel._getZIndex(nodePosX), nodeIsVisible = nodeModel._isVisible(nodePosX);
            if (nodeIsVisible) {
                nodeDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) rotate3d(0, 1, 0, " + nodeDegree + "deg)";
                nodeDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) rotate3d(0, 1, 0, " + nodeDegree + "deg)";
                nodeDom.style["z-index"] = nodeZIndex;
                nodeDom.style.visibility = "visible";
                nodeDomProps.style.visibility = "visible";
                return;
            }
            if (nodeDomProps.style.visibility !== "hidden") {
                nodeDom.style.visibility = "hidden";
                nodeDomProps.style.visibility = "hidden";
            }
        };
        return CoverFlowNodeRenderer;
    })(Component3d.INodeRenderer);
    Component3d.CoverFlowNodeRenderer = CoverFlowNodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowCollectionRenderer = (function (_super) {
        __extends(CoverFlowCollectionRenderer, _super);
        function CoverFlowCollectionRenderer() {
            _super.call(this, new Component3d.CoverFlowNodeRenderer());
        }
        return CoverFlowCollectionRenderer;
    })(Component3d.ICollectionRenderer);
    Component3d.CoverFlowCollectionRenderer = CoverFlowCollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowComponentRenderer = (function (_super) {
        __extends(CoverFlowComponentRenderer, _super);
        function CoverFlowComponentRenderer() {
            _super.call(this, new Component3d.CoverFlowCollectionRenderer());
        }
        CoverFlowComponentRenderer.prototype._setComponentDom = function (model) {
            var directionProperty = "pageX";
            _super.prototype._setComponentDom.call(this, model, directionProperty);
        };
        return CoverFlowComponentRenderer;
    })(Component3d.I3dComponentRenderer);
    Component3d.CoverFlowComponentRenderer = CoverFlowComponentRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListComponent = (function (_super) {
        __extends(ListComponent, _super);
        function ListComponent() {
            var componentRenderer = new Component3d.ListComponentRenderer(), collectionRenderer = new Component3d.ListCollectionRenderer(), componentCamera = new Component3d.CameraModel(1000, 50, -50), componentSizeW = 800, componentSizeH = 400, nodeSizeW = 250, nodeSizeH = 300;
            _super.call(this, collectionRenderer, componentRenderer);
            this._distanceZBetweenNodes = 500;
            _super.prototype.setCamera.call(this, componentCamera);
            _super.prototype.setComponentSize.call(this, componentSizeW, componentSizeH);
            _super.prototype.setNodeWidth.call(this, nodeSizeW);
            _super.prototype.setNodeHeight.call(this, nodeSizeH);
            _super.prototype.setComponentWidthMeasure.call(this, "px");
            _super.prototype.setComponentHeightMeasure.call(this, "px");
            _super.prototype.setDirection.call(this, -1);
            this._setCollection();
        }
        ListComponent.prototype._setCollection = function () {
            this._collection = new Component3d.ListCollection();
            _super.prototype._setCollection.call(this);
        };
        ListComponent.prototype.getDistanceZBetweenNodes = function () {
            return this._distanceZBetweenNodes;
        };
        ListComponent.prototype.setDistanceZBetweenNodes = function (distanceZBetweenNodes) {
            if (typeof distanceZBetweenNodes !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._distanceZBetweenNodes = distanceZBetweenNodes;
            return this;
        };
        ListComponent.prototype._getNodeMaxWidth = function () {
            return this._getComponentSizePxWithoutMargin().width / this._getCollection()._getNumberOfStacks();
        };
        ListComponent.prototype._getNodeMaxHeight = function () {
            return undefined;
        };
        ListComponent.prototype._getPositionFromIndex = function () {
            return _super.prototype._getNodeDefaultPosition.call(this);
        };
        ListComponent.prototype._getCentralPos = function (model) {
            return this.getDistanceZBetweenNodes() * model._getIndexInStack();
        };
        ListComponent.prototype._getNodeXCenterShift = function () {
            var nodeMaxWidth = this._getNodeMaxWidth() - 2 * this.getNodeMargin().width, nodeWidth = this.getNodeWidth();
            return Math.max(0, (nodeMaxWidth - nodeWidth) / 2);
        };
        ListComponent.prototype._getCalculatedYPos = function () {
            return this._getComponentSizeInPx().height - this.getComponentMargin().height - this.getNodeHeight();
        };
        ListComponent.prototype._getBorders = function () {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(), min = 0, max = min + (componentMaxIndexInStacks - 1) * this._distanceZBetweenNodes;
            return new Component3d.RangeModel(min, max);
        };
        return ListComponent;
    })(Component3d.BaseComponent);
    Component3d.ListComponent = ListComponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListNode = (function (_super) {
        __extends(ListNode, _super);
        function ListNode(data) {
            _super.call(this, data);
            this._isSelected = false;
        }
        ListNode.prototype._getIsSelected = function () {
            return this._isSelected;
        };
        ListNode.prototype._setIsSelected = function (isSelected) {
            this._isSelected = isSelected;
        };
        return ListNode;
    })(Component3d.BaseNode);
    Component3d.ListNode = ListNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListCollection = (function (_super) {
        __extends(ListCollection, _super);
        function ListCollection() {
            _super.call(this);
        }
        ListCollection.prototype._getNodeConstructor = function () {
            return Component3d.ListNode;
        };
        ListCollection.prototype._getIsAnySelectedNode = function () {
            var isAnySelected = false;
            this._getNodes().map(function (node) {
                if (node._getIsSelected() === true) {
                    isAnySelected = true;
                }
            });
            return isAnySelected;
        };
        return ListCollection;
    })(Component3d.BaseCollection);
    Component3d.ListCollection = ListCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListNodeRenderer = (function (_super) {
        __extends(ListNodeRenderer, _super);
        function ListNodeRenderer() {
            _super.call(this);
        }
        ListNodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(), nodeIndexInStack = nodeModel._getIndexInStack();
            _super.prototype._setNodeBaseDomStyle.call(this, nodeModel);
            if (nodeModel._getIsSelected()) {
                this._setNodeDomStyleTransformSelected(nodeModel);
            }
            else {
                this._setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
            }
        };
        ListNodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            this._setSelectOrDeselect(nodeModel);
            nodeModel._getComponent()._getCollectionRenderer()._mountOrUpdate(nodeModel._getCollection());
        };
        ListNodeRenderer.prototype._setSelectOrDeselect = function (nodeModel) {
            if (nodeModel._getIsSelected() === true) {
                nodeModel._setIsSelected(false);
                nodeModel._getComponent()._getScrollingLib().preventMouseDownEvent = false;
                return;
            }
            if (nodeModel._getCollection()._getIsAnySelectedNode() === true) {
                return;
            }
            nodeModel._setIsSelected(true);
            nodeModel._getComponent()._getScrollingLib().preventMouseDownEvent = true;
        };
        ListNodeRenderer.prototype._setNodeDomStyleTransform = function (nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var component = nodeModel._getComponent(), componentMargin = component.getComponentMargin(), componentDom = nodeModel._getDom(), nodeMaxWidth = component._getNodeMaxWidth(), nodeXCenterShift = component._getNodeXCenterShift(), nodeMarginX = component.getNodeMargin().width, nodeMarginY = 0, nodePosX = componentMargin.width + nodeMarginX + nodeNumberOfStack * nodeMaxWidth + nodeXCenterShift, nodePosY = component._getCalculatedYPos() + nodeMarginY, nodePosZ = component._getScrollingPosition() - nodeIndexInStack * component.getDistanceZBetweenNodes();
            componentDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            componentDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            componentDom.style.zIndex = Math.trunc(nodePosZ);
        };
        ListNodeRenderer.prototype._setNodeDomStyleTransformSelected = function (nodeModel) {
            var component = nodeModel._getComponent(), componentDom = nodeModel._getDom(), nodePosX = component.getComponentMargin().width + component._getNodeCenterX(), nodePosY = component.getComponentMargin().height + component._getNodeCenterY(), nodePosZ = 0, nodeScaleValue = 1.5, nodeZIndex = 999999999;
            componentDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) scale(" + nodeScaleValue + ")";
            componentDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) scale(" + nodeScaleValue + ")";
            componentDom.style.zIndex = nodeZIndex;
        };
        return ListNodeRenderer;
    })(Component3d.INodeRenderer);
    Component3d.ListNodeRenderer = ListNodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListCollectionRenderer = (function (_super) {
        __extends(ListCollectionRenderer, _super);
        function ListCollectionRenderer() {
            _super.call(this, new Component3d.ListNodeRenderer());
        }
        return ListCollectionRenderer;
    })(Component3d.ICollectionRenderer);
    Component3d.ListCollectionRenderer = ListCollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListComponentRenderer = (function (_super) {
        __extends(ListComponentRenderer, _super);
        function ListComponentRenderer() {
            _super.call(this, new Component3d.ListCollectionRenderer());
        }
        ListComponentRenderer.prototype._setComponentDom = function (model) {
            var directionProperty = "pageY";
            _super.prototype._setComponentDom.call(this, model, directionProperty);
        };
        return ListComponentRenderer;
    })(Component3d.I3dComponentRenderer);
    Component3d.ListComponentRenderer = ListComponentRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomablecomponent = (function (_super) {
        __extends(ListZoomablecomponent, _super);
        function ListZoomablecomponent() {
            var componentRenderer = new Component3d.ListZoomableComponentRenderer(), collectionRenderer = new Component3d.ListZoomableCollectionRenderer(), componentCamera = new Component3d.CameraModel(1000, 50, 50), componentSizeW = 800, componentSizeH = 400, nodeSizeW = 250, nodeSizeH = 300;
            _super.call(this, collectionRenderer, componentRenderer);
            this._componentZoomDirection = 1;
            this._componentDepth = 2;
            _super.prototype.setCamera.call(this, componentCamera);
            _super.prototype.setComponentSize.call(this, componentSizeW, componentSizeH);
            _super.prototype.setNodeWidth.call(this, nodeSizeW);
            _super.prototype.setNodeHeight.call(this, nodeSizeH);
            _super.prototype.setComponentWidthMeasure.call(this, "px");
            _super.prototype.setComponentHeightMeasure.call(this, "px");
            _super.prototype.setDirection.call(this, 1);
            this._setCollection();
        }
        ListZoomablecomponent.prototype._setCollection = function () {
            this._collection = new Component3d.ListZoomableCollection();
            _super.prototype._setCollection.call(this);
        };
        ListZoomablecomponent.prototype.getZoomDirection = function () {
            return this._componentZoomDirection;
        };
        ListZoomablecomponent.prototype.setZoomDirection = function (componentZoomDirection) {
            if (typeof componentZoomDirection !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentZoomDirection = componentZoomDirection;
            return this;
        };
        ListZoomablecomponent.prototype.getDepth = function () {
            return this._componentDepth;
        };
        ListZoomablecomponent.prototype.setDepth = function (componentDepth) {
            if (typeof componentDepth !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentDepth = componentDepth;
            return this;
        };
        ListZoomablecomponent.prototype._getNodeMaxWidth = function () {
            return undefined;
        };
        ListZoomablecomponent.prototype._getNodeMaxHeight = function () {
            return this._getComponentSizePxWithoutMargin().height / this._getCollection()._getNumberOfStacks();
        };
        ListZoomablecomponent.prototype._getPositionFromIndex = function () {
            return _super.prototype._getNodeDefaultPosition.call(this);
        };
        ListZoomablecomponent.prototype._getCentralPos = function (nodeModel, nodeDirection) {
            var nodeIndexInStack = nodeModel._getIndexInStack(), nodeXPos = this._getNodeXPos(nodeIndexInStack);
            return this._getNodeCenterX() - nodeDirection * nodeXPos;
        };
        ListZoomablecomponent.prototype._getNodeYCenterShift = function () {
            var nodeMaxHeight = this._getNodeMaxHeight() - 2 * this.getNodeMargin().height, nodeHeight = this.getNodeHeight();
            return Math.max(0, (nodeMaxHeight - nodeHeight) / 2);
        };
        ListZoomablecomponent.prototype._getNodeXPos = function (nodeIndex) {
            return nodeIndex * this.getNodeWidth();
        };
        ListZoomablecomponent.prototype._getBorders = function () {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(), componentMargin = this._getNodeCenterX(), componentDirection = this.getDirection(), componentBorderShift = this._getNodeCenterX(), min = -componentMargin * componentDirection + componentBorderShift, max = min + this._getNodeXPos(componentMaxIndexInStacks - 1) - 2 * componentBorderShift;
            if (max < min) {
                max = min;
            }
            return new Component3d.RangeModel(min, max);
        };
        return ListZoomablecomponent;
    })(Component3d.BaseComponent);
    Component3d.ListZoomablecomponent = ListZoomablecomponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableNode = (function (_super) {
        __extends(ListZoomableNode, _super);
        function ListZoomableNode(data) {
            _super.call(this, data);
        }
        return ListZoomableNode;
    })(Component3d.BaseNode);
    Component3d.ListZoomableNode = ListZoomableNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableCollection = (function (_super) {
        __extends(ListZoomableCollection, _super);
        function ListZoomableCollection() {
            _super.call(this);
        }
        ListZoomableCollection.prototype._getNodeConstructor = function () {
            return Component3d.ListZoomableNode;
        };
        return ListZoomableCollection;
    })(Component3d.BaseCollection);
    Component3d.ListZoomableCollection = ListZoomableCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableNodeRenderer = (function (_super) {
        __extends(ListZoomableNodeRenderer, _super);
        function ListZoomableNodeRenderer() {
            _super.call(this);
        }
        ListZoomableNodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(), nodeIndexInStack = nodeModel._getIndexInStack();
            _super.prototype._setNodeBaseDomStyle.call(this, nodeModel);
            this._setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
        };
        ListZoomableNodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            var component = nodeModel._getComponent(), componentDirection = component.getDirection(), componentCentralPos = component._getCentralPos(nodeModel, componentDirection), componentDestination = -componentCentralPos * componentDirection;
            component._getScrollingLib().scroll(component, componentDestination, this.SELECTING_NODE_ANIMATION_TIME);
        };
        ListZoomableNodeRenderer.prototype._setNodeDomStyleTransform = function (nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var component = nodeModel._getComponent(), componentZoomDirection = component.getZoomDirection(), componentDirection = component.getDirection(), componentDepth = component.getDepth(), componentMargin = component.getComponentMargin(), nodeDom = nodeModel._getDom(), nodeMaxHeight = component._getNodeMaxHeight(), nodeYCenterShift = component._getNodeYCenterShift(), nodeXPos = component._getNodeXPos(nodeIndexInStack), nodeMarginX = 0, nodeMarginY = component.getNodeMargin().height, nodePosX = componentMargin.width + nodeMarginX + component._getScrollingPosition() + componentDirection * nodeXPos, nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift, nodePosZ = componentZoomDirection - componentZoomDirection * Math.abs(nodePosX - component._getNodeCenterX() - componentMargin.width) + componentDepth;
            nodeDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            nodeDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            nodeDom.style.zIndex = Math.round(nodePosZ);
        };
        return ListZoomableNodeRenderer;
    })(Component3d.INodeRenderer);
    Component3d.ListZoomableNodeRenderer = ListZoomableNodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableCollectionRenderer = (function (_super) {
        __extends(ListZoomableCollectionRenderer, _super);
        function ListZoomableCollectionRenderer() {
            _super.call(this, new Component3d.ListZoomableNodeRenderer());
        }
        return ListZoomableCollectionRenderer;
    })(Component3d.ICollectionRenderer);
    Component3d.ListZoomableCollectionRenderer = ListZoomableCollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableComponentRenderer = (function (_super) {
        __extends(ListZoomableComponentRenderer, _super);
        function ListZoomableComponentRenderer() {
            _super.call(this, new Component3d.ListZoomableCollectionRenderer());
        }
        ListZoomableComponentRenderer.prototype._setComponentDom = function (model) {
            var directionProperty = "pageX";
            _super.prototype._setComponentDom.call(this, model, directionProperty);
        };
        return ListZoomableComponentRenderer;
    })(Component3d.I3dComponentRenderer);
    Component3d.ListZoomableComponentRenderer = ListZoomableComponentRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableComponent = (function (_super) {
        __extends(TurnableComponent, _super);
        function TurnableComponent() {
            var componentRenderer = new Component3d.TurnableComponentRenderer(), collectionRenderer = new Component3d.TurnableCollectionRenderer(), componentCamera = new Component3d.CameraModel(1000, 50, 50), componentSizeW = 800, componentSizeH = 400, nodeWidth = 250, nodeHeight = 300;
            _super.call(this, collectionRenderer, componentRenderer);
            this._useRotatePositioning = 1;
            this._side = 1;
            this._numberOfNodesInCircle = 1;
            this._useOpacity = true;
            _super.prototype.setCamera.call(this, componentCamera);
            _super.prototype.setComponentSize.call(this, componentSizeW, componentSizeH);
            _super.prototype.setNodeWidth.call(this, nodeWidth);
            _super.prototype.setNodeHeight.call(this, nodeHeight);
            _super.prototype.setComponentWidthMeasure.call(this, "px");
            _super.prototype.setComponentHeightMeasure.call(this, "px");
            _super.prototype.setDirection.call(this, 1);
            this._setCollection();
        }
        TurnableComponent.prototype._setCollection = function () {
            this._collection = new Component3d.TurnableCollection();
            _super.prototype._setCollection.call(this);
        };
        TurnableComponent.prototype.getUseRotatePositioning = function () {
            return this._useRotatePositioning;
        };
        TurnableComponent.prototype.setUseRotatePositioning = function (useRotatePositioning) {
            if (typeof useRotatePositioning !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._useRotatePositioning = useRotatePositioning;
            return this;
        };
        TurnableComponent.prototype.getSide = function () {
            return this._side;
        };
        TurnableComponent.prototype.setSide = function (side) {
            if (typeof side !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._side = side;
            return this;
        };
        TurnableComponent.prototype.getUseOpacity = function () {
            return this._useOpacity;
        };
        TurnableComponent.prototype.setUseOpacity = function (useOpacity) {
            if (typeof useOpacity !== "boolean") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_BOOLEAN());
            }
            this._useOpacity = useOpacity;
            return this;
        };
        TurnableComponent.prototype.getNumberOfNodeInCircle = function () {
            return this._numberOfNodesInCircle;
        };
        TurnableComponent.prototype.setNumberOfNodesInCircle = function (numberOfNodesInCircle) {
            if (typeof numberOfNodesInCircle !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._numberOfNodesInCircle = numberOfNodesInCircle;
            return this;
        };
        TurnableComponent.prototype._getZoomIn = function (side, circleRadius) {
            return side === -1 ? circleRadius : 0;
        };
        TurnableComponent.prototype._getNodeMaxWidth = function () {
            return undefined;
        };
        TurnableComponent.prototype._getNodeMaxHeight = function () {
            return this._getComponentSizePxWithoutMargin().height / this._getCollection()._getNumberOfStacks();
        };
        TurnableComponent.prototype._getCircleLength = function () {
            var nodeWidth = this.getNodeWidth(), numberOfNodesInCircle = this.getNumberOfNodeInCircle();
            return nodeWidth * numberOfNodesInCircle;
        };
        TurnableComponent.prototype._getCircleRadius = function () {
            return this._getCircleLength() / (2 * Math.PI);
        };
        TurnableComponent.prototype._getPositionFromIndex = function () {
            var componentDirection = this.getDirection(), componentCentralPos = _super.prototype._getNodeDefaultPosition.call(this);
            return -componentDirection * componentCentralPos;
        };
        TurnableComponent.prototype._getCentralPos = function (nodeIndex) {
            return this._getPosByIndex(nodeIndex);
        };
        TurnableComponent.prototype._getPosByIndex = function (nodeIndex) {
            return nodeIndex * 180;
        };
        TurnableComponent.prototype._getNodeYCenterShift = function () {
            var nodeMaxHeight = this._getNodeMaxHeight() - 2 * this.getNodeMargin().height, nodeHeight = this.getNodeHeight();
            return Math.max(0, (nodeMaxHeight - nodeHeight) / 2);
        };
        TurnableComponent.prototype._getAngle = function (nodeIndex) {
            var componentDirection = this.getDirection(), numberOfNodesInCircle = this.getNumberOfNodeInCircle();
            return (this._getScrollingPosition() / 90 + componentDirection * nodeIndex * 2) / numberOfNodesInCircle;
        };
        TurnableComponent.prototype._getPxFromAngle = function (angle) {
            return angle * this.getNumberOfNodeInCircle() / 2;
        };
        TurnableComponent.prototype._getBorders = function () {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(), componentBorderShift = this._getPxFromAngle(90), componentMargin = this._getPxFromAngle(this.getComponentMargin().width), min = 0 + componentBorderShift - componentMargin, max = min + this._getPosByIndex(componentMaxIndexInStacks - 1) - 2 * componentBorderShift + 2 * componentMargin;
            if (max < min) {
                max = min;
            }
            return new Component3d.RangeModel(min, max);
        };
        return TurnableComponent;
    })(Component3d.BaseComponent);
    Component3d.TurnableComponent = TurnableComponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableNode = (function (_super) {
        __extends(TurnableNode, _super);
        function TurnableNode(data) {
            _super.call(this, data);
            this._setDefaultProps();
        }
        TurnableNode.prototype._setDefaultProps = function () {
            _super.prototype._getDomProps.call(this).style = {};
            _super.prototype._getDomProps.call(this).style.visibility = "visible";
        };
        TurnableNode.prototype._isVisible = function (degree) {
            return -90 <= degree && degree <= 90;
        };
        return TurnableNode;
    })(Component3d.BaseNode);
    Component3d.TurnableNode = TurnableNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableCollection = (function (_super) {
        __extends(TurnableCollection, _super);
        function TurnableCollection() {
            _super.call(this);
        }
        TurnableCollection.prototype._getNodeConstructor = function () {
            return Component3d.TurnableNode;
        };
        return TurnableCollection;
    })(Component3d.BaseCollection);
    Component3d.TurnableCollection = TurnableCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableNodeRenderer = (function (_super) {
        __extends(TurnableNodeRenderer, _super);
        function TurnableNodeRenderer() {
            _super.call(this);
        }
        TurnableNodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(), nodeIndexInStack = nodeModel._getIndexInStack();
            _super.prototype._setNodeBaseDomStyle.call(this, nodeModel);
            this._set3NodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
        };
        TurnableNodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            var component = nodeModel._getComponent(), nodeIndexInStack = nodeModel._getIndexInStack(), nodeCentralPos = component._getCentralPos(nodeIndexInStack);
            component._getScrollingLib().scroll(component, nodeCentralPos, this.SELECTING_NODE_ANIMATION_TIME);
        };
        TurnableNodeRenderer.prototype._set3NodeDomStyleTransform = function (nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var PI = 180, component = nodeModel._getComponent(), componentMargin = component.getComponentMargin(), componentCenterX = componentMargin.width + component._getNodeCenterX(), componentRadius = component._getCircleRadius(), componentSide = component.getSide(), nodeDom = nodeModel._getDom(), nodeDomProps = nodeModel._getDomProps(), nodeMaxHeight = component._getNodeMaxHeight(), useCurvePositioning = component.getUseRotatePositioning(), useOpacity = component.getUseOpacity(), nodeAngle = component._getAngle(nodeIndexInStack), nodeAngleShifted = nodeAngle + 0.5, nodeDegree = nodeAngle * PI, nodeRotateValue = componentSide * useCurvePositioning * nodeDegree, nodeIsVisible = nodeModel._isVisible(nodeDegree), nodeYCenterShift = component._getNodeYCenterShift(), nodeMarginY = component.getNodeMargin().height, nodePosX = componentCenterX - componentRadius * Math.cos(Math.PI * nodeAngleShifted), nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift, nodePosZ = -componentRadius + component._getZoomIn(componentSide, componentRadius) + componentSide * componentRadius * Math.sin(Math.PI * nodeAngleShifted);
            if (nodeIsVisible) {
                nodeDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) rotate3d(0, 1, 0, " + nodeRotateValue + "deg)";
                nodeDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) rotate3d(0, 1, 0, " + nodeRotateValue + "deg)";
                nodeDom.style.zIndex = Math.round(nodePosZ);
                nodeDom.style.visibility = "visible";
                nodeDom.style.opacity = useOpacity ? 1 - Math.abs(nodeDegree) / 90 : 1;
                nodeDomProps.style.visibility = "visible";
                return;
            }
            if (nodeDomProps.style.visibility !== "hidden") {
                nodeDom.style.visibility = "hidden";
                nodeDomProps.style.visibility = "hidden";
            }
        };
        return TurnableNodeRenderer;
    })(Component3d.INodeRenderer);
    Component3d.TurnableNodeRenderer = TurnableNodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableCollectionRenderer = (function (_super) {
        __extends(TurnableCollectionRenderer, _super);
        function TurnableCollectionRenderer() {
            _super.call(this, new Component3d.TurnableNodeRenderer());
        }
        return TurnableCollectionRenderer;
    })(Component3d.ICollectionRenderer);
    Component3d.TurnableCollectionRenderer = TurnableCollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableComponentRenderer = (function (_super) {
        __extends(TurnableComponentRenderer, _super);
        function TurnableComponentRenderer() {
            _super.call(this, new Component3d.TurnableCollectionRenderer());
        }
        TurnableComponentRenderer.prototype._setComponentDom = function (model) {
            var directionProperty = "pageX";
            _super.prototype._setComponentDom.call(this, model, directionProperty);
        };
        return TurnableComponentRenderer;
    })(Component3d.I3dComponentRenderer);
    Component3d.TurnableComponentRenderer = TurnableComponentRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ExceptionMessageEnum = (function () {
        function ExceptionMessageEnum() {
        }
        ExceptionMessageEnum.NOT_IMPLEMENTED = function () {
            return "Method should be implemented";
        };
        ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING = function () {
            return "Should be type of string";
        };
        ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER = function () {
            return "Should be type of number";
        };
        ExceptionMessageEnum.SHOULD_BE_TYPE_OF_BOOLEAN = function () {
            return "Should be type of boolean";
        };
        ExceptionMessageEnum.SHOULD_BE_INSTANCE_OF_HTML_ELEMENT = function () {
            return "Should be instance of HTMLElement";
        };
        ExceptionMessageEnum.SHOULD_BE_INSTANCE_OF_ARRAY = function () {
            return "Should be instance of Array";
        };
        ExceptionMessageEnum.SHOULD_BE_PX_OR_PERCENT = function () {
            return "Should be 'px' or '%'";
        };
        ExceptionMessageEnum.OUT_OF_RANGE = function () {
            return "Out of range";
        };
        return ExceptionMessageEnum;
    })();
    Component3d.ExceptionMessageEnum = ExceptionMessageEnum;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    (function (OngoingChangeEnum) {
        OngoingChangeEnum[OngoingChangeEnum["ADD"] = 1] = "ADD";
        OngoingChangeEnum[OngoingChangeEnum["REMOVE"] = 2] = "REMOVE";
    })(Component3d.OngoingChangeEnum || (Component3d.OngoingChangeEnum = {}));
    var OngoingChangeEnum = Component3d.OngoingChangeEnum;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var BaseExceptionModel = (function () {
        function BaseExceptionModel(name, message) {
            this.name = name;
            this.message = message;
        }
        return BaseExceptionModel;
    })();
    Component3d.BaseExceptionModel = BaseExceptionModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var NotImplementedExceptionModel = (function (_super) {
        __extends(NotImplementedExceptionModel, _super);
        function NotImplementedExceptionModel() {
            _super.call(this, "NotImplementedException", Component3d.ExceptionMessageEnum.NOT_IMPLEMENTED());
        }
        return NotImplementedExceptionModel;
    })(Component3d.BaseExceptionModel);
    Component3d.NotImplementedExceptionModel = NotImplementedExceptionModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ValidationExceptionModel = (function (_super) {
        __extends(ValidationExceptionModel, _super);
        function ValidationExceptionModel(message) {
            _super.call(this, "ValidationException", message);
        }
        return ValidationExceptionModel;
    })(Component3d.BaseExceptionModel);
    Component3d.ValidationExceptionModel = ValidationExceptionModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var OutOfRangeExceptionModel = (function (_super) {
        __extends(OutOfRangeExceptionModel, _super);
        function OutOfRangeExceptionModel() {
            _super.call(this, "OutOfRangeException", Component3d.ExceptionMessageEnum.OUT_OF_RANGE());
        }
        return OutOfRangeExceptionModel;
    })(Component3d.BaseExceptionModel);
    Component3d.OutOfRangeExceptionModel = OutOfRangeExceptionModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CameraModel = (function () {
        function CameraModel(perspective, perspectiveOriginX, perspectiveOriginY) {
            this.perspective = perspective;
            this.perspectiveOriginX = perspectiveOriginX;
            this.perspectiveOriginY = perspectiveOriginY;
        }
        return CameraModel;
    })();
    Component3d.CameraModel = CameraModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var Size2DModel = (function () {
        function Size2DModel(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size2DModel;
    })();
    Component3d.Size2DModel = Size2DModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var RangeModel = (function () {
        function RangeModel(min, max) {
            this.min = min;
            this.max = max;
        }
        return RangeModel;
    })();
    Component3d.RangeModel = RangeModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var OngoingChangeModel = (function () {
        function OngoingChangeModel(type, data) {
            this.type = type;
            this.data = data;
        }
        return OngoingChangeModel;
    })();
    Component3d.OngoingChangeModel = OngoingChangeModel;
})(Component3d || (Component3d = {}));
/**
 * Created by khanas on 10/21/15.
 */
var ScrollingModulePhysics = (function () {
    function ScrollingModulePhysics() {
    }
    Object.defineProperty(ScrollingModulePhysics, "ACCELERATION_CONSTANT", {
        get: function () {
            return 0.010;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModulePhysics, "MIN_VELOCITY", {
        get: function () {
            return 0.005;
        },
        enumerable: true,
        configurable: true
    });
    ScrollingModulePhysics.getMomentum = function (current, positions, lowerMargin, upperMargin, wrapperSize, EASING_BOUNCE) {
        var velocity = ScrollingModulePhysics.getVelocity(positions), momentum = ScrollingModulePhysics.computeMomentum(velocity, current);
        if (momentum.destination < lowerMargin) {
            momentum = ScrollingModulePhysics.computeSnap(lowerMargin, wrapperSize, velocity, current);
            momentum.bounce = EASING_BOUNCE;
        }
        else if (momentum.destination > upperMargin) {
            momentum = ScrollingModulePhysics.computeSnap(upperMargin, wrapperSize, velocity, current);
            momentum.bounce = EASING_BOUNCE;
        }
        return momentum;
    };
    ScrollingModulePhysics.getVelocity = function (positions) {
        var i, velocity, positionsLength = positions.length, lastTime, lastPos, firstTime, firstPos, period = 100;
        if (positionsLength < 2) {
            return 0;
        }
        lastTime = positions[positionsLength - 1].time;
        lastPos = positions[positionsLength - 1].value;
        i = positionsLength - 2;
        while (i >= 0 && (positions[i].time - lastTime < period)) {
            firstTime = positions[i].time;
            firstPos = positions[i].value;
            i--;
        }
        if (lastTime - firstTime === 0) {
            return 0;
        }
        velocity = (lastPos - firstPos) / (lastTime - firstTime);
        if (Math.abs(velocity) < ScrollingModulePhysics.MIN_VELOCITY) {
            return 0;
        }
        return velocity;
    };
    ScrollingModulePhysics.computeMomentum = function (velocity, current) {
        var acceleration = ScrollingModulePhysics.ACCELERATION_CONSTANT, time = Math.abs(velocity) / acceleration, distance = velocity / 2 * time;
        return {
            destination: current + distance,
            time: time
        };
    };
    ScrollingModulePhysics.computeSnap = function (start, end, velocity, current) {
        var destination = start + Math.sqrt(end) * (velocity / 16);
        return {
            destination: destination,
            time: Math.abs((destination - current) / velocity)
        };
    };
    return ScrollingModulePhysics;
})();
/**
 * Created by khanas on 10/19/15.
 */
var ScrollingModuleHelper = (function () {
    function ScrollingModuleHelper() {
    }
    ScrollingModuleHelper.getFloatWithPerception = function (value) {
        var perception = 1000;
        return Math.round(value * perception) / perception;
    };
    Object.defineProperty(ScrollingModuleHelper, "IS_TOUCH_EVENT_TYPE", {
        get: function () {
            return "ontouchstart" in window;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "SCROLLING_START_EVENT_NAME", {
        get: function () {
            return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchstart" : "mousedown";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "SCROLLING_MOVE_EVENT_NAME", {
        get: function () {
            return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchmove" : "mousemove";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "SCROLLING_END_EVENT_NAME", {
        get: function () {
            return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchend" : "mouseup";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "CURRENT_TIME", {
        get: function () {
            return (Date.now || function () { return new Date().getTime(); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "GET_EASING_BOUNCE", {
        get: function () {
            return BezierEasing(0.33, 0.33, 0.66, 0.81);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "GET_EASING_REGULAR", {
        get: function () {
            return BezierEasing(0.33, 0.66, 0.66, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "GET_BOUNCE_TIME", {
        get: function () {
            return 300;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "GET_OUT_OF_THE_BOX_ACCELERATION", {
        get: function () {
            return 0.3;
        },
        enumerable: true,
        configurable: true
    });
    ScrollingModuleHelper.getCoordinateFromEvent = function (e) {
        return e.touches ? e.touches[0] : e;
    };
    ScrollingModuleHelper.getTimelineItem = function (value, time) {
        return {
            value: value,
            time: time
        };
    };
    ScrollingModuleHelper.getPositionsFromCoordinates = function (coordinates, direction, directionKoef) {
        var positions = [];
        coordinates.map(function (coordinate) {
            var positionWithTime = ScrollingModuleHelper.getTimelineItem(directionKoef * (-coordinate.value[direction]), coordinate.time);
            positions.push(positionWithTime);
        });
        return positions;
    };
    return ScrollingModuleHelper;
})();
/**
 * Created by khanas on 10/19/15.
 */
var ScrollingModule = (function () {
    function ScrollingModule(model, scrollableDom, direction) {
        this.RAF = window.requestAnimationFrame.bind(window);
        this.CAF = window.cancelAnimationFrame.bind(window);
        this.lastFrameId = undefined;
        this.preventMouseDownEvent = false;
        this.preventClickEvent = false;
        this.model = model;
        this.scrollableDom = scrollableDom;
        this.direction = direction;
        this.isScrolling = false;
        this.isAnimating = false;
        this.mouseDownHandler = this._getMouseDownHandler(model, scrollableDom, direction);
        this.scrollableDom.addEventListener(ScrollingModuleHelper.SCROLLING_START_EVENT_NAME, this.mouseDownHandler, false);
    }
    ScrollingModule.prototype.scroll = function (model, animationDestination, animationDuration) {
        if (this.isAnimating === false) {
            this._resetAnimation(model, animationDestination, animationDuration);
        }
    };
    ScrollingModule.prototype.destroy = function () {
        this._stopScrolling();
        this.scrollableDom.removeEventListener(ScrollingModuleHelper.SCROLLING_START_EVENT_NAME, this.mouseDownHandler, false);
    };
    ScrollingModule.prototype._getMouseDownHandler = function (model, scrollableDom, direction) {
        var self = this;
        return function (eStart) {
            var coordinatesWithTime = [], firstCoordinate = ScrollingModuleHelper.getCoordinateFromEvent(eStart), previousCoordinate, coordinateWithTime;
            if (self.preventMouseDownEvent === true) {
                return;
            }
            previousCoordinate = firstCoordinate;
            coordinateWithTime = ScrollingModuleHelper.getTimelineItem(firstCoordinate, ScrollingModuleHelper.CURRENT_TIME);
            coordinatesWithTime.push(coordinateWithTime);
            self.isAnimating = false;
            self._stopScrolling();
            scrollableDom.addEventListener(ScrollingModuleHelper.SCROLLING_MOVE_EVENT_NAME, onTouchMove, false);
            window.addEventListener(ScrollingModuleHelper.SCROLLING_END_EVENT_NAME, onTouchEnd, false);
            function onTouchMove(eMove) {
                var newCoordinate = ScrollingModuleHelper.getCoordinateFromEvent(eMove), shift = newCoordinate[self.direction] - previousCoordinate[self.direction], adjustedValue = model._getScrollingPosition() + self._getAcceleratedVelocity(model, shift);
                self.preventClickEvent = true;
                previousCoordinate = newCoordinate;
                coordinateWithTime = ScrollingModuleHelper.getTimelineItem(newCoordinate, ScrollingModuleHelper.CURRENT_TIME);
                coordinatesWithTime.push(coordinateWithTime);
                model._setScrollingPosition(adjustedValue);
                model._getCollectionRenderer()._mountOrUpdate(model._getCollection());
            }
            function onTouchEnd(eEnd) {
                var positions, momentum, borders;
                scrollableDom.removeEventListener(ScrollingModuleHelper.SCROLLING_MOVE_EVENT_NAME, onTouchMove, false);
                window.removeEventListener(ScrollingModuleHelper.SCROLLING_END_EVENT_NAME, onTouchEnd, false);
                if (self._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME)) {
                    return;
                }
                self.isScrolling = true;
                borders = model._getBorders();
                positions = ScrollingModuleHelper.getPositionsFromCoordinates(coordinatesWithTime, direction, -model._getDirectionCoefficient());
                momentum = ScrollingModulePhysics.getMomentum(model._getDirectionCoefficient() * model._getScrollingPosition(), positions, borders.min, borders.max, borders.max - borders.min, ScrollingModuleHelper.GET_EASING_BOUNCE);
                self._animateScroller(model, momentum.time, momentum.destination, momentum.bounce);
            }
        };
    };
    ScrollingModule.prototype._resetPositionIfNoScrolling = function (model) {
        this._stopScrolling();
        this._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME);
    };
    ScrollingModule.prototype._stopScrolling = function () {
        if (this.isScrolling === true) {
            this.isScrolling = false;
            this.CAF(this.lastFrameId);
        }
    };
    ScrollingModule.prototype._getAcceleratedVelocity = function (model, velocity) {
        var self = this, borders = model._getBorders(), min = borders.min, max = borders.max, current = model._getDirectionCoefficient() * model._getScrollingPosition();
        if (current < min || current > max) {
            return velocity * ScrollingModuleHelper.GET_OUT_OF_THE_BOX_ACCELERATION;
        }
        return velocity;
    };
    ScrollingModule.prototype._resetPosition = function (model, time) {
        var self = this, borders = model._getBorders(), min = borders.min, max = borders.max, current = model._getDirectionCoefficient() * model._getScrollingPosition();
        if (current < min) {
            self._resetAnimation(model, min, time);
            return true;
        }
        if (current > max) {
            self._resetAnimation(model, max, time);
            return true;
        }
        return false;
    };
    ScrollingModule.prototype._resetAnimation = function (model, animationDestination, animationDuration) {
        this._animateScroller(model, animationDuration, animationDestination, ScrollingModuleHelper.GET_EASING_REGULAR);
    };
    ScrollingModule.prototype._animateScroller = function (model, animationDuration, animationDestination, easingFn) {
        var self = this, animationStartTime = ScrollingModuleHelper.CURRENT_TIME, animationEndTime = animationStartTime + animationDuration, animationStartPos = model._getScrollingPosition(), animationDistance = model._getDirectionCoefficient() * animationDestination - animationStartPos, stepValue;
        easingFn || (easingFn = ScrollingModuleHelper.GET_EASING_REGULAR);
        function animationStep() {
            var startStepTime = ScrollingModuleHelper.CURRENT_TIME, easing;
            if (startStepTime >= animationEndTime) {
                self.isAnimating = false;
                self.lastFrameId = null;
                model._setScrollingPosition(model._getDirectionCoefficient() * animationDestination);
                if (!self._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME)) {
                    self.isScrolling = false;
                }
                return;
            }
            startStepTime = (startStepTime - animationStartTime) / animationDuration;
            easing = easingFn.get(startStepTime);
            stepValue = ScrollingModuleHelper.getFloatWithPerception(animationStartPos + animationDistance * easing);
            model._setScrollingPosition(stepValue);
            model._getCollectionRenderer()._mountOrUpdate(model._getCollection());
            if (self.isAnimating) {
                self.lastFrameId = self.RAF(animationStep);
            }
        }
        self.isAnimating = true;
        animationStep();
    };
    return ScrollingModule;
})();
var Component3d;
(function (Component3d) {
    var ChangesStorage = (function () {
        function ChangesStorage() {
            this._ongoingChanges = [];
        }
        ChangesStorage.prototype._remove = function (nodeIndex) {
            var ongoingChange = new Component3d.OngoingChangeModel(Component3d.OngoingChangeEnum.REMOVE, {
                index: nodeIndex
            });
            this._addOngoingChange(ongoingChange);
        };
        ChangesStorage.prototype._insert = function (node, nodeIndex) {
            var ongoingChange = new Component3d.OngoingChangeModel(Component3d.OngoingChangeEnum.ADD, {
                element: node,
                index: nodeIndex
            });
            this._addOngoingChange(ongoingChange);
        };
        ChangesStorage.prototype._getOngoingChanges = function () {
            return this._ongoingChanges;
        };
        ChangesStorage.prototype._clearOngoingChanges = function () {
            this._ongoingChanges = [];
        };
        ChangesStorage.prototype._addOngoingChange = function (change) {
            this._ongoingChanges.push(change);
        };
        return ChangesStorage;
    })();
    Component3d.ChangesStorage = ChangesStorage;
})(Component3d || (Component3d = {}));
if (typeof module !== "undefined" && module !== null && module.exports) {
    module.exports = Component3d;
}
else if (typeof define === "function" && define.amd) {
    define('components/../../libs/scrolling-component',[], function () {
        return Component3d;
    });
}
else if (typeof window !== "undefined" && Component3d) {
    window.Component3d = Component3d;
}
;
/**
 * # dress.Scroller
 * Scrollable component.
 * @class dress.Scroller
 * @author Rostyslav Khanas <r.khanas@samsung.com>
 */
(function () {

        dress.Scroller = dress.factory('scroller', {

            component: undefined,

            classPrefix: 'closet-scroller',

            defaults: {

            },

            onCreated: function () {
                var nodes = this.getNodes();

                this.component = new Component3d.CoverFlowComponent();

                this.className = this.classPrefix;

                this.component.setBackground('rgb(5, 5, 5)')
                    .setComponentMargin(0, 50)
                    .setScrollingIndex(0)
                    .setComponentSize(100, 100)
                    .setComponentWidthMeasure('%')
                    .setComponentHeightMeasure('%')
                    .setNodeWidth(500)
                    .setNodeHeight(500)
                    .setNodeMargin(0, 20)
                    .insert(nodes, 0)
                    .setNumberOfStacks(2)
                    .setDirection(1)
                    .attachToParent(this);

                console.debug('onCreated');
            },

            onAttached: function () {
                this.component.update();
            },

            onDetached: function () {
                this.component.detachFromParent();
            },

            // TODO: should be empty and load data from somewhere
            getNodes: function () {
                var i,
                    numberOfNodes = 150,
                    nodes = [];

                var imagesSrc = [
                    'http://images.samsung.com/is/image/samsung/in_SM-A300HZKDINU_000268347_Front-SS_black_thumb?$M-Thumbnail$',
                    'http://s.tmocache.com/content/dam/tmo/en-p/cell-phones/samsung-galaxy-s-6-edge/white-pearl/spin/samsung-galaxy-s-6-edge-pearl-white-spin.0001.jpg',
                    'http://images.samsung.com/is/image/samsung/my_SM-A800FZDEXME_000000001_Front_gold_thumb?$M-Thumbnail$',
                    'http://www.samsung.com/ca/next/img/support/ia_image_type/1903.jpg'
                ];

                function getImageSrc() {
                    var src = imagesSrc.shift(),
                        dom = document.createElement('img');

                    dom.src = src;

                    imagesSrc.push(src);

                    return dom;
                }

                for (i = 0; i < numberOfNodes; i += 1) {
                    nodes.push({
                        dom : getImageSrc()
                    });
                }

                return nodes;
            }
        });

        }());

(function () {

        var __window = window,
            listTypeArr = [
                'none', 'square', 'disc', 'circle', 'decimal',
                'decimal-leading-zero', 'upper-alpha', 'upper-latin',
                'upper-roman', 'lower-alpha', 'lower-greek', 'lower-latin',
                'lower-roman'];

        /*
         ###Usage
         <closet-poll-list [answer={NUMBER}]>
         [
             <li class="closet-poll-list-item"> {STRING} </li>,
             <li class="closet-poll-list-item"> {STRING} </li>,
            ...
         ]
         </closet-poll-list>

         ###Event
         * correct.answer : Fired if user select the right answer(same as value of "answer" attribute)
         * wrong.answer : Fired if user select the wrong answer(same as value of "answer" attribute)

         ###Example
         <closet-poll-list answer="2">
         <li id="closet-poll-list-item-1" class="closet-poll-list-item">Answer 1</li>
         <li id="closet-poll-list-item-2" class="closet-poll-list-item">Answer 2</li>
         </closet-poll-list>

         */
        dress.PollList = dress.factory('poll-list', {
            defaults : {
                // set Attributes type
                answer : 1,
                listType : 'none',
                contentsList: []
            },
            events : {
                click : '_isRightAnswer'
            },
            // Base LifeCycle
            onCreated : function () {
                this._initialize();
            },
            // Additional Method
            _initialize : function () {
                this.options.contentsList = [];
                this._itemClass = 'closet-poll-list-item';

                this._readDefaultContents();
            },
            _readDefaultContents : function () {
                var itemList;
                itemList = this.$el.find('.' + this._itemClass);
                if (itemList.length > 0) {
                    this._saveAllListItems(itemList);
                } else {
                    this._addDefaultItem();
                }
            },

            _saveAllListItems : function (itemList) {
                var i, length;
                length = itemList.length;

                if (length === 0) {
                    return false;
                }

                for (i = 0; i < length; i += 1) {
                    this._saveListItem(itemList[i].textContent);
                }

                return true;
            },
            _saveListItem : function (contents) {
                this.options.contentsList.push(contents);
            },
            _addDefaultItem : function () {
                this.$el.append(this._createListItem('List Item 1'));
            },
            _createListItem : function (contents) {
                var $element = $(document.createElement('li'));
                $element.addClass(this._itemClass);
                $element.text(contents || '');
                this.options.contentsList.push(contents);

                return $element;
            },
            _applyContent : function (index, contents) {
                var contentsLength = this.options.contentsList.length;
                if (index < contentsLength) {
                    $(this.$el.find('.' + this._itemClass)[index]).text(contents);
                    this.options.contentsList[index] = contents;
                }

                return this;
            },

            _removeListItem : function (index) {
                this.options.contentsList.splice(index, 1);
                $(this.$el.find('.' + this._itemClass)[index]).remove();

                return this;
            },
            _isRightAnswer : function (e) {
                var idx = this.$el.find('.' + this._itemClass).index(e.target);

                if (idx > -1) {
                    if (idx + 1 === parseInt(this.answer, 10)) {
                        this.trigger('correct.answer');
                    } else {
                        this.trigger('wrong.answer');
                    }
                }

                return this;
            },

            setAnswer : function (value) {
                this.options.answer = value;
                return this;
            },
            getAnswer : function () {
                return this.options.answer;
            },
            setListType : function (value) {
                if (listTypeArr.indexOf(value) > -1) {
                    this.options.listType = value;
                    this.$el.css('list-style', value);
                } else {
                    throw Error('Not Supported List Type');
                }

                return this;
            },
            getListType : function () {
                return this.options.listType;
            },
            getContentsList : function () {
                return this.options.contentsList;
            },
            setContentsList : function (contentsList) {
                this.applyContents(contentsList);
                this.options.contentsList = contentsList;
                return this;
            },
            applyContents : function (contents) {
                var i,
                    newContentsLength = contents.length || 0,
                    oldContentsLength = this.options.contentsList.length;


                if (oldContentsLength <= newContentsLength) {
                    for (i = 0; i < oldContentsLength; i += 1) {
                        this._applyContent(i, contents[i]);
                    }

                    for (i; i < newContentsLength; i += 1) {
                        this.$el.append(this._createListItem(contents[i]));
                    }
                } else {
                    for (i = 0; i < newContentsLength; i += 1) {
                        this._applyContent(i, contents[i]);
                    }

                    for (i = oldContentsLength - 1; i >= newContentsLength; i -= 1) {
                        this._removeListItem(i);
                    }
                }
                return this;
            }
        }, __window.HTMLUListElement);

}());

/* global $ */
/**
 * # closet.router
 * Object contains main framework methods.
 * @class closet.router
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function () {

        var ACTIVE_PAGE = 'active',
            HISTORY = window.history,
            HTML_REGEX = /([^/]+)(?=\.\w+$)(.html)/,
            ID_REGEX = /[^#][A-z\W\d]*/;

        dress.Router = dress.factory('router', {
            defaults: {
                disable: false
            },

            setRoute: function (key, route) {
                this.routes[key] = route;
            },

            onCreated: function () {
                var pages = this.$el.find('closet-page'),
                    i, len;
                this.activePage = null;
                this.pageTransition = null;
                this.routes = {};

                len = pages.length;
                for (i = 0; i < len; i += 1) {
                    // Find activated page
                    if ($(pages[i]).hasClass(ACTIVE_PAGE)) {
                        this.activePage = pages[i];
                    }
                }
                if (!this.activePage) {
                    $(pages[0]).addClass(ACTIVE_PAGE);
                    this.activePage = pages[0];
                }
                this.getPageModel();
                this.getTransitionData();
                this.bindLinkHandler();
            },

            bindLinkHandler: function () {
                document.addEventListener('click', function (event) {
                    var link = $(event.target).closest('a'),
                        href;

                    event.stopPropagation();
                    event.preventDefault();
                    if (link.length && event.which === 1) {
                        href = link.attr('href');

                        if (this.routes[href.match(ID_REGEX)]) {
                            this.changePage(href);
                        }

                    }
                }.bind(this));

                window.addEventListener('popstate', function (event) {
                    var href = event.state;
                    this.setActive($(this.$el.find('#' + href)).get(0));
                }.bind(this));

                $(document).on('change.page', function (event, id) {
                    this.changePage('#' + id);
                    event.preventDefault();
                    event.stopPropagation();
                }.bind(this));
            },

            changePage: function (href) {
                var self = this,
                    $toPage,
                    id = href.match(ID_REGEX),
                    path = this.routes[id[0]],
                    address = location.origin + location.pathname.replace(HTML_REGEX, '') + path.match(HTML_REGEX)[0];

                if (self.$el.find(href).length) {
                    $toPage = self.$el.find(href);
                    self.setActive($toPage.get(0));
                    HISTORY.pushState(id, null, address);
                    return;
                }

                $.ajax({
                    url: address,
                    success: function (data) {
                        var $data = $(data),
                            result;
                        $data.wrap('<div></div>');
                        result = $data.parent().find(href);
                        self.$el.append(result);
                        $toPage = self.$el.find(href);
                        self.setActive($toPage.get(0));

                        HISTORY.pushState(id, null, address);
                    }
                });
            },

            getPageModel: function () {
                var self = this,
                    id;
                $.getJSON('pageModel.json', function (data) {
                    Object.key(data).forEach((i) => {
                        self.setRoute(i, data[i].path.match(HTML_REGEX)[0]);
                    });
                    id = $(self.activePage).attr('id');
                    HISTORY.pushState(id, null, location.origin + location.pathname + self.routes[id]);
                })
                    .fail(function () {
                        console.log('error');
                    });
            },

            getTransitionData: function () {
                var self = this;
                $.getJSON('transition.json', function (data) {
                    self.setTransition(data);
                })
                    .fail(function () {
                        console.log('error');
                    });
            },

            setActive: function (toPage) {
                if (this.activePage === toPage) {
                    return;
                }

                if (this.activePage) {
                    this.pageTransition.from = this.activePage;
                }
                this.pageTransition.to = toPage;
                this.activePage = toPage;

                this.pageTransition.start();
            },

            setTransition: function (data) {
                this.pageTransition = new window.PageTransition({
                    effect: data.name,
                    effectConfig: {
                        color: data.color
                    }
                });
            }
        });

}());

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



  return dress;
}));
