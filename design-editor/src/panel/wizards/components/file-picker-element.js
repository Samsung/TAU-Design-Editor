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

if (window.atom) {
    remote = require('remote');

    dialog = (remote && remote.require && remote.require('dialog')) || null;
    BrowserWindow = (remote && remote.require && remote.require('browser-window')) || null;
}

if (!window.atom && brackets) {
    BracketsProjectManager = brackets.getModule('project/ProjectManager');
}

// brackets
/**
 * Get directions
 * @param {Function} onSuccess
 * @returns {boolean|*}
 */
function getDirectories(onSuccess) {
    var promise = BracketsProjectManager.getAllFiles();

    promise.done((files) => {
        var previous = '',
            directories = files.map(file => file.parentPath).filter((dir) => { // remove duplicates
                var result = previous !== dir;
                previous = dir;
                return result;
            });
        if (typeof onSuccess === 'function') {
            onSuccess(directories);
        }
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
     * On click in atom callback
     * @private
     */
    _atomOnClick() {
        var self = this,
            parentWindow = process.platform === 'darwin' ?
                null :
                BrowserWindow.getFocusedWindow(),
            $blind = $(document.createElement('div')).css({
                position: 'absolute',
                width: '200%',
                height: '200%',
                left: 0,
                top: 0,
                zIndex: 9998
            });

        $blind.appendTo(document.body);
        dialog.showOpenDialog(parentWindow, {
            properties: ['openDirectory']
        }, (directoryPath) => {
            if (directoryPath !== undefined) {
                if ($.isArray(directoryPath)) {
                    directoryPath = directoryPath[0];
                }
                self.path = directoryPath;
            }
            $blind.remove();
        });
    }

    /**
     * On click in brackets callback
     * @private
     */
    _bracketsOnClick() {
        console.log('onClick');
    }

    /**
     * On click callback
     */
    onClick() {
        if (window.atom) {
            this._atomOnClick();
        } else {
            this._bracketsOnClick();
        }
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

        if (window.atom) {
            $textElement = $(document.createElement(editor.selectors.textEditor));
            self._textElement = $textElement[0];
            $(self).append($textElement);
            $textElement
                .attr('mini', true)
                .addClass(classes.DEFAULT_FILE_EXPLORER_TEXT);
        } else {
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
        if (window.atom) {
            this._textElement.getModel().setText(path);
        } else {
            this._selectPath.value = path;
            this._customPath.value = path;
        }
    }
}

const FilePickerElement = document.registerElement('closet-file-picker', FilePicker);

export {FilePickerElement, FilePicker};
