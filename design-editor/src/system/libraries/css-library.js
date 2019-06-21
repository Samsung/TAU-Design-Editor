// @ts-nocheck
import Library from './library';
import {basename, extname} from 'path';

class CSSLibrary extends Library {
	constructor(fileName, element) {
		super(fileName);
		this._element = element;
	}

	createHTMLElement() {
		if (this._fileName) {
			this._element = document.createElement('link');
			this.setAttribute('rel', 'stylesheet');
			this.setAttribute('hrev', this.getAbsolutePath(true));
			this.setAttribute(this.createDataAttribute(), '');
		} else {
			this._element = document.createElement('style');
		}
		return this._element;
	}

	createDataAttribute() {
		const libraryAttributeName = basename(this._fileName, extname(this._fileName))
			.replace('.', '-');
		return `data-style-${libraryAttributeName}`;
	}

	getSelector() {
		return `link[${this.createDataAttribute()}]`;
	}

	setAttribute(key, value='') {
		this.addAttribute(key,value);
		this._element.setAttribute(key, value);
	}
}

export default CSSLibrary;
