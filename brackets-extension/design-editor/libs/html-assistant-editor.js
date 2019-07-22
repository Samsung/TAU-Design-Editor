/* eslint-disable no-console */
import $ from 'jquery';
import {html as beautify} from 'js-beautify';
import {DressElement} from '../../../design-editor/src/utils/dress-element';
import utils from '../../../design-editor/src/utils/utils';
import editor from '../../../design-editor/src/editor';
import {appManager} from '../../../design-editor/src/app-manager';

const TextEditor = editor.TextEditor;

const beautyOptions = {
	'indent_size': 4,
	'indent_char': ' ',
	'preserve_newlines': false,
	'unformatted': ['a', 'br', 'noscript', 'textarea', 'pre', 'code']
};

require('jquery-ui');

class HTMLAssistantEditor extends DressElement {

	/**
	 * Constructing Editor object when created
	 */
	onCreated() {
		let brackets = null,
			DocumentManager = null,
			doc = null;
		this.classList.add('closet-instant-editor');
		$(document.body).append(this);
		brackets = utils.checkGlobalContext('brackets');
		DocumentManager = brackets.getModule('document/DocumentManager');
		doc = DocumentManager.createUntitledDocument(1, '.html');
		this._textEditor = new TextEditor(doc, false, this.$el);
		this._$textEditorEl = this._textEditor.$el;

		this._$textEditorEl.addClass('closet-instant-editor-item');
		this._$textEditorEl.attr('tabindex', 0);

		this._currentGrammar = null;
		this._targetModel = null;

		this._opened = false;
		this._bindEvent();
	}

	/**
	 * Opens HTML Assistant editor
	 * @param {string} elementContent Content of selected Element which appears in editor
	 */
	open(elementContent) {
		this._opened = true;
		console.log('HTMLAssistant open', elementContent);
		this._targetModel = appManager.getActiveDesignEditor().getModel();
		this.layout(1, 1);
		this.initContents(elementContent);
		this.$el.addClass('activate');
	}

	/**
	 * Closes HTML assistant editor
	 */
	close() {
		return new Promise((resolve) => {
			this._opened = false;
			this.$el.removeClass('activate');
			console.log('HTMLAssistant close');

			resolve();
		});
	}

	/**
	 * Check if editor is opened
	 * @returns {boolean} true if document is open
	 */
	isOpened() {
		return this._opened;
	}

	/**
	 * Formats and bueatifies contents of selected element
	 * to add it as editor content
	 * @param {string} elementContent content of selected element
	 */
	initContents(elementContent) {
		const contents = beautify(elementContent, beautyOptions);
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
	 * Returns current content from editor
	 * @returns {string} editor content
	 */
	getEditorContent() {
		return this._textEditor.document.getText();
	}

	layout(x, y) {
		const width = this.$el.innerWidth(),
			max = 55;

		this.$el.css({
			left: Math.max(x - width, max),
			top: y
		});
	}

	_bindEvent() {
		this.$el.on('transitionEnd webkitTransitionEnd', () => {
			if (this._opened) {
				if (this._textEditor.setCursorScreenPosition) {
					this._$textEditorEl.focus();
					this._textEditor.setCursorScreenPosition([0, 0]);
				} else {
					this._textEditor.updateLayout(true);
					this._textEditor.setCursorPos(0, 0, true);
				}
			}
		});
	}

	onDestroy() {
		this._$textEditorEl.remove();
		this._$textEditorEl = null;
		this._textEditor.destroy();
		this._textEditor = null;
	}
}
const HTMLAssistantEditorElement = document.registerElement('closet-instant-editor', HTMLAssistantEditor);

export {HTMLAssistantEditorElement, HTMLAssistantEditor};
