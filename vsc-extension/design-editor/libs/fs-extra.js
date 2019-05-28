const utils = require('../../../design-editor/src/utils/utils').default;
const path = require('path');

const fsEndpoint = utils.urlJoin(window.location.origin, 'fs');
const fileEndpoint = utils.urlJoin(fsEndpoint, 'file');
const dirEndpoint = utils.urlJoin(fsEndpoint, 'dir');

/**
 * Helper function handling http requests
 *
 * @param {string} url
 * @param {object} options
 * @param {string} type json | text
 */
function __fetchHelper(url, options, type, callback) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': type === 'text' ? 'text/html' : 'application/json'
    };

	if (options['Content-Type'] !== undefined) {
		headers['Content-Type'] = options['Content-Type'];
		delete options['Content-Type'];
	}

    return fetch(url, Object.assign({headers}, options))
        .then(response => callback && (type === 'text' ? response.text() : response.json()))
        .then(content => callback && callback(undefined, content))
        .catch(err => callback && callback(err, undefined));
}

/**
 * Reads data from file specified by name.
 * Triggers callback afterwards.
 *
 * @param {String} path path starting from the project root
 * @param {String} encoding
 * @param {Function} callback
 */
function readFile(path, encoding, callback) {
    __fetchHelper(path, {}, 'text', callback);
}

/**
 * Deletes file from disc.
 *
 * @param {String} path path starting from the project root
 * @param {Function} callback
 */
function deleteFile(path, callback) {
    const options = {
        method: 'DELETE'
    };

    __fetchHelper(utils.urlJoin(fileEndpoint, path), options, 'json', callback);
}

/**
 * Checks if directory specified by name exists.
 * Triggers callback afterwards.
 *
 * @param {String} path path starting from the project root
 * @param {Function} callback
 */
function existsDir(path, callback) {
    __fetchHelper(
        utils.urlJoin(dirEndpoint, path),
        {},
        'json',
        callback
    );
}

/**
 * Creates new direcotry specified by dirName.
 * Triggers callback afterwards.
 *
 * @param {String} path path starting from the project root
 * @param {Function} callback
 */
function makeDir(path, callback) {
    const options = {
        method: 'POST',
        body: JSON.stringify({dirName: path})
    };

    __fetchHelper(dirEndpoint, options, 'text', callback);
}

/**
 * Writes data to file specified via name argument.
 * Triggers callback afterwards.
 *
 * @param {String} path path starting from the project root
 * @param {Object} data
 * @param {Function} callback
 */
function writeFile(path, data, callback) {
    const options = {
        method: 'POST',
		body: data,
		'Content-Type': checkFileExt(path)
    };

    __fetchHelper(fileEndpoint, options, 'text', callback);
}

/**
 * Returns extension of the file which should be send on a server
 *
 * @param {String} path given path
 */

function checkFileExt(filePath) {
	const pathExt = path.extname(filePath);
	switch (pathExt) {
	case '.css':
		return 'text/css';
	case '.html':
		return 'text/html';
	case '.js':
		return 'text/javascript';
	case '.jpeg':
	case '.jpg':
		return 'image/jpeg';
	case '.gif':
		return 'image/gif';
	case '.png':
		return 'image/png';
	case '.tiff':
		return 'image/tiff';
	case '.svg':
		return 'image/svg+xml';
	case '.aac':
		return 'audio/aac';
	case '.mp3':
		return 'audio/mpeg';
	case '.oga':
		return 'audio/ogg';
	case '.wav':
		return 'audio/wav';
	case '.avi':
		return 'video/x-msvideo';
	case '.mpeg':
		return 'video/mpeg';
	case '.ogv':
		return 'video/ogg';
	case '.3gp':
		return 'video/3gpp';
	case '.json':
		return 'application/json';
	default:
		return 'text/plain';
	}
}

/**
 * Checks if file specified in name exists,
 * triggers callback afterwards.
 *
 * @param {String} path path starting from the project root
 * @param {Function} callback
 */
function exists(path, callback) {
    __fetchHelper(utils.urlJoin(fileEndpoint, path), {}, 'json', callback);
}

/**
 * Copies a file
 *
 * @param {String} srcPath path starting from the project root
 * @param {String} destPath path starting from the project root
 * @param {Function} callback
 */
function copy(srcPath, destPath, callback) {
    const options = {
        method: 'POST',
        body: JSON.stringify({src: srcPath, dest: destPath})
    };

    __fetchHelper(utils.urlJoin(fileEndpoint, 'copy'), options, 'text', callback);
}

/**
 * Reads directory specified via URL parameter,
 * triggers callback afterwards
 *
 * @param {String} URL
 * @param {Function} callback
 */
function readDir(URL, callback) {
    __fetchHelper(URL, {}, 'json', callback);
}

module.exports = {
    readFile,
    writeFile,
    makeDir,
    existsDir,
    exists,
    copy,
    readdir: readDir,
    deleteFile
};
