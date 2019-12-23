'use babel';

import mustache from 'mustache';
import $ from 'jquery';
import path from 'path';
import {packageManager, Package} from 'content-manager';
import {appManager as AppManager} from '../../../app-manager';
import {StateManager} from '../../../system/state-manager';
import utils from '../../../utils/utils';
import {DressElement} from '../../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../../events-emitter';
import { _compareVersions } from '../component/utils/component-element-utils';

const TEMPLATE_FILE = 'panel/property/attribute/attribute-element-styles.html';
const EMPTY_STYLES_ELEMENT = '<span class="empty-styles">No styles to show.</span>';


/**
 *
 */
class AttributeStyles extends DressElement {
    /**
     * Create callback
      */
    onCreated() {
        var self = this;
        self._data = {
            style: []
        };

        self._packages = packageManager.getPackages(Package.TYPE.COMPONENT);
        self.$el.html(EMPTY_STYLES_ELEMENT);
    }

    /**
     * clear element
     * @param {boolean} empty
     * @private
     */
    _clearElement(empty) {
        var self = this;

        if (empty) {
            self.$el.empty();
        } else {
            self.$el.html(EMPTY_STYLES_ELEMENT);
        }
    }

    /**
     * Render
     * @private
     */
    _render() {
        var self = this;
        $.get(path.join(AppManager.getAppPath().src, TEMPLATE_FILE), (template) => {
            self._clearElement(true);
            self.$el.append(mustache.render(template, self._data));

            self._bindEvent();
        });
    }

    /**
     * Set data
     * @param {PackageComponent} component
     * @param {HTMLElement} element
     */
    setData(component, element) {
		const options = component && component.options,
			styles = options && options.styles,
			screen = StateManager.get('screen'),
			profile = screen.profile || 'mobile',
			shape = screen.shape || 'rectangle',
			currentTauVersion = StateManager.get('tau-version', undefined);
		let temp = {},
			i,
			len;

        if (styles) {
            len = styles.length;
            this._data.style = [];
            for (i = 0; i < len; i += 1) {
                if (styles[i].parentSelector && element
                    && element.closest(styles[i]['parent-selector']).length == 0) {
                    continue;
				}
				if (!utils.correctVersion(styles[i].version, profile, shape)) {
					break;
				}
				if (!_compareVersions(currentTauVersion, styles[i].since)) {
					break;
				}
                // icon is path
                temp = {};
                temp.name = styles[i].name;
                temp.icon = path.join(options.path, styles[i].icon).replace(/\\/g, '/');
                temp.template = styles[i].template;
                temp.index = i;
				temp.new = !!styles[i].new;
                this._data.style.push(temp);
            }
            this._render();
        } else {
            this._clearElement();
        }
    }

    /**
     * Bind events
     * @private
     */
    _bindEvent() {
        $('.styles-icon').on('click', this._onClick.bind(this));
    }

    /**
     * Click event callback
     * @param {Event} event
     * @private
     */
    _onClick(event) {
        console.log('attribute-element-styles:_onClick');
        var $element = $(event.target),
            index = $element.attr('data-index');

        $('.styles-icon').removeClass('active');
        $element.addClass('active');

        eventEmitter.emit(EVENTS.ChangeElementStyle, this._data.style[index].template);
    }
}


const AttributeStylesElement = document.registerElement('closet-attribute-styles', AttributeStyles);

export {AttributeStylesElement, AttributeStyles};
