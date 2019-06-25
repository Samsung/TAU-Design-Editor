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
	 * @param {HTMLScriptElement} [scriptElement] Script element of library
	 * if empty then it will be internal script with content inside
	 * otherwise it will be script with src=<lib-root>/filename
	 */
	constructor(fileName, scriptElement) {
		super(fileName, scriptElement);
		this.element = scriptElement;
		this.type = 'application/javascript';
	}

	/**
	 * Creating HTMLScriptElement for library
	 * @param {string} currentFile - path to currently opened file
	 * @returns {HTMLScriptElement} script element for library
	 */
	// eslint-disable-next-line no-unused-vars
	createHTMLElement(currentFile) {
		this.element = this.element || document.createElement('script');
		this.setAttribute('type', this.type);
		if (this.fileName) {
			this.setAttribute('src', this.getRelativePath(currentFile));
			this.setAttribute(this.createDataAttribute(), '');
		}
		return this.element;
	}

	getSelector() {
		return `script[src$="${this.fileName}"]`;
	}
}

export default JSLibrary;
