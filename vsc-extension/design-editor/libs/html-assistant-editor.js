const utils = require('../../../design-editor/src/utils/utils');
const fsExtra = require('./fs-extra');


class HTMLAssistantEditorElement {
    constructor() {
        this._isOpened = false;
        this._tempFileName = '.html-assistant-tmp';
    }

    open(htmlText) {
        fsExtra.writeFile(this._tempFileName, htmlText, (error) => {
            if (error) {
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
        fsExtra.deleteFile(this._tempFileName, (error) => {
            if (error) {
                console.error(error);
            } else {
                window.parent.postMessage({
                    type: 'CLOSE_EDITOR'
                }, '*');
                this._isOpened = false;
            }
        });
    }

    isOpened() {
        return this._isOpened;
    }

    getEditorContent() {
        return new Promise((reject, resolve) => {
            fsExtra.readFile(this._tempFileName, null, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
}

export {HTMLAssistantEditorElement};
