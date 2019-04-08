/**
 * # dress.closet
 * Object contains prototype of base component.
 * @class dress.closet
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
/* global define */
    define([
        'jQuery',
        '../dress/dress'
    ], function ($, dress) {
    

// >>excludeEnd("buildExclude");

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

// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress;
    });
// >>excludeEnd("buildExclude");
}());
