import mustache from 'mustache';
import $ from 'jquery';
import path from 'path';
import {DressElement} from '../../../utils/dress-element';
import {appManager as AppManager} from '../../../app-manager';
import attributeUtils from '../../../utils/attribute-utils';

const TEMPLATE_FILE = 'panel/property/attribute/attribute-element-interactive.html';

class AttributeInterative extends DressElement {
	onAttached() {
		this._render();
	}

	onCreated() { }

	_updateSourcePath(sourcePath, ext) {
		const self = this;
		if (ext === undefined) {
			return;
		}

		if (['obj', 'fbx', 'gltf'].indexOf(ext) !== -1) {
			self.$el.find('input[name=i3d-src]').val(sourcePath);
		}
	}

	_onSrcModelChange(event) {
		attributeUtils.setModelSource(event,
			'models',
			this._selectedElementId,
			this._updateSourcePath.bind(this)
		);
	}

	_clearElement(empty) {
		const self = this;

		if (empty) {
			self.$el.empty();
		}
	}

	setData(target, element) {
		const self = this;
		const $el = self.$el;
		this._selectedElementId = target.attr('data-id');

		for (const attr of element.attributes) {
			if (['width', 'height', 'position', 'scale', 'rotation', 'light', 'src'].indexOf(attr.name) !== -1) {
				$el.find(`input[name=i3d-${attr.name}]`).val(attr.value);
			} else if (['autoplay', 'controls'].indexOf(attr.name) !== -1) {
				$el.find(`input[name=i3d-${attr.name}]`).attr('checked', true);
			}
		}
	}

	_render() {
		const self = this;
		$.get(path.join(AppManager.getAppPath().src, TEMPLATE_FILE), (template) => {
			self._clearElement(true);
			self.$el.append(mustache.render(template, self._data));
			self.$el.find('#srcModelBtn').on('click', () => {
				self.$el.find('#srcModelFile').click();
			});
			self.$el.find('#srcModelFile').on('change', this._onSrcModelChange.bind(this));
		});
	}
}

const AttributeInteractiveElement = document.registerElement('closet-attribute-interactive', AttributeInterative);
export {AttributeInteractiveElement, AttributeInterative};