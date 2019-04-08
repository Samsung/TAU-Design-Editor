'use babel';

import path from 'path';
import {EVENTS, eventEmitter} from './events-emitter';
import editor from './editor';

let appManager = null;

/**
 *
 */
class AppManager {
    /**
     * Constructor
      */
    constructor() {
        this._designEditor = null;
        this._registerEvents();
    }

    /**
     * Register events
      * @private
     */
    _registerEvents() {
        // When we open new tab (pane) in editor.
        eventEmitter.on(EVENTS.ActiveEditorUpdated, this._onUpdateActiveEditor.bind(this));
    }

    /**
     * Update active editor callback
      * @param type
     * @param editorElement
     * @private
     */
    _onUpdateActiveEditor(type, editorElement) {
        if (type === 1 && editorElement) {
            this._designEditor = editorElement;
        } else {
            this._designEditor = null;
        }
    }

    /**
     * Get Active Design Editor
      * @returns {null|*}
     */
    getActiveDesignEditor() {
        return this._designEditor;
    }

    /**
     * Get app
     * @returns {{root: *, src: string}}
     */
    getAppPath() {
        let root = '',
            src = '../design-editor/closet';
        if (editor.isAtom()) {
            root = editor.resolvePackagePath('Closet');
            src = path.join(root, 'src');
        }
        return {root, src};
    }

		static getInstance() {
			if (appManager == null) {
				appManager = new AppManager();
			}

			return appManager;
		}
}

AppManager.getInstance();
export {AppManager, appManager};
