'use babel';

import $ from 'jquery';
import path from 'path';
import Mustache from 'mustache';
import {appManager} from '../../../app-manager';


const TEMPLATE_FILE_PATH = '/panel/wizards/components/thumbnail-element.html';

/**
 *
 */
class Thumbnail extends HTMLElement {

	constructor() {
		super();
		this._thumbnailMetaData = null;
		this._$selectedItem = null;
		this.options = {
			templatePath: ''
		};
		this.addEventListener('click', this.handleClick);
	}

	handleClick(event) {
		let el = event.target;
		while (el !== document.firstElementChild && !el.classList.contains('closet-pw-thumbnail-list')) {
			el = el.parentNode;
		}
		if (el.classList.contains('closet-pw-thumbnail-list')) {
			this.onClick(event, el);
		}
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
		const $selectedElement = $(el),
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
	 * @returns {Object}
	 */
	render() {
		// difference between atom and brackets
		const projectDirPath = appManager ? appManager.getAppPath().src : '/design-editor/closet';
		fetch(path.join(projectDirPath, TEMPLATE_FILE_PATH))
			.then((data) => data.text())
			.then((templateString) => {
				const templateRendered = Mustache.render(templateString, {
					templates: this._thumbnailMetaData,
					getThumbnailPath() {
						return path.join(this.path, this.thumbnail.replace(/(\.\/)/g, '/'));
					}
				});

				$(this).empty().append(templateRendered);
				this.selectedIndex = 0;
			}).catch((err) => {throw err;});

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


customElements.define('closet-pw-thumbnail', Thumbnail);

export {Thumbnail};
