import { extname } from 'path';
import JSLibrary from './js-library';
import CSSLibrary from './css-library';


class LibraryCreator {

	createLibrary(name, element, type) {
		type = type || this.getType(name, element);
		switch (type) {
		case 'css':
			return new CSSLibrary(name, element);
		case 'js':
			return new JSLibrary(name, element);
		default:
			return;
		}

	}

	getType(name, element) {
		if(name) {
			return extname(name).replace('.', '');
		} else {
			switch (element.tagName) {
			case 'SCRIPT':
				return 'js';
			case 'STYLE':
			case 'LINK':
				return 'css';
			default:
				throw new Error('Unknown Library type. The type of library has to be specified');
			}
		}
	}

}

export default LibraryCreator;
