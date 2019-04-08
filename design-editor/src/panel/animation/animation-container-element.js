'use babel';

import $ from 'jquery';
import {StateManager} from '../../system/state-manager';
import {DressElement} from '../../utils/dress-element';
import {AnimationEditElement} from './animation-edit-element';
import {AnimationPreviewElement} from './animation-preview-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import {appManager} from '../../app-manager';

let activeEditor = null,
    animationId = 0;
const ANIMATION_RESIZE_HANDLE_HTML = '<div class="animation-resize-handle"></div>';

class AnimationContainer extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        var self = this,
            $designEditorElement = self.$el,
            templatePath = '/panel/animation/animation-container-element.html';

        self.events = {
            'click .closet-animation-add': 'onAnimationAddClick',
            'click .closet-animation-group-remove': 'onAnimationRemoveClick',
            'dblclick .closet-animations-container span': 'onAnimationDblClick',
            'mouseover .closet-animations-container div': 'onAnimationGroupOver',
            'mouseout .closet-animations-container div': 'onAnimationGroupOut',
            'click .closet-animations-container': 'onAnimationSelectClick',
            'click .switch-animation': 'onAnimationModeSwitch'
        };

        self._$resizeHandle = $(ANIMATION_RESIZE_HANDLE_HTML);

        this.$el.addClass('closet-animation-container-hidden');

        // we crete animation elements
        self._animationPreviewElement = new AnimationPreviewElement();
        self._animationEditElement = new AnimationEditElement();
        self._activeElement = self._animationPreviewElement;

        $designEditorElement.prepend(self._$resizeHandle);
        self.createFromTemplate(templatePath, {
            callback: () => {
                self.initialize();
            }
        });
    }

    /**
     * Init
     */
    initialize() {
        var self = this,
            $element = this.$el.find('.closet-animation-keyframes');

        // we append animation element to animation panel
        $element.append(this._animationPreviewElement);
        $element.append(this._animationEditElement);

        self._$resizeHandle.on('mousedown', (ev) => {
            var $animationContainer = self._activeElement.$el.parent();

            $animationContainer.addClass('closet-animation-container-during-resize');

            // User should be able to cover the editor iframe with
            // animation window
            // $animationContainer.css('max-height', '');

            self._startMoveY = ev.pageY;
            self._startHeight = self.$el.parent().height();

            $('body').on('mousemove', (event) => {
                var newHeight = (self._startHeight - (event.pageY - self._startMoveY));
                if (event.which) {
                    self.$el.css('height', newHeight + 'px');
                    StateManager.set('animation-container:height', newHeight);
                }
            }).on('mouseup', function () {
                $animationContainer.removeClass('closet-animation-container-during-resize');
                $(this).off('mousemove mouseup');
            });
        });
        eventEmitter.on(EVENTS.ActiveEditorUpdated, self.activeEditorUpdated.bind(self));
    }


    /**
     * Active editor update callback
     * @param {number} type
     * @param {Editor} editorElement
     */
    activeEditorUpdated(type, editorElement) {
        if (type === 1) {
            activeEditor = editorElement;
            // we send information that editor was refreshed in design mode
            this._animationPreviewElement.updateList(activeEditor);
            this._animationEditElement.updateList(activeEditor);
            this.updateAnimationsList();
            this.open();
        } else {
            activeEditor = null;
        }
    }

    /**
     * Open
     */
    open() {
        var self = this;
        // we send information about selected element change
        self._animationPreviewElement.hide();
        self._animationEditElement.hide();
        // Remove user predefined height before setting new height
        self.$el.css('height', '');

        if (StateManager.get('animation-container:visible')) {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Hide
     */
    hide() {
        this.$el.addClass('closet-animation-container-hidden');
        StateManager.set('animation-container:visible', false);
    }

    /**
     * Show
     */
    show() {
        this.$el.removeClass('closet-animation-container-hidden');
        StateManager.set('animation-container:visible', true);
    }

    /**
     * Toggle
     */
    toggle() {
        if (this.isOpened()) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Is open?
     * @returns {*}
     */
    isOpened() {
        return StateManager.get('animation-container:visible');
    }

    /**
     * Callback for click on remove
     * @param {Event} event
     */
    onAnimationRemoveClick(event) {
        var model = appManager.getActiveDesignEditor().getModel();
        model.removeAnimationGroup(event.target.previousElementSibling.value);
        model.setActiveAnimationGroup(null);
        this.updateAnimationsList();
        this._activeElement.updateList();
        this.$el.find('.animation-empty-info').show();
    }

    /**
     * animation select click element callback
     * @param {Event} event
     */
    onAnimationSelectClick(event) {
        var model = appManager.getActiveDesignEditor().getModel(),
            target = event.target,
            $target = $(target).closest('.closet-animations-container div'),
            name = null;

        if (target.tagName !== 'INPUT') {
            this.$el.find('.selected').removeClass('selected');
            // event is bind to container, we need chach that choosed any item
            if ($target.length) {
                $target.addClass('selected');
                name = target.textContent;
                this.$el.find('.animation-empty-info').hide();
                this._activeElement.show();
            } else {
                this.$el.find('.animation-empty-info').show();
                this._activeElement.hide();
            }

            model.setActiveAnimationGroup(name);

            this._activeElement.updateList(activeEditor);
        }
    }

    /**
     * animation dbl click callback
     * @param {Event} event
     */
    onAnimationDblClick(event) {
        if (event.target.tagName !== 'INPUT') {
            const $target = $(event.target),
                oldAnimationNme = $target.text(),
                model = appManager.getActiveDesignEditor().getModel(),
                $input = $('<span><input class="animation-name-edit native-key-bindings" value="' + oldAnimationNme + '" /><div class="closet-animation-group-remove"></div></span>'),
                input = $input.find('input')[0];

            $target.replaceWith($input);
            $('body').on('click', (ev) => {
                const name = input.value;
                if (ev.target !== input) {
                    if (/^-?[_a-zA-Z][_a-zA-Z0-9-]*$/.test(name)) {
                        model.changeAnimationGroup(oldAnimationNme, input.value);
                        model.setActiveAnimationGroup(input.value);
                        this._activeElement.updateList();
                        $target.text(input.value);
                        $input.replaceWith($target);
                        $('body').off('click');
                    } else {
                        console.warn('incorrect name');
                    }
                }
                ev.preventDefault();
                ev.stopPropagation();
            });
        }
    }

    /**
     * Animation add click callback
     */
    onAnimationAddClick() {
        var model = appManager.getActiveDesignEditor().getModel(),
            tmpName = 'tmp-name-' + (animationId += 1);

        model.addAnimationGroup(tmpName);
        this.updateAnimationsList();

        this.$el.find('.closet-animations-container div').each((index, element) => {
            if (element.textContent === tmpName) {
                $(element).addClass('selected');
                this._activeElement.show();
            }
        });

        model.setActiveAnimationGroup(tmpName);
        this.$el.find('.animation-empty-info').hide();
        // @TODO prepare more effective refresh method, currently whole list is updated, but only one element is added
        this._activeElement.updateList();
    }

    /**
     * Switch animation mode
     */
    onAnimationModeSwitch() {
        var self = this;
        if (self._activeElement === self._animationPreviewElement) {
            self._animationPreviewElement.hide();
            self._animationEditElement.show();
            self._activeElement = self._animationEditElement;
            this._activeElement.updateList();
            self.$el.find('.switch-animation').text('Preview mode');
        } else {
            self._animationEditElement.hide();
            self._animationPreviewElement.show();
            self._activeElement = self._animationPreviewElement;
            this._activeElement.updateList();
            self.$el.find('.switch-animation').text('Edit mode');
        }
    }

    /**
     * update animation list
     */
    updateAnimationsList() {
        var designEditor = appManager.getActiveDesignEditor(),
            model = designEditor && designEditor.getModel(),
            animationNames = null;
        if (model) {
            animationNames = model.getAnimationGroups();
            this.$el.find('.closet-animations-container').empty();
            for (const name of animationNames) {
                this.$el.find('.closet-animations-container').append('<div><span>' + name + '</span></div>');
            }
        }
    }
}

const AnimationContainerElement = document.registerElement('closet-animation-container', AnimationContainer);

export {AnimationContainerElement, AnimationContainer};

