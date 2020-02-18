'use babel';

import $ from 'jquery';
import mustache from 'mustache';
import {appManager} from '../app-manager';
import {eventEmitter} from '../events-emitter';

const EVENT_SPLIT_REG = /^(\S+)\s*(.*)$/;

/**
 * Convert function name form option name
 * @param {string} prefix
 * @param {string} str
 * @returns {string}
 */
function convertFunctionNameFromOptionName(prefix, str) {
    return prefix + str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to option name
 * @param {string} str
 * @returns {void|string|XML|*}
 */
function convertToOptionName(str) {
    return str.replace(/(-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''));
}

/**
 * Convert to attribute name
 * @param {string} str
 * @returns {void|string|XML|*}
 */
function convertToAttributeName(str) {
    return str.replace(/([A-Z])/g, $1 => '-' + $1.toLowerCase());
}

/**
 * Attribute to casting
 * @param {string} optionName
 * @param {string} attributeValue
 * @returns {*}
 */
function attributeTypeCasting(optionName, attributeValue) {
    var booltestValue;

    if ($.isNumeric(attributeValue)) {
        return Number(attributeValue);
    }

    if (typeof attributeValue === 'string') {
        booltestValue = attributeValue.toLowerCase().trim();
        if (/true|false/.test(booltestValue)) {
            return !!/true/.test(booltestValue);
        }
    }

    return attributeValue;
}

/**
 * ES6 Dress version of HTMLElement
 */
class DressElement extends HTMLElement {
	constructor() {
		super();
		this.$el = $(this);
	}

	/**
	 * create callback
	 */
	onCreated() {
	}

	/**
	 * ready callback
	 */
	onReady() {
	}

	/**
	 * attach callback
	 */
	onAttached() {
	}

	/**
	 * detach callback
	 */
	onDetached() {
	}

	/**
	 * attribute change callback
	 */
	onAttributeChanged() {
	}

	/**
	 * change callback
	 */
	onChanged() {
	}

	/**
	 * destroy callback
	 */
	onDestroy() {
	}

	createdCallback() {
		this.connectedCallback();
	}

	/**
	 * create callback (CE)
	 */
	connectedCallback() {
        var self = this,
            $el = $(self),
            options = null;

        self.options = self.options || {};
        options = self.options;

        self.$el = $el;
        self.componentName = '';
        self.defaults = self.defaults || {
            focusable: false,
            disable: false
        };

        Object.keys(self.defaults).forEach((optionName) => {
            options[optionName] = attributeTypeCasting(optionName, $el.attr(convertToAttributeName(optionName)) || self.defaults[optionName]);
        });

        Object.keys(options).forEach((optionName) => {
            options[optionName] = attributeTypeCasting(optionName, options[optionName]);
        });

        self.onCreated();
		self.onReady();
		this._bindEvents();
    }

	/**
	 * attach callback (CE)
	 */
	attachedCallback() {
		this._bindEvents();
		this.onAttached();
	}

    /**
     * detach callback (CE)
      */
    detachedCallback() {
        this._unbindEvents();
        this.onDetached();
    }

    /**
     * Standard  callback from HTML Element
     * @param {string} attrName
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(attrName, oldValue, newValue) {
        var self = this,
            optionName = convertToOptionName(attrName);

        // notify attribute is changed
        self.onAttributeChanged(attrName, oldValue, newValue);

        if (self.defaults[optionName]) {
            self._setOption(optionName, attributeTypeCasting(optionName, newValue));
        }
    }

    /**
     * Trigger eventName on element
     * @param {string} eventName
     */
    trigger(eventName) {
        this.$el.trigger(eventName);
    }

    /**
     * Destroy
      */
    destroy() {
        var self = this;
        self.detachedCallback();
        self._unbindEvents();
        self.onDestroy();
        self.$el = null;
        self._isInitialized = false;
    }

    /**
     * Bind events
      * @private
     */
	_bindEvents() {
		const self = this,
			events = self.events;
		let	method = null,
			match = null,
			eventName = '',
			selector = '',
			listener = null;

		if (!events) {
			return;
		}

		Object.keys(events).forEach((key) => {
			match = key.match(EVENT_SPLIT_REG);
			eventName = match[1];
			selector = match[2];

			const methodName = events[key];
			method = methodName;
			if (!$.isFunction(method)) {
				method = self[method];
			}

			if ($.isFunction(method)) {
				listener = method.bind(self);

				self.$el.on(`${eventName  }.components${  self.id}`, selector, listener);
			} else {
				self.$el.on(`${eventName  }.components${  self.id}`, selector, ((nodeEventName) => {
					eventEmitter.emit(nodeEventName);
				}).bind(null, methodName));
			}
		});
	}

    /**
     * Unbind events
      * @private
     */
    _unbindEvents() {
        this.$el.off('.components' + this.id);
    }

    /**
     * Set options
     * @param {string} name
     * @param {string} value
     * @private
     */
    _setOption(name, value) {
        var self = this;
        var oldValue = self.options[name],
            newValue = value;

        if (oldValue === value) {
            return;
        }

        if (!self._callSetter(name, newValue)) {
            self.options[name] = attributeTypeCasting(name, value);
        }

        self.onChanged(name, value, oldValue);
    }

    /**
     * Setter
      * @param {string} name
     * @param {string} value
     * @returns {boolean}
     * @private
     */
    _callSetter(name, value) {
        var method = this[convertFunctionNameFromOptionName('set', name)];

        if ($.isFunction(method)) {
            method.call(this, attributeTypeCasting(name, value));
            return true;
        }
        return false;
    }

    /**
     *Get option
     * @param {string} name
     * @returns {*}
     * @private
     */
    _getOption(name) {
        var self = this,
            method = self[convertFunctionNameFromOptionName('get', name)];
        return $.isFunction(method) ? method.call(self) : self.options[name];
    }

    /**
     * Create form template
     * @param {string} url
     * @param {parent, options, callback, before}
     */
    createFromTemplate(url, {parent, options, callback, before} = {}) {
		const appPath = appManager.getAppPath().src + url;
		$.get(appPath, (template) => {
			const $parentElement = parent || this.$el,
				content = mustache.render(template, options),
				$element = $(content);
            if (before) {
                before.before($element);
            } else {
                $parentElement.append($element);
            }
            if (callback) {
                callback($element);
            }
        });
    }
}

export {DressElement};
