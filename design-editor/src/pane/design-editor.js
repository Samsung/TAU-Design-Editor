/* eslint-disable no-console */
'use babel';

import $ from 'jquery';
import {projectManager} from '../system/project-manager';
import {EVENTS, eventEmitter} from '../events-emitter';
import {StateManager} from '../system/state-manager';
import LibraryCreator from '../system/libraries/library-creator';
import utils from '../utils/utils';
import pathUtils from '../utils/path-utils';

let globalId = 0;
let newElementId = 0;
let componentPackages;
const INTERNAL_ID_ATTRIBUTE = 'data-id';
const ST_DEVICE_ATTRIBUTE = 'st-device';
const ST_DEVICE_HANDLE_ATTRIBUTE = 'st-device-handle';
const UI_PAGE_SELECTOR = 'div.ui-page';
const upperCase = /[A-Z]/g;

/**
 * Generate Unique ID
 * @returns {string}
 */
function uniqueId() {
    return 'cl-' + (globalId += 1);
}

/**
 * @param {Element} node
 * @returns {Element}
 */
function addDataId(node) {
    if (node.setAttribute) {
        node.setAttribute(INTERNAL_ID_ATTRIBUTE, uniqueId());
    }
    [].forEach.call(node.children, (childNode) => {
        addDataId(childNode);
    });
    return node;
}

/**
 * @param {Element} node
 * @returns {Element}
 */
function removeDataId(node) {
    if (node.removeAttribute) {
        node.removeAttribute(INTERNAL_ID_ATTRIBUTE);
    }
    [].forEach.call(node.children, (childNode) => {
        removeDataId(childNode);
    });
    return node;
}

/**
 * @param {string} id
 * @param {HTMLElement} element
 * @param {string} name
 */
function removeAttribute(id, element, name) {
    if (element) {
        element.removeAttribute(name);
        eventEmitter.emit(EVENTS.RemoveAttribute, id, name);
    } else {
        console.debug('check: removeAttribute: element is null');
    }
}

/**
 * @param {Element} node
 * @param {string} id
 * @returns {*|Element}
 */
function findById(node, id) {
    console.log('findById', node, id);
    return node.querySelector('[' + INTERNAL_ID_ATTRIBUTE + '=' + id + ']');
}

/**
 * @param {string} id
 * @param {Element} element
 * @param {string} name
 * @param {string} value
 */
function setStyle(id, element, name, value) {
    if (element) {
        element.style[name] = value;
        eventEmitter.emit(EVENTS.ChangeStyle, id, name, value);
    } else {
        console.debug('check: setStyle: element is null');
    }
}

/**
 * @param {string} id
 * @param {Object} keyframe
 * @param {string} name
 * @param {string} value
 * @param {number} time
 */
function setKeyframeStyle(id, keyframe, name, value, time) {
    keyframe.style[name] = value;
    eventEmitter.emit(EVENTS.ChangeStyle, id, name, value, time);
}

/**
 * @param {string} id
 * @param {HTMLElement} element
 * @param {string} name
 * @param {string} value
 */
function setAttribute(id, element, name, value) {
    if (element) {
        element.setAttribute(name, value);
        eventEmitter.emit(EVENTS.ChangeAttribute, id, name, value);
    } else {
        console.debug('check: setAttribute: element is null');
    }
}

/**
 * @param {string} id
 * @param {HTMLElement} element
 * @param {string} value
 */
function setContent(id, element, value) {
	console.log('setContent', id, element, value);
    if (element) {
        element.innerHTML = value;
        if (element.children.length) {
            Array.prototype.forEach.call(element.children, (childElement) => {
                if (!childElement.getAttribute(INTERNAL_ID_ATTRIBUTE)) {
                    addDataId(childElement);
                }
            });
        }
        eventEmitter.emit(EVENTS.ChangeContent, id, element.innerHTML);
    } else {
        console.debug('check: setContent: element is null');
    }
}

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement} element
 * @param {HTMLElement} prev
 */
function insertElement(parent, element, prev) {
    console.log('insertElement');

    if (prev) {
        $(prev).after(element);
    } else {
        $(parent).prepend(element);
    }

    eventEmitter.emit(EVENTS.ElementInserted,
        parent.getAttribute(INTERNAL_ID_ATTRIBUTE),
        element.getAttribute(INTERNAL_ID_ATTRIBUTE),
        element.outerHTML,
        prev && prev.getAttribute(INTERNAL_ID_ATTRIBUTE));

}

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement} element
 */
function removeElement(parent, element) {
	console.log('removeElement');
    parent.removeChild(element);
    eventEmitter.emit(EVENTS.ElementDeleted,
        element.getAttribute(INTERNAL_ID_ATTRIBUTE));
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @param {HTMLElement} sibling
 */
function moveElement(element, parent, sibling) {
    if (sibling) {
        $(sibling).after(element);
    } else {
        let $sibling = $(parent).find('[' + INTERNAL_ID_ATTRIBUTE + ']');
        if ($sibling.length) {
            $(element).insertBefore($sibling.eq(0));
        } else {
            $(parent).prepend(element);
        }
    }

    eventEmitter.emit(EVENTS.ElementMoved,
        element.getAttribute(INTERNAL_ID_ATTRIBUTE),
        parent.getAttribute(INTERNAL_ID_ATTRIBUTE),
        sibling && sibling.getAttribute(INTERNAL_ID_ATTRIBUTE));
}

/**
 * @param {HTMLElement} element
 * @param {string} selector
 * @returns {*}
 */
function closest(element, selector) {
    var current = element;
    while (current && current.webkitMatchesSelector) {
        if (current.webkitMatchesSelector(selector)) {
            return current;
        }
        current = current.parentNode;
    }
    return null;
}

/**
 * @param {string} letter
 * @returns {string}
 */
function convertFromUpperCase(letter) {
    return '-' + letter.toLowerCase();
}

class Model {
	/**
     * Constructor
     */
	constructor() {
		this._DOM = null;
		this._history = [];
		this._undoHistory = [];
		this._keyframes = {};
		this._keyframeId = null;
		this._animations = [];
		this._animationGroups = new Map();
		this._behaviors = {};
		this._tauCommHosts = [];
		this._checkbox = {};
		this._dirty = false;
		this._libraryCreator = new LibraryCreator();
	}

    /**
     * Generate id
     * @param {HTMLElement} element
     * @returns {string}
     * @private
     */
    _generateElementId(element) {
        let originalElementId = element.getAttribute('id');
        if (!originalElementId) {
            do {
                originalElementId = 'element-' + (newElementId += 1);
            } while (this._DOM.getElementById(originalElementId));
            element.setAttribute('id', originalElementId);
        }
        return originalElementId;
    }

    /**
     * Import behaviours from html file
     */
    importBehavior() {
        var script = this._DOM.querySelector('script[data-closet-behavior]');
        if (script) {
            try {
                this._behaviors = JSON.parse(script.textContent) || {};
            } catch (e) {
                console.warn(e);
                this._behaviors = {};
            }
        }
    }

    /**
     * Import animations
     */
    importAnimation() {
        var style = this._DOM.querySelector('style[data-style="animation"]'),
            content = style && style.textContent,
            keyframes = (content && content.split('@keyframes')) || [],
            animationRegex = /\.([a-zA-Z0-9-]+) #([a-zA-Z0-9-]+)[\s\S]*?animation: ([^ ]+) ([^ ]+)ms ([^ ]+) ([^ ]+)ms;/gm,
            match,
            ids = new Map();

        while (match = animationRegex.exec(content)) {
            const animationId = match[1],
                elementId = match[2],
                keyframe = match[3],
                time = parseInt(match[4], 10),
                functionName = match[5],
                delay = parseInt(match[6], 10);
            ids.set(keyframe, {animationId, elementId, time, functionName, delay});
        }

        keyframes.forEach((keyframe) => {
            const keyFrameMatch = /([a-zA-Z0-9-]+) {([\s\S]*)}/gm.exec(keyframe.trim());
            if (keyFrameMatch) {
                const keyframeId = keyFrameMatch[1],
                    keyframeInfo = ids.get(keyframeId),
                    elementId = keyframeInfo && keyframeInfo.elementId,
                    animationId = keyframeInfo && keyframeInfo.animationId,
                    animationDescription = keyFrameMatch[2].split('}'),
                    internalId = keyframeInfo && this._DOM.getElementById(elementId).getAttribute('data-id');
                if (keyframeInfo) {
                    let keyframesImportObject = {},
                        animationsArray = null,
                        animationGroup = this._animationGroups.get(animationId);

                    if (!animationGroup) {
                        animationGroup = {
                            keyframes: {},
                            animations: []
                        };
                        this._animationGroups.set(animationId, animationGroup);
                    }
                    keyframesImportObject = animationGroup.keyframes;
                    animationsArray = animationGroup.animations;
                    keyframesImportObject[keyframeInfo.delay] = keyframesImportObject[keyframeInfo.delay] || [];
                    keyframesImportObject[keyframeInfo.time + keyframeInfo.delay] = keyframesImportObject[keyframeInfo.time + keyframeInfo.delay] || [];
                    animationDescription.forEach((animation) => {
                        const animationMatch = /([0-9]+)% {([\s\S]*)/gm.exec(animation);
                        if (animationMatch) {
                            const position = animationMatch[1] === '0' ? keyframeInfo.delay : keyframeInfo.time + keyframeInfo.delay,
                                styles = animationMatch[2],
                                stylesObject = {};
                            styles.split(';').forEach((styleItem) => {
                                const data = styleItem.split(':').map(item => item.trim());
                                if (data[0] && data[1]) {
                                    stylesObject[data[0]] = data[1];
                                }
                            });
                            keyframesImportObject[position] = keyframesImportObject[position] || [];
                            keyframesImportObject[position].push({
                                id: internalId,
                                style: stylesObject
                            });
                        }
                    });
                    if (!(animationsArray.filter(function (item) {
                        return item.fromTime === keyframeInfo.delay && item.toTime === keyframeInfo.time + keyframeInfo.delay && item.id === internalId;
                    }).length)) {
                        animationsArray.push({
                            functionName: keyframeInfo.functionName,
                            fromTime: keyframeInfo.delay,
                            toTime: keyframeInfo.time + keyframeInfo.delay,
                            fromKeyframe: keyframesImportObject[keyframeInfo.delay].filter(keyframeItem => keyframeItem.id === internalId)[0],
                            toKeyframe: keyframesImportObject[keyframeInfo.time + keyframeInfo.delay].filter(keyframeItem => keyframeItem.id === internalId)[0],
                            id: internalId
                        });
                    }
                }
            }
        });
    }

    importCheckboxStyle() {
      var style = this._DOM.querySelector('style[data-style=checkbox]');
      const colorsPattern = /[^(background:)]#[\w]{6}/gm,  // pattern for color value
      imgPattern = /[^(url\()]\w+\/\w+.svg/gm,
      classpattern = /custom-checkbox-\d{1,}/gm;
      if (style) {
        let img, color, selector;
        this._generateElementId(style);
        color = [...new Set(style.textContent.match(colorsPattern))];
        img = [...new Set(style.textContent.match(imgPattern))];
        selector = [...new Set(style.textContent.match(classpattern))];
        if (color.length !== 0) {
          for(let i = 0; i < color.length; i++) {
            this._checkbox[selector[i]] = {
              color: color[i].trim(),
              imgDisabled: img ? img[2 * i] : undefined,
              imgEnabled: img ? img[2 * i + 1] : undefined
            }
          }
        }
        console.log('Checkbox Model', this._checkbox);
      }
    }
    /**
     * Init
     * @param {HTMLElement} iframeDocument
     * @param {Object} componentPackagesFromCloset
     * @param {Object} _designEditor
     */
    init(iframeDocument, componentPackagesFromCloset, _designEditor) {
        console.log('design-editor.init()');
        this._DOM = addDataId(iframeDocument).cloneNode(true);
        this.importAnimation();
        this.importBehavior();
        this.importCheckboxStyle();
        this._disableIotivityRestImpl();
        this._history = [];
        this._undoHistory = [];
        this._designEditor = _designEditor;
        this._capabilities = this._getSmartThingsCapabilities()
        componentPackages = componentPackagesFromCloset;
    }

	/**
	 * Update
	 * @param {HTMLElement} iframeDocument
	 */
	update(iframeDocument) {
        console.log('design-editor.update()');
        this._DOM = addDataId(iframeDocument);
        this._disableIotivityRestImpl();
	}

	/**
     * Update one style
     * @param {string} id
     * @param {string} name
     * @param {string} value
     * @private
     */
    _updateOneStyle(id, name, value) {
        var element = findById(this._DOM, id);

        if (element) {
            if (this._keyframeId === null) {
                setStyle(id, element, name, value);
            } else {
                setKeyframeStyle(id, this.getKeyFrameElement(this._keyframeId, id) ||
                    this.addKeyFrame(this._keyframeId, id), name, value, this._keyframeId);
            }
        } else {
            console.debug('check: element is null');
        }
    }

    /**
     * Raplace element
     * @param {string} id
     * @param {Object} componentInfo
     */
    replaceElement(id, componentInfo) {
        var parentId = $(findById(this._DOM, id)).parent().attr('data-id');
        this.insert(parentId, componentInfo, id);
        $(findById(this._DOM, id)).remove();
    }

    /**
     * Update style
     * @param {string} id
     * @param {string} name
     * @param {string} value
     * @param {string} previousValue
     */
    updateStyle(id, name, value, previousValue) {
        var self = this,
            element = findById(this._DOM, id),
            previousValues = {},
            styles = {};

        if (typeof name === 'string') {
            this._updateOneStyle(...arguments);
            styles[name] = value;
            previousValues[name] = previousValue || element.style[name];
        } else {
            styles = name;
            if (value) {
                previousValues = value;
            }
            Object.keys(name).forEach((key) => {
                self._updateOneStyle(id, key, name[key]);
                if (previousValues[key] === undefined) {
                    previousValues[key] = element.style[key];
                }
            });
        }
        this._undoHistory = [];
        this._history.push({
            id: id,
            operation: 'style',
            styles: styles,
            previousValues: previousValues
        });
        this.dirty();
    }

    /**
     * Update attribute
     * @param {string} id
     * @param {string} name
     * @param {string} value
     */
    updateAttribute(id, name, value) {
        var element = findById(this._DOM, id),
            previousValue = element.getAttribute(name);
        if (previousValue !== value) {
            setAttribute(id, element, name, value);
            this._undoHistory = [];
            this._history.push({
                id: id,
                operation: 'attribute',
                name: name,
                value: value,
                previousValue: previousValue
            });
            this.dirty();
        }
    }

    /**
     * Remove attribute
     * @param {string} id
     * @param {string} name
     */
    removeAttribute(id, name) {
        const element = findById(this._DOM, id),
            previousValue = element.getAttribute(name);

        if (element.hasAttribute(name)) {
            removeAttribute(id, element, name);
            this._undoHistory = [];
            this._history.push({
                id: id,
                operation: 'attribute',
                name: name,
                value: '',
                previousValue: previousValue
            });
            this.dirty();
        }
    }

    /**
     * Update content
     * @param {string} id
     * @param {string} value
     */
    updateText(id, value) {
        var element, previousValue;

        element = findById(this._DOM, id);

        if (element) {
            previousValue = element.innerHTML;

            if (previousValue !== value) {
                setContent(id, element, value);
                this._undoHistory = [];
                this._history.push({
                    id: id,
                    operation: 'content',
                    value: value,
                    previousValue: previousValue
                });
                this.dirty();
            }
        } else {
            console.debug('CHECK: updateText null');
        }
    }

    /**
     * Create new element
     * @param {Document} targetDoc
     * @param {Object} componentInfo
     * @returns {Element}
     * @private
     */
    _createNewElement(targetDoc, componentInfo) {
        var name = '',
            template = '',
            fragment = targetDoc.createElement('div');

        if (typeof componentInfo === 'string') {
            template = componentInfo;
        } else {
            name = componentInfo.name;
            template = componentInfo.options.template;
        }
        targetDoc = targetDoc || document;

        if (template) {
            fragment.innerHTML = template;
        } else {
            fragment.innerHTML = targetDoc.createElement(name);
        }
        if (fragment.firstElementChild) {
            addDataId(fragment.firstElementChild);
        }
        return fragment.firstElementChild;
    }

    /**
     * Wrap children by string
     * @param {HTMLElement} element
     * @param {string} wrapString
     */
    wrapChildren(element, wrapString) {
        var $element = $(findById(this._DOM, $(element).attr(INTERNAL_ID_ATTRIBUTE))),
            $wrap = $(wrapString),
            $childWrap = null;
        if ($element.length > 0) {
            $childWrap = $element.children($wrap.prop('tagName'));
            if ($childWrap.length === 0) {
                $element.children().wrapAll(wrapString);
            } else {
                $childWrap.append($childWrap.siblings());
            }
        }
    }

    /**
     * Insert element
     * @param {string} parent_id
     * @param {Object} componentPackageInfo
     * @param {HTMLElement} prevSibling_id
     * @returns {string}
     */
    insert(parent_id, componentPackageInfo, prevSibling_id) {
        var parent = parent_id instanceof HTMLElement ? parent_id : findById(this._DOM, parent_id),
            element = this._createNewElement(this._DOM, componentPackageInfo),
            id = element.getAttribute(INTERNAL_ID_ATTRIBUTE),
            prev = findById(this._DOM, prevSibling_id);

        if (parent) {
            insertElement(parent, element, prev);
            // TODO Each component should be made independently, but now template has full components.
            // componentPackageInfo.copyToProject(ProjectManager.getActiveProjectInfo().projectPath, this._DOM);
        }

        this._undoHistory = [];
        this._history.push({
            id: id,
            operation: 'insert',
            parent_id: parent_id,
            prev_id: prevSibling_id
        });
        this.dirty();

        return id;
    }


    /**
     * Delete element
     * @param {string} id
     */
    delete(id) {
        var element = findById(this._DOM, id),
            parent = element.parentNode;

        removeElement(parent, element);

        this._undoHistory = [];
        this._history.push({
            operation: 'delete',
            element: element,
            parent_id: parent.getAttribute('data-id'),
            prevSibling_id: element.previousElementSibling && element.previousElementSibling.getAttribute('data-id')
        });
        this.dirty();
    }

    /**
     * Move element
     * @param {string} id
     * @param {string} parentId
     * @param {string} siblingId
     * @returns {*}
     */
    move(id, parentId, siblingId) {
        var element = findById(this._DOM, id),
            parent = element.parentNode,
            prevParentId = parent.getAttribute('data-id'),
            prevSiblingId = element.previousElementSibling && element.previousElementSibling.getAttribute('data-id');

        moveElement(element, findById(this._DOM, parentId), findById(this._DOM, siblingId));

        this._undoHistory = [];
        this._history.push({
            operation: 'move',
            element: element,
            parent_id: parentId,
            sibling_id: siblingId,
            prevParent_id: prevParentId,
            prevSibling_id: prevSiblingId
        });
        this.dirty();

        return id;
    }

    /**
     * Export animation
     * @param {string} name
     * @param {Object} animations
     * @returns {string}
     */
    exportAnimationName(name, animations) {
        var DOM = this._DOM,
            styleContent = '',
            element = null,
            originalElementId,
            time = 0,
            functionName = '',
            animationId = 0,
            exportData = new Map(),
            objectKey = null,
            delay;

        Object.keys(animations).forEach((key) => {
            time = animations[key].toTime - animations[key].fromTime;
            delay = animations[key].fromTime;
            functionName = animations[key].functionName;
            // fromKeyframe can be array or one element
            [].concat(animations[key].fromKeyframe).forEach((operations) => {
                element = findById(DOM, operations.id);
                if (element) {
                    originalElementId = this._generateElementId(element);
                    objectKey = [name, originalElementId, time, functionName].join('-');
                    if (!exportData.has(objectKey)) {
                        exportData.set(objectKey, {
                            name,
                            originalElementId,
                            time,
                            delay,
                            functionName,
                            frames: []
                        });
                    }
                    exportData.get(objectKey).frames.push({
                        position: 0,
                        styles: operations.style
                    });
                }
            });
            // toKeyframe can be array or one element
            [].concat(animations[key].toKeyframe).forEach((operations) => {
                element = findById(DOM, operations.id);
                if (element) {
                    originalElementId = element.getAttribute('id');
                    if (!originalElementId) {
                        do {
                            originalElementId = 'animation-' + (animationId += 1);
                        } while (DOM.getElementById(originalElementId));
                        element.setAttribute('id', originalElementId);
                    }
                    objectKey = [name, originalElementId, time, functionName].join('-');
                    if (!exportData.has(objectKey)) {
                        exportData.set(objectKey, {
                            name,
                            originalElementId,
                            time,
                            delay,
                            functionName,
                            frames: []
                        });
                    }
                    exportData.get(objectKey).frames.push({
                        position: 100,
                        styles: operations.style
                    });
                }
            });
        });
        exportData.forEach((value) => {
            styleContent += '@keyframes ' + value.name + '-' + value.originalElementId + ' {';
            value.frames.forEach((data) => {
                styleContent += data.position + '% {';
                Object.keys(data.styles).forEach((styleName) => {
                    styleContent += styleName.replace(upperCase, convertFromUpperCase) + ': ' + data.styles[styleName] + ';';
                });
                styleContent += '}';
            });
            styleContent += '}';
            styleContent += '.' + value.name + ' #' + value.originalElementId + ' {';
            styleContent += ' animation: ' + value.name + '-' + value.originalElementId + ' ' + value.time + 'ms ' + value.functionName + ' ' + value.delay + 'ms;';
            styleContent += '}';
        });
        console.log(styleContent);
        return styleContent;
    }


    /**
     * Export behaviours
     */
    exportBehaviour() {
        return JSON.stringify(this._behaviors);
    }

    /**
     * Get smart things capabilities
     * @returns {[string]} Array of capabilities names
     */
    _getSmartThingsCapabilities() {
        const capabilitiesMap = {};
        this._DOM.querySelectorAll(`[${ST_DEVICE_ATTRIBUTE}]`).forEach(stDeviceHtmlElement => {
            const capability = stDeviceHtmlElement.getAttribute(ST_DEVICE_ATTRIBUTE);
            // Device profile creator in [1] does not allow multiple capability of the same type.
            // [1] https://devworkspace.developer.samsung.com
            capabilitiesMap[capability] = true; // assigned value does not matter, we are interested in keys only.
        });
        return Object.keys(capabilitiesMap);
    }

    /**
     * Get smart things capabilities if changed
     * @returns {[string]|null} Array of capabilities names or null if capabilities not changed
     */
    getSmartThingsCapabilitiesIfChanged() {
        const capabilities = this._getSmartThingsCapabilities();
        return (this._capabilities.length !== capabilities.length ||
            !this._capabilities.every((capability, index) => capability === capabilities[index]))
            ? capabilities
            : null;
    }

    /**
     * Adds script disabling iotivity rest implementation
     */
    _disableIotivityRestImpl() {
        if (!this._DOM) {
            return;
        }
        const stScript = this._DOM.querySelector('script[data-closet-sthings]');
        if (!stScript) {
            return;
        }
        let stDisabledScript = this._DOM.querySelector('script[data-closet-sthings-disabled]');
        if (stDisabledScript) {
            return;
        }
        stDisabledScript = document.createElement('script');
        stDisabledScript.setAttribute('type', 'text/javascript');
        stDisabledScript.setAttribute('data-closet-sthings-disabled', 'true');
        stDisabledScript.innerHTML = 'const DISABLE_IOTIVITY_REST_IMPL = true;';
        stScript.parentNode.insertBefore(stDisabledScript, stScript);
    }

    /**
     * Modifies device handle in document
     * @param {object} deviceHandleModification Device handle modification object
     */
    _updateDeviceHandle(deviceHandleModification) {
        const uiPageDiv = this._DOM.body.querySelector(UI_PAGE_SELECTOR);
        if (!uiPageDiv) {
            return console.error(`No ${uiPageDiv} found`);
        }
        if (deviceHandleModification.remove) {
            uiPageDiv.removeAttribute(ST_DEVICE_HANDLE_ATTRIBUTE);
        } else {
            uiPageDiv.setAttribute(ST_DEVICE_HANDLE_ATTRIBUTE, deviceHandleModification.deviceHandle);
        }
    }

    /**
     * Export all data
     * @param {boolean} iotivityRestImplDisabledScript
     * @param {object|null} deviceHandleModification Device handle modification object or null if not modified
     * @returns {string}
     */
    export(iotivityRestImplDisabledScript, deviceHandleModification) {
        var self = this,
            screen = StateManager.get('screen'),
            scripts = [].slice.call(self._DOM.querySelectorAll('script')),
            found = scripts.some(function (script) {
                var text = script.textContent,
                    quote,
                    cfg;

                if (script.src.match(/multiprofile/i)) { // test for tau multiprofile
                    script.setAttribute('data-tau-profile', screen.profile);
                    script.setAttribute('data-tau-shape', screen.shape);
                    return true;
                }

                if (text.match(/tauconfig/i)) {
                    quote = text.match(/'[^']+':/i) ? '\'' : '"';
                    text = text
                        .replace(/var[^=]+=/i, '')
                        .replace(/([^'"\s]+):/gi, quote + '$1' + quote + ':')
                        .replace(/([^;]+);\s*$/i, '$1');
                    cfg = null
                    try {
                        cfg = JSON.parse(text);
                    } catch (err) {
                        console.error(err);
                    }

                    if (cfg) {
                        cfg.profile = screen.profile;
                        cfg.shape = screen.shape;

                        script.textContent = 'var tauConfig = ' + JSON.stringify(cfg) + ';';
                        return true;
                    }
                }

                return false;
            }),
            script,
            head;

        if (!found) {
            script = document.createElement('script');
            head = self._DOM.head;
            script.setAttribute('type', 'text/javascript');
            script.textContent = 'var tauConfig = ' + JSON.stringify({
                profile: screen.profile,
                shape: screen.shape
            }) + ';';
            head.insertBefore(script, head.firstElementChild);
        }

        if (this._DOM.body.querySelector('r-type')) {
            var rtypeScript = this._DOM.querySelector('script[data-closet-rtype]') || document.createElement('script');
            rtypeScript.setAttribute('src', 'libs/r-type.min.js');
            rtypeScript.setAttribute('data-closet-rtype', 'true');
            projectManager.createLibFromTemplate('r-type.min.js');
            this._DOM.head.appendChild(rtypeScript);
        }

        var styleContent = '',
            style = this._DOM.querySelector('style[data-style="animation"]') || document.createElement('style'),
            customstyle = this._DOM.querySelector('style[data-style="checkbox"]') || document.createElement('style'),
            script = this._DOM.querySelector('script[data-closet-behavior]') || document.createElement('script'),
            stscript = this._DOM.querySelector('script[data-closet-sthings]'),
            stDisabledScript = this._DOM.querySelector('script[data-closet-sthings-disabled]'),
            scriptRunner = this._DOM.querySelector('script[data-closet-behavior-runner]') || document.createElement('script');

        style.setAttribute('data-style', 'animation');
        customstyle.setAttribute('data-style', 'checkbox');
        script.setAttribute('data-closet-behavior', 'true');
        script.setAttribute('type', 'application/json');
		scriptRunner.setAttribute('data-closet-behavior-runner', 'true');
        scriptRunner.setAttribute('src', pathUtils.createProjectPath('/lib/behaviour.js', true));
        scriptRunner.setAttribute('type', 'text/javascript');
        scriptRunner.setAttribute('defer', 'true');
        this._DOM.head.appendChild(style);
        // append r-type.min.js if the document has r-type element
        // if (this._DOM.body.querySelector('r-type')) {
        //     var rtypeScript = document.createElement('script');
        //     rtypeScript.setAttribute('src', 'libs/r-type.min.js');
        //     projectManager.createLibFromTemplate('r-type.min.js');
        //     this._DOM.head.appendChild(rtypeScript);
        // }

		this._DOM.body.appendChild(scriptRunner);
		this.addLibrary('back-button-support.js');
		if (screen.shape == 'circle') {
			this.addLibrary('tau.circle.css');
			this.addLibrary('circle-helper.js');
		}
        for (const [key, value] of this._animationGroups) {
            styleContent += this.exportAnimationName(key, value.animations);
        }

        // append tau-sthings.js binding sevice if any element has stings props
        if (!stscript) {
            if (this._DOM.body.querySelector(`[${ST_DEVICE_ATTRIBUTE}]`)) {
                const uiPageDiv = this._DOM.body.querySelector(UI_PAGE_SELECTOR);
                if (uiPageDiv) {
                    console.log('detected S-Things bindings!');
                    stscript = document.createElement('script'),
					stscript.setAttribute('src', 'lib/sthings.min.js');
                    stscript.setAttribute('type', 'text/javascript');
                    stscript.setAttribute('data-closet-sthings', 'true');
                    projectManager.createLibFromTemplate('sthings.min.js');
                    uiPageDiv.appendChild(stscript);
                } else {
                    console.error('No ui-page');
                }
            }
        } else {
            if (iotivityRestImplDisabledScript) {
                this._disableIotivityRestImpl();
            } else if (stDisabledScript) {
                stDisabledScript.parentNode.removeChild(stDisabledScript);
            }
        }
        if (deviceHandleModification) {
            this._updateDeviceHandle(deviceHandleModification)
        }
        style.textContent = styleContent;
        this._DOM.body.appendChild(script);
        script.textContent = this.exportBehaviour();
        console.log('copy behaviour.js...');
        projectManager.createLibFromTemplate('behaviour.js', function () {
            console.log('[OK] copied behaviour.js');
        });

        return removeDataId(this._DOM.cloneNode(true)).documentElement.outerHTML;
    }

	addLibrary(libraryName) {
		const helper = this._libraryCreator.createLibrary(libraryName);
		if (!this._DOM.querySelector(helper.getSelector())) {
			this._DOM.head.appendChild(
				helper.createHTMLElement(
					utils.checkGlobalContext('globalData').fileUrl
				)
			);
		}
		helper.insertLibContent(() => {
			// eslint-disable-next-line no-console
			console.log(`[OK] File ${libraryName} copied!`);
		});
	}

    /**
     * Export HTML
     * @returns {Node|*|null|string}
     */
    getHTML() {
        return this._DOM && this._DOM.documentElement.outerHTML;
    }

    /**
     * Is init?
     * @returns {boolean}
     */
    isInit() {
        return !!this._DOM;
    }

    isDirty() {
        return this._dirty;
    }

    dirty() {
        console.log('marking document as dirty');
        this._dirty = true;
        eventEmitter.emit(EVENTS.DocumentDirty, this);
    }

    clean() {
        console.log('marking document as clean');
        this._dirty = false;
        this._capabilities = this._getSmartThingsCapabilities();
        eventEmitter.emit(EVENTS.DocumentClean, this);
    }

    /**
     * Undo operation
     */
    undo() {
        var state = null,
            element = null,
            parent = null;
        if (!this._disableHisotry) {
            state = this._history.pop();
            element = null;
            if (state) {
                element = state.element || findById(this._DOM, state.id);
                if (state.parent_id) {
                    parent = findById(this._DOM, state.parent_id);
                }

                this._undoHistory.push(state);

                switch (state.operation) {
                case 'style':
                    Object.keys(state.styles).forEach((name) => {
                        setStyle(state.id, element, name, state.previousValues[name]);
                    });
                    break;
                case 'attribute':
                    setAttribute(state.id, element, state.name, state.previousValue);
                    break;
                case 'insert':
                    state.parent = element.parentNode;
                    state.element = element;
                    removeElement(element.parentNode, element);
                    break;
                case 'delete':
                    insertElement(parent, element, findById(this._DOM, state.prevSibling_id));
                    break;
                case 'move':
                    moveElement(element, findById(this._DOM, state.prevParent_id), findById(this._DOM, state.prevSibling_id));
                    break;
                case 'content':
                    setContent(state.id, element, state.previousValue);
                    break;
                }
            }
            this.dirty();
        }
    }

    /**
     * REDO operation
     */
    redo() {
        var state = null,
            element = null,
            parent = null;
        if (!this._disableHisotry) {
            state = this._undoHistory.pop();
            if (state) {
                element = state.element || findById(this._DOM, state.id);
                if (state.parent_id) {
                    parent = findById(this._DOM, state.parent_id);
                }

                if (!element) {
                    console.debug('check: element is null');
                    return;
                }

                this._history.push(state);
                switch (state.operation) {
                case 'style':
                    Object.keys(state.styles).forEach((name) => {
                        setStyle(state.id, element, name, state.styles[name]);
                    });
                    break;
                case 'attribute':
                    setAttribute(state.id, element, state.name, state.value);
                    break;
                case 'insert':
                    insertElement(state.parent, element);
                    break;
                case 'delete':
                    removeElement(parent, element);
                    break;
                case 'move':
                    moveElement(element, findById(this._DOM, state.parent_id), findById(this._DOM, state.sibling_id));
                    break;
                case 'content':
                    setContent(state.id, element, state.value);
                    break;
                }
            }
            this.dirty();
        }
    }

    /**
     * Return all elements
     * @returns {*}
     */
    getAllElements() {
        var elementsSelector = componentPackages && componentPackages.getAllComponentsSelector();
        // is selector string isn't empty
        if (elementsSelector) {
            return [].map.call(this._DOM.querySelectorAll(elementsSelector), element => ({
                id: element.getAttribute(INTERNAL_ID_ATTRIBUTE),
                component: componentPackages.getPackageByElement(element)
            }));
        }
        return [];

    }

    /**
     * Return all element in tree format
     * @returns {components.root|{children}}
     */
    getTreeElements() {
        var elementsSelector = componentPackages.getAllComponentsSelector(),
            components = {
                root: {
                    children: []
                }
            };
        // is selector string isn't empty
        if (elementsSelector) {
            [].map.call(this._DOM.querySelectorAll(elementsSelector), (element) => {
                var parent = closest(element.parentElement, elementsSelector),
                    id = element.getAttribute(INTERNAL_ID_ATTRIBUTE),
                    parentId = (parent && parent.getAttribute(INTERNAL_ID_ATTRIBUTE)) || 'root';
                components[id] = {
                    id: id,
                    parent: parentId,
                    component: componentPackages.getPackageByElement($(element)),
                    children: []
                };
                components[parentId].children.push(components[id]);
            });
        }
        return components.root;
    }

    /**
     * Return element by query
     * @param {string} query
     * @returns {*|Element}
     */
    getElementByQuery(query) {
        return this._DOM.querySelector(query);
    }

    /**
     * Return element
     * @param {string} id
     * @returns {{id: *, component: (*|{}|Object), attributes: boolean}}
     */
    getElement(id) {
        var element = findById(this._DOM, id),
            component = componentPackages.getPackageByElement($(element)),
            style = this._designEditor.getComputedStyle(id),
            keyframe = null;
        if (this._keyframeId !== null) {
            keyframe = this.getKeyFrameElement(this._keyframeId, id);
            if (keyframe) {
                Object.keys(keyframe.style).forEach((name) => {
                    style[name] = keyframe.style[name];
                });
            }
        }
        return {
            id: id,
            component: component,
            attributes: element ? [].map.call(element.attributes, attributeName => ({
                name: attributeName,
                value: element.attributes[attributeName]
            })) : [],
            // @TODO require analyze what should be style in the place, style attribute of element or computed styles
            style: style,
            content: (element && element.innerHTML) || ''
        };
    }

    /**
     * Get clear element
     * @param {string} id
     * @returns {Element}
     */
    getElementWithoutId(id) {
        var element = findById(this._DOM, id);

        return removeDataId(element.cloneNode(true));
    }

    /**
     * Returns text of title element
     * @returns {string|null}
     */
    getTitle() {
        let titleElement = this._DOM.querySelector('.ui-title');
        if (titleElement && titleElement.textContent) {
            return titleElement.textContent;
        }
        titleElement = this._DOM.querySelector('.ui-title-text-main');
        if (titleElement && titleElement.textContent) {
            return titleElement.textContent;
        }
        return null;
    }

    /**
     * Returns element from keyframe based on time and element ID
     * @param time
     * @param id
     * @returns {object}
     */
    getKeyFrameElement(time, id) {
        var keyframe = this.getKeyFrame(time);
        if (id !== null) {
            return keyframe && (keyframe.filter(item => item.id === id)[0]);
        }
        return keyframe;
    }

    /**
     * Returns element from keyframe based on time
     * @param time
     * @returns {object|null}
     */
    getKeyFrame(time) {
        return this._keyframes[time] || null;
    }

    /**
     * Get keyframes
     * @returns {Array|*|{}}
     */
    getKeyFrames() {
        return this._keyframes;
    }

    /**
     * Add keyframe
     * @param {number} time
     * @param {string} id
     * @returns {Object}
     */
    addKeyFrame(time, id) {
        var keyframe = this.getKeyFrameElement(time, id);
        if (!keyframe) {
            if (id) {
                keyframe = {
                    id: id,
                    style: {}
                };
            }
            this._keyframes = this._keyframes || [];
            this._keyframes[time] = this._keyframes[time] || [];
            if (keyframe) {
                this._keyframes[time].push(keyframe);
            } else {
                keyframe = this._keyframes[time];
            }
        }
        this.dirty();
        return keyframe;
    }

    /**
     * Get times of keyframes
     * @returns {Array}
     */
    getKeyFrameTimes() {
        return Object.keys(this._keyframes);
    }

    /**
     * Lock history save
     */
    lockHistory() {
        this._disableHisotry = true;
    }

    /**
     * Unlock history change
     */
    unlockHistory() {
        this._disableHisotry = false;
    }

    /**
     * Move keyframe
     * @param {number} time
     * @param {string} id
     * @param {number} newTime
     */
    editKeyFrame(time, id, newTime) {
        var self = this,
            keyframes = self._keyframes,
            editedKeyframe = self.getKeyFrameElement(time, id),
            index = keyframes[time].indexOf(editedKeyframe);

        if (time !== newTime) {
            keyframes[time].splice(index, 1);
            keyframes[newTime] = keyframes[newTime] || [];
            keyframes[newTime].push(editedKeyframe);
        }
        this.dirty();
    }

    /**
     * Remove key frame
     * @param {number} time
     * @param {string} id
     */
    removeKeyFrame(time, id) {
        var self = this,
            keyframes = self._keyframes,
            editedKeyframe = self.getKeyFrameElement(time, id),
            index = keyframes[time].indexOf(editedKeyframe);

        keyframes[time].splice(index, 1);
        this.dirty();
    }

    /**
     * Set animation
     * @param {string} id
     * @param {number} fromTime
     * @param {number} toTime
     * @param {string} functionName
     * @returns {number}
     */
    addAnimation(id, fromTime, toTime, functionName) {
        this._animations.push({
            id: id,
            fromTime: fromTime,
            toTime: toTime,
            fromKeyframe: this.addKeyFrame(fromTime, id),
            toKeyframe: this.addKeyFrame(toTime, id),
            functionName: functionName
        });
        this.dirty();
        return this._animations.length - 1;
    }

    /**
     * Change animation data
     * @param {Object} animation
     * @param {number} newFromTime
     * @param {number} newToTime
     * @param {string} functionName
     */
    changeAnimation(animation, newFromTime, newToTime, functionName = null) {
        var self = this;

        self.editKeyFrame(animation.fromTime, animation.id, newFromTime);
        self.editKeyFrame(animation.toTime, animation.id, newToTime);

        animation.fromTime = newFromTime;
        animation.toTime = newToTime;

        if (functionName) {
            animation.functionName = functionName;
        }
        this.dirty();
    }

    /**
     * Remove animation
     * @param {Object} animation
     */
    deleteAnimation(animation) {
        var self = this,
            index = self._animations.indexOf(animation);

        if (index >= 0) {
            self._animations.splice(index, 1);
            self.removeKeyFrame(animation.fromTime, animation.id);
            self.removeKeyFrame(animation.toTime, animation.id);
        }
        this.dirty();
    }

    /**
     * Find animations in time period
     * @param {string} id
     * @param {number} fromTime
     * @param {number} toTime
     * @returns {boolean}
     */
    animationsInInterval(id, fromTime, toTime) {
        return this._animations.filter(animation =>
            // choose animations which are in conflict with the animation in interval [fromTime, toTime]
             animation.id === id && ((animation.fromTime <= fromTime && animation.toTime >= toTime) ||
                (animation.fromTime < toTime && animation.fromTime > fromTime) ||
                (animation.toTime < toTime && animation.toTime > fromTime))
        );
    }

    /**
     * Return animations
     * @returns {null|Array|*}
     */
    getAnimations() {
        return this._animations;
    }

    /**
     * Check animations in time
     * @param {number} time
     * @returns {boolean}
     */
    checkAnimationsAtTime(time) {
        return this._animations.filter(animation => // choose animations which are in conflict with the animation in interval [fromTime, toTime]
        animation.fromTime < time && animation.toTime > time);
    }

    /**
     * Set animations group
     * @param {string} name
     */
    setActiveAnimationGroup(name) {
        // if name is correct then change animation object
        if (this._animationGroups.has(name)) {
            this._keyframes = this._animationGroups.get(name).keyframes;
            this._animations = this._animationGroups.get(name).animations;
            this._animationName = name;
        } else {
            // else clear values
            this._keyframes = {};
            this._animations = null;
            this._animationName = null;
        }
    }

    /**
     * Add animation group
     * @param name
     */
    addAnimationGroup(name) {
        var newKeyframes = {},
            newAnimations = [];
        this._keyframes = newKeyframes;
        this._keyframes = newAnimations;
        this._animationGroups.set(name, {
            animations: newAnimations,
            keyframes: newKeyframes
        });
        this.dirty();
    }

    /**
     * return animations group
     * @returns {Iterator.<K>}
     */
    getAnimationGroups() {
        return this._animationGroups.keys();
    }

    /**
     * Get animation name
     * @returns {null|*}
     */
    getAnimationGroup() {
        return this._animationName;
    }

    /**
     * change animation group name
     * @param {string} oldName
     * @param {string} newName
     */
    changeAnimationGroup(oldName, newName) {
        var object = this._animationGroups.get(oldName);
        if (object) {
            this._animationGroups.delete(oldName);
            this._animationGroups.set(newName, object);
            this.dirty();
        }
    }

    /**
     * Remove animation group
     * @param {string} name
     */
    removeAnimationGroup(name) {
        this._animationGroups.delete(name);
        this.dirty();
    }

    /**
     * Set animation key frame
     * @param {number} time
     */
    setActiveKeyFrame(time) {
        var self = this,
            elementsToRecalculate = this._elementsToRecalculate || {},
            newElementsToRecalculate = {};

        Object.keys(elementsToRecalculate).forEach((id) => {
            Object.keys(elementsToRecalculate[id]).forEach((name) => {
                eventEmitter.emit(EVENTS.ChangeStyle, id, name, elementsToRecalculate[id][name], self._keyframeId);
            });
        });

        if (this._keyframes[time]) {
            this._keyframeId = time;
            this._keyframes[this._keyframeId].forEach((item) => {
                elementsToRecalculate[item.id] = elementsToRecalculate[item.id] || {};
                Object.keys(item.style).forEach((styleName) => {
                    elementsToRecalculate[item.id][styleName] = item.style[styleName];
                });
                newElementsToRecalculate[item.id] = newElementsToRecalculate[item.id] || {};
                Object.keys(item.style).forEach((styleName) => {
                    newElementsToRecalculate[item.id][styleName] = '';
                });
            });
        } else {
            this._keyframeId = null;
            this.checkAnimationsAtTime(time)
                .forEach((animation) => {
                    var elementInfo = self.getElement(animation.id),
                        styles = Object.keys(animation.fromKeyframe.style).concat(Object.keys(animation.toKeyframe.style));
                    elementsToRecalculate[animation.id] = elementsToRecalculate[animation.id] || {};
                    newElementsToRecalculate[animation.id] = newElementsToRecalculate[animation.id] || {};
                    styles.forEach((styleName) => {
                        var fromValue = animation.fromKeyframe.style[styleName] !== undefined ? parseFloat(animation.fromKeyframe.style[styleName]) :
                                parseFloat(elementInfo.style[styleName]),
                            toValue = animation.toKeyframe.style[styleName] !== undefined ? parseFloat(animation.toKeyframe.style[styleName]) :
                                parseFloat(elementInfo.style[styleName]);

                        elementsToRecalculate[animation.id][styleName] = ((toValue - fromValue) /
                            (animation.toTime - animation.fromTime)) * (time - animation.fromTime);
                        newElementsToRecalculate[animation.id][styleName] = '';
                    });
                });
        }
        this._elementsToRecalculate = newElementsToRecalculate;
        Object.keys(elementsToRecalculate).forEach((id) => {
            Object.keys(elementsToRecalculate[id]).forEach((name) => {
                eventEmitter.emit(EVENTS.ChangeStyle, id, name, elementsToRecalculate[id][name], self._keyframeId);
            });
        });
    }

    /**
     * get full DOM
     * @returns {Node|*|null}
     */
    getDOM() {
        return this._DOM;
    }

    /**
     * Get behavious for element id
     * @param {string} id
     * @returns {*}
     */
    getBehaviors(id) {
        var element = findById(this._DOM, id),
            elementId = (element && element.id) || '';
        return this._behaviors[elementId];
    }

    /**
     * Create behaviour
     * @param {string} id
     * @param {Object} data
     */
    createBehavior(id, data) {
        var element = findById(this._DOM, id),
            elementId = this._generateElementId(element);
        this._behaviors[elementId] = this._behaviors[elementId] || [];
        this._behaviors[elementId].push(data);
        this.dirty();
    }

    /**
     * Update behaviour
     * @param id
     * @param number
     * @param data
     */
    updateBehavior(id, number, data) {
        var element = findById(this._DOM, id),
            elementId = (element && element.id) || '';

        Object.keys(data).forEach((key) => {
            this._behaviors[elementId][number][key] = data[key];
        });
        this.dirty();
    }

    removeBehavior(id, number) {
      var element = findById(this._DOM, id),
          elementId = (element && element.id) || '';
      this._behaviors[elementId].splice(number, 1);
      if (this._behaviors[elementId].length == 0) {
        delete this._behaviors[elementId];
      }
      this.dirty();
    }

    exportStyles() {
      return this._checkbox;
    }

    insertStyles (style, content) {
      var styleEl = this._DOM.querySelector('style[data-style=checkbox]');
      this._checkbox = style;
      styleEl.innerHTML = content;
      this.updateText(styleEl.id, content);
      console.log('insertStyles', style, content);
    }

}

export {Model};
