'use babel';

import fs from 'fs';
import AssistantView from 'assistant-view';

import pathUtils from '../../utils/path-utils';
import utils from '../../utils/utils';
import {eventEmitter, EVENTS} from '../../events-emitter';
import editor from '../../editor';
import {AssistantWizardElement} from '../../panel/assistant/assistant-wizard';
import {AssistantCodeGenerator} from './assistant-code-generator';

const JS_TEMPLATE = 'document.getElementById(\'main\').addEventListener(\'pagebeforeshow\', function (event) {\n//::write down your own handler in here::\n\n});\n';

/**
 * @class AssistantManager
 * The highest abstraction layer for Assistant View feature
 * It is compatible with every AssistantViewManager implementation
 * Methods that have to be implemented in AssistantViewManager:
 * 	open(designEditor, pathToFile) - to open this view certainly in your editor
 *  close() - to close this in your platform
 *  isOpened() - Check if is opened
 *  insertCode() - insert code to the editor
 */
class AssistantManager {
	constructor() {
		this._assistantView = new AssistantView();
		this._assistantWizard = new AssistantWizardElement();
		this._codeGenerator = new AssistantCodeGenerator();
		this._bindEvents();
		this._model = null;
		this._designEditor = null;
	}

    /**
     * Create JS file if not exists
     * @param {string} pathName relative path to js-file
     * @param {string} content file content to add while file is created
     * @param {Function} callback
     * @private
     */
	_createJSIfNotExists(pathName, callback) {
		fs.exists(pathName, (err, exists) => {
			if (exists) {
				callback();
			} else {
				fs.writeFile(pathName, JS_TEMPLATE, () => {
					callback();
				});
			}
		});
	}

    /**
     * Gets script path when script name is tha same as
     * currently opened HTML file. If this JS file doesn't exists
     * it creates new one.
     * @param {DesignEditor} closetDesignEditor - Design Editor instance
     * @returns {string} Path to js file
     * @private
     */
    _getReferenceableScriptPath() {
        const htmlFileUrl = utils.checkGlobalContext("globalData").fileUrl,
            jsFileName = `${pathUtils.getFileName(htmlFileUrl)}.js`;
        let script = this._getScriptElement(jsFileName);

        if (!script) {
            console.log('_getReferenceableScriptPath', jsFileName, this._model);
            script = this._createScript(jsFileName);
            this._model.insert(this._model.getElementByQuery('.ui-page'), script.outerHTML);
        }

        return htmlFileUrl.replace(/html$/, 'js');
    }

    /**
     * Toggle assistant-view element
     * @param {ClosetEditor} closetEditor
     * @param {string} pathName
     * @param {Function} callback
     */
    toggle(closetEditor, pathName, callback) {
        this._model = closetEditor.getModel();
        this._designEditor = closetEditor;
        const scriptPath = this._getReferenceableScriptPath();

        this._createJSIfNotExists(scriptPath, () => {
            if (!this._assistantView.isOpened()) {
                this._assistantView.open(closetEditor, scriptPath);
                callback(true);
            } else {
                this._assistantView.close();
                callback(false);
            }
        });
    }


    /**
     * Getting reference to ScriptElement from model or undefined if not exists
     * @param  {String} fileName name of JS file
     * @param  {Object} model design editor model
     */
    _getScriptElement(fileName) {
        return this._model.getElementByQuery(`script[src="${fileName}"]`);
    }

    /**
     * Creates script HTML element
     * @param {string} filePath Path to JS file
     * @returns {HTMLScriptElement} script element with src equal given path
     * @private
     */
    _createScript(filePath) {
        const script = document.createElement("script");
        script.setAttribute('src', filePath);
        return script;
    }

    _bindEvents() {
        eventEmitter.on(EVENTS.OpenAssistantWizard, this._onOpenAssistantCodeWizard.bind(this));
        eventEmitter.on(EVENTS.AssistantWizardAccepted, this._onWizardAccepted.bind(this));
    }

    /**
     * Accept in wizard
     * @param {Object} codeInfo
     * @private
     */
    _onWizardAccepted(codeInfo) {
        switch (codeInfo.type) {
        case 'instance':
            this._assistantView.insertCode(this._codeGenerator.getInstance(codeInfo.element, codeInfo.info, this._model));
            break;
        case 'tau-widget':
            this._assistantView.insertCode(this._codeGenerator.getTAUWidget(codeInfo.element, codeInfo.info, this._model));
            break;
        case 'listener':
            this._assistantView.insertCode(this._codeGenerator.getEventListener(codeInfo.element, codeInfo.info, this._model));
            break;
        case 'transition':
            this._assistantView.insertCode(this._codeGenerator.getPageTransition(codeInfo.element, codeInfo.info, this._model));
            break;
        case 'popup':
            this._assistantView.insertCode(this._codeGenerator.getPopupOpen(codeInfo.element, codeInfo.info, this._model));
        }
    }

    /**
     * Callback for event OpenAssistantCodeWizard is triggered
     * @param {Object} [options={}] Assistant wizard options
     * @param {HTMLElement} options.element Selected element
     * @param {number} options.row Row to insert code in editor
     */
    _onOpenAssistantCodeWizard(options = {}) {
        options.element = options.element || this._designEditor.getSelectedElement();

        if (options.element) {
            this._assistantWizard.open(options.element, this._codeGenerator.getInstanceListFromMap(options.element));
        }
    }
}

export default AssistantManager;
