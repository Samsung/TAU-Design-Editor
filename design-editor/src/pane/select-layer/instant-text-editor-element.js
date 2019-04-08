'use babel';

import $ from 'jquery';
import {html as beautify} from 'js-beautify';
import {DressElement} from '../../utils/dress-element';
import editor from '../../editor';
import {EVENTS, eventEmitter} from '../../events-emitter';
import {appManager} from '../../app-manager';
import utils from '../../utils/utils'

const TextEditor = editor.TextEditor;

const beautyOptions = {
    'indent_size': 4,
    'indent_char': ' ',
    'preserve_newlines': false,
    'unformatted': ['a', 'br', 'noscript', 'textarea', 'pre', 'code']
};

require('jquery-ui');

class InstantTextEditor extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        var brackets = null,
            DocumentManager = null,
            doc = null;
        this.classList.add('closet-instant-editor');
        $(document.body).append(this);
        if (editor.isAtom()) {
            this._textEditor = new TextEditor();
            this._$textEditorEl = $(editor.getView(this._textEditor));
            this.$el.append(this._$textEditorEl);
        } else {
            brackets = utils.checkGlobalContext('brackets');
            DocumentManager = brackets.getModule('document/DocumentManager');
            doc = DocumentManager.createUntitledDocument(1, '.html');
            this._textEditor = new TextEditor(doc, false, this.$el);
            this._$textEditorEl = this._textEditor.$el;
        }
        this._$textEditorEl.addClass('closet-instant-editor-item');
        this._$textEditorEl.attr('tabindex', 0);

        this._currentGrammar = null;
        this._targetModel = null;
        this._isClosed = false;

        this._bindEvent();
        this.hide();
    }

    /**
     * Bind events
     * @private
     */
    _bindEvent() {
        var self = this;
        self.$el.on('transitionEnd webkitTransitionEnd', () => {
            if (!self._isClosed) {
                if (self._textEditor.setCursorScreenPosition) {
                    self._$textEditorEl.focus();
                    self._textEditor.setCursorScreenPosition([0, 0]);
                } else {
                    self._textEditor.updateLayout(true);
                    self._textEditor.setCursorPos(0, 0, true);
                }
            }
        });

        if (editor.isAtom()) {
            self._$textEditorEl.on('blur', self._onBlur.bind(self));
        }

        eventEmitter.on(EVENTS.ElementDeselected, () => {
            if (!self._isClosed) {
                self._onBlur();
            }
            self._elementId = null;
        });

        eventEmitter.on(EVENTS.ElementSelected, (elementId) => {
            self._elementId = elementId;
        });
    }

    /**
     * Destroy callback
     */
    onDestroy() {
        this._$textEditorEl.remove();
        this._$textEditorEl = null;
        this._textEditor.destroy();
        this._textEditor = null;
    }

    /**
     * Open
     */
    open() {
        this._targetModel = appManager.getActiveDesignEditor().getModel();

        // prevent secure error
        this.layout(0, 0);
        this.initContents();

        this.show();
    }

    /**
     * Set grammar
     * @param {Object} grammar
     */
    setGrammar(grammar) {
        if (this._currentGrammar !== grammar) {
            this._currentGrammar = grammar;

            if (this._textEditor.setGrammar) {
                this._textEditor.setGrammar(grammar);
            }
        }
    }

    /**
     * Close
     */
    close() {
        var contents;

        if (this._elementId) {
            if (this._textEditor.document) {
                contents = this._textEditor.document.getText();
            } else {
                contents = this._$textEditorEl[0].getModel().getText();
            }
            this._targetModel.updateText(this._elementId, contents);
            this.hide();
        }
    }

    /**
     * Build layout
     * @param {number} x
     * @param {number} y
     */
    layout(x, y) {
        var width = this.$el.innerWidth(),
            max = editor.isAtom() ? 300 : 15;

        this.$el.css({
            left: Math.max(x - width, max),
            top: y
        });
    }

    /**
     * Init content
     */
    initContents() {
        var contents = beautify(this._targetModel.getElementWithoutId(this._elementId).innerHTML, beautyOptions);
        if (this._textEditor.setText) {
            this._textEditor.setText(contents, {
                autoIndent: true,
                autoIndentNewline: true
            });
        } else {
            this._textEditor.document.setText(contents);
            this._textEditor.updateLayout(true);
        }
    }

    /**
     * Show
     */
    show() {
        this._isClosed = false;
        this.$el.addClass('activate');
    }

    /**
     * Hide
     */
    hide() {
        this._isClosed = true;
        this.$el.removeClass('activate');
    }

    /**
     * Blur callback
     * @private
     */
    _onBlur() {
        this.close();
    }
}


const InstantTextEditorElement = document.registerElement('closet-instant-editor', InstantTextEditor);

export {InstantTextEditorElement, InstantTextEditor};
