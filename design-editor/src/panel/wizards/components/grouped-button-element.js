'use babel';

import $ from 'jquery';

var classes = {
    GROUPED_BUTTON_DEFAULT_CLASS: 'closet-grouped-button',
    GROUPED_BUTTON_ITEM_DEFAULT_CLASS: 'closet-grouped-button-item'
};

/**
 *
 */
class GruppedButton extends HTMLDivElement {
    /**
     * Create callback
     */
    createdCallback() {
        this._initialize();
        this.options = {
            selectedIndex: 0
        };
    }

    /**
     * Attach callback
     */
    attachedCallback() {
        this._setDefaultContents();
        this._bindDefaultEvent();
    }

    /**
     * Init
     * @private
     */
    _initialize() {
        this._$buttons = [];
        this._$selectedItem = null;
        $(this).addClass(classes.GROUPED_BUTTON_DEFAULT_CLASS);
    }

    /**
     * Create button
     * @param {string} text
     * @returns {jQuery|HTMLElement}
     * @private
     */
    _createButton(text) {
        var $element = $(document.createElement('button'));
        $element.addClass(classes.GROUPED_BUTTON_ITEM_DEFAULT_CLASS);

        this._setText($element, text);

        return $element;
    }

    /**
     * Set text
     * @param {jQuery} $button
     * @param {string} text
     * @private
     */
    _setText($button, text) {
        if (typeof text !== 'string') {
            throw new Error('Second Argument(text) is must be string type.');
        }

        $button.text(text);
    }

    /**
     * Deselect selected item
     * @private
     */
    _deselectSelectedItem() {
        if (this._$selectedItem) {
            this._$selectedItem.removeClass('selected');
        }
    }

    /**
     * Change selected item
     * @param {number} itemIndex
     * @private
     */
    _changeSelectedItem(itemIndex) {
        this._deselectSelectedItem();
        this._$selectedItem = this._getButton(itemIndex).addClass('selected');
    }

    /**
     * Get button
     * @param {number} itemIdx
     * @returns {*}
     * @private
     */
    _getButton(itemIdx) {
        if (typeof itemIdx === 'number') {
            return this._$buttons[itemIdx];
        }
        throw new Error('_getButton need Number type argument.');
    }

    /**
     * Get button index
     * @param {HTMLElement|jQuery} $item
     * @returns {*|jQuery}
     * @private
     */
    _getButtonIndex($item) {
        if ($item instanceof HTMLElement) {
            $item = $($item);
        }

        return $(this).find('.' + classes.GROUPED_BUTTON_ITEM_DEFAULT_CLASS).index($item);
    }

    /**
     * Bind default events
     * @private
     */
    _bindDefaultEvent() {
        var self = this;
        $(this).on('click', (e) => {
            self.selectedIndex = self._getButtonIndex(e.target);
        });
    }

    /**
     * Set default content
     * @private
     */
    _setDefaultContents() {
        var buttons = $(this).find('.' + classes.GROUPED_BUTTON_ITEM_DEFAULT_CLASS),
            i, length;

        length = buttons.length;
        for (i = 0; i < length; i += 1) {
            this._$buttons.push($(buttons[i]));
        }

        this.setSelectedIndex(this.options.selectedIndex);
    }

    /**
     * Get buttons
     * @returns {Array}
     */
    getButtons() {
        return this._$buttons;
    }

    /**
     * set selected index
     * @param {number} itemIdx
     */
    setSelectedIndex(itemIdx) {
        this.options.selectedIndex = itemIdx;
        this._changeSelectedItem(parseInt(itemIdx, 10));
    }

    /**
     * get selected button
     * @returns {*}
     */
    getSelectedButton() {
        return this._$buttons[this.options.selectedIndex];
    }
}

const GruppedButtonElement = document.registerElement('closet-grouped-button', GruppedButton);

export {GruppedButtonElement, GruppedButton};
