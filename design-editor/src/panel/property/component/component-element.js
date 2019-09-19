'use babel';

import path from 'path';
import mustache from 'mustache';
import $ from 'jquery';

import {packageManager, Package} from 'content-manager';
import {appManager as AppManager} from '../../../app-manager';
import {DressElement} from '../../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../../events-emitter';
import {elementSelector} from '../../../pane/element-selector';
import {ViewType} from '../../../static';
import {StateManager} from '../../../system/state-manager';
import utils from '../../../utils/utils';
import { _compareVersions } from './utils/component-element-utils';

const TYPE_DESIGN_EDITOR = ViewType.Design;
const RENDER_TIMEOUT = 300; //ms

let waitForInterval = false;
let renderTimeoutHandler = null;

const dragInfo = {
    currentDragEvent: null,
    componentInfo: null,
    $dragHelper: null
};

const
	TEMPLATE_FILE_PATH = '/panel/property/component/',
	TEMPLATE_FILE_NAME = 'component-element.html',
	ITEM_TEMPLATE_FILE_NAME = 'component-element-item.html',
	ITEM_BUTTON_CLASS = 'closet-component-element-list-item',
	DEVICE_PROFILE_OPTION = 'device-profile';

/**
 * Drag interval
 */
function dragInterval() {
    var event = dragInfo.currentDragEvent;
    waitForInterval = false;

    dragInfo.$dragHelper.css({
        top: event.clientY,
        left: event.clientX
    });
    eventEmitter.emit(EVENTS.ComponentDragged, event, dragInfo.componentInfo);
}


/**
 *
 */
class Component extends DressElement {

	/**
	 * Method called when CE is created.
	 */
	onCreated() {
		const screen = StateManager.get('screen');
		this.classList.add('closet-property');
		// @todo: change this to more configurable
		this._profile = screen.profile || 'mobile';
		this._shape = screen.shape || 'rectangle';
		this._bindEditorEvents();

		/**
		 * Id of animation frame request created during item (widget) dragging.
		 * The id is used to clear request when the dragging is stopped.
		 */
		this._dragAnimationFrameRequestId = 0;
	}

    /**
     * Method called on attached element to DOM
     */
    onAttached() {
        this._initialize();
    }

	/**
	 * Method called when element is destroyed
	 */
	onDestroy() {
		this._unsetDraggable(this._componentButtonList);
	}

	/**
	 * Build main DOM structure and initialize all properties
	 * @private
	 */
	_initialize() {
		const componentsContainers = {},
			componentsChildren = {};

		this._componentButtonList = [];
		this._componentPackage = packageManager.getPackages(Package.TYPE.COMPONENT);
		this.componentsInfo = this._componentPackage._packages;

		Object.keys(this.componentsInfo).forEach((componentName) => {
			const componentOptions = this.componentsInfo[componentName].options;

			if (componentOptions.constraint) {
				componentOptions.constraint.forEach((constraint) => {
					if (componentsContainers[constraint]) {
						componentsContainers[constraint].push(componentName);
					} else {
						componentsContainers[constraint] = [componentName];
					}
					if (componentsChildren[componentName]) {
						componentsChildren[componentName].push(constraint);
					} else {
						componentsChildren[componentName] = [constraint];
					}
				});
			}
		});

		this._componentsContainers = componentsContainers;
		this._componentsChildren = componentsChildren;

		$.get(path.join(AppManager.getAppPath().src, TEMPLATE_FILE_PATH, TEMPLATE_FILE_NAME), (templateString, err) => {
			if (templateString) {
				this.$el.append(mustache.render(templateString));
				this._render();
			} else {
				throw new Error(err);
			}
		});
	}

	/**
	 * Change component profil
	 * @private
	 */
	_changeProfile(profile) {
		this._profile = profile;
		this._setIcon(this._componentButtonList);

		this._render();
	}

	/**
	 * Change component shape
	 * @private
	 */
	_changeShape(shape) {
		this._shape = shape;
		this._setIcon(this._componentButtonList);

		this._render();
	}

    /**
     * Bind editor events
     * @private
     */
    _bindEditorEvents() {
        var self = this;
        eventEmitter.on(EVENTS.ElementSelected, (elementId) => {
            self._onSelectElement(elementId, true);
        });

        eventEmitter.on(EVENTS.ElementDeselected, (elementId) => {
            self._onSelectElement(elementId, false);
        });

		eventEmitter.on(EVENTS.ChangeProfile, self._changeProfile.bind(self));
		eventEmitter.on(EVENTS.ChangeShape, self._changeShape.bind(self));
		eventEmitter.on(EVENTS.ActiveEditorUpdated, self._onUpdateActiveEditor.bind(self));
		eventEmitter.on(EVENTS.TAULoaded, self._render.bind(self, true));
    }

    /**
     * Callback for select or deselect element
     * @param {string} elementId
     * @param {boolean} selected
     * @private
     */
    _onSelectElement(elementId, selected) {
        var self = this,
            elementInfo = null;

        elementInfo = self._editor.getUIInfo(self._editor._getElementById(elementId));

		self._componentButtonList.forEach((component) => {
            var $component = $(component),
                childName = $component.data('component-name'),
                componenChildren = elementInfo && self._componentsChildren[elementInfo.package.name],
                disabled = selected && ((!componenChildren) || (componenChildren.indexOf(childName) === -1));

            $component.toggleClass('component-disabled', disabled);
        });
    }

    /**
     * On change editor update connected editor element
     * @param {number} type
     * @param {Editor} editor
     * @private
     */
    _onUpdateActiveEditor(type, editor) {
        var self = this;
        if (type === TYPE_DESIGN_EDITOR) {
            self._editor = editor;
        }

        let screen = StateManager.get('screen');

        if (screen.profile !== self._profile) {
            self._changeProfile(screen.profile);
        }

        if (screen.shape !== self._shape) {
            self._changeShape(screen.shape);
        }

        self._render();
    }

	/**
     * Return list of components, which could be available in current design editor profile
     * @param {Object} componentInfo
     * @private
     */
	_selectComponentsToDeviceProfile(componentInfo) {
		let comp = null;
		const components = {},
			screen = StateManager.get('screen');

		for (comp in componentInfo) {
			const componentProfileList = componentInfo[comp].options[DEVICE_PROFILE_OPTION];
			if (!componentProfileList || componentProfileList.indexOf(screen.profile) !== -1) {
				components[comp] = componentInfo[comp];
			}
		}
		return components;
	}

	/**
	 * Fill component info at panel
	 * If render method is called in short time of period only the last one will runs
	 * @param {boolean} force render without timeout
	 * @private
	 */
	_render(force) {
		if (renderTimeoutHandler) {
			window.clearTimeout(renderTimeoutHandler);
		}
		renderTimeoutHandler = window.setTimeout(
			this._renderCallback.bind(this),
			(force) ? 0 : RENDER_TIMEOUT
		);
	}

	/**
	 * This method is called by _render method with timeout
	 * @private
	 */
	_renderCallback() {
		if (!this.componentsInfo) {
			return;
		}
		const componentsInfoProfile = this._selectComponentsToDeviceProfile(this.componentsInfo);
		this._getItemTemplate(componentsInfoProfile)
			.then((template) => {
				const $content = this.$el.find('.closet-component-element-content');

				$content.html('');
				$content.append($(template));
				const _$componentButtonList = this.$el.find(`.${ITEM_BUTTON_CLASS}`);
				this._componentButtonList = _$componentButtonList.toArray();
				this._setIcon(this._componentButtonList);
				this._setDraggable(_$componentButtonList.filter(
					':not(.component-disabled), :not(.not-available)'));
			}, (err) => {
				throw err;
			});
	}

	/**
	 * Clear dragable function
	 * @param {HTMLCollection} itemList
	 * @private
	 */
	_unsetDraggable(itemList) {
		if (itemList && itemList.length) {
			$(itemList).draggable('destroy');
		}
	}

    /**
     * Set dragable function
     * @param {jQuery} $itemList
     * @private
     */
    _setDraggable($itemList) {
        $itemList.draggable({
            iframeFix: true,
            zIndex: 1000,
            containment: false,
            helper: 'clone',
            start: this._onDragStart.bind(this),
            drag: this._onDrag.bind(this),
            stop: this._onDragStop.bind(this, $itemList)
        });
    }

	/**
	 * All Component should be had own Icon that display on component tab.
	 * @param {Element[]} itemList -Compnent list
	 * @private
	 */
	_setIcon(itemList) {
		itemList = itemList || [];

		const getComponentIconPath = component => {
			const icon = component.options.resources.icon;

			const iconPath =
				icon && icon[this._profile] && icon[this._profile][this._shape] ||
				icon && icon[this._profile] ||
				icon;

			return iconPath;
		};

		itemList.forEach(element => {
			const name = $(element).data('component-name');
			const component = this.componentsInfo[name];
			const iconRelPath = getComponentIconPath(component);

			if (typeof iconRelPath === 'string' && iconRelPath) {
				const imgPath = path.join(component.options.path, iconRelPath)
					// fix for Windows paths
					.replace(/\\/g, '/');

				$(element)
					.css('background-image', `url(${imgPath})`)
					.removeClass('closet-component-element-list-item-noicon');
			} else {
				$(element)
					.css('background-image', 'none')
					.addClass('closet-component-element-list-item-noicon');
			}
		});
	}

    /**
     * Method load external resources like js and css
     * and append to editor view (iframe)
     *
     * @param {*} externalResources
     */
    _addExternalResources(name, externalResources) {
        let self = this;
        let iframe = self._editor._$iframe.get(0);

        if (iframe) {
            let contentDocument = iframe.contentDocument;
            let head = contentDocument.head;
            let queue = [];
            function done() {
                queue.shift();
                if (queue.length) {
                    queue[0].call();
                }
            }

            externalResources.forEach(function (lib) {
                if (typeof lib === "string") {
                    lib = {"src": lib};
                }
                let element;
                let fileExtension = lib.src.match(/([^.]+)$/);
                if (fileExtension.length) {
                    fileExtension = fileExtension[0];
                    switch (fileExtension) {
                        case "js" :
                            if (head.querySelector("script[src='" + lib.src + "']")) {
                                // continue
                                return;
                            };
                            element = document.createElement("script");
                            element.setAttribute("type", "text/javascript");
                            element.setAttribute("src", lib.src);
                        break;
                        case "css" :
                            if (head.querySelector("link[href='" + lib.src + "']")) {
                                // continue
                                return;
                            };
                            element = document.createElement("link");
                            element.setAttribute("type", "text/css");
                            element.setAttribute("rel", "stylesheet");
                            element.setAttribute("href", lib.src);
                        break;
                    }

                    if (element) {
                        // async load
                        element.addEventListener("load", function () {
                            console.log(name + ' has additionaly loaded ' + lib.src);
                            done();
                        });
                        // add attributes
                        if (lib.attributes) {
                            Object.keys(lib.attributes).forEach(function (key) {
                                element.setAttribute(key, lib.attributes[key]);
                            });
                        }

                        // append script to iframe
                        queue.push(function () {
                            head.appendChild(element);
                        });
                    }
                };
            });
            if (queue.length) {
                queue[0].call();
            }
        }
    }

	/**
	 * Callback for drag start
	 * @param {Event} e
	 * @param {Object} ui
	 * @private
	 */
	_onDragStart(e, ui) {
		const name = $(e.target).data('component-name'),
			componentInfo = this.componentsInfo[name],
			possibleContainers = this._componentsContainers[name];

		// to cache
        dragInfo.name = name;
        dragInfo.componentInfo = componentInfo;

        elementSelector.unSelect();
		this._createDragHelper(ui.helper);

        // append external libraries required by component
        if (componentInfo.options && componentInfo.options.externalResources) {
            console.log('component ' + name + ' needs additional resources', componentInfo.options.externalResources);
			// External resources support is currently disabled
			// self._addExternalResources(name, componentInfo.options.externalResources);
        }

        if (possibleContainers.length) {
			let tooltipText = `Possible containers ${
				componentInfo.options.label ? `for ${componentInfo.options.label} : ` : ': '
			}`;
            tooltipText += possibleContainers.reduce((containersText, currentContainer, index) => {
                if (index === 1) {
					return `${this.componentsInfo[containersText].options.label},
						${this.componentsInfo[currentContainer].options.label}`;
                }
				return `${containersText}, ${this.componentsInfo[currentContainer].options.label}`;
            }) + '.';

            // show tooltip-panel
            eventEmitter.emit(EVENTS.TooltipPanelOpen, {
                category: 'components',
                header: '',
                text: tooltipText
            });
        }
    }

    /**
     * Create preview of dragged element
     * @param {jQuery} helperElement
     * @private
     */
    _createDragHelper(helperElement) {
        var $helper = $(helperElement),
            $dragHelper = $helper.clone();

        $dragHelper.removeClass()
            .html('')
            .addClass('closet-component-drag-helper')
            .appendTo(document.body);

        dragInfo.$dragHelper = $dragHelper;

        $helper.css('display', 'none');
    }

    /**
     * Callback for drag event
     * @param {Event} event
     * @private
     */
    _onDrag(event) {
        dragInfo.currentDragEvent = event;

        if (!waitForInterval) {
            waitForInterval = true;
            this._dragAnimationFrameRequestId = requestAnimationFrame(dragInterval);
        }
    }

    /**
     * Callback fro dragstop event
     * @param {jQuery} $itemList
     * @param {Event} event
     * @private
     */
    _onDragStop($itemList, event) {
        // clear pending animation frame request if exist
        if (waitForInterval) {
            waitForInterval = false;
            cancelAnimationFrame(this._dragAnimationFrameRequestId)
        }

        dragInfo.$dragHelper.remove();
        eventEmitter.emit(EVENTS.InsertComponent, event, dragInfo.componentInfo);
    }

    /**
     * Convert Components info to options for template
     * @param {Object} info
     * @returns {{}}
     * @private
     */
    _componentsToOptions(info) {
		const options = {},
			screen = StateManager.get('screen'),
			currentTauVersion = StateManager.get('tau-version', undefined),
			profile = screen.profile,
			shape = screen.shape,
			defaultWeight = 10000;

		let isAvailable;

		Object.keys(info).forEach((id) => {
            if (info[id].options.attachable !== false && utils.correctVersion(info[id].options.version, profile, shape)) {
                if (!options[info[id].options.type]) {
                    options[info[id].options.type] = [];
                }

				isAvailable = _compareVersions(currentTauVersion, info[id].options.since);
                options[info[id].options.type].push({
                    name: info[id].name,
					new: isAvailable && info[id].options.new,
					label: info[id].options.label,
					weight: info[id].options.displayOrderWeight || defaultWeight,
					isAvailable: isAvailable,
					availableSince: info[id].options.since
                });
            }
        });

        Object.keys(options).forEach((type) => {
            options[type].sort((a,b) => {
                return a.weight - b.weight;
            });
        });

        return options;
    }

	/**
	 * Read template and fill data about items
	 * @param {Object} info
	 * @returns {Promise}
	 * @private
	 */
	_getItemTemplate(info) {
		const options = this._componentsToOptions(info);
		const templatePath = path.join(
			AppManager.getAppPath().src,
			TEMPLATE_FILE_PATH,
			ITEM_TEMPLATE_FILE_NAME
		);

		return fetch(templatePath)
			.then(response => response.text())
			.then(templateString => mustache.render(templateString, options));
	}

    /**
     * Return title of panel
     * @returns {string}
     */
    getElementTitle() {
        return 'Widgets';
    }

    /**
     * Show element
     */
    show() {
        this._render();
        this.$el.removeClass('fast-hide')
            .addClass('fast-show');
    }

    /**
     * Hide element
     */
    hide() {
        this.$el.addClass('fast-hide')
            .removeClass('fast-show');
    }
}

const ComponentElement = document.registerElement('closet-component-element', Component);

export {Component, ComponentElement};
