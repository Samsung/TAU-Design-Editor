'use babel';

import $ from 'jquery';
import Mustache from 'mustache';
import {ComponentElement} from './component/component-element';
import {BehaviorElement} from './behavior/behavior-element';
import {DressElement} from '../../utils/dress-element';
import {AttributeElement} from './attribute/attribute-element';
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
class PropertyContainer extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        var self = this;

        self.$tab = null;
        self.propertyElements = null;
        self._activeTabIndex = 0;
        self.classList.add('closet-property-container');
        self._attributeEl = new AttributeElement();
        self._behaviorEl = new BehaviorElement();
        self._componentEl = new ComponentElement();
        self._initializeTab();
        self.propertyElements = [self._componentEl, self._attributeEl, self._behaviorEl];
        self._addPropertyElements();

        // FIXME: once use this_bindEvents for the below code, clicking tab doesn't work.
        eventEmitter.on(EVENTS.ElementSelected, () => {
            self.setActivePropertyTab(self._previousActiveTabIndex === undefined ? 1 : self._previousActiveTabIndex);
        });
        eventEmitter.on(EVENTS.ElementDeselected, () => {
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
        var self = this;
        self.$tab = $(Mustache.render(TAB_TEMPLATE));
        self.$el.empty().append(self.$tab);
    }

    /**
     * Add property element
     * @private
     */
    _addPropertyElements() {
        var self = this,
            propertyElement,
            propertyElementLength = self.propertyElements.length,
            propertyData = {},
            i = 0;

        for (i = 0; i < propertyElementLength; i += 1) {
            propertyElement = self.propertyElements[i];
            propertyData.title = propertyElement.getElementTitle();
            self.$tab.append(Mustache.render(TAB_ITEM_TEMPLATE, propertyData));
            self.$el.append(propertyElement);
        }
    }

    /**
     * Set active property index
     * @param index
     */
    setActivePropertyTab(index) {
        var self = this,
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
     * @param {Event} e
     */
    onClickTabHandler(e) {
        var self = this,
            target = $(e.target),
            index;

        if (target.hasClass('closet-property-container-tab-item')) {
            index = self.$tab.children().index(target);
            self.setActivePropertyTab(index);
        }
    }
}

const PropertyContainerElement = document.registerElement('closet-property-container-element', PropertyContainer);

export {PropertyContainerElement, PropertyContainer};
