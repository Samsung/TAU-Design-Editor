'use babel';
import {html as beautify} from 'js-beautify';
import {HTMLAssistantEditorElement} from 'html-assistant-editor';
import {EVENTS, eventEmitter} from '../../events-emitter';
import {appManager} from '../../app-manager';
import utils from '../../utils/utils'

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
	 */
	setSelectedContent(content) {
		if (typeof content == 'string') {
				this._model.updateText(this.selectedElementId, content);
			} else {
				content
					.then((item) => {
						this._model.updateText(this.selectedElementId, item);
						})
					.catch((err) => {
						throw err;
					})
			}
	}

	/**
	 * Toggles HTML Assistant Panel
	 * @param {function} callback
	 */
	toggle(callback) {
		if(this._htmlAssistantEditor.isOpened()) {
			this.setSelectedContent(this._htmlAssistantEditor.getEditorContent());
			this._htmlAssistantEditor.close();
		} else {
			this._htmlAssistantEditor.open(this.getSelectedContent(this.element));
		}
		callback(this._htmlAssistantEditor.isOpened())
	}

	_bindEvents () {
		eventEmitter.on(EVENTS.ElementSelected, (elementId) => {
			console.log("element selected", elementId);
			this._model = appManager.getActiveDesignEditor().getModel();
            this.selectedElementId = elementId;
			this.element = this._model.getElementWithoutId(elementId);
        });

		eventEmitter.on(EVENTS.ElementDeselected, () => {
			console.log("element deselected");			
				this.selectedElementId = null;
        });
	}
}

export default HTMLAssistant;
