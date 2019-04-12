'use babel';

import fs from 'fs';
import $ from 'jquery';
import {AssistantViewElement} from './assistant-view-element';
import {AssistantWizardElement} from './assistant-wizard';
import {AssistantCodeGenerator} from '../../../../design-editor/src/system/assistant/assistant-code-generator';
import {eventEmitter, EVENTS} from '../../../../design-editor/src/events-emitter';
import pathUtils from '../../../../design-editor/src/utils/path-utils';
import utils from '../../../../design-editor/src/utils/utils';
import editor from '../../../../design-editor/src/editor';

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

        this._bindEvents();
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
     * Store code
     * @param {Object} options
     * @private
     */
    _storeCodeInsertLocationInfo(options) {
        if (options) {
            if (options.row) {
                this._insertRow = options.row;
                this._isInsertCursorPosInfoExist = true;
            }

            if (options.column) {
                this._insertColumn = options.column;
                this._isInsertCursorPosInfoExist = true;
            }

        } else {
            this._isInsertCursorPosInfoExist = false;
        }
    }

    /**
     * Clear code
     * @private
     */
    _clearCodeInsertLocationInfo() {
        this._insertRow = null;
    }

    /**
     * Open assistant code wizard
     * @param options
     * @private
     */
    _onOpenAssistantCodeWizard(options/* element */) {
        var cursorPos,
            designEditor;

        if (!this.isOpened()) {
            return;
        }

        if (!options) {
            options = {};
        }

        designEditor = this._closetDesignEditor;

        options.element = options.element || designEditor.getSelectedElement();

        cursorPos = this._assistantElement.getCursorPosition();

        options.row = options.row || cursorPos.row;
        options.column = options.column || cursorPos.column;

        if (options.element) {
            this._storeCodeInsertLocationInfo(options);
            this._assistantCodeWizard.open($(options.element), this._codeGenerator.getInstanceListFromMap(options.element));
        }
    }

    /**
     * Accept in wizard
     * @param {Object} codeInfo
     * @private
     */
    _onWizardAccepted(codeInfo) {
        const model = this._closetDesignEditor.getModel();
        switch (codeInfo.type) {
        case 'instance':
            this._insertCode(this._codeGenerator.getInstance(codeInfo.element, codeInfo.info, model));
            break;
        case 'tau-widget':
            this._insertCode(this._codeGenerator.getTAUWidget(codeInfo.element, codeInfo.info, model));
            break;
        case 'listener':
            this._insertCode(this._codeGenerator.getEventListener(codeInfo.element, codeInfo.info, model));
            break;
        case 'transition':
            this._insertCode(this._codeGenerator.getPageTransition(codeInfo.element, codeInfo.info, model));
            break;
        case 'popup':
            this._insertCode(this._codeGenerator.getPopupOpen(codeInfo.element, codeInfo.info, model));
        }
    }

    /**
     * Bind events
     * @private
     */
    _bindEvents() {
        eventEmitter.on(EVENTS.OpenAssistantWizard, this._onOpenAssistantCodeWizard.bind(this));
        eventEmitter.on(EVENTS.AssistantWizardAccepted, this._onWizardAccepted.bind(this));
    }

    /**
     * Insert code
     * @param {string} codeBlock
     * @private
     */
    _insertCode(codeBlock) {

        this._assistantElement.$el.focus();

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
