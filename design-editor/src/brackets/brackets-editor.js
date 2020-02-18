'use babel';

import fs from 'fs';
import $ from 'jquery';
import {packageManager} from 'content-manager';
import tauComponents from 'tau-component-packages';
import formComponents from 'closet-default-component-packages';
import closetComponents from 'closet-component-packages';
import {BracketsPreferenceManager} from './brackets-preference-manager';
import {PreferenceManager} from '../preference-manager';
import bracketsDefaultConfig from '../package-config';
import {BracketsStatusBar} from './brackets-status-bar';
import {ConfigurationDesignArea} from '../panel/configuration-design-area-element';
import {stageManager} from '../system/stage-manager';
import {appManager} from '../app-manager';
import utils from '../utils/utils';
import {DesignEditor} from '../pane/design-editor-element';
import {panelManager} from '../system/panel-manager';
import {EVENTS, eventEmitter} from '../events-emitter';
import {ModelManager} from '../pane/model-manager';

var element,
	statusBarElement,
	configurationDesignAreaElement;

const beautyOptions = {
	indent_size: 4,
	indent_char: ' ',
	preserve_newlines: false,
	unformatted: ['a', 'br', 'noscript', 'textarea', 'pre', 'code']
	},
	isDemoVersion = utils.isDemoVersion();

let _instance = null;
let modelManager = null;

class BracketsEditor {
	/**
	 * Constructor
	 */
	constructor() {
		// This will register BracketsPreferenceManager inside PreferenceManager
		BracketsPreferenceManager.initialize();

		element = new DesignEditor();
		statusBarElement = new BracketsStatusBar();
		configurationDesignAreaElement = new ConfigurationDesignArea();

		modelManager = ModelManager.getInstance();

		eventEmitter.on(EVENTS.InsertComponent, (event, componentPackageInfo, element) => {
			const activeClosetEditor = appManager.getActiveDesignEditor();
			if (activeClosetEditor) {
				activeClosetEditor.insertComponent(event, componentPackageInfo, element);
			}
		});
	}

	/**
	 * Return instance
	 * @returns {*}
	 */
	static getInstance() {
		if (_instance === null) {
			_instance = new BracketsEditor();
		}

		return _instance;
	}

	/**
	 * Define default preferences
	 * @private
	 */
	_defineDefaultPreferences() {
		Object.keys(bracketsDefaultConfig).forEach((key) => {
			const dotIndex = key.indexOf('.');
			// dotIndex + 1 -> even in case we will not have any dot inside of the config
			// this will return key starting from 0 index
			PreferenceManager.setDefault(
				key.substring(0, Math.max(dotIndex, 0)),
				key.substring(dotIndex + 1),
				bracketsDefaultConfig[key].default,
				{
					title: bracketsDefaultConfig[key].title,
					description: bracketsDefaultConfig[key].description
				}
			);
		});
	}

	/**
	 * Init
	 * @returns {BracketsEditor}
	 */
	initialize() {
		const self = this;

		self._defineDefaultPreferences();

		closetComponents.consumeCloset(packageManager, () => {
			formComponents.consumeCloset(packageManager, () => {
				tauComponents.consumeCloset(packageManager, () => {
					panelManager.initialize(document.body);
					stageManager.initialize()._onActiveEditorUpdated(1, element);
					element.appendChild(statusBarElement);
					document.querySelector('.closet-container' +
						' .closet-panel-container-middle  .closet-panel-container-center').appendChild(element);
					statusBarElement.addItem(configurationDesignAreaElement);

					fs.readFile(window.top.globalData.fileUrl, 'utf8', (err, data) => {
						if (err) throw err;
						if (isDemoVersion) {
							document.body.classList.add('closet-preview-mode');
							document.body.classList.add('closet-preview-mode-active');
						}
						self.update(data, window.top.globalData);
						document.querySelector('.closet-container').classList.add('full', 'design-view-active');
						element.show();
						// inform about activate design editor
						eventEmitter.emit(EVENTS.ActiveEditorUpdated, 1, element);
					});
					window.top.saveToFile = (callback, quiet) => {
						modelManager.saveModel(window.top.globalData.fileUrl, quiet, callback);
					};

					window.top.writeFile = (path, fileData, additionalFileOptions, callback) => {
						fs.writeFile(path, fileData, () => {
							callback();
						}, additionalFileOptions);
					};

					window.top.existsDir = (path, callback) => {
						fs.existsDir(path, callback);
					};

					window.top.makeDir = (path, callback) => {
						fs.makeDir(path, callback);
					};

					window.top.loadFromFile = () => {
						fs.readFile(window.top.globalData.fileUrl, 'utf8', (err, data) => {
							if (err) {
								throw err;
							}

							self.update(data, window.top.globalData);
							element.show();
							// inform about activate design editor
							eventEmitter.emit(EVENTS.ActiveEditorUpdated, 1, element);
						});
					};
				});
			});
		});
		return self;
	}

	/**
	 * Update model for design editor after changing file.
	 * @param {string} data File content
	 * @param {string} basePath
	 * @param {string} uri
	 */
	update(data, state) {
		const model = modelManager.update(state.fileUrl, true);

		// eslint-disable-next-line no-console
		console.log('update with state', state);
		element.update(model, data, state.basePath, state);
	}
}

const bracketsEditor = BracketsEditor.getInstance().initialize();

export {BracketsEditor, bracketsEditor};
