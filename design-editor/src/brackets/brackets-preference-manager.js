'use babel';

import {PreferenceManager} from '../preference-manager';

const PACKAGE_NAME = 'Closet';
const brackets = window.brackets || window.top.brackets;
const EditorPreferencesManager = brackets.getModule('preferences/PreferencesManager');
const EditorPreferenceBase = brackets.getModule('preferences/PreferencesBase');
const EditorPreferenceScope = EditorPreferenceBase.Scope;
const EditorPreferenceFileStorage = EditorPreferenceBase.FileStorage;

class BracketsPreferenceManager {
    /**
     * Costructor
     */
    constructor() {
        throw new Error('This class should not be instantialized!');
    }

    /**
     * Init
     */
    static initialize() {
        PreferenceManager.register(BracketsPreferenceManager);

        // Define internal scope for preferences
        // this will save an additional internal.SETTINGS_FILENAME file near brackets.json
        // This way part of the preferences won't be mixed with others
        EditorPreferencesManager.addScope('internal', new EditorPreferenceScope(new EditorPreferenceFileStorage(
            brackets.app.getApplicationSupportDirectory() + '/internal.' + EditorPreferencesManager.SETTINGS_FILENAME,
            true, // Create if doesn't exist
            true  // Recreate if invalid
        )));

    }

    /**
     * Get value
     * @param {string} group
     * @param {string} key
     * @param {Object} options
     * @returns {*}
     */
    static get(group, key, options) {
        const _group = EditorPreferencesManager.getExtensionPrefs(PACKAGE_NAME);
        const internal = options && options.internal;
        const preference = _group.get(group + '.' + key);

        // Avoid exposing internal preferences by normal API
        if (!internal && preference && _group.getPreferenceLocation(group + '.' + key).scope === 'internal') {
            return undefined;
        }

        return preference;
    }

    /**
     * Set default value
     * @param {string} group
     * @param {string} key
     * @param {Object} value
     * @param {Object} options
     * @returns {boolean}
     */
    static setDefault(group, key, value, options) {
        const _group = EditorPreferencesManager.getExtensionPrefs(PACKAGE_NAME),
            internal = options && options.internal,
            prefOptions = {
                name: (options && options.title) || undefined,
                description: (options && options.description) || undefined,
                excludeFromHints: options && options.internal
            };

        try {
            if (internal) {
                _group.set(group + '.' + key, value, {
                    location: {
                        scope: 'internal'
                    }
                }, false);
            } else {
                _group.definePreference(group + '.' + key, typeof value, value, prefOptions);
            }
        } catch (e) {
            // In case default value is already set we don't wont to
            // expose the exception
            if (e.message.indexOf('was redefined') > -1) {
                return false;
            }

            // In case other exception appears it's rethrown
            throw e;
        }

        return true;
    }

    /**
     * Set value
     * @param {string} group
     * @param {string} key
     * @param {Object} value
     * @param {Object} options
     * @returns {boolean}
     */
    static set(group, key, value, options) {
        const _group = EditorPreferencesManager.getExtensionPrefs(PACKAGE_NAME),
            internal = options && options.internal;

        // For internal preferences we do not set the default values
        // to avoid listing them in knownPrefs (.getAllPreferences()).
        // In brackets properties need to be first setDefault to later
        // properly use them. This condition is used to keep consistent behavior
        if (!internal && _group.get(group + '.' + key) === undefined) {
            return BracketsPreferenceManager.setDefault(group, key, value, options);
        }

        if (internal) {
            _group.set(group + '.' + key, value, {
                location: {
                    scope: 'internal'
                }
            }, false);
        } else {
            _group.set(group + '.' + key, value, null, false);
        }

        return true;
    }

    static deinitialize() {
        return PreferenceManager.deregister();
    }

    // @TODO consider adding other methods from brackets Preference Manager like validation, hints etc.
}

export {BracketsPreferenceManager};
