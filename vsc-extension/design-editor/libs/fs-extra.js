const utils = require('../../../design-editor/src/utils/utils').default;

const fsEndpoint = utils.urlJoin(window.location.origin, 'fs');
const fileEndpoint = utils.urlJoin(fsEndpoint, 'file');
const dirEndpoint = utils.urlJoin(fsEndpoint, 'dir');

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

/**
 *
 * @param {string} url
 * @param {object} options
 * @param {string} type json | text
 */
function fetchHelper(url, options, type, callback) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': type === 'text' ? 'text/html' : 'application/json'
    };

    return fetch(url, Object.assign({headers}, options))
        .then(response => (type === 'text' ? response.text() : response.json()))
        .then(content => callback(undefined, content))
        .catch(err => callback(err, undefined));
}

/**
 * Reads data from file specified by name.
 * Triggers callback afterwards.
 *
 * @param {String} name
 * @param {String} encoding
 * @param {Function} callback
 */
function readFile(name, encoding, callback) {
    fetchHelper(name, {}, 'text', callback);
}

/**
 * Checks if directory specified by name exists.
 * Triggers callback afterwards.
 *
 * @param {String} name
 * @param {Function} callback
 */
function existsDir(name, callback) {
    fetchHelper(
        utils.urlJoin(dirEndpoint, name),
        {},
        'json',
        callback
    );
}

/**
 * Creates new direcotry specified by dirName.
 * Triggers callback afterwards.
 *
 * @param {String} dirName
 * @param {Function} callback
 */
function makeDir(dirName, callback) {
    const options = {
        method: 'POST',
        body: JSON.stringify({dirName})
    };

    fetchHelper(dirEndpoint, options, 'text', callback);
}

/**
 * Writes data to file specified via name argument.
 * Triggers callback afterwards.
 *
 * @param {String} name
 * @param {Object} data
 * @param {Function} callback
 */
function writeFile(name, data, callback) {
    const options = {
        method: 'POST',
        body: JSON.stringify({name, data})
    };

    fetchHelper(fileEndpoint, options, 'text', callback);
}

/**
 * Checks if file specified in name exists,
 * triggers callback afterwards.
 *
 * @param {String} name
 * @param {Function} callback
 */
function exists(name, callback) {
    fetchHelper(utils.urlJoin(fileEndpoint, name), {}, 'json', callback);
}

/**
 * Copies a file
 *
 * @param {String} src
 * @param {String} dest
 * @param {Function} callback
 */
function copy(src, dest, callback) {
    const options = {
        method: 'POST',
        body: JSON.stringify({src, dest})
    };

    fetchHelper(utils.urlJoin(fileEndpoint, 'copy'), options, 'text', callback);
}

/**
 * Reads directory specified via URL parameter,
 * triggers callback afterwards
 *
 * @param {String} URL
 * @param {Function} callback
 */
function readDir(URL, callback) {
    fetchHelper(URL, {}, 'json', callback);
}

module.exports = {
    readFile,
    writeFile,
    makeDir,
    existsDir,
    exists,
    copy,
    readdir: readDir
};
