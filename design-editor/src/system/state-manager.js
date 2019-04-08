'use babel';

// object manage state of application, states are saved on atom close, and are automatically restores on start
import {EVENTS, eventEmitter} from '../events-emitter';

/**
 * Clone
 * @param obj
 * @returns {*}
 */
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (Array.isArray(obj)) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i += 1) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        Object.keys(obj).forEach((attr) => {
            copy[attr] = clone(obj[attr]);
        });
        return copy;
    }

    throw new Error('Unable to copy obj! Its type isn\'t supported.');
}

const statesDefinition = {
    UseExistingWindow: 'project-manager:useExistingWindow',
    LayoutDetailToggle: 'layout-detail:layoutDetailToggle'
};

let states = {};
const StateManager = {
    States: statesDefinition,
    /**
     * Set value in states
     * @param {string} key
     * @param {*} value
     * @return {Object}
     */
    set: function (key, value) {
        states[key] = clone(value);
        eventEmitter.emit(EVENTS.EditorConfigChanged, key, states[key]);
        return states[key];
    },
    /**
     * Get value from states or is is undefined then return default value
     * @param {string} key
     * @param {*} [defaultValue]
     * @returns {*}
     */
    get: function (key, defaultValue) {
        var state = clone(states[key]);
        if (state === undefined) {
            return defaultValue;
        }
        return state;
    },
    /**
     * Init states values
     * @param {Object} oldStates
     */
    init: function (oldStates) {
        states = oldStates;
    },
    /**
     * Return current states values
     * @returns {Object}
     */
    serialize: function () {
        return states;
    }
};

export {StateManager};
