'use babel';

import $ from 'jquery';
import {DressElement} from '../utils/dress-element';
import {EVENTS, eventEmitter} from '../events-emitter';

class Popup extends DressElement {
    /**
     * Constructor
     */
    constructor() {
        super();
        this._isSelected = false;
    }

    /**
     * Create callback
     */
    onCreated() {
        this._bindEditorEvents();
    }

    /**
     * Bind events callback
     * @private
     */
    _bindEditorEvents() {
        eventEmitter.on(EVENTS.ActiveEditorUpdated, this._onActiveEditorUpdated.bind(this));
        eventEmitter.on(EVENTS.ElementSelected, this._onElementSelected.bind(this));
    }

    /**
     * Opens popup given as parameter.
     * Attaches a handler of the popupshow event to notify when the popup is open.
     * @param {HTMLElement} popup
     * @param {object} selectedElementInfo
     * @private
     */
    _openPopupAndNotify(popup, selectedElementInfo) {
        if (!popup) {
            return;
        }

        $(popup).one('popupshow', () => {
            eventEmitter.emit(EVENTS.PopupOpened, selectedElementInfo.element);
        });
        this._tau.openPopup(popup, {transition: 'none'});
    }

    /**
     * Element selected callback
     * @param {string} elementId
     * @private
     */
    _onElementSelected(elementId) {
        var self = this,
            elementInfo;

        if (self._designView) {
            self._tau = self._designView.getDesignViewIframe()[0].contentWindow.tau;
            elementInfo = self._designView.getUIInfo(self._designView._getElementById(elementId));

            if (elementInfo && elementInfo.package.name === "popup" && !self._isPopupActive(elementInfo.$element)) {
                // show selected popup because popup element has been selected
                self._isSelected = true;
                self._openPopupAndNotify(elementInfo.element, elementInfo);
            } else if (elementInfo && elementInfo.$element.parents('.ui-popup').length == 0 &&
                    elementInfo.package.name !== "popup" && self._isSelected) {
                // close popup because other element has been selected
                self._isSelected = false;
                self._tau.closePopup();
            } else if (elementInfo && self._isChildsPopup(elementInfo.$element) &&
                    !self._isChildsPopupActive(elementInfo.$element)) {
                // open popup because one of its child element has been selected
                self._isSelected = true;
                self._openPopupAndNotify(elementInfo.$element.parents('.ui-popup')[0], elementInfo);
            }
        }
    }

    /**
     * Active editor update callback
     * @param type
     * @param editor
     * @private
     */
    _onActiveEditorUpdated(type, editor) {
        this._designView = editor;
    }

    /**
     * Returns true if passed argument is a popup.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    _isPopup(element) {
        return $(element).hasClass('ui-popup');
    }

    /**
     * Returns true if passed argument is a popup and it is active.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    _isPopupActive(element) {
        return $(element).hasClass('ui-popup-active');
    }

    /**
     * Returns true if passed argument is a popup's child.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    _isChildsPopup(element) {
        return $(element).parents('.ui-popup').length == 1;
    }

    /**
     * Returns true if passed argument is a popup's child and the popup is active.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    _isChildsPopupActive(element) {
        return $(element).parents('.ui-popup').first().hasClass('ui-popup-active');
    }

    /**
     * Returns true if passed argument is a popup or its child.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @public
     */
    isPopup(element) {
        return this._isPopup(element) || this._isChildsPopup(element);
    }

    /**
     * Returns true if passed argument is a popup or its child and the popup is active.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @public
     */
    isPopupActive(element) {
        return this._isPopupActive(element) || this._isChildsPopupActive(element);
    }
}

const PopupElement = document.registerElement('closet-popup-element', Popup);

export {PopupElement, Popup};
