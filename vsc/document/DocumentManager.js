/**
 * This module contains set of functions simulating Brackets API behaviour,
 * which is non existent while Design Editor is used
 * as Visual Studio Code extension.
 *
 * @todo implement DocumentManager module methods
 * (http://suprem.sec.samsung.net/jira/browse/TIZENWF-1977)
 */

const fsExtra = require('../../vsc-extension/design-editor/libs/fs-extra');

module.exports = class DocumentManager {
	/**
	 * Returns the Document that is currently open
	 * in the editor UI. May be null.
	 * @return {?Document}
	 */
	static getCurrentDocument() {
		return null;
	}

	/**
	 * Creates an untitled document. The associated File has a fullPath that
	 * looks like /some-random-string/Untitled-counter.fileExt.
	 *
	 * @param {number} counter - used in the name of the new Document's File
	 * @param {string} fileExt - file extension of
	 *      the new Document's File, including "."
	 * @return {Document} - a new untitled Document
	 */
	static createUntitledDocument(counter, fileExt) {
		return null;
	}

	/**
	 * Gets an existing open Document for the given file,
	 * or creates a new one if the Document is
	 * not currently open ('open' means referenced
	 * by the UI somewhere). Always use this method to
	 * get Documents; do not call the Document constructor directly.
	 * This method is safe to call in parallel.
	 *
	 * If you are going to hang onto the Document
	 * for more than just the duration of a command - e.g.
	 * if you are going to display its contents in a piece of UI -
	 * then you must addRef() the Document and listen for changes on it.
	 * (Note: opening the Document in an Editor automatically manages
	 * refs and listeners for that Editor UI).
	 *
	 * If all you need is the Document's getText() value,
	 * use the faster getDocumentText() instead.
	 *
	 * @param {!string} fullPath
	 * @return {$.Promise} A promise object that will be
	 *      resolved with the Document, or rejected
	 *      with a FileSystemError if the file is not
	 *      yet open and can't be read from disk.
	 */
	static getDocumentForPath(fullPath) {
		return new Promise((resolve, reject) => {
			fsExtra.readFile(fullPath, undefined, (error, content) => {
				if (error) reject(error);
				resolve(content);
			});
		});
	}
};
