'use babel';

import $ from 'jquery';
import Mustache from 'mustache';
import {EVENTS, eventEmitter} from '../../../../design-editor/src/events-emitter';

const Sentences = {
    variable: 'var {{varName}} = ',
    querySelector: 'document.getElementById(\'{{id}}\')',
    listener: '{{instance}}.addEventListener(\'{{type}}\', function'
    + ' (event) {\r\n {{{content}}}{{^content}}//::write down your'
    + ' own handler in here::{{/content}}\r\n})',
    pageTransition: 'tau.changePage(\'{{url}}\', {transition: \'{{transition}}\'});',
    popupOpen: 'tau.openPopup(\'\');',
    tauWidget: 'var {{varName}} = {{constructorName}}({{targetElement}});',
    tauWidgetWithOptions: 'var {{varName}} = {{constructorName}}({{targetElement}}, {\r\n{{options}}\r\n});',
    sentenceEnd: ';\r\n'
};

/**
 *
 */
class AssistantCodeGenerator {
    /**
     * Constructor
     */
    constructor() {
        this._elementInstancePair = new WeakMap();
        this._designEditor = null;
    }

    /**
     * Set target editor
     * @param {Editor} editor
     */
    setTargetEditor(editor) {
        this._designEditor = editor;
    }

    /**
     * Generate sentence
     * @param {string} sentenceBody
     * @returns {string}
     * @private
     */
    static _generateCompleteSentence(sentenceBody) {
        return sentenceBody + Sentences.sentenceEnd;
    }

    /**
     * Generate id
     * @param {string} keyword
     * @returns {string}
     * @private
     */
    static _generateId(keyword) {
        var date = new Date();
        keyword = keyword || 'closet-component';
        return keyword + '-' + date.getTime();
    }

    /**
     * Generate query selector
     * @param {HTMLElement} element
     * @returns {*}
     * @private
     */
    _generateQuerySelector(element) {
        var $element = $(element),
            elementId,
            option;
        console.log('_generateQuerySelector');

        elementId = $element.attr('id');

        if (!elementId) {
            elementId = AssistantCodeGenerator._generateId();
            // need duplicate filter
            $element.attr('id', elementId);

            // update ID in model
            this._designEditor.getModel().updateAttribute($element.attr('data-id'), 'id', elementId);

            eventEmitter.emit(EVENTS.ReplaceCodeView);
        } else {
            // update ID in model
            this._designEditor.getModel().updateAttribute($element.attr('data-id'), 'id', elementId);
        }

        option = {
            id: elementId || null
        };

        return (Mustache.render(Sentences.querySelector, option));
    }

    /**
     * Generate instance variable
     * @param {string} variableName
     * @param {HTMLElement} element
     * @returns {*}
     * @private
     */
    _generateInstanceVariable(variableName, element) {
        var selector,
            option;

        if (!variableName) {
            throw new Error('Code Generator :: 1st arg(variableName) missing');
        }

        selector = this._generateQuerySelector(element);
        option = {
            varName: variableName
        };

        return (Mustache.render(Sentences.variable, option)) + selector;
    }

    /**
     * Generate TAU Widget var
     * @param {Object} options
     * @returns {void|string|XML|*}
     * @private
     */
    static _generateTAUWidgetVariable(options) {
        var sentence;
        if (options.options && Object.keys(options.options).length > 0) {
            sentence = (Mustache.render(Sentences.tauWidgetWithOptions, options));
        } else {
            sentence = (Mustache.render(Sentences.tauWidget, options));
        }

        return sentence.replace(/&#39;/g, '\'');
    }

    /**
     * Generate widget options
     * @param {Object} options
     * @returns {string}
     * @private
     */
    _generateWidgetOptionSentence(options) {
        var optionSentence = [];

        options.forEach((option) => {
            optionSentence.push('\t' + option[0] + ' : ' + (option[1] || 'null'));
        });

        return optionSentence.join(',\r\n');
    }

    /**
     * This method make instance for used to info and element.
     * info has properties, name.
     * @param {HTMLElement} element
     * @param {Object} info
     * @returns {string}
     */
    getInstance(element, info) {
        var $element = $(element),
            existedInstance,
            result = null;

        if (!element) {
            throw new Error('getInstance::1st argument is empty');
        }

        if (!info) {
            info = {};
        }
        existedInstance = AssistantCodeGenerator._getValueFromMap(this._elementInstancePair, $element[0]);
        if (!existedInstance.length || !info.useExist) {
            if (info.name) {
                result = this._generateInstanceVariable(info.name, $element);
                AssistantCodeGenerator._setValueToMap(this._elementInstancePair, $element[0], info.name);
            } else {
                result = this._generateQuerySelector($element[0]);
            }
        } else if (existedInstance.indexOf(info.name) >= 0) {
            result = info.name;
        }
        return AssistantCodeGenerator._generateCompleteSentence(result);
    }

    /**
     * Get TAU widget
     * @param {HTMLElement} element
     * @param {Object} info
     * @returns {void|string|XML|*}
     */
    getTAUWidget(element, info) {
        var $element,
            existedInstance,
            result = {
                varName: null,
                constructorName: null,
                targetElement: null,
                options: null
            };

        if (!element) {
            throw new Error('getTAUWidget::1st argument is empty');
        }

        if (!info) {
            throw new Error('getTAUWidget::2nd argument is empty');
        }

        $element = $(element);
        existedInstance = AssistantCodeGenerator._getValueFromMap(this._elementInstancePair, $element[0]);
        if (!existedInstance.length || !info.useExist) {
            result.targetElement = this._generateQuerySelector($element[0]);
        } else if (existedInstance.indexOf(info.name) >= 0) {
            result.targetElement = info.name;
        }

        result.constructorName = info.widgetInfo.constructorName;
        result.varName = info.widgetInfo.name;
        result.options = this._generateWidgetOptionSentence(info.widgetInfo.options);

        return AssistantCodeGenerator._generateTAUWidgetVariable(result);
    }

    /**
     * This method make event listener for used to info and element.
     * info has properties, eventName.
     * @param {HTMLElement} element
     * @param {Object} info
     * @returns {string}
     */
    getEventListener(element, info) {
        var $element = $(element),
            instanceList,
            instance,
            listener;

        if (!element || !info) {
            throw new Error('getEventListener::arguments are empty');
        }
        instanceList = AssistantCodeGenerator._getValueFromMap(this._elementInstancePair, $element[0]);
        if (info.useExist) {
            if (instanceList.indexOf(info.name) >= 0) {
                instance = info.name;
            }
        } else {
            instance = this._generateQuerySelector($element[0]);
        }
        listener = Mustache.render(Sentences.listener, info);
        return AssistantCodeGenerator._generateCompleteSentence(instance + listener);
    }

    /**
     * Get page transition
     * @param {HTMLElement} element
     * @param {Object} info
     * @returns {*}
     */
    getPageTransition(element, info) {
        info.content = Mustache.render(Sentences.pageTransition, info);
        return this.getEventListener(element, info);
    }

    /**
     * Get open popup
     * @param {HTMLElement} element
     * @param {Object} info
     * @returns {*}
     */
    getPopupOpen(element, info) {
        info.content = Mustache.render(Sentences.popupOpen);
        return this.getEventListener(element, info);
    }

    /**
     * get instance list
     * @param {HTMLElement} element
     * @returns {*}
     */
    getInstanceListFromMap(element) {
        var $element = $(element);
        return AssistantCodeGenerator._getValueFromMap(this._elementInstancePair, $element[0]);
    }

    /**
     * Set value to map
     * @param {Map} map
     * @param {string} key
     * @param {*} value
     * @private
     */
    static _setValueToMap(map, key, value) {
        var stored = AssistantCodeGenerator._getValueFromMap(map, key);

        if (!stored.length) {
            map.set(key, [value]);
        } else {
            stored.push(value);
            map.set(key, stored);
        }
    }

    /**
     * Get value form map
     * @param {Map} map
     * @param {string} key
     * @returns {*}
     * @private
     */
    static _getValueFromMap(map, key) {
        return map.get(key) || [];
    }
}

export {AssistantCodeGenerator};
