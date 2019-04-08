'use babel';

import {DressElement} from '../utils/dress-element';
import {EVENTS, eventEmitter} from '../events-emitter';

var TEMPLATE_FILE_NAME = '/panel/tooltip-element.html';
var TYPES = ['info', 'warning', 'error'];
var shownHints = {};

/**
 *
 */
class Tooltip extends DressElement {

    /**
     * Create callback
     */
    onCreated() {
        var self = this,
            templatePath;

        // timeout to close in ms
        self.timeout = 10000;
        self.category = 'none';
        // \in TYPES
        self.type = 'info';
        self.options = {};

        self._eventsListeners = {};
        self._timeout = null;
        self._progressInterval = null;
        self._progressSeconds = 0;

        this.events = {
            'click .tooltip-panel-close' : 'onCloseClick'
        };

    }

    /**
     * Attach callback
     */
    onAttached() {
        this.bindEvents();
    }

    /**
     * Destroy
     */
    onDestroy() {
        var self = this,
            eventsListeners = self._eventsListeners;

        eventEmitter.removeListener(EVENTS.TooltipPanelOpen, eventsListeners.tooltipPanelOpen);
        eventEmitter.removeListener(EVENTS.TooltipPanelClose, eventsListeners.tooltipPanelClose);
    }

    /**
     * Bind events
     */
    bindEvents() {
        var self = this,
            eventsListeners = self._eventsListeners;

        eventsListeners.tooltipPanelOpen = self._show.bind(self);
        eventsListeners.tooltipPanelClose = self._hide.bind(self);
        eventEmitter.removeListener(EVENTS.TooltipPanelOpen, eventsListeners.tooltipPanelOpen);
        eventEmitter.removeListener(EVENTS.TooltipPanelClose, eventsListeners.tooltipPanelClose);
    }

    /**
     * Set element
     * @param {Object} options
     * @private
     */
    _setElement(options) {
        var self = this,
            $el = self.$el;

        self.options = {
            header: options.header || '',
            text: options.text || ''
        };

        self.createFromTemplate(TEMPLATE_FILE_NAME, {
            options: self.options,
            callback: () => {
                $el.removeClass(TYPES.join(' '));
                $el.addClass('show ' + self.type);
            }
        });
    }

    /**
     * Set timer
     * @private
     */
    _setTimer() {
        var self = this,
            $progress = self.$el.find('.tooltip-panel-progress'),
            seconds = self._progressSeconds += 1;

        if (seconds * 1000 <= self.timeout) {
            $progress.width(((100 - (((seconds * 1000) / self.timeout) * 100))) + '%');
        }
    }

    /**
     * Show
     * @param {Object} options
     * @private
     */
    _show(options) {
        var self = this,
            category;

        options = options || {};

        category = options.category || self.category;

        // @todo: support categories
        // close previous element from this category
        // if (shownHints[category]) {
        //    shownHints[category]._hide();
        // }
        // now we close all hints (@to_remove):
        Object.keys(shownHints).forEach((hintCategory) => {
            shownHints[hintCategory]._hide();
        });

        self.category = category;
        if (TYPES.indexOf(options.type) > -1) {
            self.type = options.type;
        } else {
            self.type = 'info';
        }
        self._setElement(options);

        shownHints[category] = self;

        self._timeout = setTimeout(self._hide.bind(self), self.timeout);
        self._progressInterval = setInterval(self._setTimer.bind(self), 1000);
        self._setTimer();
    }

    /**
     * Hide
     * @param {Object} options
     * @private
     */
    _hide(options) {
        var self = this;

        if (self._timeout) {
            clearTimeout(self._timeout);
        }
        if (self._progressInterval) {
            clearInterval(self._progressInterval);
        }
        self._timeout = null;
        self._progressInterval = null;
        self._progressSeconds = 0;

        options = options || {};
        if (!options.category || (options.category === self.category)) {
            self.$el.removeClass('show');
            shownHints[self.category] = null;
            delete shownHints[self.category];
        }
    }

    /**
     * close click callback
     */
    onCloseClick() {
        this._hide();
    }
}

const TooltipElement = document.registerElement('closet-tooltip', Tooltip);

export {TooltipElement, Tooltip};
