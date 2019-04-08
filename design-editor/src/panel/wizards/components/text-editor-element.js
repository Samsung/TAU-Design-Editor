'use babel';

import $ from 'jquery';
import editor from '../../../editor';
import utils from '../../../utils/utils';

var BracketsProjectManager;
var brackets = utils.checkGlobalContext('brackets');

var classes = {
    BLOCK : 'block',
    DEFAULT_TEXT : 'pw-page-name',
    BRACKETS_TEXT : 'brackets-text-edit'
};


if (!window.atom && brackets) {
    BracketsProjectManager = brackets.getModule('project/ProjectManager');
}

/**
 *
 */
class TextEditor extends HTMLDivElement {
    /**
     * Create callback
     */
    createdCallback() {
        this._initialize();
        this.options = {
            path: ''
        };
    }

    /**
     * Init
     * @private
     */
    _initialize() {
        this._textElement = null;
        $(this).addClass(classes.BLOCK);
        this._setElement();
    }

    /**
     * Set element
     * @private
     */
    _setElement() {
        var $textElement,
            self = this;

        if (window.atom) {
            $textElement = $(document.createElement(editor.selectors.textEditor));
            self._textElement = $textElement[0];
            $(self).append($textElement);
            $textElement
                .attr('mini', true);
        } else {
            $textElement = $(document.createElement('input'));
            self._textElement = $textElement[0];
            $(self).append($textElement);
            $textElement
                .attr('mini', true)
                .addClass(classes.BRACKETS_TEXT);
        }
        $(self).addClass(classes.DEFAULT_TEXT);
    }

    /**
     * Get value
     * @returns {*}
     */
    getValue() {
        if (window.atom) {
            return this._textElement.getModel().getText();
        }
        return this._textElement.value;
    }
}

const TextEditorElement = document.registerElement('text-editor', TextEditor);

export {TextEditorElement, TextEditor};
