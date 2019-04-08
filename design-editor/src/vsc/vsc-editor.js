'use babel';
/**
 * This is a copy of similar file brackets-editor.js
 * TODO: Rewrite this file to enable works Design Editor in VSCode.
 */
import brackets from 'brackets';
import fs from 'fs';
import $ from 'jquery';
import {packageManager} from 'content-manager';
import tauComponents from 'tau-component-packages';
import formComponents from 'closet-default-component-packages';
import closetComponents from 'closet-component-packages';
import {VSCPreferenceManager} from './vsc-preference-manager';
import {PreferenceManager} from '../preference-manager';
import bracketsDefaultConfig from '../package-config';
import {BracketsStatusBarElement} from './brackets-status-bar';
import {ConfigurationDesignAreaElement} from '../panel/configuration-design-area-element';
import {stageManager} from '../system/stage-manager';
import {appManager} from '../app-manager';
import {DesignEditorElement} from '../pane/design-editor-element';
import {panelManager} from '../system/panel-manager';
import {EVENTS, eventEmitter} from '../events-emitter';
import {ModelManager} from '../pane/model-manager';
import {ViewType} from '../static';

var element,
    statusBarElement,
    configurationDesignAreaElement;


const TEXT = ViewType.Text,
    DESIGN = ViewType.Design;

const beautyOptions = {
    indent_size: 4,
    indent_char: ' ',
    preserve_newlines: false,
    unformatted: ['a', 'br', 'noscript', 'textarea', 'pre', 'code']
};

let _instance = null;
let modelManager = null;

/**
 * @class VSCEditor
 * Responsible for launch Design-Editor in Web-view.
 */
class VSCEditor {
    /**
     * Constructor
     */
    constructor() {
        // Adding brackets mockup on the top of Design Editor
        window.brackets = brackets;
        // This will register BracketsPreferenceManager inside PreferenceManager
        VSCPreferenceManager.initialize();

        element = new DesignEditorElement();
        statusBarElement = new BracketsStatusBarElement();
        configurationDesignAreaElement = new ConfigurationDesignAreaElement();

        modelManager = ModelManager.getInstance();
				//appManager = AppManager.getInstance();

        eventEmitter.on(EVENTS.InsertComponent, (event, componentPackageInfo, element) => {
            let activeClosetEditor = appManager.getActiveDesignEditor();
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
            _instance = new VSCEditor();
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
     * @returns {VSCEditor}
     */
    initialize() {
        const self = this;

        // self._defineDefaultPreferences();

        closetComponents.consumeCloset(packageManager, () => {
            formComponents.consumeCloset(packageManager, () => {
                tauComponents.consumeCloset(packageManager, () => {
                    panelManager.initialize(document.body);
                    stageManager.initialize()._onActiveEditorUpdated(1, element);
                    document.querySelector('.closet-container' +
                        ' .closet-panel-container-middle  .closet-panel-container-center').appendChild(element);
                    element.appendChild(statusBarElement);
                    statusBarElement.addItem(configurationDesignAreaElement);

                    document.querySelector('.closet-container').classList.add('full');

                    fs.readFile(window.globalData.fileUrl, 'utf8', (err, data) => {
                        if (err) throw err;
                        $('.closet-container').addClass('full design-view-active');
                        self.update(data, window.globalData);
                        element.show();
                        // inform about activate design editor
                        eventEmitter.emit(EVENTS.ActiveEditorUpdated, 1, element);
                    });
                    window.saveToFile = (callback, quiet) => {
                        var modelID = window.globalData.fileUrl;
                        var html = modelManager.getHTML(modelID, true);
                        var save = function () {
                            fs.writeFile(modelID, html, () => {
                                modelManager.markModelClean(modelID);
                                callback();
                            });
                        };

                        // empty string means that no change was done
                        if (html) {
                            //@TODO this needs rework!
                            if (!quiet && modelManager.isModelDirty(modelID)) {
                                if (window.confirm('Document was changed, do you want to save?')) {
                                    save();
                                } else {
                                    callback();
                                }
                            } else {
                                save();
                            }
                        } else {
                            callback();
                        }
                    };

                    window.writeFile = (path, fileData, additionalFileOptions, callback) => {
                        fs.writeFile(path, fileData, () => {
                            callback();
                        }, additionalFileOptions);
                    };

                    window.existsDir = (path, callback) => {
                        fs.existsDir(path, callback);
                    };

                    window.makeDir = (path, callback) => {
                        fs.makeDir(path, callback);
                    };

                    window.loadFromFile = () => {
                        fs.readFile(window.globalData.fileUrl, 'utf8', (err, data) => {
                            if (err) {
                                throw err;
                            }

                            self.update(data, window.globalData);
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

        console.log('update with state', state);
        element.update(model, data, state.basePath, state.fileUrl, state.networks);
    }
}

const VSCEditorInstance = VSCEditor.getInstance().initialize();

export {VSCEditor, VSCEditorInstance};
