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
		this.selectedElementId = null;
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
	setSelectedContent(content) {
		return Promise.resolve(content)
			.then((item) => {
				this._model.updateText(this.selectedElementId, item);
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
		if (opened) {
			this._htmlAssistantEditor.close()
				.then(() => this._htmlAssistantEditor.getEditorContent())
				.then(content => this.setSelectedContent(content))
				.then(() => {
					this.element = this._model.getElementWithoutId(this.selectedElementId);
					this._htmlAssistantEditor.clean();
				})
				.catch(error => console.error(error));

		} else {
			this._htmlAssistantEditor.open(this.getSelectedContent(this.element));
		}
		callback(opened);
	}

	_bindEvents () {
		eventEmitter.on(EVENTS.ElementSelected, (elementId) => {
			console.log("element selected", elementId);
			this._model = appManager.getActiveDesignEditor().getModel();
			this.selectedElementId = elementId;
			this.element = this._model.getElementWithoutId(this.selectedElementId);
		});

		eventEmitter.on(EVENTS.ElementDeselected, () => {
			console.log("element deselected");
			this.selectedElementId = null;
		});
	}
}

export default HTMLAssistant;
