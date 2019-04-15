'use babel';

/**
 *  Manages asssistant view feature for VSCode.
 */
class AssistantViewManager {
    /**
     * Constructor
     */
    constructor() {
        this._isOpened = false;
    }

    /**
     * Opens VSCode card with JS file
     * @param {DesignEditor} closetDesignEditor
     * @param {string} scriptPath
     */
    open(closetDesignEditor, scriptPath) {
        window.parent.postMessage({
            type: 'ASSISTANT_VIEW_OPEN'
        }, '*');
        this._isOpened = true;
    }

    /**
     * Close card
     */
    close() {
        window.parent.postMessage({
            type: 'CLOSE_EDITOR'
        }, '*');
        this._isOpened = false;
    }

    /**
     * Check if card is opened
     * @returns {boolean}
     */
    isOpened() {
        return this._isOpened;
    }

    /**
     * Insert code to the opened editor
     * @param  {string} code
     */
    insertCode(code) {
        window.parent.postMessage({
            type: 'INSERT_CODE',
            code
        }, '*');
        console.log('Insert code', code);
    }
}

export default AssistantViewManager;
