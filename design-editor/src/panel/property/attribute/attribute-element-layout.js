'use babel';

import mustache from 'mustache';
import $ from 'jquery';
import path from 'path';
import {packageManager, Package} from 'content-manager';
import {appManager as AppManager} from '../../../app-manager';
import {DressElement} from '../../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../../events-emitter';

const TEMPLATE_FILE = 'panel/property/attribute/attribute-element-layout.html';
const LAYOUT_OPTIONS_FILE = {
    "linear" : 'panel/property/attribute/templates/layout-linear.html',
    "column" : 'panel/property/attribute/templates/layout-column.html'
};
const TEMPLATE_LAYOUT_OPTIONS = {}

const defaultLayout = {
    "profile": "all",
    "layout": "linear",
    "options": Object.assign({}, {
            "direction": "vertical",
            "fill": true
        }),
    "profiles": PROFILES
}

const LAYOUT_OPTIONS = {
    "linear": {
        "direction": "vertical",
        "fill": true
    },
    "column": {
        "columnNumber": 2,
        "columnGap": true
    }
}
const PROFILES = ["all", "mobile", "wearable", "tv"];

/**
 *
 */
class AttributeLayout extends DressElement {
    /**
     * Create callback
      */
    onCreated() {
        var self = this;
        self._data = {
            layouts: [Object.assign({}, defaultLayout)]
        };
        self._loadTemplates(() => {
            self._render();
        });
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
            self.$el.html("");
        }
    }

    /**
     * _loadTemplates
     * @param {Function} callback
     */
    _loadTemplates(callback) {
        var templatePath = AppManager.getAppPath().src;

        var loadOptionsTemplates = [];
        Object.keys(LAYOUT_OPTIONS_FILE).forEach(function (templateName) {
            let templateFileName = LAYOUT_OPTIONS_FILE[templateName];

            loadOptionsTemplates.push(new Promise(function (resolve, reject) {
                    $.get(path.join(templatePath, templateFileName), (template) => {
                        TEMPLATE_LAYOUT_OPTIONS[templateName] = template;
                    })
                    .done(resolve)
                    .fail(reject);
                })
            );
        });
        Promise.all(loadOptionsTemplates).then(() => {
            if (typeof callback === "function") {
                callback.call();
            }
        });
    }

    /**
     * Add IDs for array elemnts
     * @param {Array} tab
     */
    _addId(tab) {
        tab.forEach(function (value, index) {
            tab[index]._index = index;
        });
    }

    /**
     * Fill Options as HTML from template
     */
    _fillOptionsHTML() {
        this._data.layouts.forEach((layout, index, layouts) => {
            layouts[index].optionsHTML = mustache.render(TEMPLATE_LAYOUT_OPTIONS[layout.layout], layout);
        });
    }

    _fillValues() {
        this._data.layouts.forEach((layout) => {
            let selected = {};
            selected["profile" + "_" + layout.profile] = "selected";
            selected["layout" + "_" + layout.layout] = "selected";
            selected["columnNumber" + "_" + layout.options.columnNumber] = "selected"
            selected["columnGap" + "_" + layout.options.columnGap] = "selected"
            selected["direction" + "_" + layout.options.direction] = "selected"
            selected["fill" + "_" + layout.options.fill] = "selected"
            layout._selected = selected;
        });
    }

    /**
     * Render
     * @private
     */
    _render() {
        var templatePath =  path.join(AppManager.getAppPath().src, TEMPLATE_FILE);

        $.get(templatePath, (template) => {
            this._clearElement(true);
            this._addId(this._data.layouts);
            this._fillValues();
            this._fillOptionsHTML();

            this.$el.append(mustache.render(template, this._data));

            this._bindEvent();
        });
}

    /**
     * Set data from HTML element
     * @param {HTMLElement} element
     */
    setData(element) {
        var options = element && element.options,
            layouts = options && options.layouts,
            temp = {},
            i, len;

        if (layouts) {
            len = layouts.length;
            for (i = 0; i < len; i += 1) {
                // icon is path
                temp = {};
                temp.profile = layouts[i].profile;
                temp.layout = layouts[i].layout;
                temp.options = Object.assign({}, LAYOUT_OPTIONS[temp.layout]);
                temp.index = i;
                this._data.layouts.push(temp);
            }
            this._render();
        }
    }

    /**
     * Add profile callback
     * @param {Event} event
     * @private
     */
    _addProfile(event) {
        let layout = Object.assign({}, defaultLayout);

        layout.options = Object.assign({}, LAYOUT_OPTIONS[layout.layout]);
        this._data.layouts.push(layout);
        eventEmitter.emit(EVENTS.AddLayoutProfile, this._data.layouts[this._data.layouts.length - 1]);

        this._render();
    }

    /**
     * Remove profile callback
     * @param {Event} event
     * @private
     */
    _removeProfile(event) {
        var $element = $(event.target),
            index = parseInt($element.attr('data-index'), 10),
            removedLayout = this._data.layouts[index];

        this._data.layouts = this._data.layouts.filter(function (layout) {
            return layout._index !== index;
        });
        eventEmitter.emit(EVENTS.RemoveLayoutProfile, removedLayout);

        this._render();
    }

    /**
     * Change profile options
     * @param {Event} event
     * @private
     */
    _changeLayoutProfile(event) {
        var $element = $(event.target),
            index = $element.attr('data-index');

        this._data.layouts[index].profile = $element.val();
        eventEmitter.emit(EVENTS.changeLayoutType, $element.val());

        this._render();
    }

    /**
     * Change layout type options
     * @param {Event} event
     * @private
     */
    _changeLayoutType(event) {
        let $element = $(event.target);
        let index = $element.attr('data-index');
        let layout;

        if (index) {
            layout = this._data.layouts[index];
            layout.layout = $element.val();
            layout.options = Object.assign({}, LAYOUT_OPTIONS[layout.layout]);
            eventEmitter.emit(EVENTS.changeLayoutType, layout.layout);
            this._render();
        }
    }

    /**
     * Change layout options
     * @param {Event} event
     * @private
     */
    _changeLayoutOptions(event) {
        var $element = $(event.target),
            index = $element.attr('data-index'),
            name = $element.attr("name").replace(/\_.*$/, ""),
            result = {};

        console.log("_changeLayoutOptions");
        this._data.layouts[index].options[name] = $element.val();
        result[name] = $element.val();
        eventEmitter.emit(EVENTS.changeLayoutOptions, result);
        this._render();
    }

    /**
     * Bind events
     * @private
     */
    _bindEvent() {
        $('.closet-attribute-layout-profile-add').on('click', this._addProfile.bind(this));
        $('.closet-attribute-layout-profile-delete').on('click', this._removeProfile.bind(this));
        $('.closet-attribute-layout-profile').on('change', this._changeLayoutProfile.bind(this));
        $('.closet-attribute-layout-type').on('change', this._changeLayoutType.bind(this));
        $('.closet-attribute-layout-options').on('change', this._changeLayoutOptions.bind(this));
    }

}

const AttributeLayoutElement = document.registerElement('closet-attribute-element-layout', AttributeLayout);

export {AttributeLayoutElement, AttributeLayout};
