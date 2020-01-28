'use babel';

const classes = {
	BLOCK : 'block',
	DEFAULT_TEXT : 'pw-page-name',
	BRACKETS_TEXT : 'brackets-text-edit'
};

/**
 *
 */
class TextEditor extends HTMLElement {
	constructor() {
		super();
		this.options = {
			path: ''
		};
		this._textElement = null;
	}

	/**
     * Set elements content
     * @private
     */
	connectedCallback() {
		this.classList.add(classes.BLOCK, classes.DEFAULT_TEXT);
		this._textElement = document.createElement('input');
		this._textElement.setAttribute('mini', true);
		this._textElement.setAttribute('required', '');
		this._textElement.classList.add(classes.BRACKETS_TEXT);
		this._textElement.addEventListener('blur', this.showWarningIfEmpty);
		this.appendChild(this._textElement);
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
		if (!element.value) {
			element.parentElement.classList.add('empty-warning');
		} else {
			element.parentElement.classList.remove('empty-warning');
		}
	}
}

customElements.define('text-editor', TextEditor);

export {TextEditor};
