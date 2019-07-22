const utils = require('../../../design-editor/src/utils/utils').default;
const fsExtra = require('./fs-extra');
const path = require('path');


class HTMLAssistantEditorElement {
	constructor() {
		this._isOpened = false;
		this._tempFileName = 'html-assistant-tmp.txt';
	}

	open(htmlText) {
		fsExtra.writeFile(this._tempFileName, htmlText, (error) => {
			if (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			} else {
				window.parent.postMessage({
					type: 'OPEN_EDITOR',
					file: this._tempFileName
				}, '*');
				this._isOpened = true;
			}
		});
	}

	close() {
		window.parent.postMessage({
			type: 'CLOSE_EDITOR'
		}, '*');
		this._isOpened = false;

		return new Promise((resolve) => {
			window.addEventListener('message', ({ data }) => {
				if (data.type === 'VSCODE_MESSAGE' && data.info === 'EDITOR_CLOSED') {
					return resolve();
				}
			});
		});
	}

	clean() {
		fsExtra.deleteFile(this._tempFileName);
	}

	isOpened() {
		return this._isOpened;
	}

	getEditorContent() {
		const fullPath = path.resolve(
			utils.checkGlobalContext('globalData').projectId,
			this._tempFileName
		);

		return new Promise((resolve, reject) => {
			fsExtra.readFile(fullPath, null, (error, result) => {
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		});
	}
}

export {HTMLAssistantEditorElement};
