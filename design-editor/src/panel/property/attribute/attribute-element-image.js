// @ts-nocheck
'use babel';

import mustache from 'mustache';
import $ from 'jquery';
import path from 'path';

import {appManager as AppManager} from '../../../app-manager';
import {DressElement} from '../../../utils/dress-element';
import attributeUtils from '../../../utils/attribute-utils';

const TEMPLATE_FILE = 'panel/property/attribute/templates/attribute-image.html';

const filterDefaults = {
	'brightness': 100,
	'contrast': 100,
	'saturate': 100,
	'sepia': 0,
	'grayscale': 0,
	'hue-rotate': 0,
	'opacity': 1
};

const filterPresets = {
	aden: {
		'hue-rotate': -20,
		'contrast': 90,
		'saturate': 85,
		'brightness': 120
	},
	brooklyn: {
		'contrast': 90,
		'brightness': 110
	},
	earlybird: {
		'contrast': 90,
		'sepia': 20
	},
	gingham: {
		'brightness': 105,
		'hue-rotate': -10
	},
	hudson: {
		'brightness': 120,
		'contrast': 90,
		'saturate': 110
	},
	inkwell: {
		'sepia': 30,
		'contrast': 110,
		'brightness': 110,
		'grayscale': 100
	},
	lofi: {
		'saturate': 110,
		'contrast': 150
	},
	mayfair: {
		'contrast': 110,
		'saturate': 110
	}
};

let imageFilter = {};

class AttributeImage extends DressElement {

	/**
	 * Create callback
	  */
	onCreated() {
		const self = this;

		$.get(path.join(AppManager.getAppPath().src, TEMPLATE_FILE), (template) => {
			self.$el.append(mustache.render(template, self._data));
			self.$el.find('[type=range]').on('change', this._onSliderValueChange.bind(this));
			self.$el.find('.closet-image-filter-btn').on('click', this._onPresetButtonClick.bind(this));
			self.$el.find('#srcImageFile').on('change', this._onSrcImageChange.bind(this));
			self.$el.find('#srcImageClear').on('click', this._onSrcImageClear.bind(this));
		});
	}

	setData(element) {
		this._targetImage = element;
		this._selectedElementId = element.attr('data-id');
		this._updatePanel();
	}

	_readImageFilter() {
		const filter = this._targetImage[0].style.filter;

		imageFilter = Object.assign({}, filterDefaults, { opacity: this._targetImage[0].style.opacity || 1 });

		if (filter) {
			filter.split(' ').forEach(component => {
				imageFilter[component.match(/[a-z-]+/)[0]] = parseInt(component.match(/\d+/)[0], 10);
			});
		}
	}

	_setImageFilter() {
		let filterString = '';

		Object.keys(imageFilter).forEach(filter => {
			if (filter === 'opacity') {
				return;
			}

			if (parseInt(imageFilter[filter], 10) !== filterDefaults[filter]) {
				filterString += `${filter
				}(${  imageFilter[filter]  }${this.$el.find(`[name=${  filter  }]`).attr('dataunit')  }) `;
			}
		});

		this._targetImage[0].style.webkitFilter = filterString;
		this._targetImage[0].style.opacity = imageFilter.opacity === filterDefaults.opacity ? '' : imageFilter.opacity;

		AppManager.getActiveDesignEditor()
			.getModel().updateStyle(this._targetImage[0].getAttribute('data-id'), 'webkitFilter', filterString);
	}

	_onPresetButtonClick(event) {
		const button = event.target;
		const preset = button.name;

		imageFilter = Object.assign({}, filterDefaults, filterPresets[preset]);

		this._setImageFilter();
		this._updatePanel();
	}

	_updatePanel() {
		const self = this;

		self._readImageFilter();
		self._setImageSourcePath();

		Object.keys(imageFilter).forEach(filter => {
			const $slider = self.$el.find(`[name="${  filter  }"]`),
				newValue = imageFilter[filter];

			setTimeout(() => {
				$slider.val(newValue);
			}, 0);
		});
	}

	_onSliderValueChange(e) {
		imageFilter[e.target.name] = parseInt(e.target.value, 10);
		this._setImageFilter();
	}

	_updateImageSourcePath(sourcePath) {
		if (!sourcePath || sourcePath === '#') {
			this.$el.find('#srcImageChoose').show();
			this.$el.find('#srcImageShow').hide();
			this.$el.find('#srcImageFile').val('');
		} else {
			this.$el.find('#srcImageChoose').hide();
			this.$el.find('#srcImageShow').show();
			this.$el.find('#srcImageValue').val(sourcePath);
		}
	}

	_setImageSourcePath() {
		const sourcePath = this._targetImage.attr('src');
		this._updateImageSourcePath(sourcePath);
	}

	_onSrcImageChange(event) {
		attributeUtils.writeMediaFileWhenIsLoaded(event, filePath => attributeUtils.setImageSource(
			filePath,
			'src',
			this._selectedElementId,
			this._updateImageSourcePath.bind(this)));
	}

	_onSrcImageClear() {
		AppManager.getActiveDesignEditor().getModel()
			.updateAttribute(this._selectedElementId, 'src', '');
		this._updateImageSourcePath();
	}
}

const AttributeImageElement = document.registerElement('closet-image-element', AttributeImage);

export {AttributeImageElement, AttributeImage};
