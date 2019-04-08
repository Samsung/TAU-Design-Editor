/**
 * # dress.Component
 * The factory method witch make the ui component.
 * @class dress.component
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
/* global define */
    define([
        'jQuery',
        './core',
        './base'
    ], function ($, dress) {


// >>excludeEnd("buildExclude");
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

// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.factory;
    });
// >>excludeEnd("buildExclude");
}());
