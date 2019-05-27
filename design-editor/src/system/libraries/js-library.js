// @ts-nocheck
'use babel';

import Library from './library';

/**
 * @classdesc Responsible for JS-Libraries
 */
class JSLibrary extends Library {

	/**
	 * @constructor
	 * @param {string} [fileName] Name of library file
	 * @param {HTMLScriptElement} [script] Script element of library
	 * if empty then it will be internal script with content inside
	 * otherwise it will be script with src=<lib-root>/filename
	 */
	constructor(fileName, script) {
		super(fileName);
		this.element = script || this.createHTMLElement();
		this.type = 'application/javascript';
	}

	/**
	 * Creating HTMLScriptElement for library
	 * @returns {HTMLScriptElement} script element for library
	 */
	createHTMLElement() {
		this.element = this.element || document.createElement('script');
		this.setAttribute('type', this.type);
		if (this._fileName) {
			this.setAttribute('src', this.getAbsolutePath());
		}
		return this.element;
	}


	insertLibContent(callback) {
		if (this._fileName) {
			this.copyLibFile(callback);
		} else {
			this.element.textContent = this.content;
		}
	}


	setAttribute(key, value='') {
		this.addAttribute(key,value);
		this.element.setAttribute(key, value);
	}
}

export default JSLibrary;
