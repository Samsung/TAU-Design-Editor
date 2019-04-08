'use babel';

import {PreferenceManager} from '../preference-manager';

class VSCPreferenceManager {

	/**
     * Constructor
     */
    constructor() {
        throw new Error('This class should not be instantialized!');
    }

	/**
     * Init
     * @returns {*}
     */
    static initialize() {
        return PreferenceManager.register(VSCPreferenceManager);
    }

    static get() {
    }
}

export {VSCPreferenceManager};