'use babel';

import fs from 'fs';
import {html as beautify} from 'js-beautify';
import {Model} from './design-editor';
import editor from '../editor';
import utils from '../utils/utils';

const brackets = utils.checkGlobalContext('brackets');
const PreferencesManager = brackets ? brackets.getModule('preferences/PreferencesManager') : {};

const beautyOptions = {
    indent_size: 4,
    indent_char: ' ',
    preserve_newlines: false,
    unformatted: ['a', 'br', 'noscript', 'textarea', 'pre', 'code']
};

const DEVICE_PROFILES_STATE_KEY = "deviceProfiles";

let _instance = null,
    _activeModelId = null,
    designModelsMap;

if (editor.isAtom()) {
    // for Atom object represented TextEditor is used as a key
    designModelsMap = new WeakMap();
} else {
    // for Brackets string represented path for file is used as a key
    designModelsMap = new Map();
}

/**
 * Sends request for smart things virtual device creation
 *
 * @param {string} filePath Path of file in project with capabilities
 * @param {string} deviceName Name of device
 * @param {[string]} capabilities Array of capabilities names
 * @returns {Object|null} Object representing device data or null if smart things is disabled
 */
const createSmartThingsVirtualDevice = (filePath, deviceName, capabilities) =>
    fetch(`/iotivity/createSmartThingsVirtualDevice/${PreferencesManager.getViewState('projectId')}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath, deviceName, capabilities })
    })
        .then(response =>
            response.ok
                ? response.json()
                : response.json()
                    .then(jsonResponse => {
                        // Ignore if sthings flag is disabled
                        if (jsonResponse && jsonResponse.error && jsonResponse.error === 'sthings-disabled') {
                            return null;
                        }
                        const err = JSON.stringify((jsonResponse && jsonResponse.error)
                            ? jsonResponse.error
                            : jsonResponse);
                        throw new Error(`Error: ${response.status}: ${err}`);
                    }));

/**
 * Updates device profile associated with file
 *
 * @param {string} filePath Path of file in project
 * @param {Object} profile Device profile associated with this file
 */
const updateDeviceProfile = (filePath, profile) => {
    const deviceProfiles = PreferencesManager.getViewState(DEVICE_PROFILES_STATE_KEY);
    if (profile)
        deviceProfiles[filePath] = profile;
    else {
        delete deviceProfiles[filePath];
    }
    PreferencesManager.setViewState(DEVICE_PROFILES_STATE_KEY, deviceProfiles);
};

class ModelManager {

    /**
     * Return instance
     * @returns {*}
     */
    static getInstance() {
        if (_instance === null) {
            _instance = new ModelManager();
        }
        return _instance;
    }

    /**
     * Update model by activating a new one.
     * @param {string|TextEditor} modelId For Atom TextEditor is used as a key. For Brackets - only path of file.
     * @param {boolean} createModel If no model is found for given modelId, create a new one.
     * @returns {Model}
     */
    update(modelId, createModel) {
        this.activateModel(modelId);
        return this.getModel(modelId, createModel);
    }

    /**
     * Set private information about currently active model.
     * @param {string|TextEditor} modelId For Atom TextEditor is used as a key. For Brackets - only path of file.
     */
    activateModel(modelId) {
        _activeModelId = modelId;
    }

    /**
     * Return active model for text editor.
     * If there is no model for given text editor,
     * the new one will be created.
     * @param {string|TextEditor} modelId
     * @returns {Model}
     */
    getActiveModel(modelId) {
        return this.getModel(modelId, true);
    }

    /**
     * Return the currently active model
     * @returns {Model}
     */
    getIdForActiveModel() {
        return _activeModelId;
    }

    /**
     * Get model for given Text Editor.
     * @param {string|TextEditor} modelId
     * @param {boolean} createModel If no model is found for given modelId, create a new one.
     * @returns {*}
     */
    getModel(modelId, createModel) {
        let model = null;

        modelId = modelId || _activeModelId;

        if (modelId) {
            if (designModelsMap.has(modelId)) {
                // if there is already a model for this text editor in map
                model = designModelsMap.get(modelId);
            } else if (createModel) {
                // create a new design model if it can be created
                model = new Model();
                designModelsMap.set(modelId, model);
            }
        }

        return model;
    }

    /**
     * Returns model dirty status
     * @param {string|textEditor} modelId
     * @return {boolean}
     */
    isModelDirty(modelId) {
        const model = this.getModel(modelId);

        if (model) {
            return model.isDirty();
        }

        return false;
    }

    /**
     * Marks model as clean
     * @param {string|textEditor} modelId
     */
    markModelClean(modelId) {
        const model = this.getModel(modelId);
        if (model) {
            model.clean();
        }
    }

    /**
     * Get HTML content for given model with all changes.
     * @param {string|TextEditor} modelId
     * @param {boolean} saveMode Run beautify for file.
     * @returns {string}
     */
    getHTML(modelId, saveMode) {
        const model = this.getModel(modelId);
        let html = '';

        if (model && model.isInit()) {
            html = model.export(!saveMode, null);
            if (saveMode) {
                html = html.replace(
                    /<head><base [^>]+ data-project-path="true"><style>.using-alternative-selector\{opacity:0\.4;\}<\/style>/,
                    '<head>');
                html = beautify(html, beautyOptions);
            }
        }
        return html;
    }

	/**
     * Save model
     * @param {string} modelId
     * @param {boolean} quiet No confirm dialog
     * @param {function ()} callback Called after model saving is done
     */
	saveModel(modelId, quiet, callback) {
		const model = this.getModel(modelId);
		if (!model || !model.isInit()) {
			return callback();
		}

		if (!quiet && model.isDirty()) {
			if (!window.confirm('Document was changed, do you want to save?')) {
				return callback();
			}
		}
		const capabilities = model.getSmartThingsCapabilitiesIfChanged();
		let promise;
		if (!capabilities) {
			// No changes should be applied
			promise = Promise.resolve(null);
		} else if (!capabilities.length) {
			// Device id should be removed from document and profile should removed
			promise = Promise.resolve({ id: null, profile: null });
		} else {
			// Device should be created
			const title = model.getTitle();
			const deviceName = title
				? title
				: 'Custom device';
			promise = createSmartThingsVirtualDevice(modelId, deviceName, capabilities);
		}
		promise
			.then(deviceData => {
				let deviceHandleModification;
				if (deviceData) {
					updateDeviceProfile(modelId, deviceData.profile);
					deviceHandleModification = { remove: !deviceData.id, deviceHandle: deviceData.id };
				} else {
					deviceHandleModification = null;
				}
				let html = model.export(false, deviceHandleModification);
				html = html.replace(
					// eslint-disable-next-line max-len
					/<head><base [^>]+ data-project-path="true"><style>.using-alternative-selector\{opacity:0\.4;\}<\/style>/,
					'<head>');
				html = beautify(html, beautyOptions);
				fs.writeFile(modelId, html, () => {
					model.clean();
					callback();
				});
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.log(`Error while saving model ${  err && err.message ? err.message : ''}`);
				callback();
			});
	}
}

export {ModelManager};
