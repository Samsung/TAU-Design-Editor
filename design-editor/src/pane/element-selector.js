'use babel';

import {EVENTS, eventEmitter} from '../events-emitter';

class ElementSelector {
    /**
     * Constructor
     */
    constructor() {
        this._curSelectedId = null;
    }

    /**
     * select element
     * @param {string} elementId
     */
    select(elementId) {
        console.log("select", elementId);
        if (this._curSelectedId && elementId !== this._curSelectedId) {
            this.unSelect();
        }

        if (!this._curSelectedId) {
            this._curSelectedId = elementId;
            eventEmitter.emit(EVENTS.ElementSelected, elementId);
        }
    }

    /**
     * Unselect element
     * @returns {boolean}
     */
    unSelect() {
        console.log("unselect", this._curSelectedId);
        if (this._curSelectedId) {
            eventEmitter.emit(EVENTS.ElementDeselected, this._curSelectedId);
            this._curSelectedId = null;
            return true;
        }
        return false;
    }

    /**
     * Get id of selected element
     * @returns {null|*}
     */
    getSelectedElementId() {
        return this._curSelectedId;
    }
}

const elementSelector = new ElementSelector();

export {elementSelector};
