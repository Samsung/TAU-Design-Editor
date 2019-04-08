'use babel';

import Mustache from 'mustache';
import {DressElement} from '../../utils/dress-element';
import {elementSelector} from '../element-selector';
import {ElementDetector} from '../element-detector';
import {eventEmitter, EVENTS} from '../../events-emitter';
import {appManager} from '../../app-manager';

const textFormatParent = '<div class="parent-info" data-id="{{parentInternalId}}"><span class="tag-field">{{parentTag}}</span><span class="id-field">{{parentId}}</span><span class="class-field">{{parentClass}}</span></div><span> &raquo; </span>';
const textFormatChild = '<span class="tag-field">{{tag}}</span><span class="id-field">{{id}}</span><span class="class-field">{{class}}</span>';

const join = Array.prototype.join;

/**
 * Info bar with information about current selected alement and it parent.
 */
class Info extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        this.classList.add('info-bar');
        this._curSelectedElementInfo = {
            tag : null,
            id : null,
            class : null
        };
        // bind event
        this._bindEvent();
        this._displayNoSelectedElementInfo();
    }

    /**
     * Destroy callback
     */
    onDestroy() {
        this.options = null;
        this._curSelectedElementInfo = null;
    }

    /**
     * Prepare date for given element
     * @param {jQuery} $element
     * @return {Info}
     * @private
     */
    _setElementInfo($element) {
        var element = $element[0],
            // prepare data about current element
            id = element.getAttribute('id'),
            classes = join.call(element.classList, '.'),
            // init parent variables
            parentDetectedElement = null,
            parentDetectedElementInfo = null;

        // reset information
        this._curSelectedElementInfo = {};

        // fill information about current element
        this._curSelectedElementInfo.tag = element.tagName.toLowerCase();
        this._curSelectedElementInfo.id = id ? '#' + id : null;
        this._curSelectedElementInfo.class = (classes !== '') ? '.' + classes : null;

        // find component in parent chain
        parentDetectedElementInfo = ElementDetector.getInstance().detect(element.parentElement);

        if (parentDetectedElementInfo) {
            // fill information about parent
            parentDetectedElement = parentDetectedElementInfo.element;
            this._curSelectedElementInfo.parentInternalId = parentDetectedElement.dataset.id;
            this._curSelectedElementInfo.parentTag = parentDetectedElement.tagName.toLowerCase();
            this._curSelectedElementInfo.parentId = parentDetectedElement.getAttribute('id') ? '#' + parentDetectedElement.getAttribute('id') : null;
            this._curSelectedElementInfo.parentClass = parentDetectedElement.classList.length ? '.' + join.call(parentDetectedElement.classList, '.') : null;
        }
        return this;
    }

    /**
     * Prepare HTML for given data
     * @param {Object} elementInfo
     * @returns {string}
     * @private
     */
    static _getRenderedHTMLString(elementInfo) {
        var fullStr = '';

        if (elementInfo.parentTag) {
            fullStr += Mustache.render(textFormatParent, elementInfo);
        }

        fullStr += Mustache.render(textFormatChild, elementInfo);

        return fullStr;
    }

    /**
     * Change HTML in next animation frame
     * @private
     */
    _render() {
        requestAnimationFrame(() => {
            this.$el.html(Info._getRenderedHTMLString(this._curSelectedElementInfo));
        });
        return this;
    }

    /**
     * Bind events to interact with info element
     * @private
     */
    _bindEvent() {
        // on change selected element update information in bar
        eventEmitter.on(EVENTS.ElementSelected, (elementId) => {
            var design = appManager.getActiveDesignEditor(),
                $element = design && design._getElementById(elementId);
            if ($element && $element.length) {
                this._setElementInfo($element)
                    ._render()
            }
        });

        // on deselect element hide bar
        eventEmitter.on(
            EVENTS.ElementDeselected,
            this._onElementDeselect.bind(this)
        );

        // on click in element with referer to nother change selected element
        this.$el.on('click', '[data-id]', (event) => {
            console.log('info-element.click');
            const id = event.currentTarget.dataset.id;
            if (id) {
                elementSelector.select(id);
            }
        });
    }

    /**
     * Handles element deselect event.
     */
    _onElementDeselect() {
        this._displayNoSelectedElementInfo.apply(this);
    }

    /**
     * Display static message in element.
     */
    _displayNoSelectedElementInfo() {
        this.$el.html("No element selected");
    }
}

const InfoElement = document.registerElement('info-bar', Info);

export {InfoElement, Info};
