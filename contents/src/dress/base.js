/**
 * # dress.Base
 * Object contains prototype of base dress element.
 * @class dress.Base
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
/* global define */
    define([
        'jQuery',
        './core'
    ], function ($, dress) {


// >>excludeEnd("buildExclude");

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

// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.Base;
    });
// >>excludeEnd("buildExclude");
}());
