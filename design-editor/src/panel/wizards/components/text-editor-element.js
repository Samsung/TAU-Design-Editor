'use babel';

import $ from 'jquery';

const classes = {
	BLOCK : 'block',
	DEFAULT_TEXT : 'pw-page-name',
	BRACKETS_TEXT : 'brackets-text-edit'
};

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
		const $textElement = $(document.createElement('input')),
			self = this;
		self._textElement = $textElement[0];
		$(self).append($textElement);
		$textElement
			.attr('mini', true)
			.attr('required', '')
			.addClass(classes.BRACKETS_TEXT);
		$(self).addClass(classes.DEFAULT_TEXT);
		self._textElement.addEventListener('blur', this.showWarningIfEmpty);
	}

	/**
     * Get value
     * @returns {*}
     */
	getValue() {
		return this._textElement.value;
	}

	/**
	 * Shows warning message if element is empty
	 * @param  {Event} e event given to callback
	 */
	showWarningIfEmpty(e) {
		const element = e.target;
		if (!element.value()) {
			element.parentElement.classList.add('empty-warning');
		} else {
			element.parentElement.classList.remove('empty-warning');
		}
	}
}

const TextEditorElement = document.registerElement('text-editor', TextEditor);

export {TextEditorElement, TextEditor};
