'use babel';

import $ from 'jquery';
import Mustache from 'mustache';
import {appManager} from '../app-manager';
import {elementSelector} from './element-selector';
import {EVENTS, eventEmitter} from '../events-emitter';

const slice = [].slice;

/**
 * Filter text nodes
 * @param {Node} node
 * @returns {boolean}
 */
function filterOnlyTextNode(node) {
    return node.nodeType === node.TEXT_NODE;
}

/**
 * Map element content
 * @param {Node} node
 * @returns {*}
 */
function mapTextContent(node) {
    return node.textContent;
}

/**
 * Get text from element
 * @param {HTMLElement} element
 * @returns {string}
 */
function getDirectTextFromElement(element) {
    return slice.call(element.childNodes)
        .filter(filterOnlyTextNode)
        .map(mapTextContent)
        .join(' ');
}

class StyleManager {
    /**
     * Constructor
     */
    constructor() {
	    console.log('style-manager:constructor');
        this._model = {
            elements: []
        };
        this._bindEvents();
    }

    /**
     * Bind events
     * @private
     */
    _bindEvents() {
        eventEmitter.on(EVENTS.ChangeElementStyle, this._onChangeElementStyle.bind(this));
    }

    /**
     * Change element style callback
     * @param {string} template
     * @private
     */
    _onChangeElementStyle(template) {
        console.log('style-manager:_onChangeElementStyle');

        var id = elementSelector.getSelectedElementId(),
            designEditor = appManager.getActiveDesignEditor(),
            $element = designEditor && $(designEditor._getElementById(id));

        this._designEditor = designEditor;

        if (designEditor.getUIInfo($element).package.name === 'listview') {
            this._getModel($element.children(), 'listview');
        } else {
            this._getModel($element, designEditor.getUIInfo($element).package.name);
        }

        this._replaceStyle($element, template);
    }

    /**
     * Replace style
     * @param {jQuery} $element
     * @param {string} template
     * @private
     */
    _replaceStyle($element, template) {
        var elements,
            designEditor = appManager.getActiveDesignEditor(),
            afterTemplate,
            $template,
            len, i,
            id,
            component = designEditor.getUIInfo($element).package,
            oldTemplate;

        if (component.name === 'listview') {
            elements = $element.children();
            len = elements.length;
        } else {
            // listitem
            elements = $element;
            len = 1;
        }

        for (i = 0; i < len; i += 1) {
            id = $(elements[i]).attr('data-id');
            afterTemplate = Mustache.render(template, this._model.elements[i]);
            $template = $(afterTemplate);
            oldTemplate = component.options.template;
            component.options.template = afterTemplate;
            this._designEditor.getModel().replaceElement(id, component);
            component.options.template = oldTemplate;
        }
    }

    /**
     * Get model for list item
     * @param {jQuery} $element
     * @returns {{}}
     * @private
     */
    _getModelForListItem($element) {
        var $textElements,
            subIndex = 0,
            j, jLen,
            content = {};

        $textElements = $($element).find('span, a, label');
        content = {
            mainText: 'Main text',
            subText: [
                {
                    text: 'Sub text',
                    first: true
                },
                {
                    text: 'Sub text',
                    first: false
                }
            ]
        };
        jLen = $textElements.length;
        if (jLen) {
            subIndex = 0;
            for (j = 0; j < jLen; j += 1) {
                if ($($textElements[j]).hasClass('ui-li-sub-text')) {
                    // subtext
                    if (content.subText[subIndex += 1]) {
                        content.subText[subIndex].text = $($textElements[j]).text();
                    }
                } else {
                    // maintext
                    content.mainText = getDirectTextFromElement($textElements[j]);
                }
            }
        }
        return content;
    }

    /**
     * Get model for Header
     * @param {jQuery} $element
     * @returns {{title: string, button: {text: string}}}
     * @private
     */
    _getModelForHeader($element) {
        var $title,
            $button,
            content = {
                title: 'Header',
                button: {
                    text: 'More'
                }
            };

        $title = $element.find('.ui-title');
        if ($title.length) {
            content.title = $title.text();
        }

        $button = $element.find('button');
        if ($button.length) {
            content.button.text = $button.text();
        }
        return content;
    }

    /**
     * Get model for text
     * @param {jQuery} $element
     * @returns {{mainText: (string|string)}}
     * @private
     */
    _getModelForText($element) {
        return {
            mainText: getDirectTextFromElement($element) || 'text'
        };
    }

    /**
     * Get model
     * @param {jQuery} $element
     * @param {string} packageName
     * @returns {{elements: Array}|*}
     * @private
     */
    _getModel($element, packageName) {
        var content = null,
            i, len;

        // clear old values
        this._model.elements = [];

        len = $element.length;
        if (len) {
            for (i = 0; i < len; i += 1) {
                switch (packageName) {
                case 'listitem' :
                case 'listview' :
                    content = this._getModelForListItem($element[i]);
                    break;
                case 'text' :
                    content = this._getModelForText($element[i]);
                    break;
                case 'header' :
                    content = this._getModelForHeader($($element[i]));
                    break;
                }
                if (content) {
                    this._model.elements.push(content);
                }
            }
        }
        return this._model;
    }
}

const styleManager = new StyleManager();

export {styleManager};
