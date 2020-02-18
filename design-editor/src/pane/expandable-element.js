'use babel';

import $ from 'jquery';
import {DressElement} from '../utils/dress-element';
import {EVENTS, eventEmitter} from '../events-emitter';

class Expandable extends DressElement {
    /**
     * Constructor
     */
    constructor() {
        super();
        this._expandedElement = null;
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
    }

    /**
     * Element selected callback
     * @param {string} elementId
     * @private
     */
    _onElementSelected(elementId) {
        const self = this;
        let expandableElement,
            elementToCollapse,
            elementInfo;

        self._tau = self._designView.getDesignViewIframe()[0].contentWindow.tau;
        elementInfo = self._designView.getUIInfo(self._designView._getElementById(elementId));

        if (elementInfo) {
            expandableElement = self._getExpandableAncestor(elementInfo.element);
            if (expandableElement !== self._expandedElement) {
                if (self._expandedElement) {
                    elementToCollapse = self._expandedElement;
                    while (elementToCollapse && !elementToCollapse.contains(expandableElement)) {
                        self._tau.event.trigger(elementToCollapse, "collapse");
                        elementToCollapse = elementToCollapse.parentElement.closest(".ui-expandable");
                    }
                }
                if (expandableElement) {
                    self._tau.event.trigger(expandableElement, "expand");
                }
                self._expandedElement = expandableElement;
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
        eventEmitter.on(EVENTS.ElementSelected, this._onElementSelected.bind(this));
    }

    /**
     * Returns true if passed argument is expandable.
     * @param {HTMLElement} element
     * @returns {boolean}
     * @private
     */
    _isExpandable(element) {
        return $(element).hasClass("ui-expandable");
    }

    /**
     * Returns expandable ancestor element, if not found returns null.
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     * @private
     */
    _getExpandableAncestor(element) {
        return element.closest(".ui-expandable");
    }

}

customElements.define('closet-expandable-element', Expandable);

export {Expandable};
