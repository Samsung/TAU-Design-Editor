/* eslint-disable no-console */
'use babel';

import $ from 'jquery';
import path from 'path';
import {appManager as AppManager} from '../app-manager';
import {StateManager} from '../system/state-manager';
import {DressElement} from '../utils/dress-element';
import {PageWizardElement} from './wizards/page-wizard-element';
import {EVENTS, eventEmitter} from '../events-emitter';
import {ViewType} from '../static';

const States = StateManager.States,
	TEMPLATE_PATH = 'panel/toolbar-element.html';

const DESIGN = ViewType.Design;
/**
 *
 */
class Toolbar extends DressElement {
	/**
     * Create callback
     */
	onCreated() {
		this._allButtonsDisabled = false;
		this.htmlAssistantOpen = false;
		this._initialize();
		this._create();
		this.events = {
			'click .preview-toggle': EVENTS.TogglePreviewView,
			'click .interaction-view-toggle': EVENTS.ToggleInteractionView,
			'click .editor-toggle': EVENTS.ToggleDesignAndCodeView,
			'click .assistant-view-toggle': EVENTS.ToggleAssistantView,
			'click .edit-mode-toggle': 'onClickEditMode',
			'click .closet-new-page': EVENTS.PageWizardOpen,
			'click .layout-detail-toggle': 'onClickLayoutDetail',
			'click .structure-element-toggle': EVENTS.ToggleStructureElement,
			'click .animation-panel-toggle': EVENTS.ToggleAnimationPanel,
			'click .instant-edit': EVENTS.ToggleInstantTextEditor,
			'click .insert-code': EVENTS.OpenAssistantWizard,
			'click .save-file': EVENTS.DocumentSave,
			'click .undo': EVENTS.Undo,
			'click .redo': EVENTS.Redo
		};

		eventEmitter.on(EVENTS.OpenInstantTextEditor, () => {
			this.htmlAssistantOpen = true;
		});

		eventEmitter.on(EVENTS.OpenInstantTextEditor, () => {
			this.htmlAssistantOpen = false;
		});

		eventEmitter.on(EVENTS.ElementSelected, (elementId) => {
			this.setEnable(this.Controls.INSTANT_EDIT);
			if (this._assistantViewState) {
				this.setEnable(this.Controls.INSERT_CODE);
			}
			this._selectedElement = elementId;
		});
		eventEmitter.on(EVENTS.ElementDeselected, () => {
			this.turnOffControl(this.Controls.INSTANT_EDIT);
			this.setDisable(this.Controls.INSTANT_EDIT);
			this.setDisable(this.Controls.INSERT_CODE);
			this._selectedElement = null;
		});
		eventEmitter.on(EVENTS.OpenAssistantView, () => {
			this._assistantViewState = true;
			if (this._assistantViewState && this._selectedElement) {
				this.setEnable(this.Controls.INSERT_CODE);
			}
		});

		eventEmitter.on(EVENTS.CloseAssistantView, () => {
			this._assistantViewState = false;
			if (this._assistantViewState && this._selectedElement) {
				this.setEnable(this.Controls.INSERT_CODE);
			} else {
				this.setDisable(this.Controls.INSERT_CODE);
			}
		});

		eventEmitter.on(EVENTS.DocumentDirty, () => {
			this.setEnable(this.Controls.SAVE);
		});

		eventEmitter.on(EVENTS.DocumentClean, () => {
			this.setDisable(this.Controls.SAVE);
		});

		eventEmitter.on(EVENTS.MultiappUpdate, (data) => {
			if (data.length) {
				this.setEnable(this.Controls.INTERACTION_VIEW);
			} else {
				this.setDisable(this.Controls.INTERACTION_VIEW);
			}
		});

		this.Controls = {
			PREVIEW: null,
			INTERACTION_VIEW: null,
			EDITOR: null,
			ASSISTANT: null,
			NEW_PAGE: null,
			EDIT_MODE: null,
			LAYOUT_DETAIL: null,
			STRUCTURE_ELEMENT: null,
			ANIMATION_PANEL: null,
			INSTANT_EDIT: null,
			INSERT_CODE: null,
			SAVE: null,
			UNDO: null,
			REDO: null
		};
	}

	/**
     * Create
     * @private
     */
	_create() {
		const self = this;
		$.ajax({
			url: path.join(self._appPath.src, TEMPLATE_PATH)
		}).done((template) => {
			self.$el.append(template);
			self._initControls();
			self._loaded = true;
		}).fail(() => {
			console.error(`could not load template! ${  TEMPLATE_PATH}`);
		});
	}

	/**
     * Init controls
     * @private
     */
	_initControls() {
		const controls = this.Controls;

		controls.PREVIEW = this.$el.find('button.preview-toggle');
		controls.INTERACTION_VIEW = this.$el.find('button.interaction-view-toggle');
		controls.EDITOR = this.$el.find('button.editor-toggle');
		controls.ASSISTANT = this.$el.find('button.assistant-view-toggle');
		controls.EDIT_MODE = this.$el.find('button.edit-mode-toggle');
		controls.NEW_PAGE = this.$el.find('button.closet-new-page');
		controls.LAYOUT_DETAIL = this.$el.find('button.layout-detail-toggle');
		controls.STRUCTURE_ELEMENT = this.$el.find('button.structure-element-toggle');
		controls.ANIMATION_PANEL = this.$el.find('button.animation-panel-toggle');
		controls.INSTANT_EDIT = this.$el.find('button.instant-edit');
		controls.INSERT_CODE = this.$el.find('button.insert-code');
		controls.SAVE = this.$el.find('button.save-file');
		controls.UNDO = this.$el.find('button.undo');
		controls.REDO = this.$el.find('button.redo');

		// In some cases (eg. when file other than .html is opened)
		// all buttons should be disabled.
		// Normally, such attributes are set in callback for event
		// EVENTS.ActiveEditorUpdated, but during opening editor,
		// this event fires before this function,
		if (this._allButtonsDisabled) {
			Object.keys(controls).forEach((key) => {
				this.setDisable(controls[key]);
			});
		}
		this.setToolbarForEditor(DESIGN);

		if (window.atom) {
			controls.EDITOR.removeClass('closet-toolbar-button-hidden');
		}
	}

	/**
     * Set toolbar state
     * @param {string} state
     * @param {string} value
     * @private
     */
	_setToolbarState(state, value) {
		StateManager.set(state, value);
	}

	/**
     * Init
     * @private
     */
	_initialize() {
		this._appPath = AppManager.getAppPath();
		this._pageWizard = new PageWizardElement();
	}

	/**
     * Click edit mode callback
     */
	onClickEditMode() {
		eventEmitter.emit(EVENTS.ToggleEditMode, this.Controls.EDIT_MODE);
	}

	/**
     * Turn off control
     * @param {boolean} control
     */
	turnOffControl(control) {
		if (control) {
			console.log('turning off', control);
			control.removeClass('selected');
			control.blur();
		}
	}

	/**
     * Turn on control
     * @param {boolean} control
     */
	turnOnControl(control) {
		if (control) {
			console.log('turning on', control);
			control.addClass('selected');
		}
	}

	/**
     * Set enable
     * @param {boolean} control
     */
	setEnable(control) {
		if (control) {
			console.log('toolbar enable', control);
			control.attr('disabled', false);
		}
	}

	/**
     * Set disable
     * @param {boolean} control
     */
	setDisable(control) {
		if (control) {
			console.log('toolbar disable', control);
			control.attr('disabled', true);
		}
	}

	/**
     * Click layout details callback
     */
	onClickLayoutDetail() {
		if (this.Controls.LAYOUT_DETAIL.hasClass('selected')) {
			this.turnOffControl(this.Controls.LAYOUT_DETAIL);
			this._setToolbarState(States.LayoutDetailToggle, false);
		} else {
			this.turnOnControl(this.Controls.LAYOUT_DETAIL);
			this._setToolbarState(States.LayoutDetailToggle, true);
		}
		eventEmitter.emit(EVENTS.ToggleLayoutDetail);
	}

	/**
     * Change the state of toolbar for given type of editor.
     * @param {ViewType.Design | ViewType.Text} state
     * @param {boolean} disable all button (eg. for .js files or when no file is opened)
     */
	setToolbarForEditor(state, disabled) {
		const controls = this.Controls;

		if (disabled) {
			this._allButtonsDisabled = true;
			this.turnOffControl(controls.EDITOR);
			this.turnOffControl(controls.ASSISTANT);

			Object.keys(controls).forEach((key) => {
				this.setDisable(controls[key]);
			});
		} else {
			this._allButtonsDisabled = false;
			if (state === DESIGN) {
				// if it is Design Editor, all buttons in toolbar element are enable
				// and the button for editor is turned on
				this.turnOnControl(controls.EDITOR);

				Object.keys(controls).forEach((key) => {
					if (['INSTANT_EDIT', 'INSERT_CODE', 'SAVE', 'INTERACTION_VIEW'].indexOf(key) === -1) {
						this.setEnable(controls[key]);
					}
				});
			} else {
				// if it is Text Editor, all buttons in toolbar element except of button for
				// editor are disable and all possible buttons are turned off
				this.turnOffControl(controls.EDITOR);
				this.turnOffControl(controls.ASSISTANT);

				Object.keys(controls).forEach((key) => {
					this.setDisable(controls[key]);
				});
				// in text mode, editor is enabled
				this.setEnable(controls['EDITOR']);
			}
		}

	}
}

const ToolbarElement = document.registerElement('closet-toolbar-container-element', Toolbar);

export {ToolbarElement, Toolbar};
