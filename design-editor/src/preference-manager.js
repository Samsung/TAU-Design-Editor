'use babel';

// Holds manager reference
let manager = null;

/**
 * Throws error in case no manager is registered.
 * @private
 */
function registerCheck() {
    if (!manager) {
        throw new Error('No PreferenceManager registered');
    }
}

/**
 *
 */
class PreferenceManager {
    /**
     * Constructor
      */
    constructor() {
        throw new Error('PreferenceManager class should not be instantialized!');
    }
     /**
     * Method to register preference manager based on current platform
     * @param {BracketsPreferenceManager|AtomPreferenceManager} preferenceClass
     */
    static register(preferenceClass) {
        if (typeof preferenceClass !== 'function') {
            console.error('You can only register function like objects (functions, classes)');
            return false;
        }

        if (manager) {
            console.error('PreferenceManager is already set. Registration of ' + (preferenceClass.constructor.name) + ' has failed');
            return false;
        }

        manager = preferenceClass;

        return true;
    }

    /**
     * Method to deregister preference manager
     */
    static deregister() {
        if (manager) {
            manager = null;
            return true;
        }

        return false;
    }


    /**
     * Gets preferences based on given group and key.
     * @param {string} group
     * @param {string} key
     * @returns {*}
     */
    static get(group, key) {
        registerCheck();
        return manager.get(group, key);
    }

    /**
     * Gets internal preferences based on given group and key.
     * @param {string} group
     * @param {string} key
     * @returns {*}
     */
    static getInternal(group, key) {
        registerCheck();
        return manager.get(group, key, {
            internal: true
        });
    }

    /**
     *
     * @param group
     * @param key
     * @param value
     * @param {object} options
     * @param {string} options.title
     * @param {string} options.description
     * @returns {*}
     */
    static setDefault(group, key, value, options) {
        registerCheck();
        if (!group) {
            console.warn('Preferences should not be set without groups');
        }
        return manager.setDefault(group, key, value, options);
    }

    /**
     *
     * @param group
     * @param key
     * @param value
     * @returns {*|boolean}
     */
    static setInternalDefault(group, key, value) {
        registerCheck();
        if (!group) {
            console.warn('Preferences should not be set without groups');
        }
        return manager.setDefault(group, key, value, {
            internal: true
        });
    }

    /**
     * Sets preferences based on given group and keys.
     * @param {string} group
     * @param {string} key
     * @param {*} value
     * @returns {*}
     */
    static set(group, key, value) {
        registerCheck();

        return manager.set(group, key, value);
    }

    /**
     * Sets internal preferences based on given group and keys.
     * @param {string} group
     * @param {string} key
     * @param {*} value
     * @returns {*}
     */
    static setInternal(group, key, value) {
        registerCheck();

        return manager.set(group, key, value, {
            internal: true
        });
    }

    /**
     *
     * @returns {*}
     * @private
     */
    static _getRegisteredClass() {
        return manager;
    }
}

export {PreferenceManager};
