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



  return dress;
}));
