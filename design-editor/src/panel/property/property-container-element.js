'use babel';

import $ from 'jquery';
import Mustache from 'mustache';
import {Component} from './component/component-element';
import {Behavior} from './behavior/behavior-element';
import ComponentElement from '../../utils/component-element';
import {Attribute} from './attribute/attribute-element';
import {EVENTS, eventEmitter} from '../../events-emitter';

var TAB_ITEM_TEMPLATE = [
    '<span class="closet-property-container-tab-item"><p class="closet-property-container-tab-title">{{title}}</p></span>'
].join('');

var TAB_TEMPLATE = [
    '<div class="closet-property-container-tab"></div>'
].join('');

/**
 *
 */
class PropertyContainer extends ComponentElement {
	constructor() {
		super();
		this.connectedCallback();
	}

	/**
	 * Create callback
	 */
	connectedCallback() {
		const self = this;

		self.$tab = null;
		self.propertyElements = null;
		self._activeTabIndex = 0;
		self.classList.add('closet-property-container');
		self._attributeEl = new Attribute();
		self._behaviorEl = new Behavior();
		self._componentEl = new Component();
		self._initializeTab();
		self.propertyElements = [self._componentEl, self._attributeEl, self._behaviorEl];
		self._addPropertyElements();
		self.elementSelected = false;

		// FIXME: once use this_bindEvents for the below code, clicking tab doesn't work.
		eventEmitter.on(EVENTS.ElementSelected, () => {
			self.elementSelected = true;
			self.setActivePropertyTab(self._previousActiveTabIndex === undefined ? 1 : self._previousActiveTabIndex);
		});
		eventEmitter.on(EVENTS.ElementDeselected, () => {
			self.elementSelected = false;
			if (self._activeTabIndex === 0) {
				return;
			}

			self._previousActiveTabIndex = self._activeTabIndex;
			self.setActivePropertyTab(0);
		});
	}

    /**
     * Handle event
     * @param {Event} event
     */
    handleEvent(event) {
        var target = event.target;

        if (target.parentElement && target.parentElement.matches('.closet-property-anchor')) {
            this.onToggleFoldingListClick(event);
        }
    }

    /**
     * Toggle folding list click callback
     * @param {Event} e
     */
    onToggleFoldingListClick(e) {
        var $target = $(e.target),
            $panelHead = $target.closest('.panel-heading'),
            $list = $panelHead.next();

        $list.toggleClass('closet-property-list-close');
        $panelHead.find('.closet-property-list-title-icon').toggleClass('fa-caret-down fa-caret-right');
    }

    /**
     * Attached callback
     */
    onAttached() {
        var self = this,
            container = self.$el.closest('.closet-container')[0];

        self.$el.find('.panel-draggable').each((index, element) => {
            self._setDraggable($(element));
        });


        container.addEventListener('click', self, false);
    }

    /**
     * Drag stop callback
     * @param {jQuery} $itemList
     * @param {Event} event
     */
    onDragStop($itemList, event) {
        var $container = $itemList.closest('.closet-container'),
            iframeDocument = $container[0].ownerDocument,
            pointerOverElement = null,
            offset = $itemList.offset(),
            containerOffset = $container.offset();

        // dragged element needs to be moved to find element, which the pointer is over
        $itemList.css({
            webkitTransform: 'translate(9999px,9999px)',
            transform: 'translate(9999px,9999px)'
        });
        requestAnimationFrame(() => {
            pointerOverElement = iframeDocument && iframeDocument.elementFromPoint(event.clientX, event.clientY);

            // if we stop over attribute panel, the element is added to panel
            if (pointerOverElement && pointerOverElement.matches('.closet-property-content, .closet-property-content *')) {
                $(pointerOverElement).closest('.closet-property-content').append($itemList);
                $itemList.css({
                    position: '',
                    zIndex: '',
                    webkitTransform: '',
                    transform: '',
                    top: '',
                    left: ''
                });
                $itemList.removeClass('undocked');
            } else {
                $container = $itemList.closest('.closet-container');
                $container.append($itemList);
                $itemList.css({
                    position: 'absolute',
                    zIndex: 1000,
                    webkitTransform: '',
                    transform: '',
                    top: (offset.top - containerOffset.top) + 'px',
                    left: (offset.left - containerOffset.left) + 'px'
                });
            }
        });
    }

    /**
     * Set draggable
     * @param {jQuery}  $itemList
     * @returns {*}
     * @private
     */
    _setDraggable($itemList) {
        var self = this,
            $container = $itemList.closest('.closet-container');

        $itemList.draggable({
            zIndex : 1000,
            appendTo: $container,
            containment: $container,
            helper: () => {
                var offset = $itemList.offset(),
                    containerOffset = $container.offset();

                $itemList.addClass('undocked');
                $itemList.css({
                    position: 'absolute',
                    zIndex: 1000,
                    webkitTransform: '',
                    transform: '',
                    top: (offset.top - containerOffset.top) + 'px',
                    left: (offset.left - containerOffset.left) + 'px'
                });
                $container.append($itemList);

                return $itemList;
            },
            handle: '.closet-property-list-title',
            stop : self.onDragStop.bind(self, $itemList)
        });
    }

    /**
     * Init
     */
    initialize() {
        var self = this;

        self.setActivePropertyTab(0);
        self.events = {
            click: 'onClickTabHandler'
        };
    }

	/**
	 * Init tab
	 * @private
	 */
	_initializeTab() {
		this.$tab = $(Mustache.render(TAB_TEMPLATE));
		this.appendChild(this.$tab[0]);
	}

	/**
	 * Add property element
	 * @private
	 */
	_addPropertyElements() {
		const self = this,
			propertyElementLength = self.propertyElements.length,
			propertyData = {};
		let propertyElement;

		for (let i = 0; i < propertyElementLength; i += 1) {
			propertyElement = self.propertyElements[i];
			propertyData.title = propertyElement.getElementTitle();
			self.$tab.append(Mustache.render(TAB_ITEM_TEMPLATE, propertyData));
			this.appendChild(propertyElement);
		}
	}

	/**
	 * Set active property index
	 * @param index
	 */
	setActivePropertyTab(index) {
		const self = this,
			currentActiveTab = self.$tab.children()[self._activeTabIndex],
			newActiveTab = self.$tab.children()[index];

		currentActiveTab.classList.remove('closet-property-container-tab-active');
		self.propertyElements[self._activeTabIndex].hide();

		newActiveTab.classList.add('closet-property-container-tab-active');
		self.propertyElements[index].show();
		self._activeTabIndex = index;
	}

	/**
	 * Show
	 * @param {string} selectedElementId
	 */
	show(selectedElementId) {
		requestAnimationFrame(this._attributeEl.render.bind(this._attributeEl, selectedElementId));
		requestAnimationFrame(this._behaviorEl.render.bind(this._behaviorEl, selectedElementId));
	}

	/**
	 * On click tab callback
	 * @param {Event} event
	 */
	onClickTabHandler(event) {
		const target = event.target;
		let index;

		if (target.classList.contains('closet-property-container-tab-item') && this.elementSelected) {
			index = [...this.$tab[0].children].indexOf(target);
			this.setActivePropertyTab(index);
		}
	}
}

customElements.define('closet-property-container-element', PropertyContainer);

export {PropertyContainer};
