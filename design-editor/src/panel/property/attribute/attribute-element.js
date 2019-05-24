// @ts-nocheck
'use babel';

import fs from 'fs';
import $ from 'jquery';
import {packageManager, Package} from 'content-manager';
import {appManager as AppManager} from '../../../app-manager';
import {DressElement} from '../../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../../events-emitter';
import {AttributeStylesElement} from './attribute-element-styles';
import {AttributeLayoutElement} from './attribute-element-layout';
import {AttributeSmartThingsElement} from './attribute-element-sthings';
import {AttributeInteractiveElement} from './attribute-element-interactive';
import {AttributeImageElement} from './attribute-element-image';
import {AttributeCheckboxElement} from './attribute-element-checkbox'
import editor from '../../../editor';
import utils from '../../../utils/utils';

const TEMPLATE_FILE_PATH = '/panel/property/attribute/';
const ATTRIBUTE_ELEMENT_FILE_NAME = 'templates/attribute-element.html';
const attributeTemplates = {
    'ATTRIBUTE_DIMENSION_POSITION_FILE_NAME': 'templates/attribute-dimension-position.html',
    'ATTRIBUTE_BACKGROUND_FILE_NAME': 'templates/attribute-background.html',
    'ATTRIBUTE_FLEX_FILE_NAME': 'templates/attribute-flex.html',
    'ATTRIBUTE_TEXT_FILE_NAME': 'templates/attribute-text.html',
    'ATTRIBUTE_BOX_MODEL_FILE_NAME': 'templates/attribute-box-model.html',
    'ATTRIBUTE_COVERFLOW_NAME': 'templates/attribute-coverflow.html'
};
const CSS_UNITS = ['em', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ch', 'rem', 'vh', 'vw'];
var script;
var coverflowImage = [];
var wallArray = [];

/**
 * Convert name
 * @param str
 * @returns {string}
 */
function convertToOptionName(str) {
    return str.replace(/(-[a-z])/g, function ($1) {
        return $1.toUpperCase().replace('-', '');
    });
}

/**
 * Convert RGBA to HEX
 * @param rgba
 * @returns {string}
 */
function rgba2hex(rgba) {
    rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgba && rgba.length === 4) ? '#' +
    ('0' + parseInt(rgba[1], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgba[2], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgba[3], 10).toString(16)).slice(-2) : '';
}

/**
 *
 */
class Attribute extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        var self = this;

        self._stylesElement = new AttributeStylesElement();
        self._layoutElement = new AttributeLayoutElement();
        self._sthingsElement = new AttributeSmartThingsElement();
        self._interactiveElement = new AttributeInteractiveElement();
        self._imageElement = new AttributeImageElement();
        self._checkboxElement = new AttributeCheckboxElement();
        self.model = null;
        self.classList.add('closet-attribute-element-container');
        self.classList.add('closet-property');

        self.componentPackages = packageManager.getPackages(Package.TYPE.COMPONENT);
        self.typeElementPackages = packageManager.getPackages(Package.TYPE.TYPE_ELEMENT);

        self._AttributeElementLists = [];
        self._AttributeLists = [];
        self._isVisibleCommonStyleElement = false;

        self._$selectedElement = null;

        self.events = {
            'change #fileForBackground': 'onSetRelativePathForBackground',
            'click  #fileForBackgroundClear': 'onClearBackgroundImage',
            'change #cfFiles': 'onSelectImageForCoverFlow',
            'change [name]': 'onCommonStyleChange',
            'keydown [name]': 'onCommonStyleKeydown'
        };

        this.createFromTemplate(TEMPLATE_FILE_PATH + ATTRIBUTE_ELEMENT_FILE_NAME, {
            callback: () => {
                self._initializeAttributeDOM();
                self._bindEvent();
            }
        });
    }

    /**
     * Init attribute DOM
     * @private
     */
    _initializeAttributeDOM() {
        console.log('_initializeAttributeDOM');
        var self = this,
            $el = self.$el,
            attribute = '';
        $el.find('.closet-style-element-list').append(self._stylesElement);
        $el.find('.closet-layout-element-list').append(self._layoutElement);
        $el.find('.closet-interactive-element-list').append(self._interactiveElement);
        $el.find('.closet-image-element-list').append(self._imageElement);
        $el.find('.closet-checkbox-element-list').append(self._checkboxElement);
        $el.find('.closet-attribute-element-smartthings').append(self._sthingsElement);

        self._$list = $el.find('.closet-attribute-element-list');
        self._$optionsList = $el.find('.closet-widget-options-list');
        self._$commonList = $el.find('.closet-attribute-common-list');

        self._$commonList.css('display', 'none');

        self._AttributeLists['$box'] = self.$el.find('.closet-attribute-box-model-list');
        self._AttributeLists['$dimension'] = self.$el.find('.closet-attribute-dimension-position-list');
        self._AttributeLists['$background'] = self.$el.find('.closet-attribute-background-list');
        self._AttributeLists['$text'] = self.$el.find('.closet-text-element-list');
        self._AttributeLists['$image'] = self.$el.find('.closet-image-element-list');
        self._AttributeLists['$checkbox'] = self.$el.find('.closet-checkbox-element-list');
        self._AttributeLists['$flex'] = self.$el.find('.closet-attribute-flex-list');
        self._AttributeLists['$layout'] = self.$el.find('.closet-layout-list');
        self._AttributeLists['$coverflow'] = self.$el.find('.closet-coverflow-element-list');

        Object.keys(attributeTemplates).forEach((item) => {
            attribute = item.split('_')[1].toLowerCase();
            self._createStylesTabs(attributeTemplates[item], attribute);
        });
    }

    /**
     * Bind events
     * @private
     */
    _bindEvent() {
        var self = this,
            container = self.$el.closest('.closet-container')[0];

        eventEmitter.on(EVENTS.ChangeStyle, (id, name, value) => {
            var element = null,
                currentValue = '';
            if (self._selectedElementId === id) {
                element = self.$el.find('[name=' + name + ']');
                currentValue = element.val();
                if (currentValue !== value) {
                    element.val(value);
                }
            }
        });

        eventEmitter.on(EVENTS.ChangeAttribute, (id, name, value) => {
            var element = null,
                currentValue = '';
            if (self._selectedElementId === id) {
                element = self._$list.find('[attr-name=' + name + ']');
                currentValue = element.attr('value');
                if (currentValue !== value) {
                    element.attr('value', value);
                }
            }
        });
    }

    // @TODO This function should receive Id of element and to get property should use model
    /**
     * Render
     * @param {string} _selectedElementId
     */
    render(_selectedElementId) {
        console.log("attribute-element.js:render", _selectedElementId);
        var self = this,
            $el = self.$el,
            fragment = document.createDocumentFragment(),
            designEditor = AppManager.getActiveDesignEditor(),
            modelElement,
            iframeElement,
            attributes,
            options,
            interactiveElement = self._interactiveElement,
            attribute;

        this._$list.html('');

        if (designEditor && _selectedElementId) {
            modelElement = designEditor.getModel()
                .getElement(_selectedElementId);
            iframeElement = designEditor._getElementById(_selectedElementId);

            if (modelElement.component && modelElement.component.name === 'i3d') {
                $el.find('.closet-interactive-element').show();
                interactiveElement.setData(modelElement);
            } else {
                $el.find('.closet-interactive-element').hide();
            }

            if (modelElement.component && modelElement.component.name === 'coverflow') {
                $el.find('.closet-coverflow-element').show();
            } else {
                $el.find('.closet-coverflow-element').hide();
            }

            if (modelElement.component && modelElement.component.name === 'closet-image') {
                $el.find('.closet-image-element').show();
                self._imageElement.setData(iframeElement);
            } else {
                $el.find('.closet-image-element').hide();
            }
            if (modelElement.component && modelElement.component.name === 'checkbox') {
                $el.find('.closet-checkbox-element').show();
                self._checkboxElement.setData(iframeElement , modelElement);
            } else {
                $el.find('.closet-checkbox-element').hide();
            }
            if (modelElement.component && !(['text', 'title'].includes(modelElement.component.name))) {
                self.expand('closet-additional-attribute', self._expandable);
            } else {
              self.unexpand('closet-additional-attribute', self._expandable);
            }
            if (modelElement.component && modelElement.component.options.options) {
                $el.find('.closet-property-widget-option').show();
            } else {
                $el.find('.closet-property-widget-option').hide();
            }

            attributes = modelElement.component && modelElement.component.getAttributes();

            if (attributes) {
                attributes.forEach((attributeObject) => {
                    var type = self.typeElementPackages.get(attributeObject.type.name),
                        TypeElement = null,
                        optionName = convertToOptionName(attributeObject.name),
                        typeElement,
                        typeName,
                        li, label,
                        options = null,
                        $iframeElement = iframeElement && iframeElement.jquery ?
                            iframeElement :
                            $(iframeElement),
                        value = '';

                    typeName = attributeObject.type.name;

                    if (typeName !== 'empty') {
                        TypeElement = type.getModule();
                        type = self.typeElementPackages.get(typeName);
                        optionName = attributeObject.name.match(/^data-|^st-/) ? attributeObject.name : convertToOptionName(attributeObject.name);

                        options = $.extend({}, attributeObject.type.option);
                        // list of items for select
                        if (attributeObject.list) {
	                        options.list = attributeObject.list;
                        }

                        value = $iframeElement.attr(optionName) || attributeObject.value;
                        options.value = value;
                        typeElement = new TypeElement(options);

                        typeElement.setAttribute('attr-name', optionName);
                        typeElement.$el.on('change', (e) => {
                            let value = (typeName === 'checkbox') ? e.target.checked : typeElement.value;
                            if (designEditor) {
                                designEditor
                                    .getModel()
                                    .updateAttribute(self._selectedElementId, optionName, value);
                            }
                        });

                        li = $('<li class="' + attributeObject.type.name + '"></li>');
                        label = $('<span class="closet-attribute-label">' + attributeObject.label + '</span>');
                        typeElement.$el.addClass('closet-attribute-type');

                        li.append(label)
                            .append(typeElement)
                            .appendTo(fragment);
                    }
                });

                self._$list.append(fragment);

                if (!self._isVisibleCommonStyleElement) {
                    self._$commonList.css('display', 'block');
                    this._$list.append(fragment);
                    Object.keys(attributeTemplates).forEach((item) => {
                        attribute = item.split('_')[1].toLowerCase();
                        this._updateAttributes(modelElement, attribute);
                    });
                }

                this._selectedElementId = _selectedElementId;

                self._stylesElement.setData(modelElement.component, iframeElement);
            }

            self._layoutElement.setData(modelElement.component);
            self._sthingsElement.setData(modelElement);

            if (modelElement.component && modelElement.component.options) {
                options = modelElement.component.options.options;
            }
            self._$optionsList.html('');

            if (options) {
                const optionsFragment = document.createDocumentFragment();

                options.forEach(option => {
                    const type = (typeof option.values === 'object') ? 'select' : 'text';
                    let TypeElement = self.typeElementPackages.get(type).getModule();

                    let options = {};

                    if (type === 'select') {
                        const list = [{'value' : '', 'label' : 'Default'}];
                        options.list = list;

                        option.values.forEach(value => {
                            if (typeof value === 'object') {
                                list.push(value);
                            } else {
                                list.push({
                                    'value': value,
                                    'label': value
                                });
                            }
                        });

                    }

                    let currentValue;

                    const element = iframeElement.get(0);
                    let boundWidget = element.getAttribute('data-tau-bound');

                    if (boundWidget) {
                        const iframe = element.ownerDocument.defaultView;
                        const optionName = convertToOptionName(option.name);
                        const engine = iframe.tau.engine;
                        boundWidget = element.getAttribute('data-tau-bound').split(',')[0]

                        if (engine && engine
                                .instanceWidget(element, boundWidget)
                                .option(optionName)) {
                            currentValue = engine
                                .instanceWidget(element, boundWidget)
                                .option(optionName);
                        }

                        if (currentValue) {
                            options.value = currentValue;
                        }

                        let typeElement = new TypeElement(options);
                        const eventName = (type === 'select') ? 'change' : 'keyup';

                        typeElement.$el.on(eventName, (event) => {
                            if (designEditor) {
                                let boundWidgets = element.getAttribute('data-tau-bound');
                                if (boundWidgets) {
                                    boundWidgets.split(',').forEach( name => {
                                        engine
                                            .instanceWidget(element, name)
                                            .option(optionName, typeElement.value);
                                    });
                                }
                                if (typeElement.value !== '') {
                                    designEditor
                                    .getModel()
                                    .updateAttribute(self._selectedElementId, 'data-' + option.name,
                                    typeElement.value);
                                } else {
                                    designEditor
                                    .getModel()
                                    .removeAttribute(self._selectedElementId, 'data-' + option.name);
                                }
                            }
                        });

                        const li = $('<li class="' + type + '"></li>');
                        const label = $('<span class="closet-attribute-label">' + option.label + '</span>');
                        typeElement.$el.addClass('closet-attribute-type');

                        li.append(label)
                          .append(typeElement)
                          .appendTo(optionsFragment);
                    }

                });
                self._$optionsList.append(optionsFragment);
            }
        } else {
            self._$optionsList.html('');
            self._stylesElement.setData();
            self._layoutElement.setData();
        }
    }

    expand(className, elements) {
      elements.forEach((element) => {
        element.classList.remove(className);
      })
    }
    unexpand(className, elements) {
      elements.forEach((element) => {
        element.classList.add(className);
      })
    }
    /**
     * Get element title
     * Get element title
     * @returns {string}
     */
    getElementTitle() {
        return 'Attributes';
    }

    /**
     * Show
     */
    show() {
        this.$el.removeClass('fast-hide');
        this.$el.addClass('fast-show');
    }

    /**
     * Hide
     */
    hide() {
        this.$el.addClass('fast-hide');
        this.$el.removeClass('fast-show');
    }

    _initTabs(name, $element) {
        if (name === 'background') {
            this._$backgroundChooseLayer = $element.find('#backgroundImageChoose');
            this._$backgroundShowLayer = $element.find('#backgroundImageShow');
            this._$backgroundShowLayerInput = this._$backgroundShowLayer.find('input[type=text]');
        }
            this._expandable = [...document.querySelectorAll('.closet-additional-attribute')];
    }

    /**
     * Create style tabs
     * @param {string} fileName
     * @param {string} attribute
     * @private
     */
    _createStylesTabs(fileName, attribute) {
        var self = this,
            list,
            listElements;

        self._AttributeElementLists[attribute + 'Elements'] = {};
        list = self._AttributeLists['$' + attribute];
        listElements = self._AttributeElementLists[attribute + 'Elements'];

        this.createFromTemplate(TEMPLATE_FILE_PATH + fileName, {
            parent: list,
            callback: ($element) => {
                list.find('[name]').each((index, item) => {
                    var $item = $(item),
                        name = $item.attr('name');
                    listElements[name] = $item;
                });
                self._initTabs(attribute, list);
            }
        });
    }

    _applyBackgroundImageInfo(fileName) {
        console.log('_applyBackgroundImageInfo', fileName);
        if (!fileName || fileName === 'none') {
            this._$backgroundShowLayer.hide();
            this._$backgroundChooseLayer.show();
        } else {
            let urls = fileName.split(',');
            if (urls.length) {
                let url = urls[0].replace(/url\(([^\)]+)\)/g, '$1');
                if (url.length) {
                    let relative = url.replace(new RegExp('.+' + utils.checkGlobalContext('globalData').basePath.replace(/\//g, '\/') + '(.+)', 'g'), '$1');
                    if (relative.length) {
                        let clean = relative.replace(/\/+/g, '/').replace(/('|")/g, '').trim();
                        this._$backgroundShowLayerInput.val(clean);
                    }
                }

            }
            this._$backgroundShowLayer.show();
            this._$backgroundChooseLayer.hide();
        }
    }

    onClearBackgroundImage(e) {
        console.log('clearing background image');
        AppManager
            .getActiveDesignEditor()
            .getModel()
            .updateStyle(
                this._selectedElementId,
                'backgroundImage',
                'none'
            );
        this._applyBackgroundImageInfo();
        this.$el.find('#fileForBackground').val('');
    }

    /**
     * set relative path callback
     * @param {Event} e
     */
    onSetRelativePathForBackground(e) {
        var backgroundImage = null,
            self = this,
            dataId,
            pathToProjects = [],
            slashToBackSlash = '';

        [].slice.call(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.addEventListener('loadend', event => {
                if (event.target.readyState === FileReader.DONE) {
                    const dir = utils.checkGlobalContext('globalData').fileUrl.replace(/[^\/]+$/gi, '');
                    const writepath = (dir + '/images/' + file.name).replace(/\/+/gi, '/');
                    const readpath = ('images/' + file.name).replace(/\/+/gi, '/');

                    utils.checkGlobalContext('writeFile')(
                        writepath,
                        event.target.result,
                        {
                            encoding: 'binary'
                        },
                        () => {
                        AppManager.getActiveDesignEditor()
                            .getModel().updateStyle(this._selectedElementId, 'backgroundImage', 'url(\"' + readpath + '\")');
                            this._applyBackgroundImageInfo(readpath);
                        }
                    );
                }
            });
            reader.readAsBinaryString(file);
        });
    }

    /**
     * coverflow image selection callback
     * @param {Event} e
     */
    onSelectImageForCoverFlow(e) {
        var iframeElement,
            element,
            cfFiles = e.target.files,
            editor = AppManager.getActiveDesignEditor(),
            model = editor.getModel();
        let str = '';

        script = '<ul class=\"flip-items\">';
        model.updateStyle(this._selectedElementId, 'backgroundImage', 'none');
        this._applyBackgroundImageInfo();

        if (cfFiles) {
            for(var i = 0; i < cfFiles.length; i++) {
                var img = cfFiles[i].name;
                if (img.match('.jpg') || img.match('.png')) {
                    coverflowImage.push(cfFiles[i].name);
                }
            }
            for (var i = 0; coverflowImage.length; i++) {
                if (coverflowImage[i] === undefined) {
                    break;
                }
                str = '<li><img src=\"images/' + coverflowImage[i] + '\" width=\"100px\" height=\"100px\"></li>';
                script += str;
            }
            script += '</ul>';
            iframeElement = editor._getElementById(this._selectedElementId);
            element = iframeElement.get(0);
            element.innerHTML = script;

            model.updateText(this._selectedElementId, script);
        }
    }

    /**
     * On change style callback
     * @param {Event} event
     * @param {HTMLElement} originalTarget
     */
    onCommonStyleChange(event, originalTarget) {
        var target = originalTarget || event.target,
            editor = AppManager.getActiveDesignEditor(),
            model = editor.getModel(),
            name = target.name,
            value = target.value;

        if (this._selectedElementId && name) {
            if (name === 'content') {
                model.updateText(this._selectedElementId, value);
            } else if (name === 'effect') {
                if (value === '3d wall') {
                    this._onChange3dWall();
                    model.updateText(this._selectedElementId, script);
                } else {
                    model.updateAttribute(this._selectedElementId, 'data-' + name, value);
                }
            } else if (name === 'youtube_keyword') {
                var id = this._selectedElementId;
                this._onParserUrl(this._onYoutubeChange3dWall);
                window.setTimeout(function () {
                    AppManager.getActiveDesignEditor().getModel().updateText(id, script);
                }, 500);
            } else if (name === 'cfSize' && script.length > 0) {
                var regUnit = /[0-9]+(\.[0-9]+)?(px|%)/,
                    regNumber = /^\d+(?:[.]?[\d]?[\d])?$/,
                    rval;
                if (value.match(regUnit)) {
                    rval = value;
                } else {
                    if (value.match(regNumber)) {
                        rval = value + 'px';
                    } else {
                        return;
                    }
                }
                script = script.replace(/width=\"100px\"/gi, 'width=' + '\"' + rval + '\"');
                script = script.replace(/height=\"100px\"/gi, 'height=' + '\"' + rval + '\"');
                model.updateText(this._selectedElementId, script);
            } else if (name.startsWith('i3d-')) {
                var type = name.substring(4);

                var isValid = false;
                if (['width', 'height'].indexOf(type) !== -1) {
                    isValid = value.match(/^[0-9]+$/);
                } else if (['position', 'scale', 'rotation'].indexOf(type) !== -1) {
                    isValid = value.match(/^(0|[+-]?[0-9]*.?[0-9]*) (0|[+-]?[0-9]*.?[0-9]*) (0|[+-]?[0-9]*.?[0-9]*)$/);
                } else if (type === 'light') {
                    isValid = value.match(/^(0[xX])[0-9A-Fa-f]{6} (0[xX])[0-9A-Fa-f]{6} (0|[0-9]*.?[0-9]*)$/);
                } else if (['autoplay', 'controls'].indexOf(type) !== -1) {
                    if (target.checked) {
                        model.updateAttribute(this._selectedElementId, type, '');
                    } else {
                        model.removeAttribute(this._selectedElementId, type);
                    }
                    return;
                }

                if (isValid) {
                    model.updateAttribute(this._selectedElementId, type, value);
                } else {
                    console.error('The value of the '+type+' is invalid!');
                }
            } else {
                model.updateStyle(this._selectedElementId, name, value);
            }
        }
    }

    _onChange3dWall() {
        var wallScript = '<div class=\"wrapper\"><div class=\"outer\">',
            innerScript = ['<div class=\"inner1\">', '<div class=\"inner2\">', '<div class=\"inner3\">'],
            cnt = 0;
        const row = 2;

        for (var i = 0; coverflowImage.length; i++) {
            if (coverflowImage[i] === undefined) {
                break;
            }

            innerScript[cnt++] += '<figure><img src=\"images/' + coverflowImage[i] + '\"' + '></figure>';

            if (cnt > row) {
                cnt = 0;
            }
        }
        for (var j = 0; j <= row; j++) {
            innerScript[j] += '</div>';
        }
        wallScript += innerScript + '</div></div>';
        script = wallScript.replace(/,/g, '');
    }

    _onYoutubeChange3dWall() {
        var wallScript = '<div class=\"wrapper\"><div class=\"outer\">',
            innerScript = ['<div class=\"inner1\">', '<div class=\"inner2\">', '<div class=\"inner3\">'],
            cnt = 0;
        const row = 2;

        for (var i = 0; i < wallArray.length; i = i + 2) {
            if (wallArray[i] === undefined) {
                console.log('wallArray is undefined.');
                break;
            }

            innerScript[cnt++] += '<figure><a href=\"https://youtube.com/watch?v=' + wallArray[i]
                                + '\" target=\"_blank\"><img src=\"' + wallArray[i + 1] + '\" width=\"100px\" height=\"100px\"></a></figure>';

            if (cnt > row) {
                cnt = 0;
            }
        }
        for (var j = 0; j <= row; j++) {
            innerScript[j] += '</div>';
        }
        wallScript += innerScript + '</div></div>';
        script = wallScript.replace(/,/g, '');
    }

    _onParserUrl(callback) {
        var wallScript = '<div class=\"wrapper\"><div class=\"outer\">',
            innerScript = ['<div class=\"inner1\">', '<div class=\"inner2\">', '<div class=\"inner3\">'],
            url;
        var locate, end = 0;
        const filePath = '/projects/images/youtube_result_dog';

        fs.readFile(filePath, 'utf8', (err, data) => {
            var urlArray = new Array(),
                thumbArray = new Array();

            if (err) throw err;
            if (wallArray.length > 0) {
                wallArray = [];
            }
            if (data.length > 0) {
                // Get a unique value for a video.
                do {
                    locate = data.indexOf('data-context-item-id', locate + 1);
                    if (locate === -1) {
                        break;
                    }
                    url = data.substring(locate + 22, locate + 33);
                    urlArray.push(url);
                } while (locate + 1 < data.length && locate != -1);

                // Case 1 : Extract link from src with 'https'
                do {
                    locate = data.indexOf('src=\"http', locate + 1);
                    end = data.indexOf('\"', locate + 6);
                    if (locate === -1) {
                        break;
                    }
                    url = data.substring(locate + 5, end);
                    thumbArray.push(url);
                } while (locate + 1 < data.length && locate != -1);

                // Case 2 : Extract data from data-thumb because it does not contain 'https'
                do {
                    locate = data.indexOf('data-thumb', locate + 1);
                    end = data.indexOf('\"', locate + 12);
                    if (locate === -1) {
                        break;
                    }
                    url = data.substring(locate + 12, end);
                    thumbArray.push(url);
                } while (locate + 1 < data.length && locate != -1);

                for (var uIndex = 0; uIndex < urlArray.length; uIndex++) {
                    for (var tIndex = 0; tIndex < thumbArray.length; tIndex++) {
                        if (thumbArray[tIndex].indexOf(urlArray[uIndex]) !== -1) {
                            wallArray.push(urlArray[uIndex]);
                            wallArray.push(thumbArray[tIndex]);
                        }
                    }
                }

                callback();
            }
        });
    }

    /**
     * Step change value
     * @param {HTMLElement} target
     * @param {number} step
     * @private
     */
    _stepChangeValue(target, step) {
        var value = target.value,
            matches = [],
            sufix = '';

        if (value !== null) {
            if (typeof value === 'string') {
                matches = value.match(/(^[-0-9.]+)(.*)$/);
                if (matches) {
                    sufix = matches[2];
                    if (CSS_UNITS.indexOf(sufix) > -1) {
                        target.value = (parseFloat(matches[1]) + step) + sufix;
                    }
                }
            }
        }
    }

    /**
     * Change number Input
     * @param {Event} e
     * @private
     */
    _changeNumberInput(e) {
        switch (e.keyCode) {
        case 37: // cursor key left
            break;
        case 38: // cursor key up
            this._stepChangeValue(e.target, 1);
            // confirm attribute change
            this.onCommonStyleChange(e);
            break;
        case 39: // cursor key right
            break;
        case 40: // cursor key down
            this._stepChangeValue(e.target, -1);
            // confirm attribute change
            this.onCommonStyleChange(e);
            break;
        }
    }

    /**
     * key down callback
     * @param {Event} e
     */
    onCommonStyleKeydown(e) {
        var keyCode = e.keyCode;

        if (this._selectedElementId) {
            if (keyCode === 13) { // Enter
                this.onCommonStyleChange(e);
            } else if (keyCode >= 37 && keyCode <= 40) { // Cursors
                this._changeNumberInput(e);
            }
        }
    }

    /**
     * Updates attributes.
     * @param {HTMLElement} el
     * @param {string} attribute
     * @private
     */
    _updateAttributes(el, attribute) {
        var self = this,
            styles = el.style,
            content = el.content,
            listElements = self._AttributeElementLists[attribute + 'Elements'];

        Object.keys(listElements).forEach((item) => {
            var value = styles[item] || '';
            switch (item) {
            case 'borderColor':
                listElements[item].val(rgba2hex(value));
                break;
            case 'backgroundColor':
                listElements[item].val(rgba2hex(value));
                break;
            case 'backgroundImage':
                self._applyBackgroundImageInfo(value);
                break;
            case 'color':
                listElements[item].val(rgba2hex(value));
                break;
            case 'fontFamily':
                listElements[item].val(value.replace(/^"(.*)"$/, '$1'));
                break;
            case 'content':
                listElements[item].val(content);
                break;
            default:
                listElements[item].val(value);
            }
        });
    }
}

const AttributeElement = document.registerElement('closet-attribute-element', Attribute);

export {AttributeElement, Attribute};
