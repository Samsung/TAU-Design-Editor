// @ts-nocheck
'use babel';

import Library from './library';
import {basename, extname} from 'path';

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
		super(fileName);
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
		if (this._fileName) {
			this.setAttribute('src', this.getRelativePath(currentFile));
			this.setAttribute(this.createDataAttribute(), '');
		}
		return this.element;
	}

	/**
	 * Inserts content into library
	 * both as internal script or copy proper file
	 * @param  {function} callback callback function after insertion.
	 */
	insertLibContent(callback) {
		if (this._fileName) {
			this.copyLibFile(callback);
		} else {
			this.element.textContent = this.content;
		}
	}

	/**
	 * Set element attribute
	 * @param {string} key attribute key
	 * @param {string} value attribute value
	 */
	setAttribute(key, value='') {
		this.addAttribute(key,value);
		this.element.setAttribute(key, value);
	}

	createDataAttribute() {
		return `data-${basename(this._fileName, extname(this._fileName))}`;
	}

	getSelector() {
		return `script[${this.createDataAttribute()}]`;
	}
}

export default JSLibrary;
