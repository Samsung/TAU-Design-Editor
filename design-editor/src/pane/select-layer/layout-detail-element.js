'use babel';

import $ from 'jquery';
import {StateManager} from '../../system/state-manager';
import {DressElement} from '../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../events-emitter';

const States = StateManager.States;

class LayoutDetail extends DressElement {
    /**
     * create callback
     */
    onCreated() {
        this._toggle = false;
    }

    /**
     * Init
     * @private
     */
    _init() {
        this._setDisplay();
    }

    /**
     * set display
     * @private
     */
    _setDisplay() {
        this._toggle = StateManager.get(States.LayoutDetailToggle);

        if (this._toggle) {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Bind events
     * @private
     */
    _bindEvents() {
        eventEmitter.on(EVENTS.ToggleDesignAndCodeView, this._onToggleDesignAndCodeView.bind(this));
        eventEmitter.on(EVENTS.ToggleLayoutDetail, this._onToggleLayoutDetail.bind(this));
    }

    /**
     * On change editor type
     * @private
     */
    _onToggleDesignAndCodeView() {
        this._init();
    }

    /**
     * On toogle layout details
     * @private
     */
    _onToggleLayoutDetail() {
        this._setDisplay();
    }

    /**
     * Set Layout details state
     * @param {HTMLElement} targetElement
     * @param {jQuery} $selectedElement
     */
    setLayoutDetail(targetElement, $selectedElement) {
        console.log("setLayoutDetail", targetElement, $selectedElement);
        if (this._toggle) {
            const $targetElement = $(targetElement),
                ratio = StateManager.get('screen', {}).ratio,
                styles = this._getDetailLayoutInfo($targetElement);
            this._createElements();
            this.$el.css({
                top: parseFloat($selectedElement.css('top')) - styles.marginTop,
                left: parseFloat($selectedElement.css('left')) - styles.marginLeft,
                width: $targetElement.outerWidth(true) * ratio,
                height: $targetElement.outerHeight(true) * ratio
            });
            this._setLayout(styles);
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Set layout
     * @param {Object} styles
     * @private
     */
    _setLayout(styles) {
        var tempWidth = 0,
            tempHeight = 0,
            elements = this._$elements;

        elements.layoutElement.css({
            width: styles.width,
            height: styles.height,
            top: styles.marginTop + styles.borderTop + styles.paddingTop,
            left: styles.marginLeft + styles.borderLeft + styles.paddingLeft
        });

        tempWidth = styles.width + styles.paddingLeft + styles.paddingRight;
        tempHeight = styles.height + styles.paddingTop + styles.paddingBottom;
        elements.paddingElement.css({
            top: styles.marginTop + styles.borderTop,
            left: styles.marginLeft + styles.borderLeft,
            width: tempWidth,
            height: tempHeight,
            borderTopWidth: styles.paddingTop,
            borderLeftWidth: styles.paddingLeft,
            borderBottomWidth: styles.paddingBottom,
            borderRightWidth: styles.paddingRight
        });

        tempWidth += styles.borderLeft + styles.borderRight;
        tempHeight += styles.borderTop + styles.borderBottom;
        elements.borderElement.css({
            top: styles.marginTop,
            left: styles.marginLeft,
            width: tempWidth,
            height: tempHeight,
            borderTopWidth: styles.borderTop,
            borderLeftWidth: styles.borderLeft,
            borderBottomWidth: styles.borderBottom,
            borderRightWidth: styles.borderRight
        });

        tempWidth += styles.marginLeft + styles.marginRight;
        tempHeight += styles.marginTop + styles.marginBottom;
        elements.marginElement.css({
            width: tempWidth,
            height: tempHeight,
            borderTopWidth: styles.marginTop,
            borderLeftWidth: styles.marginLeft,
            borderBottomWidth: styles.marginBottom,
            borderRightWidth: styles.marginRight
        });
    }

    /**
     * Set details info
     * @param {HTMLElement} $element
     * @returns {*}
     * @private
     */
    _getDetailLayoutInfo($element) {
        var styles = null,
            ratio = StateManager.get('screen', {}).ratio;

        styles = {
            width: $element.width() * ratio,
            height: $element.height() * ratio,
            paddingTop: parseFloat($element.css('paddingTop')) * ratio,
            paddingLeft: parseFloat($element.css('paddingLeft')) * ratio,
            paddingBottom: parseFloat($element.css('paddingBottom')) * ratio,
            paddingRight: parseFloat($element.css('paddingRight')) * ratio,
            borderTop: parseFloat($element.css('borderTopWidth')) * ratio,
            borderLeft: parseFloat($element.css('borderLeftWidth')) * ratio,
            borderBottom: parseFloat($element.css('borderBottomWidth')) * ratio,
            borderRight: parseFloat($element.css('borderRightWidth')) * ratio,
            marginTop: parseFloat($element.css('marginTop')) * ratio,
            marginLeft: parseFloat($element.css('marginLeft')) * ratio,
            marginBottom: parseFloat($element.css('marginBottom')) * ratio,
            marginRight: parseFloat($element.css('marginRight')) * ratio
        };

        return styles;
    }

    /**
     * Build element
     * @private
     */
    _createElements() {
        if (!this._created) {
            const $wrapper = $(document.createElement('div')).addClass('closet-layout-detail-element-wrapper'),
                $elementLayout = $(document.createElement('div')).addClass('closet-layout-detail-element closet-layout-detail-element-layout'),
                $elementPadding = $(document.createElement('div')).addClass('closet-layout-detail-element closet-layout-detail-element-padding'),
                $elementMargin = $(document.createElement('div')).addClass('closet-layout-detail-element closet-layout-detail-element-margin'),
                $elementBorder = $(document.createElement('div')).addClass('closet-layout-detail-element closet-layout-detail-element-border');

            $wrapper.append($elementLayout).append($elementPadding).append($elementMargin).append($elementBorder);
            this.$el.append($wrapper);
            this._created = true;

            this._$elements = {
                layoutElement: $elementLayout,
                paddingElement: $elementPadding,
                marginElement: $elementMargin,
                borderElement: $elementBorder
            };
        }
    }

    /**
     * Show
     */
    show() {
        this.$el.css('display', 'block');
    }

    /**
     * Hide
     */
    hide() {
        this.$el.css('display', 'none');
    }
}

customElements.define('closet-element-layout-detail', LayoutDetail);

export {LayoutDetail};
