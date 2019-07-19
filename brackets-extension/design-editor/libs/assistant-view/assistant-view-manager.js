'use babel';

import {AssistantViewElement} from './assistant-view-element';
import {AssistantWizardElement} from '../../../../design-editor/src/panel/assistant/assistant-wizard';
import {AssistantCodeGenerator} from '../../../../design-editor/src/system/assistant/assistant-code-generator';

const DEFAULT_GRAMMAR = 'source.js';


/**
 *  Manages asssistant view feature.
 */
class AssistantViewManager {
    /**
     * Constructor
     *
     * Brackets API does not support line-endigs customization
     * @link https://github.com/adobe/brackets/issues/10106
     */
    constructor() {
        this._codeGenerator = new AssistantCodeGenerator('\r\n');

        this._assistantElement = new AssistantViewElement();
        this._assistantCodeWizard = new AssistantWizardElement();

        this._closetDesignEditor = null;
        this._insertRow = 0;
        this._insertColumn = 0;
        this._isInsertCursorPosInfoExist = false;
    }

    /**
     * Open
     * @param {DesignEditor} closetDesignEditor
     * @param {string} scriptPath
     */
    open(closetDesignEditor, scriptPath) {
        this._closetDesignEditor = closetDesignEditor;
        closetDesignEditor.getSelectLayer();
        this._assistantElement.open(scriptPath);
    }

    /**
     * Close
     */
    close() {
        this._closetDesignEditor = null;
        this._assistantElement.close();
    }

    /**
     * Is open?
     * @returns {boolean}
     */
    isOpened() {
        return this._assistantElement.isOpened();
    }

    /**
     * Clear code
     * @private
     */
    _clearCodeInsertLocationInfo() {
        this._insertRow = null;
    }

    /**
     * Insert code
     * @param {string} codeBlock
     */
    insertCode(codeBlock) {
        const cursorPosition = this._assistantElement.getCursorPosition();
        this._assistantElement.$el.focus();
        this._insertRow = cursorPosition.row;
        this._insertColumn = cursorPosition.column;
        if (this._isInsertCursorPosInfoExist) {
            this._assistantElement.setCursorPosition([this._insertRow || 0, this._insertColumn || 0]);
        }

        this._assistantElement.insertText(codeBlock, {
            autoIndent: true,
            autoIndentNewline: true
        });

        this._clearCodeInsertLocationInfo();
    }

    /**
     * Creates script HTML element
     * @param {string} filePath Path to JS file
     * @returns {HTMLScriptElement} script element with src equal given path
     * @private
     */
    _createScript(filePath) {
        const script = document.createElement('script');
        script.setAttribute('src', filePath);
        return script;
    }
}

export default AssistantViewManager;
