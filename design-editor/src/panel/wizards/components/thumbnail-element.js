'use babel';

import $ from 'jquery';
import path from 'path';
import Mustache from 'mustache';
import {appManager} from '../../../app-manager';


var TEMPLATE_FILE_PATH = '/panel/wizards/components/thumbnail-element.html';

/**
 *
 */
class Thumbnail extends HTMLElement {

    /**
     * Create callback
     */
    createdCallback() {
        this._initialize();
        this.options = {
            templatePath : ''
        };
        this.addEventListener('click', (event) => {
            let el = event.target;
            while (el !== document.firstElementChild && !el.classList.contains('closet-pw-thumbnail-list')) {
                el = el.parentNode;
            }
            if (el.classList.contains('closet-pw-thumbnail-list')) {
                this.onClick(event, el);
            }
        });
    }

    /**
     * Init
     * @private
     */
    _initialize() {
        this._thumbnailMetaData = null;
        this._$selectedItem = null;
    }

    /**
     * Set selected item
     * @param {jQuery} $item
     * @private
     */
    _setSelectedItem($item) {
        if (this._$selectedItem) {
            this._$selectedItem.removeClass('selected');
        }

        this._$selectedItem = $item.addClass('selected');
    }

    /**
     * Click callback
     * @param {Event} e
     */
    onClick(e, el) {
        // selectected element and it index
        var $selectedElement = $(el),
            indexOfSelectedElement = $selectedElement.index();

        // set infor about template
        this.templatePath = $selectedElement.data('template-path');
        this.packagePath = this._thumbnailMetaData[indexOfSelectedElement].packagePath;
        this.libraries = this._thumbnailMetaData[indexOfSelectedElement].libraries;
        // start processing
        this._setSelectedItem($selectedElement);
    }

    /**
     * Render
     * @returns {*}
     */
    render() {
        // difference between atom and brackets
        var projectDirPath = appManager ? appManager.getAppPath().src : '/design-editor/closet',
            self = this;

        $.ajax({
            url: path.join(projectDirPath, TEMPLATE_FILE_PATH)
        }).done((templateString) => {
            var templateRendered = Mustache.render(templateString, {
                templates : self._thumbnailMetaData,
                getThumbnailPath() {
                    return path.join(this.path, this.thumbnail.replace(/(\.\/)/g, '/'));
                }
            });

            $(self).empty().append(templateRendered);
            self.selectedIndex = 0;
        });

        return this;
    }

    /**
     * Set thumbnail meta data
     * @param {Object} data
     */
    setThumbnailMetadata(data) {
        this._thumbnailMetaData = data;
    }
}


const ThumbnailElement = document.registerElement('closet-pw-thumbnail', Thumbnail);

export {ThumbnailElement, Thumbnail};
