'use babel';

import fs from 'fs';
import AssistantView from 'assistant-view';

import pathUtils from '../../utils/path-utils';
import utils from '../../utils/utils';

const JS_TEMPLATE = 'document.getElementById(\'main\').addEventListener(\'pagebeforeshow\', function (event) {\n//::write down your own handler in here::\n\n});\n';
/**
 * @class AssistantManager
 * The highest abstraction layer for Assistant View feature
 * It is compatible with every AssistantViewManager implementation
 * Methods that have to be implemented in AssistantViewManager:
 * 	open(designEditor, pathToFile) - to open this view certainly in your editor
 *  close() - to close this in your platform
 *  isOpened() - Check if is opened
 */
class AssistantManager {
	constructor() {
		this._assistantView = new AssistantView();
	}

	/**
     * Create JS file if not exists 
     * @param {string} pathName relative path to js-file 
     * @param {string} content file content to add while file is created
     * @param {Function} callback 
     * @private
     */
    _createJSIfNotExists(pathName, callback) {
        // TODO: Fix fs.exists function 
        fs.readFile(pathName, 'utf8', (err, exists) => {
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
    _getReferenceableScriptPath(closetDesignEditor) {
        const fileName = pathUtils.getFileName(utils.checkGlobalContext("globalData").fileUrl),
            model = closetDesignEditor.getModel(),
            name = `${fileName}.js`;
        let script = this._getScriptElement(name, model);

        if (!script) {       
            console.log('_getReferenceableScriptPath', name, model);
            script = this._createScript(name);
            model.insert(model.getElementByQuery('.ui-page'), script.outerHTML);
        }

        return pathUtils.createProjectPath(name);
    }

	/**
     * Toggle assistant-view element
     * @param {ClosetEditor} closetEditor
     * @param {string} pathName
     * @param {Function} callback
     */
    toggle(closetEditor, pathName, callback) {
        var scriptPath = this._getReferenceableScriptPath(closetEditor);;
		const model = closetEditor.getModel();

        this._createJSIfNotExists(scriptPath, () => {
            if (!this._assistantView.isOpened()) {
                this._assistantView.open(closetEditor, scriptPath);
                // TODO: consider add codeGenerator as platform-specific feature
                // this._codeGenerator.setTargetEditor(closetEditor);
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
	_getScriptElement(fileName, model) {
		return model.getElementByQuery(`script[src="${fileName}"]`);
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
}

export default AssistantManager;