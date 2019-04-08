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
import {InstantTextEditorElement} from '../pane/select-layer/instant-text-editor-element';
import {ToolbarElement} from '../panel/toolbar-element';
import {PreviewElement} from '../panel/preview/preview-element';
import {PreviewToolbarElement} from '../panel/preview/preview-toolbar-element';
// import {InteractionViewElement} from '../panel/preview/interaction-view-element';
// import {InteractionViewToolbarElement} from '../panel/preview/interaction-view-toolbar-element';
import {InfoElement} from '../pane/select-layer/info-element';

const CompositeDisposable = editor.CompositeDisposable;
const DESIGN = ViewType.Design;
const vscode = window.vscode;

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

        if (!vscode){
        this._instantTextEditor = new InstantTextEditorElement();}

        this._previewElementToolbar = new PreviewToolbarElement();
        this._previewElementToolbarPanel = null;
		// this._interactionViewElementToolbar = new InteractionViewToolbarElement();
		// this._interactionViewElementToolbarPanel = null;
       // this._interactionView = new InteractionViewElement();

        // for syntax highlighting
        if(!vscode){
            setTimeout(() => {
                this._instantTextEditor.$el.appendTo('body');
            }, 0);
        }

        this._assistantManager = new AssistantManager();

        // @TODO try find better solution
        if (window.atom !== undefined) {
            this._toolbarContainerElementPanel = editor.workspace.addLeftPanel({
                item: this._toolbarContainerElement,
                visible: true,
                priority: 110
            });
        } else {
            panelManager.openPanel({type: 'left', item: this._toolbarContainerElement, priority: 110});
        }

        this._toolbarControls = this._toolbarContainerElement.Controls;

        if (window.atom !== undefined) {
            this._previewElementToolbarPanel = editor.workspace.addLeftPanel({
                item: this._previewElementToolbar,
                visible: false,
                priority: 110
            });
        }

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

        eventEmitter.on(EVENTS.ToggleAnimationPanel, this._onToggleAnimationPanel.bind(this));

        eventEmitter.on(EVENTS.OpenInstantTextEditor, this._onOpenInstantTextEditor.bind(this));

    }

    /**
     * Open instant text editor
     * @param options
     * @private
     */
    _onOpenInstantTextEditor(options) {
        this._instantTextEditor.setGrammar(editor.grammars.grammarsByScopeName['text.html.basic.tau']);
        this._instantTextEditor.open();
    }

    /**
     * Set last closet editor info
     * @private
     */
    _setLastClosetEditorInfo() {
        var activePane = null;
        this._lastClosetEditor = this._activeEditor;
        if (window.atom) {
            activePane = editor.workspace.getActivePaneItem();
            if (activePane) {
                this._lastClosetPath = activePane.getPath();
            }
        }
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
        var $workSpace = $(editor.selectors.workspace),
            preview = null;

        if (!$workSpace.length) {
            $workSpace = $(document.body);
        }

        if (!$workSpace.hasClass('closet-preview-mode')) {
			preview = new PreviewElement();
			$workSpace.children().first().before(preview);
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

            if (window.atom !== undefined) {
                this._toolbarContainerElementPanel.hide();
                this._previewElementToolbarPanel.show();
            } else {
                $workSpace.children().first().before(this._previewElementToolbar);
            }
        } else {
            $workSpace.removeClass('closet-preview-mode-active');
            window.setTimeout(() => {
                $workSpace.find('closet-preview-element').remove();
                $workSpace.removeClass('closet-preview-mode');
            }, 500);

            if (window.atom !== undefined) {
                this._toolbarContainerElementPanel.show();
                this._previewElementToolbarPanel.hide();
            } else {
                $workSpace.find('closet-preview-element-toolbar').remove();
            }
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

            panelManager.openPanel({type: 'right', item: this._propertyContainerElement});
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
