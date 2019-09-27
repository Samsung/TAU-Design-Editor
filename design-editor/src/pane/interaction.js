'use babel';

import $ from 'jquery';
import {packageManager, Package} from 'content-manager';
import {PreferenceManager} from '../preference-manager';
import {StateManager} from '../system/state-manager';
import {appManager as AppManager} from '../app-manager';
import {SnapGuideManager} from './snap-guide-manager';
import {eventEmitter, EVENTS} from '../events-emitter';
import {ElementDetector} from './element-detector';
import editor from '../editor';

let snapGuideManager = null,
    snapToContainerEnabled = false,
    _instance = null;

class Interaction {

    /**
     * Constructor
     */
    constructor() {
        snapGuideManager = SnapGuideManager.getInstance();

        this._onEditMode = true;
        this._previousStyles = {};
        this._bindEvents();
        this._registerCommands();
    }

	/**
	 * Return instance
	 * @returns {*}
	 */
	static getInstance() {
		return _instance ? _instance : new Interaction();
	}

    /**
     * Set interaction
     * @param {jQuery} $selectedLayerElement
     * @param {HTMLElement} contentElement
     */
    setInteraction($selectedLayerElement, contentElement) {
        var toolbarElement = $('closet-toolbar-container-element')[0];
        this._$selectedLayerElement = $selectedLayerElement;
        this._$contentElement = $(contentElement);
        this._editModeToggle = toolbarElement && toolbarElement.Controls.EDIT_MODE;
        this.setDraggable();
        this.setResizable();
    }

    /**
     * Bind events
     * @private
     */
    _bindEvents() {
        eventEmitter.on(EVENTS.ToggleEditMode, this._onToggleEditMode.bind(this));
        eventEmitter.on(EVENTS.TextToolShowed, this._onTextToolShowed.bind(this));
        eventEmitter.on(EVENTS.ElementDeselected, this._onElementDeselected.bind(this));

        // Triggered when elements are dragged over editor
        eventEmitter.on(EVENTS.ComponentDragged, this.onComponentDragged.bind(this));
    }

    /**
     * Register commands
     * @private
     */
    _registerCommands() {
        editor.commands.add(editor.selectors.workspace, {
            'closet-stage:toggle-drag-edit-mode': () => {
                this._onToggleEditMode($('.closet-toolbar-button.edit-mode-toggle'));
            }
        });
    }

    /**
     * Toggle edit mode
     * @param control
     * @private
     */
    _onToggleEditMode(control) {
        if (this._onEditMode) {
            this._onEditMode = false;
            $(control).removeClass('selected');
            if (this._$selectedLayerElement && this._$selectedLayerElement.length) {
                this.destroyDraggable();
                this.destroyResizable();
                this.setDraggable();
                this.setResizable();
            }
        } else {
            this._onEditMode = true;
            $(control).addClass('selected');
            if (this._$selectedLayerElement && this._$selectedLayerElement.length) {
                if (this._$selectedLayerElement.parent()[0]) {
                    this._$selectedLayerElement.parent()[0].syncSelector(this._$contentElement);
                }
                this.setDraggable();
                this.setResizable();
            }
        }
        this._editModeToggle = $(control);
    }

    /**
     * On text tool showed
     * @private
     */
    _onTextToolShowed() {
        if (this._editModeToggle) {
            this._editModeToggle.attr('disabled', true);
        }
        if (this._$selectedLayerElement) {
            this.destroyDraggable();
            this.destroyResizable();
        }
    }

    /**
     * On elements deselected
     * @private
     */
    _onElementDeselected() {
        if (this._editModeToggle) {
            this._editModeToggle.attr('disabled', false);
        }
    }

    /**
     * Set draggable
     */
    setDraggable() {
        var elementDetected = ElementDetector.getInstance().detect(this._$contentElement),
            componentPackage = elementDetected && elementDetected.package,
            options = elementDetected && componentPackage.options,
            $selectedLayer = this._$selectedLayerElement.parent(),
            icon = null,
            profile = StateManager.get('screen').profile,
            shape = StateManager.get('screen').shape;

        if (options && options.resources && options.resources.icon) {
            icon = options.resources.icon;
        }

        if (elementDetected) {
            // @TODO BUG in some cases $element[0].options is undefined
            if (!options || !$selectedLayer.length) {
                return;
            }

            this._model = AppManager.getActiveDesignEditor().getModel();

            if (options.draggable === true) {
                if (this._onEditMode) {
                    this._$selectedLayerElement.draggable({
                        start: this._onDragStart.bind(this),
                        drag: this._onDrag.bind(this),
                        stop: this._onDragStop.bind(this),
                        scroll: false,
                        helper: null
                        // containment: [containmentBox.x1, containmentBox.y1, containmentBox.x2, containmentBox.y2]
                    });
                } else {
                    if (typeof icon !== 'string') {
                        icon = icon[profile];
                        if (typeof icon !== 'string') {
                            icon = icon[shape];
                        }
                    }
                    icon = options.path.replace(/\\/g, '/') + '/' + icon;
                    this._$selectedLayerElement.draggable({
                        start: this._onRepositionStart.bind(this),
                        drag: this._onReposition.bind(this, componentPackage),
                        stop: this._onRepositionStop.bind(this, componentPackage),
                        scroll: false,
                        helper: function () {
                            return '<div style="background-image:url(' + icon + ');" class="closet-component-drag-helper"></div>';
                        }
                    });
                }
                this._$selectedLayerElement.css('pointerEvents', 'fill');
            } else {
                this._$selectedLayerElement.css('pointerEvents', 'fill');
                this._$selectedLayerElement.draggable({
                    cursorAt: {
                        top: -20,
                        left: -10
                    },
                    cursor: 'hand',
                    start: function (event) {
                        eventEmitter.emit(EVENTS.ElementDragStart, event);
                    },
                    drag: function (event) {
                        eventEmitter.emit(EVENTS.ElementDrag, event);
                    },
                    stop: function (event) {
                        eventEmitter.emit(EVENTS.ElementDragStop, event);
                    },
                    scroll: false,
                    helper: function () {
                        var $helperEl = $('<div class="closet-component-drag-helper closet-drag-helper-small"></div>');
                        $helperEl.appendTo(document.body);
                        return $helperEl;
                    }
                });
            }
        }
    }

    /**
     * Start reposition callback
     * @param {Event} event
     * @param {Object} ui
     * @private
     */
    _onRepositionStart(event, ui) {
        var $selectLayer = this._$selectedLayerElement.parent();

        // @TODO this method does not exist and select layer implementation
        // reveals no info on its origin, plese find out
        // $selectLayer[0].hideElementInfo();
        ui.helper.css('pointerEvents', 'fill');

        this._$contentElement.hide();
        this._$selectedLayerElement.hide();

    }

    /**
     * Reposition callback
     * @param {Object} componentPackage
     * @param {Event} event
     * @private
     */
    _onReposition(componentPackage, event) {
        eventEmitter.emit(EVENTS.ElementDrag, event);
        eventEmitter.emit(EVENTS.ComponentDragged, event, componentPackage);
    }

    /**
     * Reposition finish callback
     * @param {Object} componentPackage
     * @param {Event} event
     * @private
     */
    _onRepositionStop(componentPackage, event) {
        eventEmitter.emit(EVENTS.InsertComponent, event, componentPackage, this._$contentElement);
        this._$contentElement.show();
        this._$selectedLayerElement.show();

        eventEmitter.emit(EVENTS.ElementDragStop);
    }

    /**
     * Drag start callback
     * @param {Event} event
     * @param {Object} ui
     * @private
     */
    _onDragStart(event, ui) {
        var self = this,
            $contentElement = self._$contentElement,
            $contentElementParent = $contentElement.parent(),
            position = $contentElement.css('position'),
            parentPosition = $contentElementParent.css('position'),
            $selectedLayer = self._$selectedLayerElement,
            $selectLayerParent = $selectedLayer.parent(),
            scrollPosition = AppManager.getActiveDesignEditor().getScrollerScroll(),
            offsetFromParent;

        snapToContainerEnabled = PreferenceManager.get('snap', 'active') && PreferenceManager.get('snap', 'container');

        self._containerDimensions = {
            width: $contentElementParent.outerWidth(false),
            height: $contentElementParent.outerHeight(false)
        };
        self._contentElementDimensions = {
            width: $contentElement.outerWidth(),
            height: $contentElement.outerHeight()
        };

		// store element width and height, because of dragging changes
		// positioning type and element may lost it's dimensions
		$contentElement.css({
			'width': $contentElement.css('width'),
			'height': $contentElement.css('height')
		});

        $selectLayerParent[0].showHighlighter($contentElement.parent()[0]);

        // Make parent offset root if it's not already
        if (parentPosition !== 'relative' && parentPosition !== 'absolute') {
            $contentElementParent.css('position', 'relative');
            this._model.updateStyle($contentElementParent.attr('data-id'), {'position': 'relative'});
        }

        // Now get the current offset from parent ...
        offsetFromParent = $contentElement.position();

        // .. and save it for later
        self._originOffset = {
            top: offsetFromParent.top,
            left: offsetFromParent.left
        };

        self._initScrollPosition = scrollPosition;
        self._startPosition = ui.position;

        self._previousStyles = {};

        ['position', 'top', 'right', 'bottom', 'left', '-webkit-transform'].forEach((prop) => {
            self._previousStyles[prop] = $contentElement[0].style[prop] || '';
        });

        // Make moved element movable
        $contentElement.css('position', 'absolute');

        $('.closet-dv-scroll').css('display', 'none');
    }

    /**
     * Drag event
     * @param {Event} event
     * @param {Object} ui
     * @private
     */
    _onDrag(event, ui) {
        var $contentElement = this._$contentElement,
            $container = $contentElement.parent(),
            rawContainerOffset = $container.offset(),
            uiPosition = ui.position,
            // Zoom level
            ratio = StateManager.get('screen').ratio,
            // Container offset with zoom ratio
            editorContainerOffset = {
                top: rawContainerOffset.top * ratio,
                left: rawContainerOffset.left * ratio
            },
            helperPosition = {
                top: (uiPosition.top / ratio) - rawContainerOffset.top,
                left: (uiPosition.left / ratio) - rawContainerOffset.left
            },
            contentElementDimensions = this._contentElementDimensions,
            containerDimensions = this._containerDimensions,
            cssTop = '',
            cssBottom = '',
            cssLeft = '',
            cssRight = '',
            $selectLayer = this._$selectedLayerElement.parent(),
            snapping = null;

        // Select parent container of current element
        $selectLayer[0].showHighlighter($container[0]);

        // Check if Snap to Container is enabled
        // this is set in drag start (to avoid unnecessary operations)
        if (snapToContainerEnabled) {
            // Get edges that we can snap to
            snapping = snapGuideManager.canSnapToContainerEdge(helperPosition, contentElementDimensions, containerDimensions);
        }

        if (snapping && snapping.any) {
            snapGuideManager.setGuidePosition(snapping, rawContainerOffset, containerDimensions);

            // Show horizontal snap guide
            if (snapping.top || snapping.bottom || snapping.vCenter) {
                snapGuideManager.showHorizontal();

                if (snapping.top) {
                    cssTop = '0';
                    cssBottom = 'auto';

                    // Snaps helper to current element position
                    uiPosition.top = editorContainerOffset.top;
                } else if (snapping.bottom) {
                    cssTop = 'auto';
                    cssBottom = '0';

                    uiPosition.top = ((containerDimensions.height * ratio) - (contentElementDimensions.height * ratio)) + editorContainerOffset.top;
                } else {
                    cssTop = ((containerDimensions.height / 2) - (contentElementDimensions.height / 2)) + 'px';
                    cssBottom = 'auto';
                }
            } else {
                snapGuideManager.hideHorizontal();
                cssTop = (this._originOffset.top + ((uiPosition.top - this._startPosition.top) / ratio)) + 'px';
                cssBottom = 'auto';
            }

            // Show vertical snap guide
            if (snapping.left || snapping.right || snapping.hCenter) {
                snapGuideManager.showVertical();

                if (snapping.left) {
                    cssLeft = '0';
                    cssRight = 'auto';

                    uiPosition.left = editorContainerOffset.left;
                } else if (snapping.right) {
                    cssLeft = 'auto';
                    cssRight = '0';

                    uiPosition.left = ((containerDimensions.width * ratio) - (contentElementDimensions.width * ratio)) + editorContainerOffset.left;
                } else {
                    cssLeft = ((containerDimensions.width / 2) - (contentElementDimensions.width / 2)) + 'px';
                    cssRight = 'auto';
                }
            } else {
                snapGuideManager.hideVertical();
                cssLeft = (this._originOffset.left + (uiPosition.left - (this._startPosition.left / ratio))) + 'px';
                cssRight = 'auto';
            }

            $contentElement.css({
                top: cssTop,
                bottom: cssBottom,
                left: cssLeft,
                right: cssRight
            });
        } else {
            snapGuideManager.hideHorizontal();
            snapGuideManager.hideVertical();

            $contentElement.css({
                top: (this._originOffset.top + ((uiPosition.top - this._startPosition.top) / ratio)) + 'px',
                left: (this._originOffset.left + ((uiPosition.left - this._startPosition.left) / ratio)) + 'px'
            });
        }
    }

    /**
     * Drag stop callback
     * @private
     */
    _onDragStop() {
        var $selectLayer = this._$selectedLayerElement.parent();

        $selectLayer[0].hideHighlighter(this._$contentElement.parent());

        this._$selectedLayerElement.parent()[0].syncSelector(this._$contentElement);
        this._$selectedLayerElement.css('opacity', 1);

        $('.closet-dv-scroll').css('display', 'block');

        snapGuideManager.hideHorizontal();
        snapGuideManager.hideVertical();

        // @TODO add drag event to history

        this._writeInfoToModel();
    }

    /**
     * Set resizable
     */
    setResizable() {
		const resizedElement = this._$contentElement,
			options = ElementDetector.getInstance().detect(resizedElement).package.options,
			resizeOptions = options.resizable;
		let resizingDirectives = '';
		if (resizeOptions) {
			if (this._onEditMode) {
				if (resizeOptions === true) {
					// set resizing to all directives when resizeOptions is true
					resizingDirectives = 'e, s, se';
				} else {
					// situation when resizeOptions is an object
					const hasResizeOptionsFalseValues = Object.keys(resizeOptions).some(
						prop => !resizeOptions[prop]
					);
					if (!hasResizeOptionsFalseValues) {
						// vertical and horizontal values in resizeOptions objects are true
						resizingDirectives = 'e, s, se';
					} else {
						for (const property in resizeOptions) {
							if (resizeOptions[property] === true) {
								switch (property) {
								// only horizontal value in resizeOptions object is true
								case 'horizontal':
									resizingDirectives = 'e';
									break;
								// only vertical value in resizeOptions object is true
								case 'vertical':
									resizingDirectives = 's';
									break;
								}
							}
						}
					}
				}
				this._$selectedLayerElement.resizable({
					handles: resizingDirectives,
					start: this._onResizeStart.bind(this),
					resize: this._onResize.bind(this),
					stop: this._onResizeStop.bind(this)
                });
            }
		}
	}

    /**
     * Resize start callback
     * @private
     */
    _onResizeStart() {
        var elem = this._$contentElement[0];

        this._previousStyles = {};
        ['position', 'top', 'left', '-webkit-transform', 'width', 'height'].forEach((prop) => {
            this._previousStyles[prop] = elem.style[prop] || '';
        });
    }

    /**
     * Resize callback
     * @param {Event} event
     * @param {Object} ui
     * @private
     */
    _onResize(event, ui) {
        const ratio = StateManager.get('screen').ratio;

        this._$contentElement.css({
            'width': ((ui.size.width) / ratio) + 'px',
            'height': ((ui.size.height) / ratio) + 'px'
        });
    }

    /**
     * Resize stop calback
     * @private
     */
    _onResizeStop() {
        this._$selectedLayerElement.parent()[0].syncSelector(this._$contentElement);
        this._$selectedLayerElement.css('opacity', 1);
        this._writeInfoToModel();
    }

    /**
     * Stop dragable
     */
    destroyDraggable() {
        if (this._$selectedLayerElement.hasClass('ui-draggable')) {
            this._$selectedLayerElement.draggable('destroy');
        }
    }

    /**
     * Stop resizable
     */
    destroyResizable() {
        if (this._$selectedLayerElement.hasClass('ui-resizable')) {
            this._$selectedLayerElement.resizable('destroy');
        }
    }

    /**
     * Write info about position to model
     * @private
     */
    _writeInfoToModel() {
        var elem = this._$contentElement[0],
            previousStyles = this._previousStyles,
            targetProperties = {},
            previousProperties = {};

        console.log('interactions._writeInfoToModel');

        ['position', 'top', 'left', 'right', 'bottom', '-webkit-transform', 'width', 'height'].forEach((prop) => {
            targetProperties[prop] = elem.style[prop] || '';
            previousProperties[prop] = previousStyles[prop] || '';
        });

        this._model.updateStyle(this._$contentElement.attr('data-id'), targetProperties, previousProperties);
    }

    // This function is triggered by conponent-element when a component is being Dragged.
    /**
     * On drag callback
     * @param {Event} event
     * @param {Object} componentPackageInfo
     * @param {Object} activeElementInfo
     */
    onComponentDragged(event, componentPackageInfo, activeElementInfo) {
        var designEditor,
            elementInfo,
            closestContainerInfo,
            closestLayoutInfo,
            packages,
            sParentPackage,
            sParentInfo;

        designEditor = AppManager.getActiveDesignEditor();

        if (designEditor) {
            elementInfo = designEditor.getElementInfoFromIFrame([event.clientX, event.clientY]);
            closestContainerInfo = designEditor.getUIInfo(elementInfo.element, 'container-component');
            closestLayoutInfo = designEditor.getUIInfo(elementInfo.element, 'layout-component');

            if ((closestContainerInfo || closestLayoutInfo) && componentPackageInfo.options['parent-constraint']) {
                packages = packageManager.getPackages(Package.TYPE.COMPONENT);
                sParentPackage = packages.get(componentPackageInfo.options['parent-constraint']);
                sParentInfo = designEditor.getUIInfo(designEditor.getDesignViewIframe().contents().find(sParentPackage.options.selector));
                eventEmitter.emit(EVENTS.SetNewGuide, elementInfo, sParentInfo, componentPackageInfo, designEditor);
            } else if (activeElementInfo) {
                eventEmitter.emit(EVENTS.SetNewGuide, elementInfo, activeElementInfo, componentPackageInfo, designEditor, true);
            } else if (closestContainerInfo) {
                eventEmitter.emit(EVENTS.SetNewGuide, elementInfo, closestContainerInfo, componentPackageInfo, designEditor);
            } else {
                designEditor.hideHighlighter();
                eventEmitter.emit(EVENTS.DeleteAllGuide);
            }
        }
    }
}

export {Interaction};
