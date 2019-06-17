// @ts-nocheck
'use babel';
import pathUtils from '../../utils/path-utils';
import {appManager} from '../../app-manager';
import {relative, join} from 'path';
import fs from 'fs-extra';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const LIB_DIRECTORY = 'lib';
/**
 * Responsible for js library file created in lib directory
 * @class Library
 */
class Library {

	/**
	 * @constructor
	 * @param {string} [fileName] name of library file with extension
	 * if not added then element for internal library is given
	 */
	constructor(fileName) {
		this._fileName = fileName;
		this._attributes = {};
		this.templatePath = join(appManager.getAppPath().src, 'templates', fileName || '');
	}

	/**
	 * Returns absolute path to main library directory
	 * @static
	 * @returns {string} path to main folder with libs
	 */
	static getLibrariesRoot(addHash) {
		return pathUtils.createProjectPath(LIB_DIRECTORY, addHash);
	}

	/**
	 * Get relative path for lib
	 * @param {string} startFrom path as startpoint
	 * from result path will be relative
	 * @returns {string} relative path according to given in param
	 */
	getRelativePath(startFrom) {
		return relative(startFrom, this.getAbsolutePath());
	}

	/**
	 * Gets absolute path started from the project root
	 * @returns {string} absolute path to specific lib
	 */
	getAbsolutePath(addHash) {
		const name = this._fileName || '';
		return pathUtils.joinPaths(Library.getLibrariesRoot(addHash), name);
	}

	/**
	 * Add attribute to library HTML element
	 * @param  {string} key elements attribute name
	 * @param  {string} [value=''] optional attribute value
	 */
	addAttribute(key, value='') {
		this._attributes[key] = value;
	}

	/**
	 * Gets all lib attributes
	 * @returns {Object} all attributes as plain object
	 */
	getAttributes() {
		return this._attributes;
	}

	getTemplateContent() {
		return fetch(this.templatePath)
			.then((data) => data.text())
			.catch((err) => {throw err;});
	}

	copyLibFile(callback) {
		fs.exists(this.getAbsolutePath(), (exists) => {
			if (!exists) {
				this.getTemplateContent()
					.then((text) => {
						return writeFile(this.getAbsolutePath(), text);
					})
					.then(callback)
					.catch(err => {throw err;});
			}
		});
	}


	/**
	 * Creating HTML element for library
	 * @abstract
	 */
	createHTMLElement() {
		throw new Error('Method createHTMLElement has to be implemented');
	}


	/**
	 * Add library to its destination
	 * @abstract
	 */
	insertLibContent() {
		throw new Error('Method insertLibContent has to be implemented');
	}

	/**
	 * Gets element selector
	 * @abstract
	 */
	getSelector() {
		throw new Error('Method getSelector should be implemented');
	}
}

export default Library;
