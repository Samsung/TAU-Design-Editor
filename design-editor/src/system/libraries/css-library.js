// @ts-nocheck
import Library from './library';

class CSSLibrary extends Library {
	constructor(fileName, element) {
		super(fileName);
		this._element = element || this.createHTMLElement();
	}

	createHTMLElement() {
		let element;
		if (this._fileName) {
			element = document.createElement('link');
			this.setAttribute('rel', 'stylesheet');
			this.setAttribute('hrev', this._fileName);
		} else {
			element = document.createElement('style');
		}
		return element;
	}

	setAttribute(key, value='') {
		this.addAttribute(key,value);
		this._element.setAttribute(key, value);
	}
}

export default CSSLibrary;
