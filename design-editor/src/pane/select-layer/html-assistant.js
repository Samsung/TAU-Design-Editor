/* eslint-disable no-console */
'use babel';
import {HTMLAssistantEditorElement} from 'html-assistant-editor';
import {EVENTS, eventEmitter} from '../../events-emitter';
import {appManager} from '../../app-manager';

/**
 * Responsible for running of HTML editor of selected component
 * Need to implement platform-specific class
 */
class HTMLAssistant {
	constructor() {
		this._model = null;
		this._htmlAssistantEditor = new HTMLAssistantEditorElement();
		this.lastSelectedElementId = null;
		this._isOpened = false;
		this.element = null;
		this._bindEvents();
	}

	/**
	 * Get content of selected element from model
	 * @param {HTMLElement} element selected element
	 * @returns {string} outerHTML of this element
	 */
	getSelectedContent(element) {
		return element.innerHTML;
	}

	/**
	 * Setting new content of selected content to model
	 * @param {string | Promise} content HTML content of edited element
	 * @returns {Promise} resolves after model is updated with new text
	 */
	setSelectedContent(content, elemID) {
		return Promise.resolve(content)
			.then((item) => {
				this._model.updateText(elemID, item);
			})
			.catch((err) => {
				throw err;
			});
	}

	/**
	 * Toggles HTML Assistant Panel
	 * @param {function} callback
	 */
	toggle(callback) {
		const opened = this._htmlAssistantEditor.isOpened();
		// keep elemID separately because selectedElementId may be changed
		// before finishing resolving all promises due to other elem selection
		const elemID = this.lastSelectedElementId;
		this.element = this._model.getElementWithoutId(this.lastSelectedElementId);
		if (opened) {
			this._htmlAssistantEditor.close()
				.then(() => this._htmlAssistantEditor.getEditorContent())
				.then(content => this.setSelectedContent(content, elemID))
				.then(() => {
					this._htmlAssistantEditor.clean();
					eventEmitter.emit(EVENTS.CloseInstantTextEditor);
				})
				.catch(error => console.error(error))
				.then(() => {
					callback(opened);
				});

		} else {
			this._htmlAssistantEditor.open(this.getSelectedContent(this.element));
			eventEmitter.emit(EVENTS.OpenInstantTextEditor);
			callback(opened);
		}
	}

	_bindEvents () {
		eventEmitter.on(EVENTS.ElementSelected, (elementId) => {
			console.log('element selected', elementId);
			this._model = appManager.getActiveDesignEditor().getModel();
			this.lastSelectedElementId = elementId;
			this.element = this._model.getElementWithoutId(this.lastSelectedElementId);
		});

		eventEmitter.on(EVENTS.ElementDeselected, () => {
			if (this._htmlAssistantEditor.isOpened()) {
				console.log('element deselected');
				this.toggle(()=>{});
			}
		});
	}
}

export default HTMLAssistant;
