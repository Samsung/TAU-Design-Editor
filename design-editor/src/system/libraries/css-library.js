// @ts-nocheck
import Library from './library';

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
	 * @returns {HTMLStyleElement|HTMLLinkElement} Element for library
	 */
	createHTMLElement() {
		if (this.fileName) {
			this.element = document.createElement('link');
			this.setAttribute('rel', 'stylesheet');
			this.setAttribute('href', this.getAbsolutePath(true));
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
		return `link[href$="${this.fileName}"]`;
	}
}

export default CSSLibrary;
