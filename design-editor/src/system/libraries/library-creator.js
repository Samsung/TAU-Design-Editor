// @ts-nocheck
import { extname } from 'path';
import JSLibrary from './js-library';
import CSSLibrary from './css-library';
import JSONLibrary	from './json-library';

/**
 * Responsible for creating library in proper type.
 * @classdesc Factory for Libraries
 */
class LibraryCreator {
	/**
	 * Choose the proper library accordin to its type
	 * @param  {string} [name] file name of given library
	 * if not given then library will be internal with content into it
	 * not in external file
	 * @param  {HTMLElement} [element] optional param for element if exists
	 * if not given Library will create its own
	 * @param  {string} [type] optional type of library
	 * mandatory only if neither name nor element given
	 * Supported types: css, js, json
	 * @todo Add JSON validation, because now we have to add type json to get json library
	 * @returns {Library} proper library type
	 */
	createLibrary(name, element, type) {
		type = type || this.getType(name, element);
		switch (type) {
		case 'css':
			return new CSSLibrary(name, element);
		case 'js':
			return new JSLibrary(name, element);
		case 'json':
			return new JSONLibrary(name, element);
		default:
			throw new Error('Unknown Library type. The type of library has to be specified');
		}

	}

	/**
	 * Automated get library type if not given
	 * @param  {string} name name of file
	 * @param  {HTMLElement} element HTMLElement for library
	 * LINk, STYLE, SCRIPT
	 * @returns {string} one of library types
	 * Supported types: css, js, json
	 */
	getType(name, element) {
		const extension = {
			'SCRIPT': 'js',
			'STYLE': 'css',
			'LINK': 'css',
		};

		return name
			? extname(name).replace(/^./, '')
			: extension[element.tagName];
	}

}

export default LibraryCreator;
