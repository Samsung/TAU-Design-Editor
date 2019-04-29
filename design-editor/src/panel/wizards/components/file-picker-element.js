'use babel';

import $ from 'jquery';
import editor from '../../../editor';
import utils from '../../../utils/utils';

var remote;
var dialog;
var BrowserWindow;
var BracketsProjectManager;
var brackets = utils.checkGlobalContext('brackets');

var classes = {
    BLOCK: 'block',
    DEFAULT_FILE_EXPLORER_WRAPPER: 'closet-file-picker',
    DEFAULT_FILE_EXPLORER_TEXT: 'closet-file-picker-text'
};

BracketsProjectManager = brackets.getModule('project/ProjectManager');


/**
 * Get all directories from project
 * @param {function} onSuccess - success callback
 */
function getDirectories(onSuccess = () => {} ) {
    BracketsProjectManager
    .getAllFiles()
    .then((files) => {
        const directories = files
            .map(file => file.parentPath)
            .filter((dir, index, array) => { // remove duplicates
                return array.indexOf(dir) == index;
            })
            .sort((a, b) => {
                const slashPattern = new RegExp(/\//, 'g');
                return (a.match(slashPattern) || [] ).length - (b.match(slashPattern) || [] ).length;
            });

        onSuccess(directories);

    })
    .catch((err) => {
        throw err;
    });
}

/**
 *
 */
class FilePicker extends HTMLDivElement {
    /**
     * Create callback
     */
    createdCallback() {
        this._initialize();
        this.options = {
            path: ''
        };
        this.addEventListener('click', (event) => {
            this.onClick(event);
        });
    }

    /**
     * attached callback
     */
    attachedCallback() {
        this._setDefaultContents();
    }

    /**
     * On click callback
     */
    onClick() {
        console.log('onClick');
    }

    /**
     * Init
     * @private
     */
    _initialize() {
        this._textElement = null;
        $(this).addClass(classes.BLOCK);
        this._setElement();
    }

    /**
     * Set element
     * @private
     */
    _setElement() {
        var $textElement,
            self = this,
            option;

        self._selectPath = document.createElement('select');
        self._selectPath.addEventListener('change', () => {
            self._customPath.value = self._selectPath.value;
            self.path = self._customPath.value;
        });
        self._customPath = document.createElement('input');
        self._customPath.addEventListener('change', () => {
            self._selectPath.value = self._customPath.value;
            self.path = self._customPath.value;
        });
        // fill select
        $(self).append(self._selectPath);
        $(self).append(self._customPath);

        getDirectories((directories) => {
            directories.forEach((dir) => {
                option = document.createElement('option');
                option.value = dir;
                option.innerText = dir;
                self._selectPath.appendChild(option);
            });
        });
    }

    /**
     * Set default content
     * @private
     */
    _setDefaultContents() {
        this.setPath(this.options.path);
    }

    /**
     * set path
     * @param {string} path
     */
    setPath(path) {
        this.options.path = path;

        this._selectPath.value = path;
        this._customPath.value = path;
    }
}

const FilePickerElement = document.registerElement('closet-file-picker', FilePicker);

export {FilePickerElement, FilePicker};
