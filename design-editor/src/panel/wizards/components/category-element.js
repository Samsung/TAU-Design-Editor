'use babel';

import $ from 'jquery';
import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';
import {appManager} from '../../../app-manager';

var TEMPLATE_FILE_PATH = '/panel/wizards/components/category-element.html';

/**
 *
 */
class Category extends HTMLUListElement {
    /**
     * Create callback
     */
    createdCallback() {
        this._initialize();
        this.options = {
            selectedIndex : 0
        };

    }

    /**
     * Init
     * @private
     */
    _initialize() {
        this._categoryParsedData = null;
        this._categoryOriginalData = null;
        this._categoryButtonElements = null;
        this._$selectedItem = null;
        this._appPath = appManager.getAppPath();

        this.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('closet-pw-category-item')) {
                this.onClick(event);
            }
        });
    }

    /**
     * Render
     * @private
     */
    _render() {
        var thumbnailTemplatePath = path.join(this._appPath.src, TEMPLATE_FILE_PATH),
            templateString,
            templateRendered;

        templateString = fs.readFileSync(thumbnailTemplatePath, 'utf8');
        templateRendered = Mustache.render(templateString, {
            list : this._categoryParsedData
        });

        $(this).empty().append(templateRendered);
        this._categoryButtonElements = $(this).find('li.closet-pw-category-item');

        this._refreshDataIndex();
        this.setSelectedIndex(0);
    }

    /**
     * Refresh data
     * @private
     */
    _refreshDataIndex() {
        var i, length;

        length = this._categoryButtonElements.length;

        for (i = 0; i < length; i += 1) {
            $(this._categoryButtonElements[i]).data('index', i);
        }
    }

    /**
     * click callback
     * @param {Event} e
     */
    onClick(e) {
        this.selectedIndex = $(e.target).data('index');
    }

    /**
     * Change category callback
     * @param {number} index
     * @private
     */
    _changeCategory(index) {
        var parsedData = this._categoryParsedData[index],
            dataList = null;
        index = parseInt(index, 10);
        this._unsetSelected();
        this._setSelected(index);

        if (parsedData) {
            dataList = this._categoryOriginalData[parsedData.name];
        }

        $(this).trigger('category.change', {list : dataList});
    }

    /**
     * set selected element
     * @param {number} itemIdx
     * @private
     */
    _setSelected(itemIdx) {
        this._$selectedItem = $(this._categoryButtonElements[itemIdx]).addClass('selected');
    }

    /**
     * Unset selected element
     * @private
     */
    _unsetSelected() {
        if (this._$selectedItem) {
            this._$selectedItem.removeClass('selected');
        }
    }

    /**
     * parse category data
     * @param {Object} data
     * @returns {Array}
     * @private
     */
    _parseCategoryMetadata(data) {
        var result = [];
        if (typeof data === 'object') {
            Object.keys(data).forEach((categoryName) => {
                result.push(
                    {
                        name : categoryName,
                        item : data[categoryName]
                    }
                );
            });
        }
        return result;
    }

    /**
     * Set category data
     * @param {Object} data
     */
    setCategoryItemData(data) {
        this._categoryOriginalData = data;
        this._categoryParsedData = this._parseCategoryMetadata(data);
        this._render();
    }

    /**
     * Set selected index
     * @param {number} itemIdx
     */
    setSelectedIndex(itemIdx) {
        this.options.selectedIndex = itemIdx;
        this._changeCategory(itemIdx);
    }
}

const CategoryElement = document.registerElement('closet-pw-category', Category);

export {CategoryElement, Category};
