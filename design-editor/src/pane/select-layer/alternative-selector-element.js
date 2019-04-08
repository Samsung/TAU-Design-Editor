'use babel';

import $ from 'jquery';
import {DressElement} from '../../utils/dress-element';
import {elementSelector} from '../element-selector';

const MINSIZE = 14;
const MAXSIZE = 30;

require('jquery-ui');

class AlternativeSelector extends DressElement {
    /**
     * Created callback
     */
    onCreated() {
        this.events = {
            click : '_onClick'
        };
        this.classList.add('closet-alternative-selector');
        this._$connectedElement = null;
    }

    /**
     * Destroy callback
     */
    onDestroy() {
        this._$connectedElement = null;
    }

    /**
     * Render
     * @param {HTMLElement} element
     * @returns {*}
     */
    render(element) {
        var $element;
        if (!element) {
            return null;
        }
        $element = $(element);
        this._$connectedElement = $element;
        return this;
    }

    /**
     * Click callback
     * @param {Event} event
     * @private
     */
    _onClick(event) {
        var d_id;

        console.log('alternative selector element._onClick');
        event.stopPropagation();
        d_id = this._$connectedElement.attr('data-id') || null;

        if (d_id) {
            elementSelector.select(d_id);
        }
    }

    /**
     * Build layout
     * @param {number} ratio
     */
    layout(ratio) {
        var $src = this._$connectedElement,
            offset = {top:0, left:0},
            markerSize;

        if ($src.length) {
            offset = $src.offset();
        }

        markerSize = Math.max($src.innerWidth(), $src.innerHeight()) / 8;
        if (markerSize > MAXSIZE) {
            markerSize = MAXSIZE;
        } else if (markerSize < MINSIZE) {
            markerSize = MINSIZE;
        }

        this.$el.css({
            top: offset.top * ratio,
            left: ((offset.left + $src.width()) - markerSize) * ratio,
            borderTopWidth: (markerSize * ratio) + 'px',
            borderLeftWidth: (markerSize * ratio) + 'px'
        });
    }

    /**
     * Show
     */
    show() {
        this.$el.css('display', 'block');
    }

    /**
     * Hide
     */
    hide() {
        this.$el.css('display', 'none');
    }
}


const AlternativeSelectorElement = document.registerElement('closet-alternative-selector', AlternativeSelector);

export {AlternativeSelectorElement, AlternativeSelector};
