'use babel';

import mustache from 'mustache';
import $ from 'jquery';
import path from 'path';
import {appManager as AppManager} from '../../../app-manager';
import {DressElement} from '../../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../../events-emitter';
import capabilities from './st-capabilities.json';

const ST_CAPABILITY = 'st-device';
const ST_CAPABILITY_PARAMS = 'st-property';
const DATA_ID_NAME = 'data-id';
const ATTRIBUTE_CHECKED = 'checked';
const ATTRIBUTE_SELECTED = 'selected';

const TEMPLATE_FILE = 'panel/property/attribute/attribute-element-sthings.html';
const templateContentPromise = fetch(path.join(AppManager.getAppPath().src, TEMPLATE_FILE))
    .then(response => response.text());

/**
 * Smart Things Attributes panel
 */
class AttributeSmartThings extends DressElement {

    /**
     * Extracts data from capabilities object
     * @returns {[Object]} Array of capability object
     * @private
     */
    _convertCapabilities() {
        return capabilities.map(capability => {
            const schemaDefinitions = Object.values(capability.schemas[0])[0].definitions;
            const capabilityName = Object.keys(schemaDefinitions)[0];
            const properties = schemaDefinitions[capabilityName].properties;
            return {
                title: capability.title,
                name: capabilityName,
                params: properties
                    ? Object.keys(properties).map(key => ({
                        name: key,
                        property: properties[key]
                    }))
                    : []
            };
        });
    }

    /**
     * Create handler
      */
    onCreated() {
        this._capabilities = this._convertCapabilities();
        this._selectedCapability = null;
        this._render();
    }

    /**
     * Render attributes form
     * @returns {Promise}
     * @private
     */
    _render() {
        return templateContentPromise.then(templateContent => {
            this.$el.html('');
            this.$el.append(mustache.render(templateContent, {
                params: this._selectedCapability ? this._selectedCapability.params : [],
                capabilities: this._capabilities
            }));
            this._bindEvent();
        });
    }

    /**
     * Removes selected capability object if exists
     * @orivate
     */
    _removeSelectedCapability() {
        if (this._selectedCapability) {
            delete this._selectedCapability._selected;
            this._selectedCapability.params.forEach(param => {
                delete param._checked;
                delete param._isEnum;
            });
            this._selectedCapability = null;
        }
    }

    /**
     * Set data from HTML element
     * @param {HTMLElement} element
     */
    setData(element) {
        if (!element) {
            return;
        }

        this._removeSelectedCapability();

        this._selectedElementedId = element.id;
        const model = AppManager.getActiveDesignEditor().getModel();
        const elementModel = model.getElementByQuery(`[${DATA_ID_NAME}="${this._selectedElementedId}"]`);
        const capabilityName = elementModel.getAttribute(ST_CAPABILITY);
        if (!capabilityName) {
            this._render();
            return;
        }
        this._selectedCapability = this._capabilities.find(capability => capability.name === capabilityName) || null;
        if (!this._selectedCapability) {
            this._render();
            return;
        }

        this._selectedCapability._selected = ATTRIBUTE_SELECTED;
        const paramsStr = elementModel.getAttribute(ST_CAPABILITY_PARAMS);
        if (paramsStr) {
            const paramsFromAttr = paramsStr.split(',');
            this._selectedCapability.params.forEach(param => {
                if (paramsFromAttr.indexOf(param.name) !== -1) {
                    param._checked = ATTRIBUTE_CHECKED;
                    param._isEnum = !!param.property.enum;
                }
            });
        }

        this._render();
    }

    /**
     * Change capability
     * @param {Event} event
     * @private
     */
    _setCapability(event) {
        this._removeSelectedCapability();

        const element = event.target;
        const capabilityName = element.value;
        const model = AppManager.getActiveDesignEditor().getModel();
        if (capabilityName) {
            this._selectedCapability = this._capabilities.find(capability => capability.name === capabilityName);
            this._selectedCapability._selected = ATTRIBUTE_SELECTED;
            this._selectedCapability.params.forEach(param => param._isEnum = !!param.property.enum);
            model.updateAttribute(this._selectedElementedId, ST_CAPABILITY, capabilityName);
        } else {
            model.removeAttribute(this._selectedElementedId, ST_CAPABILITY_PARAMS);
        }

        eventEmitter.emit(EVENTS.ChangeCapability, { capability: capabilityName });
        this._render();
    }

    /**
     * Change capabliti's params
     * @param {Event} event
     * @private
     */
    _setParams(event) {
        const element = event.target;
        const model = AppManager.getActiveDesignEditor().getModel();

        const checked = element.checked;
        const name = element.getAttribute('name');
        const param = this._selectedCapability.params.find(param => param.name === name);
        if (checked) {
            param._checked = ATTRIBUTE_CHECKED;
        } else {
            delete param._checked;
        }

        const paramsStr = this._selectedCapability.params
            .filter(param => param._checked)
            .map(param => param.name)
            .join(',');
        if (paramsStr) {
            model.updateAttribute(this._selectedElementedId, ST_CAPABILITY_PARAMS, paramsStr);
        } else {
            model.removeAttribute(this._selectedElementedId, ST_CAPABILITY_PARAMS);
        }

        eventEmitter.emit(EVENTS.ChangeCapabilityParam, { params: paramsStr });
        this._render();
    }

    /**
     * Bind events
     * @private
     */
    _bindEvent() {
        $('.closet-attribute-st-device').on('click', this._setCapability.bind(this));
        $('.closet-attribute-st-params').on('change', this._setParams.bind(this));
    }

}

customElements.define('closet-attribute-element-smartthings', AttributeSmartThings);

export {AttributeSmartThings};
