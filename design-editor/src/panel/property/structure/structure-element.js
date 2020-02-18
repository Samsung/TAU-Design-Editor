/* eslint-disable no-console */
'use babel';

import path from 'path';
import mustache from 'mustache';
import $ from 'jquery';
import {DressElement} from '../../../utils/dress-element';
import {appManager as AppManager} from '../../../app-manager';
import {EVENTS, eventEmitter} from '../../../events-emitter';
import {elementSelector} from '../../../pane/element-selector';

const ICON = {
    'undefined': 'fa fa-lock',
    'standalone-component': 'fa fa-circle-o',
    'container-component': 'fa fa-shopping-basket',
    'common-component': 'fa fa-cube',
    'layout-component': 'fa fa-hashtag',
    'hiding-container-component': 'fa fa-eye-slash'
};

/**
 *
 */
class Structure extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        var self = this;
        self.model = null;
        self._componentsInfo = null;
        self._componentPackage = null;
        self._$treeRoot = null;
        self._$lastSelectedItem = null;
        self._editor = null;
        self._showing = false;
        self.classList.add('closet-structure-element-container');

        this._bindHandler = {
            ActiveEditorUpdated: this._onUpdateActiveEditor.bind(this)
        };
        eventEmitter.on(EVENTS.ActiveEditorUpdated, this._bindHandler.ActiveEditorUpdated);

        $.get(path.join(AppManager.getAppPath().src, 'panel', 'property', 'structure', 'structure-element.html'), (template) => {
            self.$el.append(mustache.render(template));
            self._$treeRoot = self.$el.children('.list-tree');
        });
    }

    /**
     * Return element title
      * @returns {*|Element|string}
     */
    getElementTitle() {
        var element = this.querySelector('.closet-structure-element-title');
        return element && element.textContent;
    }

    /**
     * Render
     * @private
     */
    _render() {
        console.log('_render');
        if (this._editor) {
            if (this._editor.getModel()) {
                this._makeTree(
                    this._editor
                        .getModel()
                        .getTreeElements()
                );
            }
        }
    }

    /**
     * Make structure tree
     * @param {Object} structure
     */
    _makeTree(structure) {
        var $tree = this._$treeRoot,
            children = structure.children,
            length = structure.children.length,
            i = 0;


        if (this._bindHandler) {
            $tree.off('click', this._bindHandler.CLICK);
        }
        $tree.empty();

        for (i = 0; i < length; i += 1) {
            this._makeBranch(children[i], $tree);
        }
        if (this._bindHandler) {
            $tree.on('click', this._bindHandler.CLICK);
        }
    }

    /**
     * Build branch in tree
     * @param {Object} structure
     * @param {Object} tree
     * @private
     */
    _makeBranch(structure, tree) {
        var component = structure.component,
            children = structure.children,
            length = structure.children.length,
            nextTree,
            $list,
            $listItem,
            i;

        $list = $('<li></li>');
        $listItem = $('<div class="list-item"></div>');
        $listItem.append($('<i class="' + ICON[component.options.type] + '"></i>' +
            '<span class="icon item-name">' + component.name + '</span>'));
        $list.append($listItem);
        $list.attr('data-linked-element', structure.id);
        $list.addClass('list-nested-item');
        tree.append($list);

        nextTree = $('<ul class="list-tree"></ul>');
        $list.append(nextTree);
        for (i = 0; i < length; i += 1) {
            this._makeBranch(children[i], nextTree);
        }
    }

    /**
     * open hiding component
     * @param {Object} elementInfo
     * @param {string} elementId
     * @private
     */
    _openHidingComponent(elementInfo, elementId) {
        var elementPackage = elementInfo.package,
            hidingComponentShow,
            hidingComponentConstructor,
            hidingComponent,
            i, len, method;
        method = this._editor.getDesignViewIframe()[0].contentWindow;
        hidingComponentShow = elementPackage.options.display.show;
        hidingComponentConstructor = hidingComponentShow.constructor.split('.');
        len = hidingComponentConstructor.length;
        for (i = 0; i < len; i += 1) {
            method = method[hidingComponentConstructor[i]];
        }
        hidingComponent = method(elementInfo.$element[0], hidingComponentShow.options);
        hidingComponent[hidingComponentShow.method]();
        elementInfo.$element.off(elementPackage.options.display.events.onShow, this._bindOnHidingComponentShow);
        this._bindOnHidingComponentShow = this._onHidingComponentShow.bind(this, elementId);
        elementInfo.$element.on(elementPackage.options.display.events.onShow, this._bindOnHidingComponentShow);
        this._hidingInfo = elementInfo;
        this._hidingComponent = hidingComponent;
    }

    /**
     * Hiding component callback
     * @param {string} elementId
     * @private
     */
    _onHidingComponentShow(elementId) {
        if (elementId) {
            elementSelector.select(elementId);
        }
    }

    /**
     * Callback for event select element
     * @param {number} elementId
     */
	_onSelectedElement(elementId) {
		console.log('_onSelectedElement', elementId);
		const $listItem = this._$treeRoot.find(`[data-linked-element=${  elementId  }]`);
		let	elementInfo,
			$element,
			elementPackage;

		if ($listItem.length) {
			$listItem.addClass('item-selected');
		}
		if (this._lastSelectedItemId === elementId) {
			return;
		}
		this._lastSelectedItemId = elementId;

		if (this._editor && this._editor.isVisible()) {
			elementInfo = this._editor.getUIInfo(this._editor._getElementById(elementId));
			elementPackage = elementInfo && elementInfo.package;
			if (this._hidingComponent) {
				this._hidingComponent[this._hidingInfo.package.options.display.hide.method]();
			}
			if (elementInfo.package.options.type === 'hiding-container-component') {
				if (this._hidingComponent) {
					this._hidingComponent[elementInfo.package.options.display.hide.method]();
				}
				this._openHidingComponent(elementInfo);
				// elementInfo.$element.css('display', 'block');
			} else {
				$element = elementInfo.$element;
				while (elementInfo && $element.parent().length) {
					elementInfo = this._editor.getUIInfo($element.parent());
					elementPackage = elementInfo && elementInfo.package;
					if (elementPackage && elementPackage.options.type === 'hiding-container-component') {
						elementSelector.unSelect();
						if (this._hidingComponent) {
							this._hidingComponent[this._hidingInfo.package.options.display.hide.method]();
						}
						this._openHidingComponent(elementInfo, elementId);
						// elementInfo.$element.css('display', 'block');
						break;
					}
					$element = $element.parent();
				}
			}
		}
	}

    /**
     * Callback for event deselect element
     * @param {number} elementId
     */
    _onDeselectedElement(elementId) {
        console.log('_onDeselectedElement', elementId);
        var $listItem = this._$treeRoot.find('[data-linked-element=' + elementId + ']');

        if ($listItem.length) {
            $listItem.removeClass('item-selected');
        }

    }

    /**
     * Insert element callback
     * @private
     */
    _onInsertedElement() {
        this._render();
    }

    /**
     * update active editor callback
     * @param {number} type
     * @param {Editor} editor
     * @private
     */
    _onUpdateActiveEditor(type, editor) {
        console.log('_onUpdateActiveEditor', type, editor);
        this._editor = editor;

        if (type === 1 && this.isOpened()) {
            this._render();
        } else if (type === 0 && this.isOpened()) {
            eventEmitter.emit(EVENTS.ToggleStructureElement);
        }
    }

    /**
     * Delete elemenet callback
     * @private
     */
    _onDeletedElement() {
        this._render();
    }

    /**
     * Bind events
     * @private
     */
	_bindEvent() {
		const handler = this._bindHandler;
		handler.CLICK = this.onClick.bind(this);
		handler.ElementSelected = this._onSelectedElement.bind(this);
		handler.ElementDeselected = this._onDeselectedElement.bind(this);
		handler.ElementInserted = this._onInsertedElement.bind(this);
		handler.ElementDeleted = this._onDeletedElement.bind(this);

		this._$treeRoot.on('click', handler.CLICK);
		eventEmitter.on(EVENTS.ElementSelected, handler.ElementSelected);
		eventEmitter.on(EVENTS.ElementDeselected, handler.ElementDeselected);
		eventEmitter.on(EVENTS.ElementInserted, handler.ElementInserted);
		eventEmitter.on(EVENTS.ElementMoved, handler.ElementInserted);
		eventEmitter.on(EVENTS.ElementDeleted, handler.ElementDeleted);
	}

    /**
     * Remove bind events
     * @private
     */
    _unBindEvent() {
        var handler = this._bindHandler;
        this._$treeRoot.off('click', handler.CLICK);
        eventEmitter.removeListener(EVENTS.ElementSelected, handler.ElementSelected);
        eventEmitter.removeListener(EVENTS.ElementDeselected, handler.ElementDeselected);
        eventEmitter.removeListener(EVENTS.ElementInserted, handler.ElementInserted);
        eventEmitter.removeListener(EVENTS.ElementMoved, handler.ElementInserted);
        eventEmitter.removeListener(EVENTS.ElementDeleted, handler.ElementDeleted);
    }

    /**
     * Click callback
     * @param {Event} event
     */
    onClick(event) {
        var $target = $(event.target),
            $listItem = $(event.target).closest('li'),
            linkedElementId = $listItem.attr('data-linked-element');

        if (this._$lastSelectedItem) {
            this._$lastSelectedItem.removeClass('item-selected');
        }
        $listItem.addClass('item-selected');

        if ($target.hasClass('item-name')) {
			elementSelector.select(linkedElementId);
        } else if ($listItem.hasClass('collapsed')) {
            $listItem.removeClass('collapsed');
        } else {
            $listItem.addClass('collapsed');
        }

        this._$lastSelectedItem = $listItem;
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Open
     */
    open() {
        eventEmitter.emit(EVENTS.OpenPanel, {
            type: 'right',
            item: this,
            priority: 120
        });

        this.show();
    }

    /**
     * Close
     */
    close() {
        this.hide();
        eventEmitter.emit(EVENTS.ClosePanel, {
            item: this,
            clean: false
        });
    }

    /**
     * Is open?
     * @returns {boolean}
     */
    isOpened() {
        return this._showing;
    }

    /**
     * Show
     */
    show() {
        if (!this._showing) {
            this._render();
            this._bindEvent();
            this._showing = true;
        }
        this.$el.removeClass('fast-hide');
        this.$el.addClass('fast-show');
    }

    /**
     * Hide
     */
    hide() {
        this._unBindEvent();
        this._showing = false;

        this.$el.addClass('fast-hide');
        this.$el.removeClass('fast-show');
    }
}

customElements.define('closet-structure-element', Structure);

export {Structure};
