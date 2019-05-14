/**
 * This module contains set of functions simulating Brackets API behaviour,
 * which is non existent while Design Editor is used
 * as Visual Studio Code extension.
 *
 * @todo implement ProjectManager module methods
 * (http://suprem.sec.samsung.net/jira/browse/TIZENWF-2011)
 */
module.exports = class ProjectManager {
    /**
     * Refresh the project's file tree, maintaining the current selection.
     *
     * Note that the original implementation of this returned
     * a promise to be resolved when the refresh is complete.
     * That use is deprecated and `refreshFileTree` is now
     * a "fire and forget" kind of function.
     */
    static refreshFileTree() {}

    /**
     * Returns the root folder of the currently loaded project,
     * or null if no project is open (during
     * startup, or running outside of app shell).
     * @return {Directory}
     */
    static getProjectRoot() {
        return {fullPath: window.globalData.basePath};
    }

    /**
     * Returns an Array of all files for this project, optionally including
     * files in the working set that are *not* under the project root. Files are
     * filtered first by ProjectModel.shouldShow(), then by the custom filter
     * argument (if one was provided).
     *
     * @param {function (File, number):boolean=} filter
     *      Optional function to filter
     *          the file list (does not filter directory traversal).
     *          API matches Array.filter().
     * @param {boolean=} includeWorkingSet If true,
     *          include files in the working set
     *          that are not under the project root
     *          (*except* for untitled documents).
     * @param {boolean=} sort If true, The files will be sorted by their paths
     *
     * @return {$.Promise} Promise that is resolved with
     *          an Array of File objects.
     */
    static getAllFiles(filter, includeWorkingSet, sort) {
        return fetch('/get-all')
            .then(res => res.json())
            .catch((err) => {
                throw err;
            });
    }
};
