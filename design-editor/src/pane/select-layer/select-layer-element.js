'use babel';

/* global WeakMap */

import $ from 'jquery';
import {packageManager} from 'content-manager';
import {StateManager} from '../../system/state-manager';
import {Interaction} from '../interaction';
import {DressElement} from '../../utils/dress-element';
import {elementSelector} from '../element-selector';
import {ElementDetector} from '../element-detector';
import {LayoutDetailElement} from './layout-detail-element';
import {AlternativeSelectorElement} from './alternative-selector-element';
import {PopupElement} from '../popup-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import {ExpandableElement} from '../expandable-element';

const INTERNAL_ID_ATTRIBUTE = 'data-id';
const SCROLL_SPEED = 3;
const INLINE_TEXTEDITOR_TEMPLATE_FILE = '/pane/select-layer/select-layer-element.html';
let interaction = null;

require('jquery-ui');

/**
 *
 * @param a
 * @param b
 * @returns {string}
 */
function camelize(a, b) {
    return b.toUpperCase();
}

class SelectLayer extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        const self = this;

        self.defaults = {
            designEditor: null,
            screenWidth: 0,
            screenHeight: 0,
            screenRatio: 1
        };

        self.events = {
            'click': 'onClick'
        };

        interaction = Interaction.getInstance();

        self.classList.add('closet-select-layer');
        self.$el.attr('tabindex', -1);

        self._editableElementMutationObserver = null;
        self._highlightedElement = null;
        self._selectionChange = null;
        self._$editedElement = null;
        self._selectedElement = null;
        self._$scrollUpElement = null;
        self._$scrollDownElement = null;
        self._layoutDetail = new LayoutDetailElement();
        self._popupElement = new PopupElement();
        self._expandableElement = new ExpandableElement();

        self._layerWeakMap = new WeakMap();
        self._highlightWeakMap = new WeakMap();
        self._$toolsetLayer = null;

        self._buttonElements = null;
        self._fontSizeElement = null;
        self._fontNameElement = null;
        self._fontColorElement = null;

        self._altSelectorList = [];

        self.$el.append(self._layoutDetail);

        // TODO: proto: separate inline-text-editor from select layer element. INLINE_TEXTEDITOR_TEMPLATE_FILE also.
        self.createFromTemplate(INLINE_TEXTEDITOR_TEMPLATE_FILE, {
            callback: ($el) => {
                self._$toolsetLayer = $el;
                $el.hide();
            }
        });

        eventEmitter.on(EVENTS.ChangeStyle, self._onStyleChanged.bind(self));
        eventEmitter.on(EVENTS.ChangeContent, self._onContentChanged.bind(self));
        eventEmitter.on(EVENTS.PopupOpened, self._onPopupOpened.bind(self));

    }

    /**
     * Callback on popup opened event
     * @param {HTMLElement} selectedElement Popup element or one of its child.
     */
    _onPopupOpened(selectedElement) {
        if (this._$selectedLayerElement) {
            this._$selectedLayerElement.show();
            requestAnimationFrame(this._layoutElement.bind(this, selectedElement, this._$selectedLayerElement[0]));
        }
    }

    /**
     * Callback on change content event
     * @param {string} id Id of changed element
     * @param {string} content Element content
     */
    _onContentChanged(id, content) {
        if (this._selectedElement.getAttribute('data-id') === id) {
            this._layoutElement(this._selectedElement, this._$selectedLayerElement[0]);
        }
    }

    /**
     * Callback on change style event
     * @param {string} id Id of changed element
     * @param {string} name style name
     * @param {string} value style new value
     */
    _onStyleChanged(id, name, value) {
        var bigRegexp = /[A-Z]/g;
        if (this._$inputElement && this._selectedElement.getAttribute('data-id') === id) {
            this._$inputElement.css(name.replace(bigRegexp, c => '-' + c.toLowerCase()), value);
            this._layoutElement(this._selectedElement, this._$selectedLayerElement[0]);
        }
    }

    /**
     * Show highlighter
     * @param {HTMLElement} element
     * @returns {*}
     */
    showHighlighter(element) {
        console.log("showHighlighter");
        var $selectedLayerElement = this._highlightWeakMap.get(element);
        if (!element) {
            return null;
        }

        if (!$selectedLayerElement) {
            $selectedLayerElement = $(element.ownerDocument.createElement('div'));
            $selectedLayerElement.addClass('closet-highlight-item', 'closet-select-' + element.nodeName.toLowerCase());
            this._highlightWeakMap.set(element, $selectedLayerElement);
        }

        if (this._highlightedElement !== element) {
            this.hideHighlighter();
        }

        requestAnimationFrame(this._layoutElement.bind(this, element, $selectedLayerElement[0]));
        // $selectedLayerElement.appendTo(this);
        this.$el.prepend($selectedLayerElement);


        this._highlightedElement = element;

        return $selectedLayerElement;
    }

    /**
     * Hide highlighter
     * @param {HTMLElement} element
     */
    hideHighlighter(element) {
        var $element = element ? $(element) : $(this._highlightedElement),
            $selectedLayerElement, classList;

        $selectedLayerElement = this._highlightWeakMap.get($element[0]);

        if (!$selectedLayerElement || !$element || $element.length === 0) {
            return;
        }

        if ($selectedLayerElement.length) {
            classList = $selectedLayerElement[0].classList;
            if (classList.contains('ui-draggable')) {
                $selectedLayerElement.draggable('destroy');
            }
            if (classList.contains('ui-resizable')) {
                $selectedLayerElement.resizable('destroy');
            }
            $selectedLayerElement.remove();
            if (this._$toolsetlayer) {
                this._$toolsetlayer.hide();
            }
            this._highlightWeakMap.delete($element[0]);
            this._highlightedElement = null;
        }
    }

    // TODO: this function has too many responsiblity
    /**
     * Show selector
     * @param {HTMLElement} element
     */
    showSelector(element) {
        console.log("showSelector");

        var $selectedLayerElement = $(this._layerWeakMap.get(element));

        // create $selectedLayerElement for bounding of the given element.
        if (!$selectedLayerElement.length) {
            $selectedLayerElement = $(element.ownerDocument.createElement('div'));
            $selectedLayerElement.addClass('closet-select-item', 'closet-select-' + element.nodeName.toLowerCase());
            this._layerWeakMap.set(element, $selectedLayerElement);
        }

        if (element && !this._popupElement.isPopup(element) ||
                element && this._popupElement.isPopup(element) && this._popupElement.isPopupActive(element)) {
            $selectedLayerElement.show();

            // copy dimension of $element to $selectedLayerElement.
            requestAnimationFrame(this._layoutElement.bind(this, element, $selectedLayerElement[0]));
        }

        this._$selectedLayerElement = $selectedLayerElement;

        $selectedLayerElement.appendTo(this);
        this._bindDblClick($selectedLayerElement, element);
        this._selectedElement = element;

        // show element layout detail
        requestAnimationFrame(this._layoutDetail.setLayoutDetail.bind(this._layoutDetail, element, $selectedLayerElement));

        // TODO: manually change position
        interaction.setInteraction($selectedLayerElement, element);
    }

    /**
     * Is editable?
     * @param {HTMLElement} ele
     * @returns {boolean}
     * @private
     */
    _isEditable(ele) {
        var element,
            component,
            result = false;

        element = $(ele)[0];
        component = packageManager.getPackages('component').getPackageByElement(element);

        if (component && component.options.textEditable) {
            result = true;
        }

        return result;
    }

    /**
     * Bind dbl click event
     * @param {jQuery} $layerElement
     * @param {jQuery} $targetElement
     * @private
     */
    _bindDblClick($layerElement, $targetElement) {
        if ($targetElement && this._isEditable($targetElement)) {
            $layerElement.css('pointer-events', 'all');
            $layerElement.off('dblclick');
            $layerElement.on('dblclick', (event) => {
                $layerElement.off('dblclick');
                this.onDblClick(event);
            });
            eventEmitter.emit(EVENTS.TooltipPanelOpen, {
                category: 'editable',
                text: 'This element is editable. To edit the content, double click on selected element.'
            });
        } else {
            eventEmitter.emit(EVENTS.TooltipPanelClose, {
                category: 'editable'
            });
        }
    }

    /**
     * Unbind dbl click
     * @param {jQuery} $layerElement
     * @private
     */
    _unbindDblClick($layerElement) {
        $layerElement.css('pointer-events', 'none');
    }

    /**
     * Show UI of element
     * @param {HTMLElement} ele
     */
    showEditUIForElement(ele) {
        var $element = $(ele),
            element = $element.get(0),
            self = this,
            $selectedLayerElement = self._layerWeakMap.get(element);
        // show inline-text-editor

        this.showEditInput($selectedLayerElement, $element);
    }

    /**
     * Hide selector
     * @param {HTMLElement} element
     */
    hideSelector(element) {
        var $element = $(element),
            $selectedLayerElement,
            classList,
            $editedElement = this._$editedElement || $element;

        $selectedLayerElement = $(this._layerWeakMap.get($element[0]));
        $selectedLayerElement.css('border-color', '');
        this._$toolsetLayer.hide();

        // hide inline-text-editor
        if (this._$inputElement) {
            this.options.designEditor
                .getModel()
                .updateText(this._$inputElement.attr('data-id'), this._$inputElement.html());

            if ($editedElement) {
                $editedElement.css('color', this._$inputElement.css('color'));
                $editedElement.find('*').css('visibility', 'visible');
            }

            this._$editedElement = null;
            this._$inputElement.remove();
            this._$toolsetLayer.remove();
            this._$inputElement = null;
            this.options.designEditor
                .getModel()
                .unlockHistory();
        }

        if (this._selectedElement) {
            this._selectedElement.removeAttribute('data-closed-edit-mode');
        }

        // hide $selectedLayerElement for bounding of the given element.
        if ($selectedLayerElement.length) {
            classList = $selectedLayerElement[0].classList;
            if (classList.contains('ui-draggable')) {
                interaction.destroyDraggable();
            }
            if (classList.contains('ui-resizable')) {
                interaction.destroyResizable();
            }
            this._unbindDblClick($selectedLayerElement);
            $selectedLayerElement.parent().find('.closet-select-item').remove();
        } else {
            $('.closet-select-item').remove();
        }

        // hide element layout detail
        this._layoutDetail.hide();

        // stop observing changes of the editable element text content
        if (this._editableElementMutationObserver) {
            this._editableElementMutationObserver.disconnect();
        }

        document.removeEventListener('selectionchange', this._selectionChange);
    }

    /**
     * Sync selector
     * @param {HTMLElement} element
     */
    syncSelector(element) {
        this._sync(element, this._layerWeakMap);
    }


    /**
     * Sync alt selectors
     */
    syncAlternativeSelector() {
        this._altSelectorList.forEach((altSelector) => {
            altSelector.layout(this.options.designEditor.screenConfig.ratio);
        });
    }

    /**
     * Sync
     * @param {HTMLElement} element
     * @param {Map} map
     * @private
     */
    _sync(element, map) {
        var $element = $(element),
            $selectedLayerElement;

        $selectedLayerElement = $(map.get($element[0]));

        if ($selectedLayerElement.length) {
            this._layoutElement($element[0], $selectedLayerElement[0]);
            // show element layout detail
            this._layoutDetail.setLayoutDetail($element, $selectedLayerElement);
        }
    }

    /**
     * Click callback
     * @param {Event} e
     */
    onClick(e) {
        var target = this.options.designEditor.getElementInfoFromIFrame([
                e.clientX,
                e.clientY
            ]),
            detectedElementInfo = null;

        if (target && target.element) {
            detectedElementInfo = ElementDetector.getInstance().detect(target.element);

            if (detectedElementInfo) {
                elementSelector.select(detectedElementInfo.$element.attr(INTERNAL_ID_ATTRIBUTE));
            }
        }
    }

    /**
     * DBL click callback
     */
    onDblClick() {
        if (this._selectedElement) {
            this.showEditUIForElement(this._selectedElement);
        }
    }

    /**
     * Draw element layout
     * @param {HTMLElement} src
     * @param {HTMLElement} dest
     * @private
     */
    _layoutElement(src, dest) {
        console.log("_layoutElement", src, dest);
        var rectangle = src.getBoundingClientRect(),
            ratio = this.options.designEditor.screenConfig.ratio;

        dest.style.width = (rectangle.width * ratio) + 'px';
        dest.style.height = (rectangle.height * ratio) + 'px';
        dest.style.top = (rectangle.top * ratio) + 'px';
        dest.style.left = (rectangle.left * ratio) + 'px';
        this._makeHoverScroller();
    }

    /**
     * Make scroller hover
     */
    makeHoverScroller() {
        this._makeHoverScroller();
    }

    /**
     * Make scroller hover
     * @private
     */
    _makeHoverScroller() {
        var $element = this.$el,
            $closedEditor = $element.closest('closet-design-editor'),
            $dvScrollElement = $closedEditor.find('.closet-dv-scroll'),
            halfElementHeight = $element.height() / 2,
            scrollElementHeight,
            $scrollUpElement,
            $scrollDownElement;

        if ($dvScrollElement.length === 0) {
            $scrollUpElement = $(document.createElement('i'));
            $scrollDownElement = $(document.createElement('i'));
            $scrollUpElement.addClass('fa fa-angle-double-up fa-3x closet-dv-scroll-up closet-dv-scroll');
            $scrollDownElement.addClass('fa fa-angle-double-down fa-3x closet-dv-scroll-down closet-dv-scroll');
            $element.before($scrollUpElement);
            $element.after($scrollDownElement);
            this._bindHoverScrollerEvent($closedEditor);
        } else {
            $scrollUpElement = $closedEditor.find('.closet-dv-scroll-up');
            $scrollDownElement = $closedEditor.find('.closet-dv-scroll-down');
        }

        scrollElementHeight = $scrollUpElement.height();

        $scrollUpElement.css({
            'top': '50%',
            'margin-top': '-' + (halfElementHeight + scrollElementHeight) + 'px'
        });
        $scrollDownElement.css({
            'bottom': '50%',
            'margin-bottom': '-' + (halfElementHeight + scrollElementHeight) + 'px'
        });

        this._$scrollUpElement = $scrollUpElement;
        this._$scrollDownElement = $scrollDownElement;
    }

    /**
     * Scroll
     * @param {number} x
     * @param {number} y
     */
    setScroll(x, y) {
        this.$el.css('transform', 'translateX(-50%) translateY(' + y + 'px)');
        this._$scrollUpElement.css('transform', 'translateX(-50%) translateY(' + y + 'px)');
        this._$scrollDownElement.css('transform', 'translateX(-50%) translateY(' + y + 'px)');
    }

    /**
     * Bind scroller events
     * @param {jQuery} $closedEditor
     * @private
     */
    _bindHoverScrollerEvent($closedEditor) {
        $closedEditor
          .find('.closet-dv-scroll')
          .hover(this._onHoverStart.bind(this), this._onHoverStop.bind(this));
    }

	/**
	 * On hover start callback
	 * @param {Event} event
	 * @private
	 */
	_onHoverStart(event) {
		const $target = $(event.target),
			activeEditor = $target.closest('closet-design-editor')[0],
			position = activeEditor.getScrollerScroll();

		const project = $target.siblings('iframe')[0].contentDocument;

		const scrollViewClip = project.querySelector('.ui-content.ui-scrollview-clip');
		const scrollView = $target.siblings('iframe')[0].contentDocument.querySelector('.ui-scrollview-view');

		const scrollViewClipHeight = parseInt(window.getComputedStyle(scrollViewClip).height);
		const scrollViewScrollHeight = scrollView.scrollHeight;

		const maxScrollValue = scrollViewScrollHeight - scrollViewClipHeight;

		if ($target.hasClass('closet-dv-scroll-up') && position.y > 0) {
			activeEditor.setScrollerScroll(position.x, position.y - SCROLL_SPEED);
		} else if ($target.hasClass('closet-dv-scroll-down') && position.y < maxScrollValue) {
			activeEditor.setScrollerScroll(position.x, position.y + SCROLL_SPEED);
		}

		this._scrollKey = window.requestAnimationFrame(this._onHoverStart.bind(this, event));
	}

    /**
     * Stop hover callback
     * @private
     */
    _onHoverStop() {
        window.cancelAnimationFrame(this._scrollKey);
        this._scrollKey = null;
    }

    /**
     * Format text
     * @param {HTMLElement} src
     * @param {HTMLElement} dest
     * @private
     */
    _formatTextInput(src, dest) {
        var ratio = parseFloat(StateManager.get('screen', {}).ratio),
            $src = $(src),
            $dest = $(dest),
            stylesNameRegex = /^(color|border|padding|width|height|font|textAlign|overflow|lineHeight|display)/,
            prop = '',
            camel = '',
            i = 0,
            l = 0,
            style = window.getComputedStyle($src[0], null);

        for (i = 0, l = style.length; i < l; i += 1) {
            prop = style[i];
            camel = prop.replace(/-([a-z])/g, camelize);
            if (stylesNameRegex.test(camel) && ((camel === 'lineHeight' && style.display === 'block') || camel !== 'lineHeight')) {
                if (/px$/.test(style[camel])) {
                    $dest[0].style[camel] = (parseFloat(style[camel]) * ratio) + 'px';
                } else {
                    $dest[0].style[camel] = style[camel];
                }
            }
        }

        $dest.css({
            'position': 'absolute',
            'left': '0',
            'margin': '0',
            'display': 'block',
            'width': $src.parent().width() * ratio
        });

        if (style.textAlign === 'center') {
            $dest.css({
                'left': '50%',
                'transform': 'translateX(-50%)'
            });
        }
    }

    /**
     * Destroy callback
     */
    onDestroy() {
        this._layerWeakMap = null;
        this._highlightWeakMap = null;
        this.options = null;
    }

    /**
     * Remove child nodes which do not have data-id attribute
     * This indicates nodes that was created during widget building.
     * @param {jQuery} $element
     * @private
     */
    _removeBuildNodes($element) {
        var self = this,
            childNodes =  $element.children();

        childNodes.each((index, el) => {
            if (!el.getAttribute('data-id')) {
                el.outerHTML = el.innerHTML;
            }
            self._removeBuildNodes($(el));
        });
    }

    /**
     * Show edit input
     * @param {jQuery} $selectedLayerElement
     * @param {jQuery} $element
     */
    showEditInput($selectedLayerElement, $element) {
        var self = this,
            $input = $element.clone(),
            $toolsetLayer = self._$toolsetLayer,
            elementBoundingRect;

        $element.attr('data-closed-edit-mode', 1);

        $input.attr('contenteditable', 'true');
        self._removeBuildNodes($input);

        self._$inputElement = $input;
        self._$editedElement = $element;

        // append a clone of editable element to target
        $selectedLayerElement.append($input);

        self._selectionChange = self._onSelectionChange.bind(self);
        document.addEventListener('selectionchange', self._selectionChange);

        // create an instance of the observer of the editable element text content
        // and update the content of the selected element if changes occur
        self._editableElementMutationObserver = new MutationObserver((data) => {
            $element.html($input.html())
            elementBoundingRect = $element[0].getBoundingClientRect();

            $input.css({'width': Math.ceil(elementBoundingRect.width),
                        'height': Math.ceil(elementBoundingRect.height)});
        });

        // start observing changes (text insertions, deletions, cut/paste operations) of the editable element text content
        self._editableElementMutationObserver.observe($selectedLayerElement[0], {
            subtree: true,
            characterData: true
        });

        // append inline-text editor toolset
        $input.before($toolsetLayer);
        $input.addClass('native-key-bindings');

        self._formatTextInput($element, $input);

        // Click on the 'View HTML' button
        $toolsetLayer.on('click keydown change', (e) => {
            var $actionTarget = $(e.target).closest('[data-tag]'),
                command = $actionTarget.attr('data-tag'),
                value = null,
                $selected = $actionTarget,
                type = $actionTarget.attr('type');

            if (!type) {
                if ($actionTarget.length > 0) {
                    type = $actionTarget.prop('tagName').toLowerCase();
                }
            }

            if (type === 'select') {
                $selected = $actionTarget.find(':selected');
            }

            value = $selected.attr('data-value');

            if (!value) {
                value = $selected.val();
                if (!value) {
                    value = $selected.text();
                }
            }

            document.execCommand(command, true, value);

            e.stopPropagation();
        });

        $input.css({
            'top': 'initial'
        });
        $input.attr('data-closed-edit-mode', 1);

        $element.css('color', 'transparent');
        $element.find('*').css('visibility', 'hidden');
        this.options.designEditor
            .getModel()
            .lockHistory();

        $toolsetLayer.show();

        eventEmitter.emit(EVENTS.TextToolShowed);

        elementBoundingRect = $element[0].getBoundingClientRect();

        $input.css({'width': Math.ceil(elementBoundingRect.width),
                    'height': Math.ceil(elementBoundingRect.height)})
            .focus()
            .parent()
            .css('border-color', 'transparent');

        self._buttonElements = [...self.querySelectorAll('button[data-tag]')];
        self._fontSizeElement = self.querySelector('[data-tag="fontSize"]');
        self._fontNameElement = self.querySelector('[data-tag="fontName"]');
        self._fontColorElement = self.querySelector('[data-tag="foreColor"]');
    }

    /**
     * Converts decimal to hex
     * @param {string} value
     * @private
     */
    _decimalToHex(value) {
        var result = Number(value).toString(16);

        return result.length === 1 ? '0' + result : result;
    }

    /**
     * Converts rgb(r, g, b) format to hex
     * @param {string} value
     * @private
     */
    _rgbToHex(value) {
        var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/,
            match = matchColors.exec(value);

        if (match === null) {
            return value;
        } else {
            return "#" +
                this._decimalToHex(match[1]) +
                this._decimalToHex(match[2]) +
                this._decimalToHex(match[3]);
        }
    }

    /**
     * Creates array of range text nodes
     * @param {array} data
     * @param {array} result
     * @private
     */
    _createRangeNodesArray(data, result) {
        for (var node of data) {
            if (node.nodeType === 3) {
                result.push(node);
            } else {
                if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
                    result.push(node.childNodes[0]);
                } else {
                    this._createRangeNodesArray(node.childNodes, result);
                }
            }
        }
    }

    /**
     * Handles selectionchange event
     * @private
     */
    _onSelectionChange() {
        var self = this,
            isFontSizeConsistent = true,
            isFontNameConsistent = true,
            isFontColorConsistent = true,
            startEncountered = false,
            endEncountered = false,
            previousSize = null,
            previousName = null,
            previousColor = null,
            rangeNodes = [],
            selection = document.getSelection(),
            range = selection.getRangeAt(0);

        self._buttonElements.forEach((button) => {
            button.classList[
                document.queryCommandState(
                    button.getAttribute('data-tag')
                ) ? 'add' : 'remove'
            ]('active');
        });

        self._createRangeNodesArray(range.commonAncestorContainer.childNodes, rangeNodes);

        for (var node of rangeNodes) {

            // break if end container encountered
            if (endEncountered) {
                break;
            }

            // continue if start container is not encountered yet
            if (node !== range.startContainer && !startEncountered) {
                continue;
            }

            // if start container encountered update flag
            if (!startEncountered) {
                startEncountered = true;
            }

            // if end container encountered update flag
            if (node === range.endContainer) {
                endEncountered = true;
            }

            // iteration logic
            var parentNode = node.parentNode,
                styles = window.getComputedStyle(parentNode),
                currentSize = styles['font-size'],
                currentName = styles['font-family'],
                currentColor = styles['color'];

            if (previousSize && isFontSizeConsistent && previousSize != currentSize) {
                isFontSizeConsistent = false;
            }

            if (previousName && isFontNameConsistent && previousName != currentName) {
                isFontNameConsistent = false;
            }

            if (previousColor && isFontColorConsistent && previousColor != currentColor) {
                isFontColorConsistent = false;
            }

            previousSize = currentSize;
            previousName = currentName;
            previousColor = currentColor;
        }

        self._fontSizeElement.value = isFontSizeConsistent ? document.queryCommandValue('fontSize') : '';
        self._fontNameElement.value = isFontNameConsistent ? document.queryCommandValue('fontName').replace(/^"(.*)"$/, '$1') : '';
        self._fontColorElement.value = isFontColorConsistent ? self._rgbToHex(document.queryCommandValue('foreColor')) : '#000000';
    }

    /**
     * Add alt selector
     * @param {HTMLElement} element
     * @returns {*}
     */
    attachAlternativeSelector(element) {
        var $element,
            altSelector;

        if (!element) {
            return null;
        }

        $element = $(element);
        altSelector = new AlternativeSelectorElement();
        altSelector.render($element);
        altSelector.layout(this.options.screenRatio);
        this.$el.append(altSelector);

        this._altSelectorList.push(altSelector);

        return altSelector;
    }


    /**
     * Refresh alt selector
     */
    refreshAltSelectors() {
        var selector;
        while ((selector = this._altSelectorList.pop())) {
            selector.$el.remove();
        }
    }

    /**
     * Return selected element
     * @returns {jQuery|HTMLElement}
     */
    getSelectedElement() {
        console.log("select-layer-element:getSelectedElement");
        return $(this._selectedElement);
    }
}


const SelectLayerElement = document.registerElement('closet-select-layer', SelectLayer);

export {SelectLayerElement, SelectLayer};
