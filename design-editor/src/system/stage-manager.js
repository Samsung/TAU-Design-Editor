'use babel';

import $ from 'jquery';
import AssistantManager from './assistant/assistant-manager';
import {EVENTS, eventEmitter} from '../events-emitter';
import {panelManager} from './panel-manager';
import {ViewType} from './../static';
import editor from '../editor';
import {PropertyContainerElement} from '../panel/property/property-container-element';
import {AnimationContainerElement} from '../panel/animation/animation-container-element';
import {StructureElement} from '../panel/property/structure/structure-element';
import HTMLAssistant from '../pane/select-layer/html-assistant';
import {ToolbarElement} from '../panel/toolbar-element';
import {PreviewElement} from '../panel/preview/preview-element';
import {PreviewToolbarElement} from '../panel/preview/preview-toolbar-element';
// import {InteractionViewElement} from '../panel/preview/interaction-view-element';
// import {InteractionViewToolbarElement} from '../panel/preview/interaction-view-toolbar-element';
import {InfoElement} from '../pane/select-layer/info-element';
import utils from '../utils/utils';

const CompositeDisposable = editor.CompositeDisposable,
	DESIGN = ViewType.Design,
	isDemoVersion = utils.isDemoVersion();

class StageManager {
    /**
     * Init
     * @returns {StageManager}
     */
    initialize() {
        // initialize property container
        this._propertyContainerElement = new PropertyContainerElement();
        // initialize animation container
        this._animationContainerElement = new AnimationContainerElement();

        this._structureElement = new StructureElement();

        this._infoElement = new InfoElement();

        this._toolbarContainerElement = new ToolbarElement();
        this._toolbarContainerElementPanel = null;

        this._previewElementToolbar = new PreviewToolbarElement();
        this._previewElementToolbarPanel = null;
		// this._interactionViewElementToolbar = new InteractionViewToolbarElement();
		// this._interactionViewElementToolbarPanel = null;
       // this._interactionView = new InteractionViewElement();

        this._htmlAssistant = new HTMLAssistant();
        this._assistantManager = new AssistantManager();
        panelManager.openPanel({type: 'left', item: this._toolbarContainerElement, priority: 110});

        this._toolbarControls = this._toolbarContainerElement.Controls;

        this._subscriptions = null;
        this._lastClosetEditor = null;
        this._lastClosetPath = null;

        this._bindClosetEvent();
        this._registerCommands();
        return this;
    }

    /**
     * Bind closet events
      * @private
     */
    _bindClosetEvent() {
        eventEmitter.on(EVENTS.ToggleDesignAndCodeView, this._onToggleDesignAndCodeView.bind(this));
        eventEmitter.on(EVENTS.AssistantViewOpen, this._onToggleAssistantView.bind(this));
        eventEmitter.on(EVENTS.TogglePreviewView, this._onTogglePreview.bind(this));
		// eventEmitter.on(EVENTS.ToggleInteractionView, this._onToggleInteractionView.bind(this));
        eventEmitter.on(EVENTS.ToggleStructureElement, this._onToggleStructureElement.bind(this));

        // on editor change
        eventEmitter.on(EVENTS.ActiveEditorUpdated, this._onActiveEditorUpdated.bind(this));

        // on select element
        eventEmitter.on(EVENTS.ElementSelected, this._onElementSelected.bind(this));
        eventEmitter.on(EVENTS.ElementDeselected, this._onElementDeselected.bind(this));
        eventEmitter.on(EVENTS.ToggleAssistantView, this._onToggleAssistantView.bind(this));
        eventEmitter.on(EVENTS.ToggleInstantTextEditor, this._toggleHTMLAssistant.bind(this));
        eventEmitter.on(EVENTS.ToggleAnimationPanel, this._onToggleAnimationPanel.bind(this));


    }


    /**
     * Set last closet editor info
     * @private
     */
    _setLastClosetEditorInfo() {
        var activePane = null;
        this._lastClosetEditor = this._activeEditor;
    }

    /**
     * Toggle design and code view
     * @private
     */
    _onToggleDesignAndCodeView() {
        if (!panelManager.isDimmed()) {
            this._setLastClosetEditorInfo();
            eventEmitter.emit(EVENTS.ToggleEditor);
        } else if (this._lastClosetEditor) {
            eventEmitter.emit(EVENTS.ToggleEditor, {editor : this._lastClosetEditor, path : this._lastClosetPath});
        }
    }

    /**
     * Toggle structure element callback
     * @private
     */
    _onToggleStructureElement() {
        if (this._activeEditor && !panelManager.isDimmed()) {
            this._toggleStructureElement();
        }
    }

    /**
     * Toggle structure element
     * @private
     */
    _toggleStructureElement() {
        if (!this._structureElement.isOpened()) {
            this._structureElement.open();
            this._toolbarContainerElement.turnOnControl(this._toolbarControls.STRUCTURE_ELEMENT);
        } else {
            this._structureElement.close();
            this._toolbarContainerElement.turnOffControl(this._toolbarControls.STRUCTURE_ELEMENT);
        }
    }

    /**
     * Toggle assistant view callback
      * @private
     */
    _onToggleAssistantView() {
        if (this._activeEditor && !panelManager.isDimmed()) {
            this._setLastClosetEditorInfo();
            this._toggleAssistantView();
        } else if (this._lastClosetEditor) {
            this._toggleAssistantView();
        }
    }


    _toggleHTMLAssistant() {
        this._htmlAssistant.toggle((opened) => {
            console.log('HTML Assistant toggle', opened);
            if (!opened) {
                this._toolbarContainerElement.turnOnControl(this._toolbarControls.INSTANT_EDIT);
            } else {
                this._toolbarContainerElement.turnOffControl(this._toolbarControls.INSTANT_EDIT);
            }
        })

    }
    /**
     * Toggle assistant view
     * @private
     */
    _toggleAssistantView() {
        this._assistantManager.toggle(this._activeEditor, this._lastClosetPath, (opened) => {
            console.log('assistantViewManager.toggle', opened);
            if (opened) {
                this._toolbarContainerElement.turnOnControl(this._toolbarControls.ASSISTANT);
                this._propertyContainerElement.parentElement.hide();
                eventEmitter.emit(EVENTS.OpenAssistantView);
            } else {
                this._toolbarContainerElement.turnOffControl(this._toolbarControls.ASSISTANT);
                this._propertyContainerElement.parentElement.show();
                eventEmitter.emit(EVENTS.CloseAssistantView);
            }
        });
    }

    /**
     * Toggle animation panel callback
     * @private
     */
    _onToggleAnimationPanel() {
        if (this._activeEditor && !panelManager.isDimmed()) {
            this._setLastClosetEditorInfo();
            this._toggleAnimationPanel();
        } else if (this._lastClosetEditor) {
            this._toggleAnimationPanel();
        }
    }

    /**
     * Toggle animation panel
     * @private
     */
    _toggleAnimationPanel() {
        var self = this,
            animContainer = self._animationContainerElement,
            animationPanel = self._toolbarControls.ANIMATION_PANEL;

        animContainer.toggle(self._lastClosetEditor, self._lastClosetPath);
        if (animContainer.isOpened()) {
            self._toolbarContainerElement.turnOnControl(animationPanel);
        } else {
            self._toolbarContainerElement.turnOffControl(animationPanel);
        }
    }


    /**
     * Toggle preview callback
     * @private
     */
    _onTogglePreview() {
        if (this._activeEditor && !panelManager.isDimmed()) {
            this._togglePreview(this._activeEditor);
        } else if (this._lastClosetEditor) {
            this._togglePreview(this._activeEditor);
        }
    }

	/**
	 * Toggle preview callback
	 * @private
	 */
	// _onToggleInteractionView() {
	// 	if (this._activeEditor && !panelManager.isDimmed()) {
	// 		this._toggleInteractionView(this._activeEditor);
	// 	} else if (this._lastClosetEditor) {
	// 		this._toggleInteractionView(this._activeEditor);
	// 	}
	// }

	/**
     * Toggle preview
     * @param toggleEditor
     * @private
     */
	_togglePreview(toggleEditor) {
		let $workSpace = $(editor.selectors.workspace),
			preview = null;

		if (!$workSpace.length) {
			$workSpace = $(document.body);
		}

		if (!$workSpace.hasClass('closet-preview-mode') || isDemoVersion) {
			preview = new PreviewElement();
			$workSpace.children().last().before(preview);
			preview.show(
				{
					editor: toggleEditor || null,
					callback() {
						$workSpace.addClass('closet-preview-mode');
						window.setTimeout(() => {
							$workSpace.addClass('closet-preview-mode-active');
						}, 500);
					}
				}
			);

			$workSpace.children().last().before(this._previewElementToolbar);

			if (isDemoVersion) {
				const activatePreviewModeButton = document
					.querySelector('closet-preview-element-toolbar .preview-toggle');
				if (activatePreviewModeButton) {
					activatePreviewModeButton.style.display = 'none';
				}
			} else {
				// Hide DE icon.
				window.top.$('#tau-preview-icon').css('visibility', 'hidden');
			}

		} else {
			$workSpace.removeClass('closet-preview-mode-active');
			window.setTimeout(() => {
				$workSpace.find('closet-preview-element').remove();
				$workSpace.removeClass('closet-preview-mode');
			}, 500);

			$workSpace.find('closet-preview-element-toolbar').remove();

			// Restore DE icon since it may have been hidden while going to live preview.
			window.top.$('#tau-preview-icon').css('visibility', 'visible');
		}
	}


	/**
	 * Toggle preview
	 * @param toggleEditor
	 * @private
	 */
	// _toggleInteractionView(toggleEditor) {
	// 	console.log('toggleEditor', toggleEditor);

	// 	var $workSpace = $(editor.selectors.workspace),
	// 		interactionView = null;

	// 	if (!$workSpace.length) {
	// 		$workSpace = $(document.body);
	// 	}

	// 	if (!$workSpace.hasClass('closet-preview-mode')) {
	// 		interactionView = this._interactionView;
	// 		$workSpace.children().first().before(interactionView);
	// 		interactionView.show(
	// 			{
	// 				editor: toggleEditor,
	// 				callback() {
	// 					$workSpace.addClass('closet-preview-mode');
	// 					window.setTimeout(() => {
	// 						$workSpace.addClass('closet-preview-mode-active');
	// 					}, 500);
	// 				}
	// 			}
	// 		);

	// 		if (window.atom !== undefined) {
	// 			this._toolbarContainerElementPanel.hide();
	// 			this._previewElementToolbarPanel.show();
	// 		} else {
	// 			$workSpace.children().first().before(this._interactionViewElementToolbar);
	// 		}
	// 	} else {
	// 		$workSpace.removeClass('closet-preview-mode-active');
	// 		window.setTimeout(() => {
	// 			$workSpace.find('closet-interaction-view-element').remove();
	// 			$workSpace.removeClass('closet-preview-mode');
	// 		}, 500);

	// 		if (window.atom !== undefined) {
	// 			this._toolbarContainerElementPanel.show();
	// 			this._previewElementToolbarPanel.hide();
	// 		} else {
	// 			$workSpace.find('closet-interaction-view-element-toolbar').remove();
	// 		}
	// 	}
	// }


	/**
     * Selected element callback
     * @param selectedId
     * @private
     */
    _onElementSelected(selectedId) {
        this._propertyContainerElement.show(selectedId);
    }

    /**
     * deselected element callback
     * @private
     */
    _onElementDeselected() {
        this._propertyContainerElement.show();
    }

    /**
     * Callback for EVENTS.ActiveEditorUpdated
     * It is called when we switched between editors.
     * @param state
     * @param editorElement
     * @param disabled
     * @private
     */
    _onActiveEditorUpdated(state, editorElement, disabled) {
        this._activeEditor = editorElement;
        if (editorElement) {
            this._setLastClosetEditorInfo();
        }

        // is state is design
        if (state === DESIGN) {
            // init property container
            this._propertyContainerElement.initialize();
            // init animation container
            // this._animationContainerElement.initialize(editor);

			if (!isDemoVersion) {
				panelManager.openPanel({type: 'right', item: this._propertyContainerElement});
			}
            panelManager.openPanel({type: 'bottom', item: this._animationContainerElement});

            panelManager.openPanel({type: 'top', item: this._infoElement});

            // trigger event for request selected element
            eventEmitter.emit(EVENTS.RequestCurrentSelection);
        } else {
            panelManager.closePanel(this._propertyContainerElement);
            panelManager.closePanel(this._animationContainerElement);

            if (this._assistantManager) {
                this._assistantManager.close();
            }
        }

        // change toolbar button state
        this._toolbarContainerElement.setToolbarForEditor(state, disabled);
    }

    /**
     * Register commands
     * @private
     */
    _registerCommands() {
        this._subscriptions = new CompositeDisposable();

        if (this._subscriptions.add) {
            this._subscriptions.add(editor.commands.add(editor.selectors.workspace, {
                'closet-stage:toggle-editor': this._onToggleDesignAndCodeView.bind(this),
                'closet-stage:toggle-assistant-view': this._onToggleAssistantView.bind(this),
                'closet-stage:toggle-preview': this._onTogglePreview.bind(this)
				// 'closet-stage:toggle-interaction-view': this._onToggleInteractionView.bind(this)
            }));
        }
    }
}

const stageManager = new StageManager();

export {stageManager, StageManager};
