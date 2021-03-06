// @ts-nocheck
import Library from './library';
import {basename} from 'path';

/**
 * @classdesc Module responsible for CSS Libraries
 */
class CSSLibrary extends Library {
	/**
	 * @constructor
	 * @param {string} [fileName] Name of library file
	 * @param {HTMLLinkElement|HTMLStyleElement} [element] Style or Link element of library
	 * if empty then it will be style with content inside
	 * otherwise it will be link with href=<lib-root>/filename
	 */
	constructor(fileName, element) {
		super(fileName, element);
	}

	/**
	 * Creates HTML Element for library with basic attributes
	 * @param {string} currentPath current file basepath
	 * @returns {HTMLStyleElement|HTMLLinkElement} Element for library
	 */
	createHTMLElement(currentPath) {
		if (this.fileName) {
			this.element = document.createElement('link');
			this.setAttribute('rel', 'stylesheet');
			this.setAttribute('href', this.getRelativePath(currentPath));
		} else {
			this.element = document.createElement('style');
		}
		return this.element;
	}

	/**
	 * get css selector of library element
	 * @returns {string} css selector of particular library
	 */
	getSelector() {
		const minifiedName = `${basename(this.fileName, 'css')}min.css`;
		return `link[href$="${this.fileName}"], link[href$="${minifiedName}"]`;
	}
}

export default CSSLibrary;
