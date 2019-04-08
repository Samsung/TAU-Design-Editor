'use babel';

/**
 *  Manages asssistant view feature.
 */
class AssistantViewManager {
    /**
     * Constructor
     */
    constructor() {
        this._isOpened = false;
    }

    /**
     * Open
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
     * Close
     */
    close() {
        window.parent.postMessage({
            type: 'CLOSE_EDITOR'
        }, '*');
        this._isOpened = false;
    }

    /**
     * Is open?
     * @returns {boolean}
     */
    isOpened() {
        return this._isOpened;
    }
}

export default AssistantViewManager;
